import React, { useState } from 'react';
import Select from "react-select";
import { family_cnt, family_child_cnt, year, month } from "../../Global/globalVar";
import axios from 'axios';
import { formatterNumber, calculator202302, calculator202102, calculatorFamilyChildCnt, delAmt0, whileFirstZeroDel } from "../../Common/common.js";
import * as encryption from "../../encryption/encryption.js"
import { useEffect } from 'react';

function InputComponent({ visibleEvent, resultData }) {
    const [familyCntSelect, setFamilyCntSelect] = useState(family_cnt[0]); // 부양가족 수
    const [familyChildCntSelect, setFamilyChildCntSelect] = useState(family_child_cnt[0]); // 8~20세 부양가족수
    const [yearSelect, setYearSelect] = useState(year[3]); // 조회연도 
    const [monthSelect, setMonthSelect] = useState(month[new Date().getMonth()]); // 조회월
    const [amtHandler, setAmtHandler] = useState("0"); // 급여액
    const [nonTaxHandler, setNonTaxHandler] = useState("0"); // 비과세금액
    const [incomeTaxRate, setIncomeTaxRate] = useState("2"); // 원천징수율

    useEffect(() => {
        if(sessionStorage.getItem("accessToken") != null) {
            let body = {
                id: encryption.decrypt(sessionStorage.getItem("accessToken"))
            };

            axios.post('/api/user_income_tax', body)
            .then(res => {
                if(res.data.length > 0) {
                    alert("저장된 정보가 있습니다. 데이터를 불러오겠습니다.");

                    let data = res.data[0];

                    setYearSelect(year[parseInt(data.income_year)-2021]);
                    setMonthSelect(month[parseInt(data.income_month)-1]);
                    setAmtHandler(formatterNumber(String(data.month_amt)));
                    setNonTaxHandler(formatterNumber(String(data.nontax_amt)));
                    setFamilyCntSelect(family_cnt[data.family_count-1]);
                    setFamilyChildCntSelect(family_child_cnt[data.child_count]);
                    setIncomeTaxRate(String(data.withhol_rate));
                }
            })  
            .catch(res => console.log(res));
        }
    }, []);

    // 계산하기 클릭 이벤트
    const calculator = () => {
        if(amtHandler.replaceAll(",", "").length === 0) {
            alert("세전 월 급여를 입력하세요.");
            return;
        }
        else if(isNaN(amtHandler.replaceAll(",", ""))) {
            alert("세전 월 급여에는 숫자만 입력해주세요.");
            return;
        }

        if(nonTaxHandler.replaceAll(",", "").length === 0) {
            alert("비과세 금액을 입력하세요.");
            return;
        }
        else if(isNaN(nonTaxHandler.replaceAll(",", ""))) {
            alert("비과세 금액에는 숫자만 입력해주세요.");
            return;
        }

        if(familyCntSelect.value <= familyChildCntSelect.value) {
            alert("8~20세 부양 가족 수는 전체 부양 가족 수보다 많거나 같을 수 없습니다.");
            return;
        }

        let result_data = {};
        
        let pay_amt = amtHandler.replaceAll(",", "");
        let nontax_amt = nonTaxHandler.replaceAll(",", "");

        let tax_amt = parseInt(pay_amt)-parseInt(nontax_amt);

        if(tax_amt < 1060000) {
            alert("1,060,000원 미만 금액은 소득세가 없습니다.");
            return;
        }

        let income_ym = yearSelect.value+monthSelect.value
        if(income_ym >= '202303') {
            income_ym = '202303';
        } else {
            income_ym = '202103';
        }

        let body = {
            income_ym : income_ym,
            income_amt : tax_amt > 10000000 ? 10000000 : tax_amt,
            family_count : familyCntSelect.value
        };

        axios.post('/api/income_tax_select', body)
        .then(res => {
            console.log(res)
            let res_income_tax = res.data[0].income_tax;
            
            result_data["RES_INCOME_TAX"] = res_income_tax;

            // 소득세 계산
            if(parseInt(income_ym) >= 202302) {
                res_income_tax = calculator202302(tax_amt, res_income_tax);
            } else if(parseInt(income_ym) >= 202102) {
                res_income_tax = calculator202102(tax_amt, res_income_tax);
            }

            result_data["RES_INCOME_TAX1"] = parseInt(res_income_tax) < 0 ? '0' : res_income_tax;
            
            // 8세이상 20세이하 자녀수 계산
            if(familyChildCntSelect.value > 0) {
                res_income_tax = calculatorFamilyChildCnt(res_income_tax, familyChildCntSelect.value);
            }
            
            result_data["RES_INCOME_TAX2"] = parseInt(res_income_tax) < 0 ? '0' : res_income_tax;

            // 원천징수율 계산
            if(incomeTaxRate === "1") {
                res_income_tax *= 0.8;
            } else if(incomeTaxRate === "3") {
                res_income_tax *= 1.2;
            }

            result_data["RES_INCOME_TAX3"] = parseInt(res_income_tax) < 0 ? '0' : res_income_tax;

            res_income_tax = delAmt0(res_income_tax);

            result_data["TYPE"] = "INCOME_TAX";
            result_data["YEAR"] = yearSelect.value;
            result_data["MONTH"] = monthSelect.value;
            result_data["PAY_AMT"] = pay_amt;
            result_data["NONTAX_AMT"] = nontax_amt;
            result_data["TAX_AMT"] = parseInt(tax_amt);
            result_data["FAMILY_CHILD_CNT"] = familyChildCntSelect.value;
            result_data["FAMILY_CNT"] = familyCntSelect.value;
            result_data["INCOME_TAX_RATE"] = incomeTaxRate;
            result_data["RES_INCOME_TAX4"] = parseInt(res_income_tax) < 0 ? '0' : res_income_tax;

            resultData(result_data);
        })  
        .catch(res => console.log(res));

        visibleEvent();
    }

    const save = () => {
        if(sessionStorage.getItem("accessToken") != null) {
            if(window.confirm("입력한 정보를 저장하시겠습니까?")) {
                let body = {
                    id: encryption.decrypt(sessionStorage.getItem("accessToken")),
                    income_year: yearSelect.value,
                    income_month: parseInt(monthSelect.value) < 10 ? "0"+monthSelect.value:monthSelect.value,
                    month_amt: parseInt(amtHandler.replaceAll(",", "") === "" ? 0 : amtHandler.replaceAll(",", "")),
                    nontax_amt: parseInt(nonTaxHandler.replaceAll(",", "") === "" ? 0 : nonTaxHandler.replaceAll(",", "")),
                    family_count: parseInt(familyCntSelect.value),
                    child_count: parseInt(familyChildCntSelect.value),
                    withhol_rate: parseInt(incomeTaxRate)
                };

                axios.post('/api/save_income_tax', body)
                .then(res => {
                    if(res.data.success) {
                        alert("저장 되었습니다.");
                    } else {
                        alert("다시 시도 해주세요.");
                    }
                })  
                .catch(res => console.log(res));
            }
        } else {
            alert("로그인 후 이용해주세요.");
        } 
    }

    const checkNumberAmt = (e) => {
        let v = whileFirstZeroDel(formatterNumber(e.target.value));
        setAmtHandler(v === "" ? 0 : v);
    }

    const checkNumberNonAmt = (e) => {
        let v = whileFirstZeroDel(formatterNumber(e.target.value));
        setNonTaxHandler(v === "" ? 0 : v);
    }

    const taxRateRadioHandler = (e) => {
        setIncomeTaxRate(e.target.value);
    }

    const familyCntSelectHandler = (e) => {
        setFamilyCntSelect(e);
    }

    const familyChildCntSelectHandler = (e) => {
        setFamilyChildCntSelect(e);
    }

    return (
        <>
            <div style={{paddingTop: "35px", marginLeft: "60px"}}>
                <span className='incomeTaxFont'>계산 연도</span>
                <Select options={year} className='incomeTaxSelect incomeTaxSelectYear'
                value={yearSelect} onChange={setYearSelect}/>
                <span className='incomeTaxFont'> 년</span>
                <span className='incomeTaxFont' style={{ marginLeft: "82px"}}>계산 월</span>
                <Select options={month} className='incomeTaxSelect incomeTaxSelectMonth'
                value={monthSelect} onChange={setMonthSelect}/>
                <span className='incomeTaxFont'> 월</span>
            </div>
            <div style={{marginLeft: "60px", marginTop: "20px"}}>
                <span className='incomeTaxFont'>세전 월 급여</span><input className="incomeTaxInput" onChange={checkNumberAmt} value={amtHandler}/><span className='incomeTaxFont'> 원</span>
                <span className='incomeTaxFont incomeTaxNonTaxAmtStr'>비과세 금액</span><input className="incomeTaxInput" onChange={checkNumberNonAmt} value={nonTaxHandler}/><span className='incomeTaxFont'> 원</span>
            </div>
            <div style={{marginLeft: "60px", marginTop: "20px"}}>
                <span className='incomeTaxFont'>부양 가족 수</span>
                <Select options={family_cnt} className='incomeTaxSelect incomeTaxSelectFamilyCnt'
                value={familyCntSelect} onChange={familyCntSelectHandler}/>
                <span className='incomeTaxFont'> 명</span>
            </div>
            <div style={{marginLeft: "60px", marginTop: "20px"}}>
                <span className='incomeTaxFont'>8세이상 20세이하 부양 가족 수</span>
                <Select options={family_child_cnt} className='incomeTaxSelect incomeTaxSelectFamilyChildCnt'
                value={familyChildCntSelect} onChange={familyChildCntSelectHandler}/>
                <span className='incomeTaxFont'> 명</span>
            </div>
            <div style={{marginLeft: "60px", marginTop: "20px"}}>
                <span className='incomeTaxFont'>원천 징수율</span>
                <span className='incomeTaxRate'>
                    <label><input type='radio' name="taxRate" value={1} onChange={taxRateRadioHandler} checked={incomeTaxRate === "1"}/>80%</label>
                    <label><input type='radio' name="taxRate" value={2} onChange={taxRateRadioHandler} checked={incomeTaxRate === "2"}/>100%</label>
                    <label><input type='radio' name="taxRate" value={3} onChange={taxRateRadioHandler} checked={incomeTaxRate === "3"}/>120%</label>
                </span>
            </div>
            <div style={{marginTop: "20px", width: "100%", textAlign: "center"}}>
                <button className="inputComponentButton" style={{marginRight: "20px"}} onClick={calculator}>계산하기</button>
                <button className="inputComponentButton" style={{marginLeft: "20px"}} onClick={save}>저장하기</button>
            </div>
        </>
    );
}

export default InputComponent;
