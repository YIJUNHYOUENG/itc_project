import Modal from 'react-modal';
import "../css/Popup.css";
import { useState, useEffect } from 'react';

function LoginPopup({ open, loginPopup, signupPopup }) {
  const [userIdInput, setUserIdInput] = useState('');
  const [userPwdInput, setUserPwdInput] = useState('');

  const loginEvent = () => {
    alert(userIdInput+" "+userPwdInput);

  }

  const onChangeId = (e) => {
    setUserIdInput(e.target.value);
  }

  const onChangePwd = (e) => {
    setUserPwdInput(e.target.value);
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
          <input onChange={onChangeId}/>
        </div>
        <div className='input-field'>
          <div>비밀번호</div>
          <input type='password' onChange={onChangePwd}/>
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
