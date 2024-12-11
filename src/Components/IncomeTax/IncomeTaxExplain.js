import React from 'react';
import axios from 'axios';

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
                ＊세전 월 급여 : '지급 내역' 만 계산한 금액. 계산 방법 : 과세 금액 + 비과세 금액
            </div>
            <div style={{paddingTop: "26px", marginLeft: "60px", fontSize: "18px", color: "white"}}>
                ＊비과세 금액 : 세금이 발생하지 않는 금액 ex) 식대
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
        </>
    );
}

export default InputComponent;
