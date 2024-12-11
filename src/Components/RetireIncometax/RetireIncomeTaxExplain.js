import React from 'react';

function RetireIncomeTaxExplain({ info }) {
    return (
        <>
            <div style={{paddingTop: "35px", marginLeft: "60px", fontSize: "20px", color: "white"}}>
                입력 방법
            </div>
            <div style={{paddingTop: "26px", marginLeft: "60px", fontSize: "18px", color: "white"}}>
                ＊입사일 : 입사 연월일
            </div>
            <div style={{paddingTop: "26px", marginLeft: "60px", fontSize: "18px", color: "white"}}>
                ＊퇴사일 : 퇴사 연월일
            </div>
            <div style={{paddingTop: "26px", marginLeft: "60px", fontSize: "18px", color: "white"}}>
                ＊마지막 3개월간(90일치) 지급연월, 월급여액(세전), 비과세 금액 입력
            </div>
            <div style={{paddingTop: "26px", marginLeft: "60px", fontSize: "18px", color: "white"}}>
                ＊상여금 : 1년간 지급 받는 상여금
            </div>
            <div style={{paddingTop: "20px", marginLeft: "60px", fontSize: "18px", color: "white"}}>
                ＊연차개수 : 1년간 지급 받은 연차 중 남은 연차 개수
            </div>
            <div style={{paddingTop: "26px", marginLeft: "60px", fontSize: "18px", color: "white", lineHeight: "25px"}}>
                ＊연차수당 : 연차 1개당 지급 받은 연차 금액
            </div>
        </>
    );
}

export default RetireIncomeTaxExplain;
