import React, { useState } from 'react';
import Select from "react-select";
import { selType, job1Type } from "../../Global/globalVar.js";
import axios from 'axios';
import { formatterNumber, formatterRate, per1000, delAmt0, whileFirstZeroDel } from "../../Common/common.js";
import * as encryption from "../../encryption/encryption.js"
import { useEffect } from 'react';

function InduAccInsurInput({ calculator, changeData, setChangeData }) {
    const [amtHandler, setAmtHandler] = useState("0"); // 급여액
    const [selTypeChange, setSelTypeChange] = useState(selType[0]);
    const [selfRate, setSelfRate] = useState("");
    const [job1TypeChange, setJob1TypeChange] = useState(job1Type[0]);
    const [job2Type, setJob2Type] = useState([{value : "0", label: "사업세목"}]);
    const [job3Type, setJob3Type] = useState([{value : "0", label: "사업상세"}]);
    const [job2TypeChange, setJob2TypeChange] = useState(job2Type[0]);
    const [job3TypeChange, setJob3TypeChange] = useState(job3Type[0]);
    const [propChange, setPropChange] = [changeData, setChangeData];
    const [renderComp, setRenderComp] = useState(false);

    useEffect(() => {
        if(sessionStorage.getItem("accessToken") !== null) {
            let body = {
                id: encryption.decrypt(sessionStorage.getItem("accessToken")),
                major_type: '4'
            };

            axios.post('/api/user_major_tax', body)
            .then(res => {
                if(res.data.length > 0) {
                    let data = res.data[0];
                    if(renderComp) {
                        setJob1TypeChange(job1Type[data.group_1]);
                        setJob2TypeChange(job2Type[data.group_2]);
                        setJob3TypeChange(job3Type[data.group_3]);
                    }

                    job1Setting(String(data.group_1));
                    job2Setting(String(data.group_1), String(data.group_2));
                    job3Setting(String(data.group_1), String(data.group_2), String(data.group_3));
                    setAmtHandler(formatterNumber(String(data.month_amt)));
                    setSelTypeChange(selType[data.job_gubun]);
                    setSelfRate(data.job_rate);

                    setRenderComp(true);
                }
            })  
            .catch(res => console.log(res));
        }
    }, [renderComp]);

    const checkNumberAmt = e => {
        let v = whileFirstZeroDel(formatterNumber(e.target.value));
        setAmtHandler(v === "" ? 0 : v);
    }

    const checkRate = e => {
        setSelfRate(per1000(formatterRate(e.target.value)));
    }

    const setSelTypeChangeHandler = e => {
        setSelTypeChange(e);  
    }

    const setJob1TypeChangeHandler = e => {
        setJob1TypeChange(e);

        job1Setting(e.value);

        setJob2TypeChange(job2Type[0]);
        setSelfRate("");
    }

    const setJob2TypeChangeHandler = e => {
        setJob2TypeChange(e);

        job2Setting(job1TypeChange.value, e.value);

        setJob3TypeChange(job3Type[0]);
        setSelfRate("");
    }

    const setJob3TypeChangeHandler = e => {
        setJob3TypeChange(e);

        job3Setting(job1TypeChange.value, job2TypeChange.value, e.value);
    }

    const job1Setting = (job1) => {
        if(job1 === "0") {
            setJob2Type([{ value: "0", label: "사업세목" }]); 
        } else if(job1 === "1") {
            setJob2Type([
                { value: "0", label: "사업세목" },
                { value: "1", label: "석탄광업 및 채석업" },
                { value: "2", label: "석회석ㆍ금속ㆍ비금속광업 및 기타광업" }
            ]);
        } else if(job1 === "2") {
            setJob2Type([
                { value: "0", label: "사업세목" },
                { value: "1", label: "식료품제조업" },
                { value: "2", label: "섬유및섬유제품제조업" },
                { value: "3", label: "목재 및 종이제품 제조업" },
                { value: "4", label: "출판ㆍ인쇄ㆍ제본 또는 인쇄물가공업" },
                { value: "5", label: "화학 및 고무제품 제조업" },
                { value: "6", label: "의약품ㆍ화장품ㆍ연탄ㆍ석유제품 제조업" },
                { value: "7", label: "기계기구ㆍ금속ㆍ비금속광물제품 제조업" },
                { value: "8", label: "금속제련업" },
                { value: "9", label: "전기기계기구ㆍ정밀기구ㆍ전자제품 제조업" },
                { value: "10", label: "선박건조 및 수리업" },
                { value: "11", label: "수제품 및 기타제품 제조업" },
            ]);
        } else if(job1 === "3") {
            setJob2Type([
                { value: "0", label: "사업세목" },
                { value: "1", label: "전기ㆍ가스ㆍ증기ㆍ수도사업" }
            ]);
        } else if(job1 === "4") {
            setJob2Type([
                { value: "0", label: "사업세목" },
                { value: "1", label: "건설업" }
            ]);
        } else if(job1 === "5") {
            setJob2Type([
                { value: "0", label: "사업세목" },
                { value: "1", label: "철도ㆍ항공ㆍ창고ㆍ운수관련서비스업" },
                { value: "2", label: "육상 및 수상운수업" },
                { value: "3", label: "통신업" }
            ]);
        } else if(job1 === "6") {
            setJob2Type([
                { value: "0", label: "사업세목" },
                { value: "1", label: "임업" }
            ]);
        } else if(job1 === "6") {
            setJob2Type([
                { value: "0", label: "사업세목" },
                { value: "1", label: "어업" }
            ]);
        } else if(job1 === "7") {
            setJob2Type([
                { value: "0", label: "사업세목" },
                { value: "1", label: "농업" }
            ]);
        } else if(job1 === "8") {
            setJob2Type([
                { value: "0", label: "사업세목" },
                { value: "1", label: "기타의 각종사업" },
                { value: "2", label: "전문ㆍ보건ㆍ교육ㆍ여가관련 서비스업" },
                { value: "3", label: "도ㆍ소매 및 소비자용품 수리업" },
                { value: "4", label: "부동산업 및 임대업" }
            ]);
        } else if(job1 === "9") {
            setJob2Type([
                { value: "0", label: "사업세목" },
                { value: "1", label: "금융및보험업" }
            ]);
        }
    }

    const job2Setting = (job1, job2) => {
        if(job1 === "1") {
            if(job2 === "1") {
                // 석탄광업 및 채석업
                setJob3Type([
                    { value: "0", label: "사업상세" },
                    { value: "1", label: "무연탄 광업" },
                    { value: "2", label: "갈탄 광업" },
                    { value: "3", label: "유연탄 광업" },
                    { value: "4", label: "아탄 광업" },
                    { value: "5", label: "기타석탄광업" },
                    { value: "6", label: "암석채굴ㆍ채취업" }
                ]);
            } else if(job2 === "2") {
                // 석회석ㆍ금속ㆍ비금속광업 및 기타광업
                setJob3Type([
                    { value: "0", label: "사업상세" },
                    { value: "1", label: "석회석(백운석,대리석포함)광업" },
                    { value: "2", label: "금속광업" },
                    { value: "3", label: "비금속광업" },
                    { value: "4", label: "흑연광업" },
                    { value: "5", label: "석탄선별업" },
                    { value: "6", label: "원유광업" },
                    { value: "7", label: "천연가스광업또는압축천연가스광업" },
                    { value: "8", label: "사광업" },
                    { value: "9", label: "쇄석채취업" },
                    { value: "10", label: "토사채굴ㆍ채취업" },
                    { value: "11", label: "기타광물채굴ㆍ채취업" }
                ]);
            }
        } else if(job1 === "2") { 
            if(job2 === "1") {
                // 식료품제조업
                setJob3Type([
                    { value: "0", label: "사업상세" },
                    { value: "1", label: "육제품 또는 유제품제조업" },
                    { value: "2", label: "야채 및 과실의 통조림과 기타 절임식료품 제조업" },
                    { value: "3", label: "수산식료품 제조업" },
                    { value: "4", label: "빵및과자류 제조업" },
                    { value: "5", label: "제당 및 정당업" },
                    { value: "6", label: "도정 및 제분업" },
                    { value: "7", label: "조미료(장류포함) 제조업 및 제염업" },
                    { value: "8", label: "제빙업" },
                    { value: "9", label: "음료 제조업" },
                    { value: "10", label: "기타식료품 제조업" }
                ]);
            } else if(job2 === "2") {
                // 섬유및섬유제품제조업
                setJob3Type([
                    { value: "0", label: "사업상세" },
                    { value: "1", label: "직물업" },
                    { value: "2", label: "메리야스 제조업" },
                    { value: "3", label: "의복및장신품등의제조업" },
                    { value: "4", label: "표백 및 염색가공업" },
                    { value: "5", label: "방직제사 및 화학섬유제품 제조업" },
                    { value: "6", label: "화학섬유 제조업" },
                    { value: "7", label: "기타섬유 제조업" }
                ]);
            } else if(job2 === "3") {
                // 목재 및 종이제품 제조업
                setJob3Type([
                    { value: "0", label: "사업상세" },
                    { value: "1", label: "목상자,목통류 및 목용기 제조업" },
                    { value: "2", label: "목재건구 제조업" },
                    { value: "3", label: "목재가구 제조업" },
                    { value: "4", label: "기타 목재 및 목제품 제조업" },
                    { value: "5", label: "일반제재업" },
                    { value: "6", label: "목재약품 처리업" },
                    { value: "7", label: "베니어판 등 제조업" },
                    { value: "8", label: "펄프 제조업" },
                    { value: "9", label: "지류 제조업" },
                    { value: "10", label: "섬유판 제조업" },
                    { value: "11", label: "골판지 및 종이용기 제조업" },
                    { value: "12", label: "위생용 종이제품 제조업" }
                ]);
            } else if(job2 === "4") {
                // 출판 인쇄 제본 또는 인쇄물가공업
                setJob3Type([
                    { value: "0", label: "사업상세" },
                    { value: "1", label: "출판업 및 음반 제조업" },
                    { value: "2", label: "인쇄업" },
                    { value: "3", label: "사진제판, 식자 등의 제조업" },
                    { value: "4", label: "제본 또는 인쇄물 가공업" }
                ]);
            } else if(job2 === "5") {
                // 화학 및 고무제품 제품업
                setJob3Type([
                    { value: "0", label: "사업상세" },
                    { value: "1", label: "유기화학제품 제조업" },
                    { value: "2", label: "무기화학제품 제조업" },
                    { value: "3", label: "화학비료 제조업" },
                    { value: "4", label: "도료제품 또는 유지가공제품 제조업" },
                    { value: "5", label: "화약 및 성냥 제조업" },
                    { value: "6", label: "동ㆍ식물유지 제조업" },
                    { value: "7", label: "합성수지 제조업" },
                    { value: "8", label: "천연수지 제조업" },
                    { value: "9", label: "플라스틱 가공제품 제조업" },
                    { value: "10", label: "기타 화학제품 제조업" },
                    { value: "11", label: "고무제품 제조업" }
                ]);
            } else if(job2 === "6") {
                // 의약품 화장품 연탄 석유제품 제조업
                setJob3Type([
                    { value: "0", label: "사업상세" },
                    { value: "1", label: "의약품 및 의약부외품 제조업" },
                    { value: "2", label: "화장품 및 향료제조업" },
                    { value: "3", label: "담배 재건조 및 담배제품 제조업" },
                    { value: "4", label: "코크스 및 석탄가스 제조업" },
                    { value: "5", label: "연탄 및 응집고체연료 생산업" },
                    { value: "6", label: "석유지석유정제품 제조업" }
                ]);
            } else if(job2 === "7") {
                // 기계기구 금속 비금속광물제품 제조업
                setJob3Type([
                    { value: "0", label: "사업상세" },
                    { value: "1", label: "철근콘크리트제품 제조업" },
                    { value: "2", label: "석회 제조업" },
                    { value: "3", label: "탄소 또는 흑연제품 제조업" },
                    { value: "4", label: "석재 및 석공품 제조업" },
                    { value: "5", label: "기타 비금속광물제품 제조업" },
                    { value: "6", label: "양식기,칼,수공구 또는 일반금물 제조업" },
                    { value: "7", label: "수공구 제조업" },
                    { value: "8", label: "농기구 제조업" },
                    { value: "9", label: "건설용 금속제품 제조업" },
                    { value: "10", label: "양철관 또는 도금판 제품 제조업" },
                    { value: "11", label: "위생장치품 및 가열조명장치품 제조업" },
                    { value: "12", label: "선재 제품 제조업" },
                    { value: "13", label: "배관공사용 부속품 제조업" },
                    { value: "14", label: "각종 금속의 용접 또는 용단을 행하는 사업" },
                    { value: "15", label: "법랑철기 및 프레스 가공 제조업" },
                    { value: "16", label: "기타 금속제품 제조업 또는 금속가공업" },
                    { value: "17", label: "합금철제조업" },
                    { value: "18", label: "철강재제조업" },
                    { value: "19", label: "제강압연업" },
                    { value: "20", label: "철강및합금철제품제조업" },
                    { value: "21", label: "철강압연업" },
                    { value: "22", label: "철강또는비철금속주물제조업" },
                    { value: "23", label: "기타금속재료품제조업" },
                    { value: "24", label: "원동기제조업" },
                    { value: "25", label: "농업용 기계 제조업" },
                    { value: "26", label: "특수산업용 기계 제조업" },
                    { value: "27", label: "금속가공기계 제조업" },
                    { value: "28", label: "건설기계 또는 관산기계 및 설비품 제조업" },
                    { value: "29", label: "섬유기계 제조업" },
                    { value: "30", label: "가정용,사무용,서비스용 기계기구 제조업" },
                    { value: "31", label: "일반산업용 기계장치 제조업" },
                    { value: "32", label: "소화기 및 분사기 제조업" },
                    { value: "33", label: "무기제조업" },
                    { value: "34", label: "동력용 전기기계기구 제조업" },
                    { value: "35", label: "각종 기계 또는 동 부속품 제조업" },
                    { value: "36", label: "기타산업용 기계기구 제조업" },
                    { value: "37", label: "용융도금업" },
                    { value: "38", label: "전기도금업" },
                    { value: "39", label: "알루마이트 가공업" },
                    { value: "40", label: "열처리사업" },
                    { value: "41", label: "코팅사업" },
                    { value: "42", label: "자동차제조업" },
                    { value: "43", label: "항공기 제조 또는 수리업" },
                    { value: "44", label: "기타 수송용 기계기구 제조업" },
                    { value: "45", label: "철도차량 제조 또는 수리업" },
                    { value: "46", label: "자동차부분품 제조업" },
                    { value: "47", label: "자동차 및 모터사이클 수리업" },
                    { value: "48", label: "판유리제조업" },
                    { value: "49", label: "광학유리 제조업" },
                    { value: "50", label: "유리섬유 제조업" },
                    { value: "51", label: "유리제품 가공업" },
                    { value: "52", label: "기타유리제품 제조업" },
                    { value: "53", label: "건설용 점토제품 제조업" },
                    { value: "54", label: "토석제품 제조업" },
                    { value: "55", label: "연마재 제조업" },
                    { value: "56", label: "각종 시멘트제품 제조업" },
                    { value: "57", label: "도자기 제조업" },
                    { value: "58", label: "타일 제조업" },
                    { value: "59", label: "시멘트 제조업" },
                ]);
            } else if(job2 === "8") {
                // 금속제련업
                setJob3Type([
                    { value: "0", label: "사업상세" },
                    { value: "1", label: "금속의제련또는정련업" },
                    { value: "2", label: "비철금속의제련또는정련업" }
                ]);
            } else if(job2 === "9") {
                // 전기기계기구 정밀기구 전자제품 제조업
                setJob3Type([
                    { value: "0", label: "사업상세" },
                    { value: "1", label: "일상생활용 전기기계기구 제조업" },
                    { value: "2", label: "전구제조업" },
                    { value: "3", label: "절연전선 또는 케이블 제조업" },
                    { value: "4", label: "기타 전기기계기구 제조업" },
                    { value: "5", label: "전자관 또는 반도체소자 제조업" },
                    { value: "6", label: "전자응용장치 제조업" },
                    { value: "7", label: "전기계측기 제조업" },
                    { value: "8", label: "통신기계기구 또는 이에 관련한 기계기구 제조업" },
                    { value: "9", label: "의료기계기구 제조업" },
                    { value: "10", label: "광학기계기구 또는 렌즈 제조업" },
                    { value: "11", label: "시계 제조업" },
                    { value: "12", label: "이화학 기계기구 제조업" },
                    { value: "13", label: "측량 기계기구 제조업" },
                    { value: "14", label: "계측기 또는 시험기 제조업" },
                    { value: "15", label: "침,단추 등을 제조하는 사업" },
                    { value: "16", label: "악기 제조업" },
                    { value: "17", label: "금형제조업" }
                ]);
            } else if(job2 === "10") {
                // 선박건조 및 수리업
                setJob3Type([
                    { value: "0", label: "사업상세" },
                    { value: "1", label: "강선 건조 또는 수리업" },
                    { value: "2", label: "목선 건조 또는 수리업" },
                    { value: "3", label: "콘크리트 또는 플라스틱 선박 건조 및 수리업" }
                ]);
            } else if(job2 === "11") {
                // 수제품 및 기타제품 제조업
                setJob3Type([
                    { value: "0", label: "사업상세" },
                    { value: "1", label: "귀금속 제품 제조업" },
                    { value: "2", label: "볏짚류,가발,수모 등의 제품 제조업" },
                    { value: "3", label: "나전칠기 및 칠기 제조업" },
                    { value: "4", label: "지류가공제품 제조업" },
                    { value: "5", label: "포류 및 기타 피혁제품 제조업" },
                    { value: "6", label: "기타 수제품 제조업" },
                    { value: "7", label: "공업용 피혁제품 제조업" },
                    { value: "8", label: "사무용품 또는 회화용품 제조업" },
                    { value: "9", label: "운동용구 제조업" },
                    { value: "10", label: "기타 각종 제조업" }
                ]);
            }
        } else if(job1 === "3") { 
            if(job2 === "1") {
                // 전기 가스 증기 수도사업
                setJob3Type([
                    { value: "0", label: "사업상세" },
                    { value: "1", label: "전기업" },
                    { value: "2", label: "가스업" },
                    { value: "3", label: "수도사업" }
                ]);
            }
        } else if(job1 === "4") { 
            if(job2 === "1") {
                // 건설업
                setJob3Type([
                    { value: "0", label: "사업상세" },
                    { value: "1", label: "건축건설공사" },
                    { value: "2", label: "도로신설공사" },
                    { value: "3", label: "기계장치공사" },
                    { value: "4", label: "기타건설공사" },
                    { value: "5", label: "수력발전시설 신설공사" },
                    { value: "6", label: "터널신설공사" },
                    { value: "7", label: "철도 또는 궤도 신설공사" },
                    { value: "8", label: "고가 및 지하철도 신설공사" },
                    { value: "9", label: "고제방(댐) 등 신설공사" },
                    { value: "10", label: "건설기계 관리사업" }
                ]);
            }
        } else if(job1 === "5") { 
            if(job2 === "1") {
                // 철도 항공 창고 운수관련서비스업
                setJob3Type([
                    { value: "0", label: "사업상세" },
                    { value: "1", label: "철도ㆍ궤도 운수업" },
                    { value: "2", label: "삭도운수업(케이블카)" },
                    { value: "3", label: "항공운수업" },
                    { value: "4", label: "항공운수지원서비스업" },
                    { value: "5", label: "운수부대서비스업" },
                    { value: "6", label: "창고업" },
                    { value: "7", label: "기타 보관업" },
                    { value: "8", label: "항만 내의 육상하역업" },
                    { value: "9", label: "해상하역업" },
                    { value: "10", label: "육상화물 취급업" },
                    { value: "11", label: "각종 운수 부대사업" }
                ]);
            } else if(job2 === "2") {
                // 육상 및 수상운수업
                setJob3Type([
                    { value: "0", label: "사업상세" },
                    { value: "1", label: "자동차에 의한 여객운수업" },
                    { value: "2", label: "자동차 전세 여객운수업" },
                    { value: "3", label: "택시 및 경차량 운수업" },
                    { value: "4", label: "노선화물운수업" },
                    { value: "5", label: "구역화물운수업" },
                    { value: "6", label: "기타화물운수업" },
                    { value: "7", label: "특수화물운수업" },
                    { value: "8", label: "소형화물운수업" },
                    { value: "9", label: "택배업" },
                    { value: "10", label: "퀵서비스업" },
                    { value: "11", label: "수상운수업" },
                    { value: "12", label: "항만운송 부대사업" }
                ]);
            } else if(job2 === "3") {
                // 통신업
                setJob3Type([
                    { value: "0", label: "사업상세" },
                    { value: "1", label: "통신업" },
                    { value: "2", label: "신문업" },
                    { value: "3", label: "화폐(지폐) 등 제조업" }
                ]);
            }
        } else if(job1 === "6") { 
            if(job2 === "1") {
                // 임업
                setJob3Type([
                    { value: "0", label: "사업상세" },
                    { value: "1", label: "벌목업" },
                    { value: "2", label: "영림업" },
                    { value: "3", label: "기타의 임업" }
                ]);
            }
        } else if(job1 === "7") { 
            if(job2 === "1") {
                // 어업
                setJob3Type([
                    { value: "0", label: "사업상세" },
                    { value: "1", label: "어류포획업" },
                    { value: "2", label: "갑각류 및 연체동물 포획업" },
                    { value: "3", label: "수생포유동물 포획업" },
                    { value: "4", label: "정치망어업" },
                    { value: "5", label: "해조류, 패류 채취업" },
                    { value: "6", label: "내수면어업" },
                    { value: "7", label: "양식어업" },
                    { value: "8", label: "어업서비스업" }
                ]);
            }
        } else if(job1 === "8") { 
            if(job2 === "1") {
                // 농업
                setJob3Type([
                    { value: "0", label: "사업상세" },
                    { value: "1", label: "작물생산업" },
                    { value: "2", label: "종묘생산업" },
                    { value: "3", label: "양잠업" },
                    { value: "4", label: "농업서비스업" },
                    { value: "5", label: "축산업" },
                    { value: "6", label: "기계화농업" },
                    { value: "7", label: "수렵업" }
                ]);
            }
        } else if(job1 === "9") { 
            if(job2 === "1") {
                // 기타의 각종사업
                setJob3Type([
                    { value: "0", label: "사업상세" },
                    { value: "1", label: "개인 및 가사 서비스업" },
                    { value: "2", label: "각급사무소" },
                    { value: "3", label: "전 각항에 해당하지 않은 사업" },
                    { value: "4", label: "건설업본사" }
                ]);
            } else if(job2 === "2") {
                // 전문 보건 교육 여가관련 서비스업
                setJob3Type([
                    { value: "0", label: "사업상세" },
                    { value: "1", label: "정보처리 및 기타 컴퓨터 운용 관련 사업" },
                    { value: "2", label: "법무회계 관련 서비스업" },
                    { value: "3", label: "연구 및 개발 사업" },
                    { value: "4", label: "수의사업" },
                    { value: "5", label: "광고업" },
                    { value: "6", label: "시장조사 및 여론조사업" },
                    { value: "7", label: "경영컨설팅 서비스업" },
                    { value: "8", label: "예술전문서비스업" },
                    { value: "9", label: "건축기술, 엔지니어링 및 관련 기술 서비스업" },
                    { value: "10", label: "기타 과학기술서비스업" },
                    { value: "11", label: "전문디자인업" },
                    { value: "12", label: "사진촬영 및 처리업" },
                    { value: "13", label: "그 외 기타 기술서비스업" },
                    { value: "14", label: "보건 및 사회복지사업" },
                    { value: "15", label: "교육서비스업" },
                    { value: "16", label: "오락ㆍ문화 및 운동 관련 사업" },
                    { value: "17", label: "골프장 및 경마장 운영업" },
                ]);
            } else if(job2 === "3") {
                // 도 소매 및 소비자용 수리업
                setJob3Type([
                    { value: "0", label: "사업상세" },
                    { value: "1", label: "음식및숙박업" }
                ]);
            } else if(job2 === "4") {
                // 부동산업 및 임대업
                setJob3Type([
                    { value: "0", label: "사업상세" },
                    { value: "1", label: "부동산업" },
                    { value: "2", label: "임대업" }
                ]);
            }
        } else if(job1 === "10") { 
            if(job2 === "1") {
                // 금융및보험업
                setJob3Type([
                    { value: "0", label: "사업상세" },
                    { value: "1", label: "금융업" },
                    { value: "1", label: "연금및연금업" },
                    { value: "1", label: "금융 및 보험관련 서비스업" }
                ]);
            }
        }
    }

    const job3Setting = (job1, job2, job3) => {
        if(job3 === "0") {
            setSelfRate("");
        } else {
            if(job1 === "1") {
                if(job2 === "1") {
                    if(job3 !== "0") {
                        setSelfRate("185");
                    }
                } else if(job2 === "2") {
                    if(job3 !== "0") {
                        setSelfRate("57");
                    }
                }
            } else if(job1 === "2") { 
                if(job2 === "1") {
                    if(job3 !== "0") {
                        setSelfRate("16");
                    }
                } else if(job2 === "2") {
                    if(job3 !== "0") {
                        setSelfRate("11");
                    }
                } else if(job2 === "3") {
                    if(job3 !== "0") {
                        setSelfRate("20");
                    }
                } else if(job2 === "4") {
                    if(job3 !== "0") {
                        setSelfRate("10");
                    }
                } else if(job2 === "5") {
                    if(job3 !== "0") {
                        setSelfRate("13");
                    }
                } else if(job2 === "6") {
                    if(job3 !== "0") {
                        setSelfRate("7");
                    }
                } else if(job2 === "7") {
                    if(job3 !== "0") {
                        setSelfRate("13");
                    }
                } else if(job2 === "8") {
                    if(job3 !== "0") {
                        setSelfRate("10");
                    }
                } else if(job2 === "9") {
                    if(job3 !== "0") {
                        setSelfRate("6");
                    }
                } else if(job2 === "10") {
                    if(job3 !== "0") {
                        setSelfRate("24");
                    }
                } else if(job2 === "11") {
                    if(job3 !== "0") {
                        setSelfRate("12");
                    }
                }
            } else if(job1 === "3") { 
                if(job2 === "1") {
                    if(job3 !== "0") {
                        setSelfRate("8");
                    }
                }
            } else if(job1 === "4") { 
                if(job2 === "1") {
                    if(job3 !== "0") {
                        setSelfRate("36");
                    }
                }
            } else if(job1 === "5") { 
                if(job2 === "1") {
                    if(job3 !== "0") {
                        setSelfRate("8");
                    }
                } else if(job2 === "2") {
                    if(job3 !== "0") {
                        setSelfRate("18");
                    }
                } else if(job2 === "3") {
                    if(job3 !== "0") {
                        setSelfRate("9");
                    }
                }
            } else if(job1 === "6") { 
                if(job2 === "1") {
                    if(job3 !== "0") {
                        setSelfRate("58");
                    }
                }
            } else if(job1 === "7") { 
                if(job2 === "1") {
                    if(job3 !== "0") {
                        setSelfRate("28");
                    }
                }
            } else if(job1 === "8") { 
                if(job2 === "1") {
                    if(job3 !== "0") {
                        setSelfRate("20");
                    }
                }
            } else if(job1 === "9") { 
                if(job2 === "1") {
                    if(job3 !== "0") {
                        setSelfRate("9");
                    }
                } else if(job2 === "2") {
                    if(job3 !== "0") {
                        setSelfRate("6");
                    }
                } else if(job2 === "3") {
                    if(job3 !== "0") {
                        setSelfRate("8");
                    }
                } else if(job2 === "4") {
                    if(job3 !== "0") {
                        setSelfRate("7");
                    }
                }
            } else if(job1 === "10") { 
                if(job2 === "1") {
                    if(job3 !== "0") {
                        setSelfRate("6");
                    }
                }
            }
        }
    }

    const calEventHandler = e => {
        if(amtHandler.length === 0) {
            alert("보수총액을 입력하세요.");
            return;
        } else if(selfRate.length === 0) {
            alert("업종보험요율을 선택 혹은 입력해주세요.");
            return;
        }

        let json_data = {};

        json_data["TYPE"] = "InduAccInsur";
        json_data["AMT"] = amtHandler;
        json_data["SEL_RATE"] = selfRate;
        json_data["RESULT_AMT"] = delAmt0(String(parseInt(amtHandler.replaceAll(",", "")) * parseInt(selfRate.replaceAll(",", "")) / 1000));

        calculator(json_data);
    }

    const save = () => {
        if(sessionStorage.getItem("accessToken") !== null) {
            if(window.confirm("입력한 정보를 저장하시겠습니까?")) {
                let body = {
                    id: encryption.decrypt(sessionStorage.getItem("accessToken")),
                    major_type: '4',
                    month_amt: parseInt(amtHandler.replaceAll(",", "") === "" ? 0 : amtHandler.replaceAll(",", "")),
                    nontax_amt: 0,
                    job_gubun: selTypeChange.value,
                    job_rate: selfRate,
                    group_1: job1TypeChange.value === undefined ? "" : job1TypeChange.value,
                    group_2: job2TypeChange.value === undefined ? "" : job2TypeChange.value,
                    group_3: job3TypeChange.value === undefined ? "" : job3TypeChange.value
                };

                console.log(body)
                
                axios.post('/api/save_major_tax', body)
                .then(res => {
                    if(res.data.success) {
                        alert("저장 되었습니다.");

                        setPropChange(false);
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

    return (
        <>
            <div style={{marginLeft: "60px", marginTop: "20px"}}>
                <span className='incomeTaxFont'>보수총액</span><input className="majorInputCenter" onChange={checkNumberAmt} value={amtHandler}/><span className='incomeTaxFont'> 원</span>
            </div>
            <div style={{marginLeft: "60px", marginTop: "20px"}}>
                <span className='incomeTaxFont'>업종보험요율</span>
                <Select options={selType} className='incomeTaxSelect incomeTaxSelectYear' value={selTypeChange} onChange={setSelTypeChangeHandler}/>
                <input className="incomeTaxSelect incomeTaxSelectYear" disabled={selTypeChange.value!=="1"} onChange={checkRate} value={selfRate}/><span className='incomeTaxFont'> / 1000</span>
                <div style={{width: "100%", textAlign: "center", height: "40px", marginTop: "20px", marginLeft: "156px", display: selTypeChange.value==="2"?"block":"none"}}>
                    <Select options={job1Type} className='incomeTaxSelect majorSelectJob' value={job1TypeChange} onChange={setJob1TypeChangeHandler}/>
                    <Select options={job2Type} className='incomeTaxSelect majorSelectJob' isDisabled={job1TypeChange.value==="0"} onChange={setJob2TypeChangeHandler}
                        value={job2Type.filter(function(option) {
                            return option.value === job2TypeChange.value;
                        })}
                    />
                    <Select options={job3Type} className='incomeTaxSelect majorSelectJob' isDisabled={job1TypeChange.value==="0" || job2TypeChange.value==="0"} onChange={setJob3TypeChangeHandler}
                        value={job3Type.filter(function(option) {
                            return option.value === job3TypeChange.value;
                        })}
                    />
                </div>
            </div>
            <div style={{marginTop: "20px", width: "100%", textAlign: "center"}}>
                <button className="inputComponentButton" style={{marginRight: "20px"}} onClick={calEventHandler}>계산하기</button>
                <button className="inputComponentButton" style={{marginLeft: "20px"}} onClick={save}>저장하기</button>
            </div>
        </>
    );
}

export default InduAccInsurInput;