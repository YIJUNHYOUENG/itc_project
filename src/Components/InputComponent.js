import React, { useState, useEffect } from 'react'; 
import "../css/InputComponent.css";
import IncomeTaxInput from './IncomeTax/IncomeTaxInput';
import IncomeTaxExplain from './IncomeTax/IncomeTaxExplain';
import IncomeTaxResult from './IncomeTax/IncomeTaxResult';
import BonusIncomeTaxInput from "./BonusIncomeTax/BonusIncomeTaxInput";
import BonusIncomeTaxExplain from "./BonusIncomeTax/BonusIncomeTaxExplain";
import BonusIncomeTaxResult from "./BonusIncomeTax/BonusIncomeTaxResult";
import BusinessIncomeTaxInput from './BusinessIncomeTax/BusinessIncomeTaxInput';
import BusinessIncomeTaxExplain from './BusinessIncomeTax/BusinessIncomeTaxExplain';
import BusinessIncomeTaxResult from './BusinessIncomeTax/BusinessIncomeTaxResult';
import MajorIncomeTaxInput from "./MajorIncomeTax/MajorIncomeTaxInput";
import MajorIncomeTaxExplain from "./MajorIncomeTax/MajorIncomeTaxExplain";
import MajorIncomeTaxResult from "./MajorIncomeTax/MajorIncomeTaxResult";
import RetireIncomeTaxInput from './RetireIncometax/RetireIncomeTaxInput';
import RetireIncomeTaxExplain from './RetireIncometax/RetireIncomeTaxExplain';
import RetireIncomeTaxResult from './RetireIncometax/RetireIncomeTaxResult';

function InputComponent({ info }) {
    const [jsonData, setJsonData] = useState({});
    const [jsonExplain, setJsonExplain] = useState({TYPE : ""});
    const [inputHeight, setInputHeight] = useState(info.height_input);
    const [explainHeight, setExplainHeight] = useState(info.height_explain);
    const [resultHeight, setResultHeight] = useState(info.height_result);
    useEffect(() => {
        
    }, []);

    const [visibleMenu, setVisibleMenu] = useState("none");

    const visibleEvent = () => {
        if(jsonExplain.TYPE == "tab1") {
            setResultHeight("310px");
        } else if(jsonExplain.TYPE == "tab2" || jsonExplain.TYPE == "tab3"|| jsonExplain.TYPE == "tab4") {
            setResultHeight("260px");
        } 

        setVisibleMenu("block");
    }

    const resultData = json_data => {
        setJsonData(json_data);
    }

    const changeInputHeight = tabId => {
        if(tabId == "tab1" || tabId == "tab2" || tabId == "tab3") {
            setInputHeight("200px");
        } else if(tabId == "tab4") {
            setInputHeight("340px");
        } 

        setJsonExplain({TYPE : tabId});

        setVisibleMenu("none");
    }

    const changeExplainHeight = tabId => {
        if(tabId == "tab1" || tabId == "tab4") {
            setExplainHeight("190px");
        } else if(tabId == "tab2" || tabId == "tab3") {
            setExplainHeight("130px");
        } 
    }

    return (
        <>
            <div className='input-container' style={{ height: inputHeight}}>
                { 
                    info.visible === "incomeTax" ? <IncomeTaxInput visibleEvent={visibleEvent} resultData={resultData}/> : 
                    info.visible === "bonusIncomeTax" ? <BonusIncomeTaxInput visibleEvent={visibleEvent} resultData={resultData}/> :  
                    info.visible === "businessIncomeTax" ? <BusinessIncomeTaxInput visibleEvent={visibleEvent} resultData={resultData}/> :
                    info.visible === "majorIncomeTax" ? <MajorIncomeTaxInput visibleEvent={visibleEvent} resultData={resultData} changeInputHeight={changeInputHeight} changeExplainHeight={changeExplainHeight}/> : 
                    info.visible === "retireIncomeTax" ? <RetireIncomeTaxInput visibleEvent={visibleEvent} resultData={resultData} changeInputHeight={changeInputHeight} changeExplainHeight={changeExplainHeight}/> : <></>
                }
            </div>
            <div className='explain-container' style={{ height: explainHeight}}>
                {
                    info.visible === "incomeTax" ? <IncomeTaxExplain/> : 
                    info.visible === "bonusIncomeTax" ? <BonusIncomeTaxExplain/> :
                    info.visible === "businessIncomeTax" ? <BusinessIncomeTaxExplain/> :
                    info.visible === "majorIncomeTax" ? <MajorIncomeTaxExplain jsonExplain={jsonExplain}/> :
                    info.visible === "retireIncomeTax" ? <RetireIncomeTaxExplain/> : <></>
                }
            </div>
            <div className='result-container' style={{ height: resultHeight, display: visibleMenu}}>
                {
                    info.visible === "incomeTax" ? <IncomeTaxResult jsonData={jsonData}/> : 
                    info.visible === "bonusIncomeTax" ? <BonusIncomeTaxResult jsonData={jsonData}/> :
                    info.visible === "businessIncomeTax" ? <BusinessIncomeTaxResult jsonData={jsonData}/> :
                    info.visible === "majorIncomeTax" ? <MajorIncomeTaxResult jsonData={jsonData}/> :
                    info.visible === "retireIncomeTax" ? <RetireIncomeTaxResult jsonData={jsonData}/> : <></>
                }
            </div>
        </>
    );
}

export default InputComponent;
