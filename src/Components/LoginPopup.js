import Modal from 'react-modal';
import "../css/Popup.css";
import { useState } from 'react';
import axios from 'axios';
import * as encryption from "../encryption/encryption.js"
import * as sha256 from "../encryption/sha256.js";

function LoginPopup({ open, loginPopup, signupPopup }) {
  const [userIdInput, setUserIdInput] = useState('');
  const [userPwdInput, setUserPwdInput] = useState('');

  const loginEvent = () => {
    if(userIdInput.length === 0) {
      alert("아이디를 입력하세요");
    } else if(userPwdInput.length === 0) {
      alert("비밀번호를 입력하세요");
    } else {
      let body = {
        id: userIdInput,
        pwd: sha256.passwordEncryption(userPwdInput)
      };

      axios.post('/api/login', body)
      .then(res => {
        if(res.data.length > 0 && res.data[0].user_id !== undefined) {
          alert("로그인 성공");
          
          // 토큰 저장
          sessionStorage.setItem("accessToken", encryption.encrypt(res.data[0].user_id));

          // 로그인화면 초기화
          setUserIdInput("");
          setUserPwdInput("");

          loginPopup({
            success : true
          });

        } else {
          alert("아이디 혹은 비밀번호가 틀립니다.");
        }
      })  
      .catch(res => console.log(res));
    }
  }

  const onChangeId = (e) => {
    setUserIdInput(e.target.value.replace(/[^A-Za-z0-9]/ig, ''));
  }

  const onChangePwd = (e) => {
    setUserPwdInput(e.target.value.replace(/[^A-Za-z0-9]/gi, ''));
  }

  const moveToSignPopup = () => {
    loginPopup();
    signupPopup();
  }

  return (
    <Modal isOpen={open} ariaHideApp={false}
      className="container-login">
      <div className='popup-close' onClick={loginPopup}></div>
      <div className="popup-title">로그인</div>
      <div className='popup-input'>
        <div className='input-field'>
          <div>아이디</div>
          <input type="text" onChange={onChangeId} value={userIdInput}/>
        </div>
        <div className='input-field'>
          <div>비밀번호</div>
          <input type='password' onChange={onChangePwd} value={userPwdInput}/>
        </div>
        <div className='input-field'>
          <button onClick={loginEvent}>로그인</button>
          <a className='create-id' href="#!" onClick={moveToSignPopup}>계정 만들기</a>
        </div>
      </div>
    </Modal>
  );
}

export default LoginPopup;
