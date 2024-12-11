import React, { useState } from 'react';
import axios from 'axios';
import * as encryption from "../../encryption/encryption.js"
import { formatterNumber, delAmt0, whileFirstZeroDel } from "../../Common/common.js";
import { useEffect } from 'react';

function HealthInsurInput({ calculator, changeData, setChangeData }) {
    const [amtHandler, setAmtHandler] = useState("0"); // 급여액
    const [propChange, setPropChange] = [changeData, setChangeData];

    useEffect(() => {
        if(sessionStorage.getItem("accessToken") != null) {
            let body = {
                id: encryption.decrypt(sessionStorage.getItem("accessToken")),
                major_type: '2'
            };

            axios.post('/api/user_major_tax', body)
            .then(res => {
                if(res.data.length > 0) {
                    let data = res.data[0];

                    setAmtHandler(formatterNumber(String(data.month_amt)));
                }
            })  
            .catch(res => console.log(res));
        }
    }, []);

    const checkNumberAmt = (e) => {
        let v = whileFirstZeroDel(formatterNumber(e.target.value));
        setAmtHandler(v === "" ? 0 : v);
        setPropChange(true);
    }

    const calEventHandler = e => {
        if(amtHandler.length == 0) {
            alert("보수월액을 입력하세요.");
            return;
        }

        let json_data = {};
        
        json_data["TYPE"] = "HealthInsur";
        json_data["AMT"] = amtHandler;
        json_data["TAX_AMT"] = parseInt(amtHandler.replaceAll(",", ""));
        json_data["RESULT_AMT"] = parseInt(amtHandler.replaceAll(",", "")) * 3.43 / 100;
        json_data["RESULT_AMT2"] = delAmt0(parseInt(amtHandler.replaceAll(",", "")) * 3.43 / 100);

        calculator(json_data);
    }

    const save = () => {
        if(sessionStorage.getItem("accessToken") != null) {
            if(window.confirm("입력한 정보를 저장하시겠습니까?")) {
                let body = {
                    id: encryption.decrypt(sessionStorage.getItem("accessToken")),
                    major_type: '2',
                    month_amt: parseInt(amtHandler.replaceAll(",", "") === "" ? 0 : amtHandler.replaceAll(",", "")),
                    nontax_amt: 0,
                    job_gubun: '',
                    job_rate: '',
                    group_1: '',
                    group_2: '',
                    group_3: ''
                };
                
                axios.post('/api/save_major_tax', body)
                .then(res => {
                    if(res.data.success) {
                        alert("저장 되었습니다.");
                        setPropChange(false);
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

    return (
        <>
            <div style={{marginLeft: "60px", marginTop: "20px"}}>
                <span className='incomeTaxFont'>보수월액</span><input className="majorInputCenter" onChange={checkNumberAmt} value={amtHandler}/><span className='incomeTaxFont'> 원</span>
            </div>
            <div style={{marginTop: "20px", width: "100%", textAlign: "center"}}>
                <button className="inputComponentButton" style={{marginRight: "20px"}} onClick={calEventHandler}>계산하기</button>
                <button className="inputComponentButton" style={{marginLeft: "20px"}} onClick={save}>저장하기</button>
            </div>
        </>
    );
}

export default HealthInsurInput;
