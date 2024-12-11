import React, { useEffect, useState } from 'react';
import { formatterNumber, delAmt0 } from "../../Common/common.js";

function IncomeTaxResult({ jsonData }) {
    useEffect(() => {
        
    }, [jsonData]);
    return (
        <>
            {jsonData.TYPE == "BUSINESS_INCOME_TAX" ?
                <>
                    <div style={{paddingTop: "35px", marginLeft: "60px", fontSize: "20px", color: "white"}}>
                        계산 결과
                    </div>
                    <div style={{paddingTop: "26px", marginLeft: "60px", fontSize: "18px", color: "white"}}>
                        소득세 : {formatterNumber(String(jsonData.RES_AMT2))}원, 지방소득세 : {formatterNumber(String(delAmt0(parseInt(jsonData.RES_AMT2)/10)))}원
                    </div>
                    <div style={{border: "1px solid white", width : "900px", marginLeft: "50px", marginTop: "20px"}}></div>
                    <div style={{paddingTop: "35px", marginLeft: "60px", fontSize: "20px", color: "white"}}>
                        계산 과정
                    </div>
                    <div style={{paddingTop: "26px", marginLeft: "60px", fontSize: "18px", color: "white"}}>
                        소득세 : {formatterNumber(String(jsonData.BEFORE_RES_AMT))}원 = {formatterNumber(String(jsonData.PAY_AMT))}원(지급액) x 3%
                    </div>
                    <div style={{paddingTop: "26px", marginLeft: "60px", fontSize: "18px", color: "white"}}>
                        원단위 절삭 : {formatterNumber(String(jsonData.RES_AMT))}원 = {formatterNumber(String(jsonData.BEFORE_RES_AMT))}원(원단위 절삭)
                    </div>
                    <div style={{paddingTop: "26px", marginLeft: "60px", fontSize: "18px", color: "white"}}>
                        소액부징수 계산 : {formatterNumber(String(jsonData.RES_AMT2))}원 = {formatterNumber(String(jsonData.RES_AMT))}원 {jsonData.SMALL_AMOUNTS_GB == "1" ? "< 1,000원" : ""} 
                    </div>
                    <div style={{paddingTop: "26px", marginLeft: "60px", fontSize: "18px", color: "white"}}>
                        지방소득세 계산 결과 : {formatterNumber(String(delAmt0(parseInt(jsonData.RES_AMT2)/10)))}원(원단위 절삭) = {formatterNumber(String(jsonData.RES_AMT2))}원 x 10%
                    </div>
                    <div style={{paddingTop: "26px", marginLeft: "60px", fontSize: "18px", color: "white"}}>
                        계산결과 : 소득세 = {formatterNumber(String(jsonData.RES_AMT2))}원, 지방소득세 = {formatterNumber(String(delAmt0(parseInt(jsonData.RES_AMT2)/10)))}원
                    </div>
                </>
                : ""
            }
        </>
    );
}

export default IncomeTaxResult;
