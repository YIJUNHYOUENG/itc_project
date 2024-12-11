import React, { useState } from 'react';
import Select from "react-select";
import { family_cnt, family_child_cnt, year, month } from "../../Global/globalVar";
import BonusIncomeTaxTable from './BonusIncomeTaxTable';
import axios from 'axios';
import { formatterNumber, formatterDateYYYYMM, calculator202302, calculator202102, calculatorFamilyChildCnt, delAmt0, whileFirstZeroDel } from "../../Common/common.js";
import * as encryption from "../../encryption/encryption.js"
import { useEffect } from 'react';

function InputComponent({ visibleEvent, resultData }) {
    const [familyCntSelect, setFamilyCntSelect] = useState(family_cnt[0]); // 부양가족 수
    const [familyChildCntSelect, setFamilyChildCntSelect] = useState(family_child_cnt[0]); // 8~20세 부양가족수
    const [yearSelect, setYearSelect] = useState(year[3]); // 조회연도 
    const [monthSelect, setMonthSelect] = useState(month[new Date().getMonth()]); // 조회월
    const [beforeBonusAmtMonthSelect, setBeforeBonusAmtMonthSelect] = useState(month[0]); // 조회월
    const [amtHandler, setAmtHandler] = useState("0"); // 상여금
    const [incomeTaxRate, setIncomeTaxRate] = useState("2"); // 원천징수율
    const [trList, setTrList] = useState([]);

    useEffect(() => {
        if(sessionStorage.getItem("accessToken") != null) {
            let body = {
                id: encryption.decrypt(sessionStorage.getItem("accessToken"))
            };

            axios.post('/api/user_bonus_income_tax', body)
            .then(res => {
                if(res.data.length > 0) {
                    alert("저장된 정보가 있습니다. 데이터를 불러오겠습니다.");

                    let data = res.data[0];

                    setYearSelect(year[parseInt(data.income_year)-2021]);
                    setMonthSelect(month[parseInt(data.income_month)-1]);
                    setAmtHandler(formatterNumber(String(data.month_amt)));
                    setFamilyCntSelect(family_cnt[data.family_count-1]);
                    setFamilyChildCntSelect(family_child_cnt[data.child_count]);
                    setIncomeTaxRate(String(data.withhol_rate));
                    setBeforeBonusAmtMonthSelect(month[parseInt(data.before_amt_month)-1]);
                }
            })  
            .catch(res => console.log(res));
        }
    }, []);

    // 계산하기 클릭 이벤트
    const calculator = () => {
        if(amtHandler.replaceAll(",", "").length === 0) {
            alert("상여금(세전)을 입력하세요.");
            return;
        }
        else if(isNaN(amtHandler.replaceAll(",", ""))) {
            alert("세전 월 급여에는 숫자만 입력해주세요.");
            return;
        }

        if(parseInt(familyCntSelect.value) <= parseInt(familyChildCntSelect.value)) {
            alert("8~20세 부양 가족 수는 전체 부양 가족 수보다 많거나 같을 수 없습니다.");
            return;
        }

        if(parseInt(monthSelect.value) < parseInt(beforeBonusAmtMonthSelect.value)) {
            alert("직전 상여 지급월은 상여 지급 월보다 클 수 없습니다.");
            return;
        }

        let [err, msg] = chkIncomeYmAndAmt();

        if(err) {
            alert(msg);
            return;
        }

        let totalAmt = 0;
        let result_data = {};

        // 총 금액 합산
        totalAmt += parseInt(amtHandler.replaceAll(",", ""));

        trList.forEach((e) => {
            totalAmt += parseInt(e.MONTH_AMT.replaceAll(",", ""));
        });

        // 월 평균 금액 계산
        totalAmt = totalAmt/(parseInt(monthSelect.value)-parseInt(beforeBonusAmtMonthSelect.value)+1);

        if(totalAmt < 1060000) {
            alert("1,060,000원 미만 금액은 소득세가 없습니다.");
            return;
        }

        // 소득세 계산
        let income_ym = yearSelect.value+monthSelect.value
        if(income_ym >= '202303') {
            income_ym = '202303';
        } else {
            income_ym = '202103';
        }

        let body = {
            income_ym : income_ym,
            income_amt : totalAmt > 10000000 ? 10000000 : totalAmt,
            family_count : familyCntSelect.value
        };

        axios.post('/api/income_tax_select', body)
        .then(res => {
            let res_income_tax = res.data[0].income_tax;
            
            result_data["RES_INCOME_TAX"] = res_income_tax;

            // 소득세 계산
            if(parseInt(income_ym) >= 202303) {
                res_income_tax = calculator202302(totalAmt, res_income_tax);
            } else if(parseInt(income_ym) >= 202103) {
                res_income_tax = calculator202102(totalAmt, res_income_tax);
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

            let arr = [];
            trList.forEach((e) => {
                arr.push(" + "+e.MONTH_AMT+"원");
            });

            result_data["TYPE"] = "BONUS_INCOME_TAX";
            result_data["YEAR"] = yearSelect.value;
            result_data["MONTH"] = monthSelect.value;
            result_data["BONUS_MONTH"] = beforeBonusAmtMonthSelect.value;
            result_data["PAY_AMT"] = amtHandler;
            result_data["BONUS_AMT"] = arr;
            result_data["TAX_AMT"] = parseInt(totalAmt);
            result_data["FAMILY_CHILD_CNT"] = familyChildCntSelect.value;
            result_data["FAMILY_CNT"] = familyCntSelect.value;
            result_data["INCOME_TAX_RATE"] = incomeTaxRate;
            result_data["RES_INCOME_TAX4"] = parseInt(res_income_tax) < 0 ? '0' : res_income_tax;

            resultData(result_data);
        })  
        .catch(res => console.log(res));

        visibleEvent();
    }

    const chkIncomeYmAndAmt = () => {
        let incomeYmArr = [];
        let err = false;
        let msg = "";

        trList.some((e) => {       
            let incomeYm = e.PAY_YM.replaceAll("-", "");
            let incomeAmt = e.MONTH_AMT.replaceAll(",", "");
            
            if(incomeYm.length === 0) {
                msg = (parseInt(e.KEY)+1)+"행 지급년월을 입력해주세요.";
                err = true;
                return err;
            }

            if(incomeYm.length < 6) {
                msg = (parseInt(e.KEY)+1)+"행 지급년월 양식을 맞춰주세요.";
                err = true;
                return err;
            }

            if(incomeYm.substring(0, 4) !== yearSelect.value) {
                msg = (parseInt(e.KEY)+1)+"행 지급연도는 상여지급연도와 맞춰주세요.";
                err = true;
                return err;
            }
            
            if(parseInt(incomeYm.substring(4,6)) < 1 || parseInt(incomeYm.substring(4,6)) > 12) {
                msg = (parseInt(e.KEY)+1)+"행 지급월은 1월~12월 사이로 입력해주세요.";
                err = true;
                return err;
            }

            if(parseInt(yearSelect.value+(beforeBonusAmtMonthSelect.value < 10 ? '0'+beforeBonusAmtMonthSelect.value:beforeBonusAmtMonthSelect.value)) > parseInt(incomeYm)) {
                msg = (parseInt(e.KEY)+1)+"행 지급년월은 직전상여지급월보다 작을 수 없습니다.";
                err = true;
                return err;
            }

            if(parseInt(yearSelect.value+(monthSelect.value < 10 ? '0'+monthSelect.value:monthSelect.value)) < parseInt(incomeYm)) {
                msg = (parseInt(e.KEY)+1)+"행 지급년월은 상여지급년월보다 클 수 없습니다.";
                err = true;
                return err;
            }
    
            if(incomeYmArr.includes(incomeYm)) {
                msg = (parseInt(e.KEY)+1)+"행 지급년월이 중복되었습니다.";
                err = true;
                return err;
            } else {
                incomeYmArr.push(incomeYm);
            } 

            if(incomeAmt.length === 0) {
                msg = (parseInt(e.KEY)+1)+"행 월급여액(세전)을 입력해주세요.";
                err = true;
                return err;
            }
        });

        return [err, msg];
    }

    const save = () => {
        if(sessionStorage.getItem("accessToken") != null) {
            if(window.confirm("입력한 정보를 저장하시겠습니까?")) {
                let body = {
                    id: encryption.decrypt(sessionStorage.getItem("accessToken")),
                    income_year: yearSelect.value,
                    income_month: parseInt(monthSelect.value) < 10 ? "0"+monthSelect.value:monthSelect.value,
                    month_amt: parseInt(amtHandler.replaceAll(",", "") === "" ? 0 : amtHandler.replaceAll(",", "")),
                    family_count: parseInt(familyCntSelect.value),
                    child_count: parseInt(familyChildCntSelect.value),
                    withhol_rate: parseInt(incomeTaxRate),
                    before_amt_month: parseInt(beforeBonusAmtMonthSelect.value) < 10 ? "0"+beforeBonusAmtMonthSelect.value:beforeBonusAmtMonthSelect.value
                };

                axios.post('/api/save_bonus_income_tax', body)
                .then(res => {
                    if(res.data.success) {
                        if(trList.length > 0) {
                            let body_dtl = [];

                            for(let i=0;i<trList.length;i++) {
                                console.log(trList[i]);
                                let v = trList[i];
                                
                                let json_data = {
                                    id: encryption.decrypt(sessionStorage.getItem("accessToken")),
                                    pay_ym: v.PAY_YM.replaceAll("-", ""),
                                    pay_amt: v.MONTH_AMT.replaceAll(",",""),
                                    ord_num: i
                                };

                                body_dtl.push(json_data);
                            }

                            axios.post('/api/save_bonus_income_tax_detail', body_dtl)
                            .then(r => {
                                if(res.data.success) {
                                    alert("저장 되었습니다.");        
                                } else {
                                    alert("다시 시도 해주세요.");                
                                }
                            })
                            .catch(r => console.log(r));
                        } else {
                            alert("저장 되었습니다.");
                        }
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

    const taxRateRadioHandler = (e) => {
        setIncomeTaxRate(e.target.value);
    }

    const familyCntSelectHandler = (e) => {
        setFamilyCntSelect(e);
    }

    const familyChildCntSelectHandler = (e) => {
        setFamilyChildCntSelect(e);
    }

    const yearSelectHandler = e => {
        setYearSelect(e);
    }

    const monthSelectHandler = e => {
        setMonthSelect(e);
    }

    const beforBonusAmtMonthSelectHandler = e => {
        setBeforeBonusAmtMonthSelect(e);
    }

    const returnBonusIncomeTaxTable = data => {

    }

    return (
        <>
            <div style={{paddingTop: "35px", marginLeft: "60px"}}>
                <span className='incomeTaxFont'>상여 지급 연도</span>
                <Select options={year} className='incomeTaxSelect bonusIncomeTaxSelectYear'
                value={yearSelect} onChange={yearSelectHandler}/>
                <span className='incomeTaxFont'> 년</span>
                <span className='incomeTaxFont' style={{ marginLeft: "42px"}}>상여 지급 월</span>
                <Select options={month} className='incomeTaxSelect bonusIncomeTaxSelectMonth'
                value={monthSelect} onChange={monthSelectHandler}/>
                <span className='incomeTaxFont'> 월</span>
            </div>
            <div style={{marginLeft: "60px", marginTop: "20px"}}>
                <span className='incomeTaxFont'>상여금(세전)</span><input className="incomeTaxInput bonusIncomeTaxInput" onChange={checkNumberAmt} value={amtHandler}/><span className='incomeTaxFont'> 원</span>
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
            <div style={{marginLeft: "60px", marginTop: "20px"}}>
                <span className='incomeTaxFont'>직전 상여 지급 월</span>
                <Select options={month} className='incomeTaxSelect bonusIncomeTaxSelectMonth bonusIncomeTaxSelectMonthBeforeBonusAmt'
                value={beforeBonusAmtMonthSelect} onChange={beforBonusAmtMonthSelectHandler}/>
                <span className='incomeTaxFont'> 월</span>
            </div>
            <div style={{marginTop: "20px"}}>
                <BonusIncomeTaxTable formatterNumber={formatterNumber} formatterDateYYYYMM={formatterDateYYYYMM} yearSelect={yearSelect} monthSelect={monthSelect} returnBonusIncomeTaxTable={returnBonusIncomeTaxTable} propTrList={trList} propSetTrList={setTrList} whileFirstZeroDel ={whileFirstZeroDel }/>
            </div>
            <div style={{marginTop: "20px", width: "100%", textAlign: "center"}}>
                <button className="inputComponentButton" style={{marginRight: "20px"}} onClick={calculator}>계산하기</button>
                <button className="inputComponentButton" style={{marginLeft: "20px"}} onClick={save}>저장하기</button>
            </div>
        </>
    );
}

export default InputComponent;
