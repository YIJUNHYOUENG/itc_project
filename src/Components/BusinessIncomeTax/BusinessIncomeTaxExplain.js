import React from 'react';

function InputComponent({ info }) {
    return (
        <>
            <div style={{paddingTop: "35px", marginLeft: "60px", fontSize: "20px", color: "white"}}>
                입력 방법
            </div>
            <div style={{paddingTop: "26px", marginLeft: "60px", fontSize: "18px", color: "white"}}>
                ＊지급액 : 사업 소득이 발생한 금액 입력
            </div>
            <div style={{paddingTop: "26px", marginLeft: "60px", fontSize: "18px", color: "white"}}>
                ＊소액부징수 : 소득세가 천원미만인 경우 소득세를 납부하지 않는다.
            </div>
        </>
    );
}

export default InputComponent;
