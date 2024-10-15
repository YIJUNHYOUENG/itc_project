import Modal from 'react-modal';
import "../css/Popup.css";
import { useState, useEffect } from 'react';

function SignupPopup({ open, loginPopup, signupPopup }) {
  const [userIdInput, setUserIdInput] = useState('');
  const [userPwdInput, setUserPwdInput] = useState('');
  const [userPwdChkInput, setUserPwdChkInput] = useState('');

  const signupEvent = () => {
    alert(userIdInput+" "+userPwdInput+" "+userPwdChkInput);

  }

  const onChangeId = (e) => {
    setUserIdInput(e.target.value);
  }

  const onChangePwd = (e) => {
    setUserPwdInput(e.target.value);
  }

  const onChangePwdChk = (e) => {
    setUserPwdChkInput(e.target.value);
  }

  return (
    <Modal isOpen={open} ariaHideApp={false}
      className="container-signup">
      <div className='popup-close' onClick={signupPopup}></div>
      <div className="popup-title">회원가입</div>
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
          <div>비밀번호 확인</div>
          <input type='password' onChange={onChangePwdChk}/>
        </div>
        <div className='input-field'>
          <button onClick={signupEvent}>회원가입</button>
        </div>
      </div>
    </Modal>
  );
}

export default SignupPopup;
