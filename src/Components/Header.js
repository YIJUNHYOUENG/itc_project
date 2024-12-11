import React, { useState, useEffect } from 'react';
import "../css/Header.css";
import LoginPopup from "./LoginPopup";
import SignupPopup from './SignupPopup';

function Header() {
    const [loginPopupOpen, setLoginPopupOpen] = useState(false);
    const [signupPopupOpen, setSignupPopupOpen] = useState(false);
    const [loginSuccess, setLoginSeccess] = useState(false);

    useEffect(() => {
        loginChk();
    }, []);

    const loginChk = () => {
        // 로그인 체크
        if(sessionStorage.getItem("accessToken") != null) {
            setLoginSeccess(true);
        }
    }

    const loginPopup = (data) => {
        setLoginPopupOpen(!loginPopupOpen);

        try {
            // 로그인이 성공 했다면
            if(data.success) {
                setLoginSeccess(data.success);
            }
        } catch {

        }
    }

    const signupPopup = (data) => {
        setSignupPopupOpen(!signupPopupOpen);

        try {
            // 회원가입이 성공 했다면
            if(data.success) {
                // 회원가입 후 로그인 진행
                setLoginPopupOpen(data.success);
            }
        } catch {

        }
    }

    const logoutEvent = () => {
        if(sessionStorage.getItem("accessToken")) {
            alert("로그아웃 되었습니다.");
            sessionStorage.removeItem("accessToken");
            setLoginSeccess(false);
        }
    }

    return (
        <div className="body">
            <div className="left">
                <a className="title" href="/">웹기반 소득세 계산기</a>    
            </div>
            <div className="right">
                {
                    loginSuccess
                    ?   <div className='success-header'>
                            <a onClick={logoutEvent} className="logout" href="#!">로그아웃</a>
                            <a className="setting" href="/setting">설정</a>
                        </div>
                    : <a onClick={loginPopup} className="login" href="#!">로그인</a>
                }
            </div>

            <LoginPopup open = { loginPopupOpen } loginPopup = { loginPopup } signupPopup = { signupPopup } />
            <SignupPopup open = { signupPopupOpen } loginPopup = { loginPopup } signupPopup = { signupPopup } />
        </div>
    );
}

export default Header;