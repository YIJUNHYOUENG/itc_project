import React from 'react';

function InputComponent({ info }) {
    return (
        <>
            <div style={{paddingTop: "35px", marginLeft: "60px", fontSize: "20px", color: "white"}}>
                입력 방법
            </div>
            <div style={{paddingTop: "26px", marginLeft: "60px", fontSize: "18px", color: "white"}}>
                ＊계산 년월 : 2021~2024년, 1~12월 조회 가능
            </div>
            <div style={{paddingTop: "26px", marginLeft: "60px", fontSize: "18px", color: "white"}}>
                ＊상여금(세전) : 상여로 주는 금액. 월급이외에 특별히 지급되는 보너스
            </div>
            <div style={{paddingTop: "26px", marginLeft: "60px", fontSize: "18px", color: "white"}}>
                ＊부양 가족 수 : 본인이 생계를 책임지고 있는 가족의 수
            </div>
            <div style={{paddingTop: "20px", marginLeft: "60px", fontSize: "18px", color: "white"}}>
                ＊8세이상 20세이하 부양 가족 수 : 본인이 생계를 책임지고 있는 가족 중 8세이상 20세이하 자녀의 수
            </div>
            <div style={{paddingTop: "20px", marginLeft: "74px", fontSize: "18px", color: "white"}}>
                (ex : 본인 + 배우자 + 미성년 자녀 2명 = 부양 가족 수 4명, 8세이상 20세이하 부양 가족 수 2명)
            </div>
            <div style={{paddingTop: "26px", marginLeft: "60px", fontSize: "18px", color: "white", lineHeight: "25px"}}>
                ＊원천 징수 : 원천세를 근로자의 소득에서 떼어 국가에 납부하는 제도<br/>
                ＊원천 징수율 : 원천 징수 지급 퍼센트 (80%, 100%, 120%)
            </div>
            <div style={{paddingTop: "26px", marginLeft: "60px", fontSize: "18px", color: "white"}}>
                ＊직전 상여 지급월 : 직전 상여금을 지급 받은 월 입력(연도는 상여 지급년과 동일).<br/> 
            </div>
            <div style={{paddingTop: "20px", marginLeft: "74px", fontSize: "18px", color: "white"}}>
                만약 금년에 받은 상여가 없다면 1월로 입력
            </div>
            <div style={{paddingTop: "26px", marginLeft: "60px", fontSize: "18px", color: "white"}}>
                ＊지급년월, 월급여액(세전) 입력 방법 : 지급년월은 직전 상여 지급 월을 시작으로 상여 지급 월까지 입력
            </div>
            <div style={{paddingTop: "20px", marginLeft: "74px", fontSize: "18px", color: "white"}}>
                ex) 직전 상여 지급 월 = 1월, 상여 지급 월 = 11월 일 경우 총 11개의 정보 입력 (1~11월까지의 급여 정보)
            </div>
        </>
    );
}

export default InputComponent;
