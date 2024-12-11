import React, { useState } from 'react';
import axios from 'axios';
import { formatterNumber, delAmt0, whileFirstZeroDel } from "../../Common/common.js";
import * as encryption from "../../encryption/encryption.js"
import { useEffect } from 'react';

function BusinessIncomeTaxInput({ visibleEvent, resultData }) {
    const [amtHandler, setAmtHandler] = useState("0"); // 급여액
    const [smallAmountsGb, setSmallAmountsGb] = useState("2"); // 원천징수율

    useEffect(() => {
        if(sessionStorage.getItem("accessToken") != null) {
            let body = {
                id: encryption.decrypt(sessionStorage.getItem("accessToken"))
            };
            
            axios.post('/api/user_busi_income_tax', body)
            .then(res => {
                if(res.data.length > 0) {
                    alert("저장된 정보가 있습니다. 데이터를 불러오겠습니다.");

                    let data = res.data[0];

                    setAmtHandler(formatterNumber(String(data.pay_amt)));
                    setSmallAmountsGb(String(data.small_amounts));
                }
            })  
            .catch(res => console.log(res));
            
        }
    }, []);

    // 계산하기 클릭 이벤트
    const calculator = () => {
       if(amtHandler.replaceAll(",", "").length === 0) {
            alert("지급액을 입력하세요.");
            return;
        }
        else if(isNaN(amtHandler.replaceAll(",", ""))) {
            alert("지급액에는 숫자만 입력해주세요.");
            return;
        }

        let result_data = {};
        
        let pay_amt = amtHandler.replaceAll(",", "");
            
        let res_amt = pay_amt * 3 / 100;

        result_data["PAY_AMT"] = pay_amt;
        result_data["BEFORE_RES_AMT"] = res_amt;

        res_amt = delAmt0(res_amt);
        
        result_data["RES_AMT"] = res_amt;

        result_data["SMALL_AMOUNTS_GB"] = smallAmountsGb;
        if(smallAmountsGb === "1") {
            result_data["RES_AMT2"] = res_amt < 1000 ? 0 : res_amt;
        } else if(smallAmountsGb === "2") {
            result_data["RES_AMT2"] = res_amt;
        }

        result_data["TYPE"] = "BUSINESS_INCOME_TAX";

        resultData(result_data);

        visibleEvent();
    }

    const save = () => {
        if(sessionStorage.getItem("accessToken") != null) {
            if(window.confirm("입력한 정보를 저장하시겠습니까?")) {
                let body = {
                    id: encryption.decrypt(sessionStorage.getItem("accessToken")),
                    pay_amt: parseInt(amtHandler.replaceAll(",", "") === "" ? 0 : amtHandler.replaceAll(",", "")),
                    small_amounts: parseInt(smallAmountsGb)
                };
                
                console.log(body);

                axios.post('/api/save_busi_income_tax', body)
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

    const smallAmountsRadioHandler = (e) => {
        setSmallAmountsGb(e.target.value);
    }

    return (
        <>
            <div style={{paddingTop: "35px", marginLeft: "60px"}}>
            <span className='incomeTaxFont'>지급액</span><input className="incomeTaxInput" onChange={checkNumberAmt} value={amtHandler} style={{marginLeft: "256px"}}/><span className='incomeTaxFont'> 원</span>
            </div>
            <div style={{marginLeft: "60px", marginTop: "20px"}}>
                <span className='incomeTaxFont'>소액부징수</span>
                <span className='incomeSmallAmounts'>
                    <label><input type='radio' name="taxRate" value={1} onChange={smallAmountsRadioHandler} checked={smallAmountsGb === "1"}/>적용</label>
                    <label><input type='radio' name="taxRate" value={2} onChange={smallAmountsRadioHandler} checked={smallAmountsGb === "2"}/>미적용</label>
                </span>
            </div>
            <div style={{marginTop: "20px", width: "100%", textAlign: "center"}}>
                <button className="inputComponentButton" style={{marginRight: "20px"}} onClick={calculator}>계산하기</button>
                <button className="inputComponentButton" style={{marginLeft: "20px"}} onClick={save}>저장하기</button>
            </div>
        </>
    );
}

export default BusinessIncomeTaxInput;
