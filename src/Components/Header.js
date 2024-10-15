import React, { useEffect, useState } from 'react';
import "../css/Header.css";
import LoginPopup from "./LoginPopup";
import SignupPopup from './SignupPopup';

function Header() {
    const [loginPopupOpen, setLoginPopupOpen] = useState(false);
    const [signupPopupOpen, setSignupPopupOpen] = useState(false);

    const loginPopup = () => {
        setLoginPopupOpen(!loginPopupOpen);
    }

    const signupPopup = () => {
        setSignupPopupOpen(!signupPopupOpen);
    }

    return (
        <div className="body">
            <div className="left">
                <a className="title" href="/">웹기반 소득세 계산기</a>    
            </div>
            <div className="right">
                <a onClick={loginPopup} className="login">로그인</a>
            </div>

            <LoginPopup open = { loginPopupOpen } loginPopup = { loginPopup } signupPopup = { signupPopup } />
            <SignupPopup open = { signupPopupOpen } loginPopup = { loginPopup } signupPopup = { signupPopup } />
        </div>
    );
}

export default Header;