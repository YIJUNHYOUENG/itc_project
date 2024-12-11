import React, { useEffect, useState } from 'react';
import { formatterNumber, delAmt0 } from "../../Common/common.js";

function IncomeTaxResult({ jsonData }) {
    useEffect(() => {
        
    }, [jsonData]);
    return (
        <>
            {
                jsonData.TYPE == "PersonInsur" ?
                    <>
                        <div style={{paddingTop: "35px", marginLeft: "60px", fontSize: "20px", color: "white"}}>
                            계산 결과
                        </div>
                        <div style={{paddingTop: "26px", marginLeft: "60px", fontSize: "18px", color: "white"}}>
                            국민연금 : {formatterNumber(String(jsonData.RESULT_AMT))}원
                        </div>
                        <div style={{border: "1px solid white", width : "900px", marginLeft: "50px", marginTop: "20px"}}></div>
                        <div style={{paddingTop: "35px", marginLeft: "60px", fontSize: "20px", color: "white"}}>
                            계산 과정
                        </div>
                        <div style={{paddingTop: "26px", marginLeft: "60px", fontSize: "18px", color: "white"}}>
                            과세 금액 : {formatterNumber(String(jsonData.TAX_AMT))}원 = {formatterNumber(String(jsonData.AMT))}원(소득액) - {formatterNumber(String(jsonData.NONTAX_AMT))}원(비과세 금액)
                        </div>
                        <div style={{paddingTop: "26px", marginLeft: "60px", fontSize: "18px", color: "white"}}>
                            국민연금 계산 : {formatterNumber(String(jsonData.RESULT_AMT))}원 = {formatterNumber(String(jsonData.TAX_AMT))}원(과세 금액) * 4.5%
                        </div>
                    </> : 
                jsonData.TYPE == "HealthInsur" ?
                    <>
                        <div style={{paddingTop: "35px", marginLeft: "60px", fontSize: "20px", color: "white"}}>
                            계산 결과
                        </div>
                        <div style={{paddingTop: "26px", marginLeft: "60px", fontSize: "18px", color: "white"}}>
                            건강보험 : {formatterNumber(String(jsonData.RESULT_AMT2))}원
                        </div>
                        <div style={{border: "1px solid white", width : "900px", marginLeft: "50px", marginTop: "20px"}}></div>
                        <div style={{paddingTop: "35px", marginLeft: "60px", fontSize: "20px", color: "white"}}>
                            계산 과정
                        </div>
                        <div style={{paddingTop: "26px", marginLeft: "60px", fontSize: "18px", color: "white"}}>
                            건강보험 계산 : {formatterNumber(String(jsonData.RESULT_AMT2))}원 = {formatterNumber(String(jsonData.TAX_AMT))}원(보수월액) * 3.43%
                        </div>
                    </> :
                jsonData.TYPE == "EmplInsur" ?
                    <>
                        <div style={{paddingTop: "35px", marginLeft: "60px", fontSize: "20px", color: "white"}}>
                            계산 결과
                        </div>
                        <div style={{paddingTop: "26px", marginLeft: "60px", fontSize: "18px", color: "white"}}>
                            고용보험 : {formatterNumber(String(jsonData.RESULT_AMT2))}원
                        </div>
                        <div style={{border: "1px solid white", width : "900px", marginLeft: "50px", marginTop: "20px"}}></div>
                        <div style={{paddingTop: "35px", marginLeft: "60px", fontSize: "20px", color: "white"}}>
                            계산 과정
                        </div>
                        <div style={{paddingTop: "26px", marginLeft: "60px", fontSize: "18px", color: "white"}}>
                            고용보험 계산 : {formatterNumber(String(jsonData.RESULT_AMT2))}원 = {formatterNumber(String(jsonData.TAX_AMT))}원(보수월액) * 0.8%
                        </div>
                    </> :
                jsonData.TYPE == "InduAccInsur" ?
                <>
                    <div style={{paddingTop: "35px", marginLeft: "60px", fontSize: "20px", color: "white"}}>
                        계산 결과
                    </div>
                    <div style={{paddingTop: "26px", marginLeft: "60px", fontSize: "18px", color: "white"}}>
                        산재보험 : {formatterNumber(String(jsonData.RESULT_AMT))}원
                    </div>
                    <div style={{border: "1px solid white", width : "900px", marginLeft: "50px", marginTop: "20px"}}></div>
                    <div style={{paddingTop: "35px", marginLeft: "60px", fontSize: "20px", color: "white"}}>
                        계산 과정
                    </div>
                    <div style={{paddingTop: "26px", marginLeft: "60px", fontSize: "18px", color: "white"}}>
                        산재보험 계산 : {formatterNumber(String(jsonData.RESULT_AMT))}원 = {formatterNumber(String(jsonData.AMT))}원(보수총액) * {jsonData.SEL_RATE} / 1000
                    </div>
                </> : ""
            }
        </>
    );
}

export default IncomeTaxResult;
