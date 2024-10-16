import Modal from 'react-modal';
import "../css/Popup.css";
import { useState, useEffect } from 'react';

function LoginPopup({ open, loginPopup, signupPopup }) {
  const [userIdInput, setUserIdInput] = useState('');
  const [userPwdInput, setUserPwdInput] = useState('');

  const loginEvent = () => {
    if(userIdInput.length === 0) {
      alert("아이디를 입력하세요");
    } else if(userPwdInput.length === 0) {
      alert("비밀번호를 입력하세요");
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
          <a className='create-id' href='#' onClick={moveToSignPopup}>계정 만들기</a>
        </div>
      </div>
    </Modal>
  );
}

export default LoginPopup;
