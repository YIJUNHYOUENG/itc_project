import React, { useEffect, useState } from 'react';
import PersonInsurInput from "./PersonInsurInput";
import HealthInsurInput from "./HealthInsurInput";
import EmplInsurInput from "./EmplInsurInput";
import InduAccInsurInput from "./InduAccInsurInput";

function InputComponent({ visibleEvent, resultData, changeInputHeight, changeExplainHeight }) {
    const [selectTab, setSelectTab] = useState("tab1");
    const [changeData, setChangeData] = useState(false);

    useEffect(() => {
        changeInputHeight("tab1");
    }, []);

    // 계산하기 클릭 이벤트
    const calculator = e => {
        resultData(e);
        visibleEvent();
    }

    const changeTab = e => {
        if(selectTab !== e.target.id) {
            if(changeData) {
                if(window.confirm("수정한 정보는 변경되지 않습니다.")) {
                    setSelectTab(e.target.id);
                    changeInputHeight(e.target.id);
                    changeExplainHeight(e.target.id);
                }

                setChangeData(false);
            } else {
                setSelectTab(e.target.id);
                changeInputHeight(e.target.id);
                changeExplainHeight(e.target.id);
            }
        }
    }    

    return (
        <>
            <div className='majorTabMenu'>
                <div className={'majorTabSubMenu firstNode'+(selectTab==="tab1"?" selected":"")} onClick={changeTab} id="tab1">국민연금</div>
                <div className={'majorTabSubMenu'+(selectTab==="tab2"?" selected":"")} onClick={changeTab} id="tab2">건강보험</div>
                <div className={'majorTabSubMenu'+(selectTab==="tab3"?" selected":"")} onClick={changeTab} id="tab3">고용보험</div>
                <div className={'majorTabSubMenu lastNode'+(selectTab==="tab4"?" selected":"")} onClick={changeTab} id="tab4">산재보험</div>
            </div>
            {
                selectTab==="tab1" ?
                    <PersonInsurInput calculator={calculator} changeData={changeData} setChangeData={setChangeData}/> :
                selectTab==="tab2" ?
                    <HealthInsurInput calculator={calculator} changeData={changeData} setChangeData={setChangeData}/> :
                selectTab==="tab3" ?
                    <EmplInsurInput calculator={calculator} changeData={changeData} setChangeData={setChangeData}/> :
                selectTab==="tab4" ?
                    <InduAccInsurInput calculator={calculator} changeData={changeData} setChangeData={setChangeData}/> : <></>
            }
        </>
    );
}

export default InputComponent;
