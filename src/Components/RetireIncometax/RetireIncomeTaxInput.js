import React, { useState } from 'react';
import Select from "react-select";
import axios from 'axios';
import { formatterNumber, formatterDateYYYYMM, formatterDateYYYYMMDD, whileFirstZeroDel, delAmt0 } from "../../Common/common.js";
import * as encryption from "../../encryption/encryption.js"
import { useEffect } from 'react';

function RetireIncomeTaxInput({ visibleEvent, resultData }) {
    const [ertDate, ertRetDate] = useState(""); // 입사일
    const [rertDate, rertRetDate] = useState(""); // 퇴사일
    const [amtHandler, setAmtHandler] = useState("0"); // 상여금
    const [holidayCnt, setHolidayCnt] = useState("0"); // 연차개수
    const [holidayAmt, setHolidayAmt] = useState("0"); // 연차금액
    const [trList, setTrList] = useState([
        {KEY : 0, START_DATE : '', END_DATE : '', MONTH_AMT : '0', NONTAX_AMT : '0'},
        {KEY : 1, START_DATE : '', END_DATE : '', MONTH_AMT : '0', NONTAX_AMT : '0'},
        {KEY : 2, START_DATE : '', END_DATE : '', MONTH_AMT : '0', NONTAX_AMT : '0'},
        {KEY : 3, START_DATE : '', END_DATE : '', MONTH_AMT : '0', NONTAX_AMT : '0'}
    ]);
    const [lastDisabled, setLastDisabled] = useState(false);
    const [calBtnClick, setCalBtnClick] = useState(false);
    const [dayDiff, setDayDiff] = useState(0);

    useEffect(() => {
        if(sessionStorage.getItem("accessToken") != null) {
            let body = {
                id: encryption.decrypt(sessionStorage.getItem("accessToken"))
            };

            axios.post('/api/user_reti_income_tax', body)
            .then(res => {
                if(res.data.length > 0) {
                    alert("저장된 정보가 있습니다. 데이터를 불러오겠습니다.");

                    let data = res.data[0][0];
                    ertRetDate(formatterDateYYYYMMDD(data.start_date));
                    rertRetDate(formatterDateYYYYMMDD(data.end_date));
                    setAmtHandler(formatterNumber(String(data.bonus_amt)));
                    setHolidayCnt(formatterNumber(String(data.holi_count)));
                    setHolidayAmt(formatterNumber(String(data.holi_amt)));
                    setLastDisabled(data.last_dis == "1" ? true : false);
                    setCalBtnClick(data.cal_btn == "1" ? true : false);

                    if(data.cal_btn === "1") {
                        selCal3MonthAmt(res.data[1]);
                    }
                }
            })  
            .catch(res => console.log(res));
        }
    }, []);

    // 계산하기 클릭 이벤트
    const calculator = () => {
        // 입사일, 퇴사일 검증
        if(ertDate.length == 0) {
            alert("입사일을 입력하세요.");
            return;
        } else if(rertDate.length == 0) {
            alert("퇴사일을 입력하세요.");
            return;
        } else if(chkDate(ertDate) || chkDate(rertDate)) {
            return;
        } else if(false) {

        } else if(holidayCnt.length == 0) {
            alert("연차개수를 입력하세요.");
            return;
        } else if(holidayAmt.length == 0) {
            alert("연차수당을 입력하세요.");
            return;
        } else if(!calBtnClick) {
            alert("계산하기 버튼을 누른 후 급여를 입력해주세요.");
            return;
        }

        let data_json = {};
        data_json["TYPE"] = "RETI_INCOME_TAX";

        let total_amt = 0;

        for(let i=0;i<4;i++) {
            total_amt += parseInt(trList[i].MONTH_AMT.replaceAll(",", "")) - parseInt(trList[i].NONTAX_AMT.replaceAll(",", ""));
        }

        data_json["3MONTH_AMT"] = (formatterNumber(String(total_amt))==""?"0":formatterNumber(String(total_amt)))+"(3개월치 급여 합산)";
        data_json["BONUS_AMT"] = amtHandler+"(상여금)";
        data_json["HOLIDAY_AMT"] = holidayAmt+"(연차수당)";
        data_json["HOLIDAY_CNT"] = holidayCnt+"(연차개수)";
    
        // 평균임금
        let avg_pay = (total_amt
            + (parseInt(amtHandler.replaceAll(",", ""))+(parseInt(holidayAmt.replaceAll(",", ""))*parseInt(holidayCnt.replaceAll(",", ""))))/365*90)/90;
        avg_pay =  delAmt0(String(avg_pay));

        data_json["AVG_PAY"] = `(${(formatterNumber(String(total_amt))==""?"0":formatterNumber(String(total_amt)))}원(3개월치 급여 합산) + (${amtHandler}원(상여금) + (${holidayAmt}원(연차수당) * ${holidayCnt}개(연차개수))) / 365 * 90) / 90`;
        data_json["AVG_PAY_RES"] = (formatterNumber(String(avg_pay))==""?"0":formatterNumber(String(avg_pay)))+"원(평균임금)";
        // 과세퇴직급여
        let rert_amt = delAmt0(String(avg_pay * 30 * dayDiff / 365));
        
        data_json["DAY_DIFF"] = (formatterNumber(String(dayDiff))==""?"0":formatterNumber(String(dayDiff)))+"원(근무일수)";
        data_json["RERT_AMT"] = (formatterNumber(String(rert_amt))==""?"0":formatterNumber(String(rert_amt)))+"원(과세퇴직급여)";
        data_json["RERT_AMT_STR"] = (formatterNumber(String(avg_pay))==""?"0":formatterNumber(String(avg_pay)))+"원(평균임금)" + " * 30 * "+formatterNumber(String(dayDiff))+" / 365";

        // 퇴직소득근속연수공제
        // 근속연수에 따라 공제해주는 금액
        let work_year = parseInt(dayDiff/365);    
        
        data_json["WORK_YEAR"] = (formatterNumber(String(work_year))==""?"0":formatterNumber(String(work_year)))+"원(근무연수)";

        let work_year_amt = 0;
        if(work_year <= 5) {
            work_year_amt = 1000000 * work_year;
            data_json["WORK_YEAR_AMT"] = `1,000,000원 * ${(formatterNumber(String(work_year))==""?"0":formatterNumber(String(work_year)))}년(근무연수)`;
        } else if(work_year <= 10) {
            work_year_amt = 5000000 + 1000000 * (work_year-5);
            data_json["WORK_YEAR_AMT"] = `5,000,000원 + 1,000,000원 * (${(formatterNumber(String(work_year))==""?"0":formatterNumber(String(work_year)))}년(근무연수) - 5년)`;
        } else if(work_year <= 20) {
            work_year_amt = 15000000 + 2500000 * (work_year-10);
            data_json["WORK_YEAR_AMT"] = `15,000,000원 + 2,500,000원 * (${(formatterNumber(String(work_year))==""?"0":formatterNumber(String(work_year)))}년(근무연수) - 10년)`;
        } else {
            work_year_amt = 40000000 + 3000000 * (work_year-20);
            data_json["WORK_YEAR_AMT"] = `40,000,000원 + 3,000,000원 * (${(formatterNumber(String(work_year))==""?"0":formatterNumber(String(work_year)))}년(근무연수) - 20년)`;
        }
        data_json["WORK_YEAR_AMT_RES"] = (formatterNumber(String(work_year_amt))==""?"0":formatterNumber(String(work_year_amt)))+"원(퇴직소득근속연수공제)";

        // 환산급여
        let cal_amt = delAmt0(String((rert_amt - work_year_amt)/work_year * 12));

        data_json["CAL_AMT_STR"] = `(${(formatterNumber(String(rert_amt))==""?"0":formatterNumber(String(rert_amt)))}원(과세퇴직급여) - `
                                    + `${(formatterNumber(String(work_year_amt))==""?"0":formatterNumber(String(work_year_amt)))}원(퇴직소득근속연수공제)) / ${(formatterNumber(String(work_year))==""?"0":formatterNumber(String(work_year)))}년(근속연수) * 12`;
        data_json["CAL_AMT"] = (formatterNumber(String(cal_amt))==""?"0":formatterNumber(String(cal_amt)))+"원(환산급여)";

        let spe_cal_amt = 0;
        // 환산급여별공제
        if(cal_amt <= 8000000) {
            spe_cal_amt = cal_amt;
            data_json["SPE_CAL_AMT"] = `${(formatterNumber(String(cal_amt))==""?"0":formatterNumber(String(cal_amt)))}원(환산급여)`;
        } else if(cal_amt <= 70000000) {
            spe_cal_amt = 8000000 + (cal_amt - 8000000) * 60 / 100;
            data_json["SPE_CAL_AMT"] = `8,000,000원 + (${(formatterNumber(String(cal_amt))==""?"0":formatterNumber(String(cal_amt)))}원(환산급여) - 8,000,000원) * 60 / 100;`;
        } else if(cal_amt <= 100000000) {
            spe_cal_amt = 45200000 + (cal_amt - 70000000) * 55 / 100;
            data_json["SPE_CAL_AMT"] = `45,200,000원 + (${(formatterNumber(String(cal_amt))==""?"0":formatterNumber(String(cal_amt)))}원(환산급여) - 70,000,000원) * 55 / 100`;
        } else if(cal_amt <= 300000000) {
            spe_cal_amt = 61700000 + (cal_amt - 100000000) * 45 / 100;
            data_json["SPE_CAL_AMT"] = `61,700,000원 + (${(formatterNumber(String(cal_amt))==""?"0":formatterNumber(String(cal_amt)))}원(환산급여) - 70,000,000원) * 55 / 100`;
        } else {
            spe_cal_amt = 151700000 + (cal_amt - 300000000) * 35 / 100;
            data_json["SPE_CAL_AMT"] = `151,700,000원 + (${(formatterNumber(String(cal_amt))==""?"0":formatterNumber(String(cal_amt)))}원(환산급여) - 300,000,000원) * 35 / 100`;
        }
        data_json["SPE_CAL_AMT_RES"] = `${(formatterNumber(String(spe_cal_amt))==""?"0":formatterNumber(String(spe_cal_amt)))}(환산급여별공제)`;

        // 퇴직소득과세표준
        let rert_tax_amt = cal_amt - spe_cal_amt;
        
        data_json["RERT_TAX_AMT"] = `${(formatterNumber(String(cal_amt))==""?"0":formatterNumber(String(cal_amt)))}원(환산급여) - ${(formatterNumber(String(spe_cal_amt))==""?"0":formatterNumber(String(spe_cal_amt)))}원(환산급여별공제)`;
        data_json["RERT_TAX_AMT_RES"] = (formatterNumber(String(rert_tax_amt))==""?"0":formatterNumber(String(rert_tax_amt)))+"원(퇴직소득과세표준)";

        // 환산산출세액
        let next_tax_amt = 0;

        if(rert_tax_amt <= 14000000) {
            next_tax_amt = parseInt(rert_tax_amt * 6 / 100);
            data_json["NEXT_TAX_AMT"] = `${(formatterNumber(String(rert_tax_amt))==""?"0":formatterNumber(String(rert_tax_amt)))}원(퇴직소득과세표준) * 6 / 100`;
        } else if(rert_tax_amt <= 50000000) {
            next_tax_amt = parseInt(rert_tax_amt * 15 / 100 - 1260000);
            data_json["NEXT_TAX_AMT"] = `${(formatterNumber(String(rert_tax_amt))==""?"0":formatterNumber(String(rert_tax_amt)))}원(퇴직소득과세표준) * 15 / 100 - 1,260,000원`;
        } else if(rert_tax_amt <= 88000000) {
            next_tax_amt = parseInt(rert_tax_amt * 24 / 100 - 5760000);
            data_json["NEXT_TAX_AMT"] = `${(formatterNumber(String(rert_tax_amt))==""?"0":formatterNumber(String(rert_tax_amt)))}원(퇴직소득과세표준) * 24 / 100 - 5,760,000원`;
        } else if(rert_tax_amt <= 150000000) {
            next_tax_amt = parseInt(rert_tax_amt * 35 / 100 - 15440000);
            data_json["NEXT_TAX_AMT"] = `${(formatterNumber(String(rert_tax_amt))==""?"0":formatterNumber(String(rert_tax_amt)))}원(퇴직소득과세표준) * 35 / 100 - 15,440,000원`;
        } else if(rert_tax_amt <= 300000000) {
            next_tax_amt = parseInt(rert_tax_amt * 38 / 100 - 19940000);
            data_json["NEXT_TAX_AMT"] = `${(formatterNumber(String(rert_tax_amt))==""?"0":formatterNumber(String(rert_tax_amt)))}원(퇴직소득과세표준) * 38 / 100 - 19,940,000원`;
        } else if(rert_tax_amt <= 500000000) {
            next_tax_amt = parseInt(rert_tax_amt * 40 / 100 - 25940000);
            data_json["NEXT_TAX_AMT"] = `${(formatterNumber(String(rert_tax_amt))==""?"0":formatterNumber(String(rert_tax_amt)))}원(퇴직소득과세표준) * 40 / 100 - 25,940,000원`;
        } else if(rert_tax_amt <= 1000000000) {
            next_tax_amt = parseInt(rert_tax_amt * 42 / 100 - 35940000);
            data_json["NEXT_TAX_AMT"] = `${(formatterNumber(String(rert_tax_amt))==""?"0":formatterNumber(String(rert_tax_amt)))}원(퇴직소득과세표준) * 42 / 100 - 35,940,000원`;
        } else {
            next_tax_amt = parseInt(rert_tax_amt * 45 / 100 - 65940000);
            data_json["NEXT_TAX_AMT"] = `${(formatterNumber(String(rert_tax_amt))==""?"0":formatterNumber(String(rert_tax_amt)))}원(퇴직소득과세표준) * 45 / 100 - 65,940,000원`;
        }
        data_json["NEXT_TAX_AMT_RES"] = (formatterNumber(String(next_tax_amt))==""?"0":formatterNumber(String(next_tax_amt)))+"원(환산산출세액)";

        // 산출세액
        let last_amt = delAmt0(String(parseInt(next_tax_amt/12 * work_year)));
        data_json["LAST_AMT"] = `${(formatterNumber(String(next_tax_amt))==""?"0":formatterNumber(String(next_tax_amt)))}원(환산산출세액) / 12 * ${work_year}년(근무연수)`
        data_json["LAST_AMT_RES"] = `${(formatterNumber(String(last_amt))==""?"0":formatterNumber(String(last_amt)))}원(산출세액)`;
        
        resultData(data_json);
        visibleEvent();
    }

    const chkDate = value => {
        let year = "", month = "", day = "";

        if(value.length != 10 && !lastDisabled) {
            alert('YYYY-MM-DD 형식으로 입력해주세요.');
            return true;
        }

        year = value.substring(0, 4);
        month = value.substring(4, 6);
        day = value.substring(6, 8);

        if(parseInt(month) < 1 && parseInt(month) > 12) {
            alert("1월 ~ 12월 사이로 입력해주세요.");
            return true;
        } else if(parseInt(day) < 1 && parseInt(day) > 31) {
            alert("1일 ~ 31일 사이로 입력해주세요.");
            return true;
        }

        return false;
    }

    const save = () => {
        if(sessionStorage.getItem("accessToken") != null) {
            if(window.confirm("입력한 정보를 저장하시겠습니까?")) {
                let body = {
                    id: encryption.decrypt(sessionStorage.getItem("accessToken")),
                    ert_date: ertDate.replaceAll("-", ""),
                    rert_date: rertDate.replaceAll("-", ""),
                    bonus_amt: amtHandler.replaceAll(",", ""),
                    holiday_cnt: holidayCnt.replaceAll(",", ""),
                    holiday_amt: holidayAmt.replaceAll(",", ""),
                    last_dis: lastDisabled ? "1" : "2",
                    cal_btn: calBtnClick ? "1" : "2"
                };

                axios.post('/api/save_reti_income_tax', body)
                .then(res => {
                    if(res.data.success) {
                        trList.map((e, i) => {
                            let body2 = {
                                id: encryption.decrypt(sessionStorage.getItem("accessToken")),
                                idx: e.KEY,
                                start_date: e.START_DATE.replaceAll("-", ""),
                                end_date: e.END_DATE.replaceAll("-", ""),
                                month_amt: e.MONTH_AMT.replaceAll(",", ""),
                                nontax_amt: e.NONTAX_AMT.replaceAll(",", "")
                            };
                            axios.post('/api/save_reti_income_tax_dtl', body2)
                            .then(res => {
                            })  
                            .catch(res => console.log(res));
                        });

                        alert("저장 되었습니다.");
                    } else {
                        alert("다시 시도 해주세요.");
                    }
                })  
                .catch(res => console.log(res));
            }
        } else {
            alert("로그인 후 이용해주세요.");
        } 
    }

    const checkNumberAmt = (e) => {
        let v = whileFirstZeroDel(formatterNumber(e.target.value));
        setAmtHandler(v === "" ? "0" : v);
    }

    const holidayCntHandler = (e) => {
        let v = whileFirstZeroDel(formatterNumber(e.target.value));
        setHolidayCnt(v === "" ? "0" : v);
    }

    const holidayAmtHandler = (e) => {
        let v = whileFirstZeroDel(formatterNumber(e.target.value));
        setHolidayAmt(v === "" ? "0" : v);
    }

    const BonusIncomeTaxInputChange = (e) => {
        let index = e.target.parentNode.parentNode.getElementsByClassName("INDEX")[0].value;

        if(e.target.name === "START_DATE" || e.target.name === "END_DATE") {
            trList[index][e.target.name] = formatterDateYYYYMMDD(e.target.value);
        } else {
            let v = whileFirstZeroDel(formatterNumber(e.target.value));
            trList[index][e.target.name] = formatterNumber(v === "" ? "0" : v);
        }
        
        setTrList([...trList]);
    }

    const checkDateYYYYMMDD = e => {
        if(e.target.id == "ert") {
            ertRetDate(formatterDateYYYYMMDD(e.target.value));
        } else if(e.target.id == "rert") {
            rertRetDate(formatterDateYYYYMMDD(e.target.value));
        }
    }

    const notFunction = () => {

    }

    const selCal3MonthAmt = (rec) => {
        console.log(rec)

        let tbl_arr = trList;
        for(let i=0;i<rec.length;i++) {
            let value = rec[i];

            tbl_arr[i].START_DATE = formatterDateYYYYMMDD(value.start_date);
            tbl_arr[i].END_DATE = formatterDateYYYYMMDD(value.end_date);
            tbl_arr[i].MONTH_AMT = formatterNumber(String(value.month_amt));
            tbl_arr[i].NONTAX_AMT = formatterNumber(String(value.nontax_amt));
        }

        setTrList([...tbl_arr]);
    }

    const cal3MonthAmt = () => {
        if(ertDate.length === 0) {
            alert("입사일을 입력하세요.");
            return;
        } else if(rertDate.length === 0) {
            alert("퇴사일을 입력하세요.");
            return;
        } else if(ertDate.length !== 10) {
            alert("입사일을 YYYY-MM-DD 형식으로 입력하세요.");
            return;
        } else if(rertDate.length !== 10) {
            alert("퇴사일을 YYYY-MM-DD 형식으로 입력하세요.");
            return;
        }

        let ert_date = ertDate.replaceAll("-", "");
        let rert_date = rertDate.replaceAll("-", "");

        if(parseInt(ert_date) >= parseInt(rert_date)) {
            alert("입사일은 퇴사일보다 크거나 같을 수 없습니다.");
        }
        
        let sd = new Date(ertDate);
        let ed = new Date(rertDate);
        let cal_ed = new Date(rertDate);
        let cal_date = new Date(cal_ed.setDate(cal_ed.getDate() - 90));
        let cal_stop = false;

        let elapsedMSec = ed.getTime() - sd.getTime();
        setDayDiff(elapsedMSec / 1000 / 60 / 60 / 24);

        if(parseInt(ed.getMonth()) - parseInt(cal_date.getMonth()) === 3) {
            setLastDisabled(false);
        } else {
            setLastDisabled(true);
            cal_stop = true;
        }

        let tbl_arr = trList;
        let temp_cal_date = new Date(cal_date);
        for(let i=0;i<4;i++) {
            if(i===3 && cal_stop) {
                tbl_arr[i].START_DATE = "";
                tbl_arr[i].END_DATE = "";
                tbl_arr[i].MONTH_AMT = "0";
                tbl_arr[i].NONTAX_AMT = "0";
                break;
            }

            let temp_date = new Date(temp_cal_date);

            let cal_year = temp_date.getFullYear();
            let cal_month = temp_date.getMonth()+1;
            let last_day = new Date(cal_year, cal_month, 0);
            last_day = last_day.getDate();
            tbl_arr[i].START_DATE = cal_year+"-"+(cal_month < 10 ? "0"+cal_month:cal_month)+"-"+"01";
            if(ed.getMonth()+1 == cal_month) {
                if(ed.getDate() != last_day) {
                    last_day = ed.getDate();
                }
            }
            tbl_arr[i].END_DATE = cal_year+"-"+(cal_month < 10 ? "0"+cal_month:cal_month)+"-"+(last_day < 10 ?"0"+last_day:last_day);
            tbl_arr[i].MONTH_AMT = "0";
            tbl_arr[i].NONTAX_AMT = "0";

            temp_cal_date = new Date(temp_cal_date.setMonth(temp_cal_date.getMonth() + 1));	
        }

        setTrList([...tbl_arr]);
        setCalBtnClick(true);
    }

    return (
        <>
            <div style={{paddingTop: "35px", marginLeft: "60px"}}>
                <span className='incomeTaxFont'>입사일</span>
                <input className="incomeTaxInput" onChange={checkDateYYYYMMDD} value={ertDate} id="ert" placeholder='YYYY-MM-DD'/>
                <span className='incomeTaxFont' style={{ marginLeft: "80px"}}>퇴사일</span>
                <input className="incomeTaxInput" onChange={checkDateYYYYMMDD} value={rertDate} id="rert" placeholder='YYYY-MM-DD'/>
                <input type="button" className='settingInput' value="계산하기" style={{border: "0px", marginLeft: "80px"}} onClick={cal3MonthAmt}/>
            </div>
            <div style={{marginTop: "20px"}}>
                <div style={{backgroundColor: "#5fa8d3", height: "230px", width: "620.67px", margin: "auto", borderRadius: "3px"}}>
                    <table style={{width: "100%", maxHeight: "224px", overflow: "hidden", backgroundColor: "#5fa8d3", borderRadius: "3px"}}>
                        <thead style={{height: "34px", fontSize: "20px", color: "white"}}>
                            <tr>
                                <th style={{width: "120px"}}>지급 시작일</th>
                                <th style={{width: "120px"}}>지급 종료일</th>
                                <th style={{width: "120px"}}>월급여액(세전)</th>
                                <th style={{width: "120px"}}>비과세 금액</th>
                            </tr>
                        </thead>
                        <tbody style={{overflowY: "scroll", maxHeight: "190px", display : "block"}}>
                        {
                            trList.map((e, i) => {
                                return(
                                    <tr key={e.KEY} style={{height: "30px"}}>
                                        <td style={{display:"none"}}><input className="INDEX" value={e.KEY} onChange={notFunction}/></td>
                                        <td style={{width: "120px"}}><input name="START_DATE" value={trList[i].START_DATE} onChange={BonusIncomeTaxInputChange} className="bonusIncomeTaxTableListInput" style={{ textAlign: "center" }} disabled={true} placeholder='YYYY-MM-DD'/></td>
                                        <td style={{width: "120px"}}><input name="END_DATE" value={trList[i].END_DATE} onChange={BonusIncomeTaxInputChange} className="bonusIncomeTaxTableListInput" style={{ textAlign: "center" }} disabled={true} placeholder='YYYY-MM-DD'/></td>
                                        <td style={{width: "120px"}}><input name="MONTH_AMT" value={trList[i].MONTH_AMT} onChange={BonusIncomeTaxInputChange} className="bonusIncomeTaxTableListInput" disabled={i == 3 && lastDisabled}/></td>
                                        <td style={{width: "120px"}}><input name="NONTAX_AMT" value={trList[i].NONTAX_AMT} onChange={BonusIncomeTaxInputChange} className="bonusIncomeTaxTableListInput" disabled={i == 3 && lastDisabled}/></td>
                                    </tr>
                                )
                            })
                        }
                        </tbody>
                    </table>
                </div>
            </div>
            <div style={{marginLeft: "60px", marginTop: "20px"}}>
                <span className='incomeTaxFont'>상여금</span><input className="incomeTaxInput bonusIncomeTaxInput" style={{marginLeft: "255px"}} onChange={checkNumberAmt} value={amtHandler}/><span className='incomeTaxFont'> 원</span>
            </div>
            <div style={{marginLeft: "60px", marginTop: "20px"}}>
                <span className='incomeTaxFont'>연차개수</span><input className="incomeTaxInput bonusIncomeTaxInput" style={{marginLeft: "232px"}} onChange={holidayCntHandler} value={holidayCnt}/><span className='incomeTaxFont'> 개</span>
            </div>
            <div style={{marginLeft: "60px", marginTop: "20px"}}>
                <span className='incomeTaxFont'>연차수당</span><input className="incomeTaxInput bonusIncomeTaxInput" style={{marginLeft: "232px"}} onChange={holidayAmtHandler} value={holidayAmt}/><span className='incomeTaxFont'> 원</span>
            </div>
            <div style={{marginTop: "20px", width: "100%", textAlign: "center"}}>
                <button className="inputComponentButton" style={{marginRight: "20px"}} onClick={calculator}>계산하기</button>
                <button className="inputComponentButton" style={{marginLeft: "20px"}} onClick={save}>저장하기</button>
            </div>
        </>
    );
}

export default RetireIncomeTaxInput;
