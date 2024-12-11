import React, { useState } from 'react';
import axios from 'axios';
import * as encryption from "../../encryption/encryption.js"
import { formatterNumber, whileFirstZeroDel } from "../../Common/common.js";
import { useEffect } from 'react';

function InputComponent({ calculator, changeData, setChangeData }) {
    const [amtHandler, setAmtHandler] = useState("0"); // 급여액
    const [nonTaxHandler, setNonTaxHandler] = useState("0"); // 비과세금액
    const [propChange, setPropChange] = [changeData, setChangeData];

    useEffect(() => {
        if(sessionStorage.getItem("accessToken") != null) {
            let body = {
                id: encryption.decrypt(sessionStorage.getItem("accessToken")),
                major_type: '1'
            };

            axios.post('/api/user_major_tax', body)
            .then(res => {
                if(res.data.length > 0) {
                    let data = res.data[0];

                    setAmtHandler(formatterNumber(String(data.month_amt)));
                    setNonTaxHandler(formatterNumber(String(data.nontax_amt)));
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

    const checkNumberNonAmt = (e) => {
        let v = whileFirstZeroDel(formatterNumber(e.target.value));
        setNonTaxHandler(v === "" ? 0 : v);

        setPropChange(true);
    }

    const calEventHandler = e => {
        if(amtHandler.length === 0) {
            alert("소득세를 입력해주세요.");
            return;
        } else if(nonTaxHandler.length === 0) {
            alert("비과세 금액을 입력해주세요.");
            return;
        } else if(parseInt(amtHandler.replaceAll(",", "")) - parseInt(nonTaxHandler.replaceAll(",", "")) <= 0) {
            alert("비과세 금액이 소득세보다 크거나 같을 수 없습니다.");
            return;
        }

        let json_data = {};

        json_data["TYPE"] = "PersonInsur";
        json_data["AMT"] = amtHandler;
        json_data["NONTAX_AMT"] = nonTaxHandler;

        let taxAmt = parseInt(amtHandler.replaceAll("," ,"")) - parseInt(nonTaxHandler.replaceAll("," ,""));

        json_data["TAX_AMT"] = taxAmt;
        json_data["RESULT_AMT"] = (taxAmt*4.5)/100;

        calculator(json_data);
    }

    const save = () => {
        if(sessionStorage.getItem("accessToken") != null) {
            if(window.confirm("입력한 정보를 저장하시겠습니까?")) {
                let body = {
                    id: encryption.decrypt(sessionStorage.getItem("accessToken")),
                    major_type: '1',
                    month_amt: parseInt(amtHandler.replaceAll(",", "") === "" ? 0 : amtHandler.replaceAll(",", "")),
                    nontax_amt: parseInt(nonTaxHandler.replaceAll(",", "") === "" ? 0 : nonTaxHandler.replaceAll(",", "")),
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
                <span className='incomeTaxFont'>소득액</span><input className="majorIncomeTaxInput" onChange={checkNumberAmt} value={amtHandler}/><span className='incomeTaxFont'> 원</span>
                <span className='incomeTaxFont incomeTaxNonTaxAmtStr'>비과세 금액</span><input className="incomeTaxInput" onChange={checkNumberNonAmt} value={nonTaxHandler}/><span className='incomeTaxFont'> 원</span>
            </div>
            <div style={{marginTop: "20px", width: "100%", textAlign: "center"}}>
                <button className="inputComponentButton" style={{marginRight: "20px"}} onClick={calEventHandler}>계산하기</button>
                <button className="inputComponentButton" style={{marginLeft: "20px"}} onClick={save}>저장하기</button>
            </div>
        </>
    );
}

export default InputComponent;
