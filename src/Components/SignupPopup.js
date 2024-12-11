import Modal from 'react-modal';
import "../css/Popup.css";
import { useState } from 'react';
import axios from 'axios';
import * as sha256 from "../encryption/sha256.js";

function SignupPopup({ open, loginPopup, signupPopup }) {
  const [userIdInput, setUserIdInput] = useState('');
  const [userPwdInput, setUserPwdInput] = useState('');
  const [userPwdChkInput, setUserPwdChkInput] = useState('');

  const signupEvent = () => {
    if(userIdInput.length === 0) {
      alert("아이디를 입력하세요");
    } else if(userPwdInput.length === 0) {
      alert("비밀번호를 입력하세요");
    } else if(userPwdChkInput.length === 0) {
      alert("비밀번호 확인을 입력하세요");
    } else {
      let body = {
        id: userIdInput,
        pwd: sha256.passwordEncryption(userPwdInput)
      };
      
      axios.post('/api/signup', body)
      .then(res => {
        if(res.data.success) {
          // 성공
          alert(res.data.message);
          
          // 초기화
          setUserIdInput("");
          setUserPwdInput("");
          setUserPwdChkInput("");

          signupPopup({
            success : true
          });          
        } else {
          // 실패
          alert(res.data.message);
        }
      })  
      .catch(res => console.log(res));
    }
  }

  const onChangeId = (e) => {
    setUserIdInput(e.target.value.replace(/[^A-Za-z0-9]/gi, ''));
  }

  const onChangePwd = (e) => {
    setUserPwdInput(e.target.value.replace(/[^A-Za-z0-9]/gi, ''));
  }

  const onChangePwdChk = (e) => {
    setUserPwdChkInput(e.target.value.replace(/[^A-Za-z0-9]/gi, ''));
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
