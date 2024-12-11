import React, { useEffect, useState } from 'react';
import { formatterNumber, delAmt0 } from "../../Common/common.js";

function BonusIncomeTaxResult({ jsonData }) {
    useEffect(() => {
        
    }, [jsonData]);
    return (
        <>
            {jsonData.TYPE == "BONUS_INCOME_TAX" ?
                <>
                    <div style={{paddingTop: "35px", marginLeft: "60px", fontSize: "20px", color: "white"}}>
                        계산 결과
                    </div>
                    <div style={{paddingTop: "26px", marginLeft: "60px", fontSize: "18px", color: "white"}}>
                        소득세 : {formatterNumber(String(jsonData.RES_INCOME_TAX4))}원, 지방소득세 : {formatterNumber(String(delAmt0(parseInt(jsonData.RES_INCOME_TAX4)/10)))}원
                    </div>
                    <div style={{border: "1px solid white", width : "900px", marginLeft: "50px", marginTop: "20px"}}></div>
                    <div style={{paddingTop: "35px", marginLeft: "60px", fontSize: "20px", color: "white"}}>
                        계산 과정
                    </div>
                    <div style={{paddingTop: "26px", marginLeft: "60px", fontSize: "18px", color: "white"}}>
                        과세 소득 : {formatterNumber(String(jsonData.TAX_AMT))}원 = ({formatterNumber(String(jsonData.PAY_AMT))}원(상여금(세전)){jsonData.BONUS_AMT} (월별 급여액)) / {(parseInt(jsonData.MONTH)-parseInt(jsonData.BONUS_MONTH)+1)}({jsonData.BONUS_MONTH}월~{jsonData.MONTH}월까지의 기간)
                    </div>
                    {
                        parseInt(jsonData.TAX_AMT) > 10000000 ? 
                            // 10,000,000원 초과 14,000,000원 이하일 경우
                            parseInt(jsonData.TAX_AMT) > 10000000 && parseInt(jsonData.TAX_AMT) <= 14000000 ?
                                <>
                                    <div style={{paddingTop: "26px", marginLeft: "60px", fontSize: "18px", color: "white"}}>
                                        소득세 계산(10,000,000원 초과 14,000,000원 이하인 경우) : {formatterNumber(String(jsonData.RES_INCOME_TAX))}원<br/>= 10,000,000원(과세 소득 / 10,000,000원 초과분은 따로 계산) , {formatterNumber(String(jsonData.FAMILY_CNT))}명(부양 가족 수), {jsonData.YEAR}년 {jsonData.MONTH}월 기준 간이세액표 조회
                                    </div>
                                    <div style={{paddingTop: "26px", marginLeft: "60px", fontSize: "18px", color: "white"}}>
                                        소득세 추가 계산 : {formatterNumber(String(jsonData.RES_INCOME_TAX1))}원 = {formatterNumber(String(jsonData.RES_INCOME_TAX))}원 + (({formatterNumber(String(jsonData.TAX_AMT))}원 - 10,000,000원) * 98%) * 35% {parseInt(jsonData.YEAR+jsonData.MONTH) > 202302 ? "+ 25,000원" : ""}
                                    </div>
                                </>
                            :
                            parseInt(jsonData.TAX_AMT) > 14000000 && parseInt(jsonData.TAX_AMT) <= 28000000 ?
                                <>
                                    <div style={{paddingTop: "26px", marginLeft: "60px", fontSize: "18px", color: "white"}}>
                                        소득세 계산(14,000,000원 초과 28,000,000원 이하인 경우) : {formatterNumber(String(jsonData.RES_INCOME_TAX))}원<br/>= 10,000,000원(과세 소득 / 14,000,000원 초과분은 따로 계산) , {formatterNumber(String(jsonData.FAMILY_CNT))}명(부양 가족 수), {jsonData.YEAR}년 {jsonData.MONTH}월 기준 간이세액표 조회
                                    </div>
                                    <div style={{paddingTop: "26px", marginLeft: "60px", fontSize: "18px", color: "white"}}>
                                        소득세 추가 계산 : {formatterNumber(String(jsonData.RES_INCOME_TAX1))}원 = {formatterNumber(String(jsonData.RES_INCOME_TAX))}원 + (({formatterNumber(String(jsonData.TAX_AMT))}원 - 14,000,000원) * 98%) * 38% {parseInt(jsonData.YEAR+jsonData.MONTH) > 202302 ? "+ 1,397,000원" : "+ 1,372,000원"}
                                    </div>
                                </>
                            :
                            parseInt(jsonData.TAX_AMT) > 28000000 && parseInt(jsonData.TAX_AMT) <= 30000000 ?
                                <>
                                    <div style={{paddingTop: "26px", marginLeft: "60px", fontSize: "18px", color: "white"}}>
                                        소득세 계산(28,000,000원 초과 30,000,000원 이하인 경우) : {formatterNumber(String(jsonData.RES_INCOME_TAX))}원<br/>= 10,000,000원(과세 소득 / 28,000,000원 초과분은 따로 계산) , {formatterNumber(String(jsonData.FAMILY_CNT))}명(부양 가족 수), {jsonData.YEAR}년 {jsonData.MONTH}월 기준 간이세액표 조회
                                    </div>
                                    <div style={{paddingTop: "26px", marginLeft: "60px", fontSize: "18px", color: "white"}}>
                                        소득세 추가 계산 : {formatterNumber(String(jsonData.RES_INCOME_TAX1))}원 = {formatterNumber(String(jsonData.RES_INCOME_TAX))}원 + (({formatterNumber(String(jsonData.TAX_AMT))}원 - 28,000,000원) * 98%) * 40% {parseInt(jsonData.YEAR+jsonData.MONTH) > 202302 ? "+ 6,610,600원" : "+ 6,585,600원"}
                                    </div>
                                </> 
                            :
                            parseInt(jsonData.TAX_AMT) > 30000000 && parseInt(jsonData.TAX_AMT) <= 45000000 ?
                                <>
                                    <div style={{paddingTop: "26px", marginLeft: "60px", fontSize: "18px", color: "white"}}>
                                        소득세 계산(30,000,000원 초과 45,000,000원 이하인 경우) : {formatterNumber(String(jsonData.RES_INCOME_TAX))}원<br/>= 10,000,000원(과세 소득 / 30,000,000원 초과분은 따로 계산) , {formatterNumber(String(jsonData.FAMILY_CNT))}명(부양 가족 수), {jsonData.YEAR}년 {jsonData.MONTH}월 기준 간이세액표 조회
                                    </div>
                                    <div style={{paddingTop: "26px", marginLeft: "60px", fontSize: "18px", color: "white"}}>
                                        소득세 추가 계산 : {formatterNumber(String(jsonData.RES_INCOME_TAX1))}원 = {formatterNumber(String(jsonData.RES_INCOME_TAX))}원 + ({formatterNumber(String(jsonData.TAX_AMT))}원 - 30,000,000원) * 40% {parseInt(jsonData.YEAR+jsonData.MONTH) > 202302 ? "+ 7,394,600원" : "+ 7,369,600원"}
                                    </div>
                                </> 
                            :
                            parseInt(jsonData.TAX_AMT) > 45000000 && parseInt(jsonData.TAX_AMT) <= 87000000 ?
                                <>
                                    <div style={{paddingTop: "26px", marginLeft: "60px", fontSize: "18px", color: "white"}}>
                                        소득세 계산(45,000,000원 초과 87,000,000원 이하인 경우) : {formatterNumber(String(jsonData.RES_INCOME_TAX))}원<br/>= 10,000,000원(과세 소득 / 45,000,000원 초과분은 따로 계산) , {formatterNumber(String(jsonData.FAMILY_CNT))}명(부양 가족 수), {jsonData.YEAR}년 {jsonData.MONTH}월 기준 간이세액표 조회
                                    </div>
                                    <div style={{paddingTop: "26px", marginLeft: "60px", fontSize: "18px", color: "white"}}>
                                        소득세 추가 계산 : {formatterNumber(String(jsonData.RES_INCOME_TAX1))}원 = {formatterNumber(String(jsonData.RES_INCOME_TAX))}원 + ({formatterNumber(String(jsonData.TAX_AMT))}원 - 45,000,000원) * 42% {parseInt(jsonData.YEAR+jsonData.MONTH) > 202302 ? "+ 13,394,600원" : "+ 13,369,600원"}
                                    </div>
                                </>
                            :
                                <>
                                    <div style={{paddingTop: "26px", marginLeft: "60px", fontSize: "18px", color: "white"}}>
                                        소득세 계산(87,000,000원 초과) : {formatterNumber(String(jsonData.RES_INCOME_TAX))}원<br/>= 10,000,000원(과세 소득 / 87,000,000원 초과분은 따로 계산) , {formatterNumber(String(jsonData.FAMILY_CNT))}명(부양 가족 수), {jsonData.YEAR}년 {jsonData.MONTH}월 기준 간이세액표 조회
                                    </div>
                                    <div style={{paddingTop: "26px", marginLeft: "60px", fontSize: "18px", color: "white"}}>
                                        소득세 추가 계산 : {formatterNumber(String(jsonData.RES_INCOME_TAX1))}원 = {formatterNumber(String(jsonData.RES_INCOME_TAX))}원 + ({formatterNumber(String(jsonData.TAX_AMT))}원 - 87,000,000원) * 45% {parseInt(jsonData.YEAR+jsonData.MONTH) > 202302 ? "+ 31,034,600원" : "+ 31,009,600원"}
                                    </div>
                                </>
                        : 
                        <div style={{paddingTop: "26px", marginLeft: "60px", fontSize: "18px", color: "white"}}>
                            소득세 계산 : {formatterNumber(String(jsonData.RES_INCOME_TAX1))}원 = {formatterNumber(String(jsonData.TAX_AMT))}원(과세 소득) , {formatterNumber(String(jsonData.FAMILY_CNT))}명(부양 가족 수), {jsonData.YEAR}년 {jsonData.MONTH}월 기준 간이세액표 조회
                        </div>
                    }
                    {
                        jsonData.FAMILY_CHILD_CNT != "0" ?
                            jsonData.FAMILY_CHILD_CNT == "1" ?
                                <div style={{paddingTop: "26px", marginLeft: "60px", fontSize: "18px", color: "white"}}>
                                    8세이상 20세이하 부양가족 수가 1명 이상일 경우 : {formatterNumber(String(jsonData.RES_INCOME_TAX2))}원<br/>
                                    = {formatterNumber(String(jsonData.RES_INCOME_TAX1))}원 - 12,500원 
                                </div>
                            :
                            jsonData.FAMILY_CHILD_CNT == "2" ?
                                <>
                                    <div style={{paddingTop: "26px", marginLeft: "60px", fontSize: "18px", color: "white"}}>
                                        8세이상 20세이하 부양가족 수가 1명 이상일 경우 : {formatterNumber(String(jsonData.RES_INCOME_TAX2))}원<br/>
                                        = {formatterNumber(String(jsonData.RES_INCOME_TAX1))}원 - 29,160원 
                                    </div>
                                </>
                            : 
                                <>
                                    <div style={{paddingTop: "26px", marginLeft: "60px", fontSize: "18px", color: "white"}}>
                                        8세이상 20세이하 부양가족 수가 1명 이상일 경우 : {formatterNumber(String(jsonData.RES_INCOME_TAX2))}원<br/>
                                        = {formatterNumber(String(jsonData.RES_INCOME_TAX1))}원 - 29,160원 - (25,000원 x ({jsonData.FAMILY_CHILD_CNT}명 - 2))
                                    </div>
                                </>
                        : ""
                    }
                    <div style={{paddingTop: "26px", marginLeft: "60px", fontSize: "18px", color: "white"}}>
                        원천징수율 계산 : {formatterNumber(String(jsonData.RES_INCOME_TAX3))}원 = {formatterNumber(String(jsonData.RES_INCOME_TAX2))}원(소득세) x {jsonData.INCOME_TAX_RATE == "1" ? "80" : jsonData.INCOME_TAX_RATE == "2" ? "100" : "120"}%(원천징수율)
                    </div>
                    <div style={{paddingTop: "26px", marginLeft: "60px", fontSize: "18px", color: "white"}}>
                        지방소득세 계산 결과 : {formatterNumber(String(delAmt0(parseInt(jsonData.RES_INCOME_TAX4)/10)))}원(원단위 절삭) = {formatterNumber(String(jsonData.RES_INCOME_TAX4))}원 x 10%
                    </div>
                    <div style={{paddingTop: "26px", marginLeft: "60px", fontSize: "18px", color: "white"}}>
                        계산결과 : 소득세 = {formatterNumber(String(jsonData.RES_INCOME_TAX4))}원, 지방소득세 = {formatterNumber(String(delAmt0(parseInt(jsonData.RES_INCOME_TAX4)/10)))}원
                    </div>
                </>
                : ""
            }
        </>
    );
}

export default BonusIncomeTaxResult;
