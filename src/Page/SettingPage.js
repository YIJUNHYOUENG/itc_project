import { useState } from 'react';
import Header from "../Components/Header"
import "../css/SettingPage.css";
import axios from 'axios';
import PwdChangePopup from "../Components/PwdChangePopup";
import * as encryption from "../encryption/encryption.js"
import loginChk from "../Components/Header.js";

function SettingPage() {
    const [pwdChangeOpen, setPwdChangeOpen] = useState(false);
    const [signupPopupOpen, setSignupPopupOpen] = useState(false);

    const saveInfoDelete = () => {
        if(sessionStorage.getItem("accessToken") != null) {
            if(window.confirm("저장된 정보를 삭제하시겠습니까?")) {
                let body = {
                    id: encryption.decrypt(sessionStorage.getItem("accessToken"))
                };

                axios.post('/api/delete_save_data', body)
                .then(res => {
                    if(res.data.success) {
                        alert("삭제되었습니다.");
                    }
                })  
                .catch(res => console.log(res));
            }
        } else {
            alert("로그인 후 이용해주세요.");
        }
    }

    const changePassword = () => {
        setPwdChangeOpen(true);
    }

    const userInfoDelete = () => {
        if(sessionStorage.getItem("accessToken") != null) {
            if(window.confirm("계정을 삭제하시겠습니까?")) {
                let body = {
                    id: encryption.decrypt(sessionStorage.getItem("accessToken"))
                };

                axios.post('/api/delete_user_data', body)
                .then(res => {
                    if(res.data.success) {
                        alert("삭제되었습니다.");

                        // 계정 삭제
                        sessionStorage.setItem("accessToken", "");
                        window.location.href = "http://localhost:3000/";    
                        loginChk();
                    }
                })  
                .catch(res => console.log(res));
            }
        } else {
            alert("로그인 후 이용해주세요.");
        }
    }

    const closePop = () => {
        setPwdChangeOpen(false);
    }

    return (
        <>
            <Header/>
            <div style={{width: "100%", height: "600px"}}>
                <div style={{height: "100%", marginLeft: "400px", marginRight: "400px", marginTop: "120px"}}>
                    <div className="setting-container">
                        <div className="setting-title">
                            설정
                        </div>
                        <div className="option-container">
                            <span>저장된 정보 삭제하기</span>
                            <input type="button" className='settingInput' value="삭제하기" onClick={saveInfoDelete}/>
                        </div>
                        <div className="option-container">
                            <span>비밀번호 변경하기</span>
                            <input type="button" className='settingInput' value="변경하기" onClick={changePassword}/>
                        </div>
                        <div className="option-container">
                            <span>계정 삭제하기</span>
                            <input type="button" className='settingInput' value="삭제하기" onClick={userInfoDelete}/>
                        </div>
                    </div>
                </div>
            </div>

            <PwdChangePopup open = { pwdChangeOpen } closePop = { closePop } />
        </>
    )
}

export default SettingPage;