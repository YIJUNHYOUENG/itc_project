import React, { useState } from 'react';
import { useEffect } from 'react';

function BonusIncomeTaxTable({ formatterNumber, formatterDateYYYYMM, whileFirstZeroDel, propTrList, propSetTrList }) {
    const [trList, setTrList] = [propTrList, propSetTrList];
    
    const addDataList = (e) => {
        e.preventDefault();
        if(trList.length > 11) return;

        let json_data = {};
        json_data["KEY"] = String(trList.length)
        json_data["PAY_YM"] = "";
        json_data["MONTH_AMT"] = "0";
        
        setTrList([...trList, json_data]);
    }

    const BonusIncomeTaxInputChange = (e) => {
        let index = e.target.parentNode.parentNode.getElementsByClassName("INDEX")[0].value;
        
        if(e.target.name === "PAY_YM") {
            trList[index][e.target.name] = formatterDateYYYYMM(e.target.value);
        } else {
            let v = whileFirstZeroDel(formatterNumber(e.target.value));

            trList[index][e.target.name] = v;
        }
        
        setTrList([...trList]);
    }

    const notFunction = () => {

    }

    const BonusIncomeTaxInputDelete = e => {
        let index = e.target.parentNode.parentNode.getElementsByClassName("INDEX")[0].value;
        
        let data = [];
        let idx = 0;

        for(let i=0;i<trList.length;i++) {
            if(i != index) {
                trList[i]["KEY"] = idx++;
                data.push(trList[i]);
            }
        }

        setTrList([...data]);
    }

    return (
        <div style={{backgroundColor: "#5fa8d3", height: "230px", width: "620.67px", margin: "auto", borderRadius: "3px"}}>
            <table style={{width: "100%", maxHeight: "224px", overflow: "hidden", backgroundColor: "#5fa8d3", borderRadius: "3px"}}>
                <thead style={{height: "34px", fontSize: "20px", color: "white"}}>
                    <tr>
                        <th>지급년월</th>
                        <th>월급여액(세전)</th>
                        <th><input type='button' value="추가하기" onClick={addDataList}/></th>
                    </tr>
                </thead>
                <tbody style={{overflowY: "scroll", maxHeight: "190px", display : "block"}}>
                {
                    trList.map((e, i) => {
                        return(
                            <tr key={e.KEY} style={{height: "30px"}}>
                                <td style={{display:"none"}}><input className="INDEX" value={e.KEY} onChange={notFunction}/></td>
                                <td><input name="PAY_YM" value={trList[i].PAY_YM} onChange={BonusIncomeTaxInputChange} className="bonusIncomeTaxTableListInput" style={{ textAlign: "center" }} placeholder='YYYY-MM'/></td>
                                <td><input name="MONTH_AMT" value={trList[i].MONTH_AMT} onChange={BonusIncomeTaxInputChange} className="bonusIncomeTaxTableListInput"/></td>
                                <td><a className="bonusIncomeTaxDelete" onClick={BonusIncomeTaxInputDelete}></a></td>
                            </tr>
                        )
                    })
                }
                </tbody>
            </table>
        </div>
    );
}

export default BonusIncomeTaxTable;