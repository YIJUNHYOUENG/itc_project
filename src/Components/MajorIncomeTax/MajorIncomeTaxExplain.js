import React, {useEffect} from 'react';

function InputComponent({ jsonExplain }) {
    useEffect(() => {
        
    }, [jsonExplain]);
    return (
        <>
            <div style={{paddingTop: "35px", marginLeft: "60px", fontSize: "20px", color: "white"}}>
                입력 방법
            </div>
            {
                jsonExplain.TYPE == "tab1" ?
                <>
                    <div style={{paddingTop: "26px", marginLeft: "60px", fontSize: "18px", color: "white"}}>
                        ＊소득액 : '지급 내역' 만 계산한 금액. 계산 방법 : 과세 금액 + 비과세 금액
                    </div>
                    <div style={{paddingTop: "26px", marginLeft: "60px", fontSize: "18px", color: "white"}}>
                        ＊비과세 금액 : 세금이 발생하지 않는 금액 ex) 식대
                    </div>
                </> :
                jsonExplain.TYPE == "tab2" || jsonExplain.TYPE == "tab3" ?
                <>
                    <div style={{paddingTop: "26px", marginLeft: "60px", fontSize: "18px", color: "white"}}>
                        ＊보수월액 : '지급 내역' 만 계산한 금액. 계산 방법 : 과세 금액만 입력
                    </div>
                </> :
                jsonExplain.TYPE == "tab4" ?
                <>
                    <div style={{paddingTop: "26px", marginLeft: "60px", fontSize: "18px", color: "white"}}>
                        ＊보수총액 : '지급 내역' 만 계산한 금액. 계산 방법 : 과세 금액 + 비과세 금액
                    </div>
                    <div style={{paddingTop: "26px", marginLeft: "60px", fontSize: "18px", color: "white"}}>
                        ＊업종보험요율 : 사업별로 보험요율이 다르다
                    </div>
                </> : <></>
            }
        </>
    );
}

export default InputComponent;
