import React, { useEffect, useState } from 'react';

function RetireIncomeTaxResult({ jsonData }) {
    useEffect(() => {
        
    }, [jsonData]);
    return (
        <>
            {jsonData.TYPE == "RETI_INCOME_TAX" ?
                <>
                    <div style={{paddingTop: "35px", marginLeft: "60px",marginRight: "60px", fontSize: "20px", color: "white"}}>
                        계산 결과
                    </div>
                    <div style={{paddingTop: "26px", marginLeft: "60px",marginRight: "60px", fontSize: "18px", color: "white"}}>
                        퇴직 소득세 : {jsonData.LAST_AMT_RES}원
                    </div>
                    <div style={{border: "1px solid white", width : "900px", marginLeft: "50px", marginTop: "20px"}}></div>
                    <div style={{paddingTop: "35px", marginLeft: "60px",marginRight: "60px", fontSize: "20px", color: "white"}}>
                        계산 과정
                    </div>
                    <div style={{paddingTop: "26px", marginLeft: "60px", marginRight: "60px", fontSize: "18px", color: "white"}}>
                        평균임금 : {jsonData.AVG_PAY_RES} = 
                        {jsonData.AVG_PAY}
                    </div>
                    <div style={{paddingTop: "26px", marginLeft: "60px",marginRight: "60px", fontSize: "18px", color: "white"}}>
                        과세퇴직급여 : {jsonData.RERT_AMT} = {jsonData.RERT_AMT_STR}
                    </div>
                    <div style={{paddingTop: "26px", marginLeft: "60px",marginRight: "60px", fontSize: "18px", color: "white"}}>
                        퇴직소득근속연수공제 : {jsonData.WORK_YEAR_AMT_RES} = {jsonData.WORK_YEAR_AMT}
                    </div>
                    <div style={{paddingTop: "26px", marginLeft: "60px",marginRight: "60px", fontSize: "18px", color: "white"}}>
                        환산급여 : {jsonData.CAL_AMT} = {jsonData.CAL_AMT_STR}
                    </div>
                    <div style={{paddingTop: "26px", marginLeft: "60px",marginRight: "60px", fontSize: "18px", color: "white"}}>
                        환산급여별공제 : {jsonData.SPE_CAL_AMT_RES} = {jsonData.SPE_CAL_AMT}
                    </div>
                    <div style={{paddingTop: "26px", marginLeft: "60px",marginRight: "60px", fontSize: "18px", color: "white"}}>
                        퇴직소득과세표준 : {jsonData.RERT_TAX_AMT_RES} = {jsonData.RERT_TAX_AMT}
                    </div>
                    <div style={{paddingTop: "26px", marginLeft: "60px",marginRight: "60px", fontSize: "18px", color: "white"}}>
                        환산산출세액 : {jsonData.NEXT_TAX_AMT_RES} = {jsonData.NEXT_TAX_AMT}
                    </div>
                    <div style={{paddingTop: "26px", marginLeft: "60px",marginRight: "60px", fontSize: "18px", color: "white"}}>
                        산출세액(퇴직 소득세) : {jsonData.LAST_AMT_RES} = {jsonData.LAST_AMT}
                    </div>
                </>
                : ""
            }
        </>
    );
}

export default RetireIncomeTaxResult;
