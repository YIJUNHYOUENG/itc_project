import Modal from 'react-modal';
import "../css/Popup.css";
import { useState } from 'react';
import axios from 'axios';
import * as encryption from "../encryption/encryption.js"
import * as sha256 from "../encryption/sha256.js";

function PwdChangePopup({ open, closePop }) {
  const [userPwdInput, setUserPwdInput] = useState('');
  const [newUserPwdInput, setNewUserPwdInput] = useState('');
  const [newUserPwdChkInput, setNewUserPwdChkInput] = useState('');

  const onChangePwd = (e) => {
    setUserPwdInput(e.target.value.replace(/[^A-Za-z0-9]/gi, ''));
  }

  const onChangeNewPwd = (e) => {
    setNewUserPwdInput(e.target.value.replace(/[^A-Za-z0-9]/gi, ''));
  }

  const onChangeNewPwdChk = (e) => {
    setNewUserPwdChkInput(e.target.value.replace(/[^A-Za-z0-9]/gi, ''));
  }

  const changePwd = (e) => {
    if(userPwdInput.length == 0) {
      alert("비밀번호 확인을 입력하세요.");
      return;
    } else if(newUserPwdInput.length == 0) {
      alert("새로운 비밀번호을 입력하세요.");
      return;
    } else if(userPwdInput == newUserPwdInput) {
      alert("현재 비밀번호와 새로운 비밀번호가 일치하면 안 됩니다.");
      return;
    } else if(newUserPwdChkInput.length == 0) {
      alert("새로운 비밀번호 확인을 입력하세요.");
      return;
    } else if(newUserPwdInput != newUserPwdChkInput) {
      alert("새로운 비밀번호와 새로운 비밀번호 확인이 다릅니다.");
      return;
    }

    let body = {
      id: encryption.decrypt(sessionStorage.getItem("accessToken")),
      pwd: sha256.passwordEncryption(userPwdInput)
    };

    axios.post('/api/chk_pwd', body)
    .then(res => {
      if(res.data[0].cnt == 1) {
        body.pwd = sha256.passwordEncryption(newUserPwdInput);

        axios.post('/api/change_pwd', body)
        .then(r => {
          if(r.data.success) {
            alert("비밀번호가 변경되었습니다.");

            closePopup();
          } else {
            alert("조금 있다 다시 시도해주세요.");
          }
        })
        .catch(r => console.log(r));
      } else {
        alert("현재 비밀번호가 일치하지 않습니다.");
      }
    })  
    .catch(res => console.log(res));
  }

  const closePopup = () => {
    // 저장후 값 초기화
    setUserPwdInput("");
    setNewUserPwdInput("");
    setNewUserPwdChkInput("");

    closePop();
  }

  return (
    <Modal isOpen={open} ariaHideApp={false}
      className="container-pwd-change">
      <div className='popup-close' onClick={closePopup}></div>
      <div className='popup-input popup-setting'>
        <div className='input-field'>
          <div>비밀번호 확인</div>
          <input type="text" onChange={onChangePwd} value={userPwdInput}/>
        </div>
        <div className='input-field'>
          <div>새로운 비밀번호</div>
          <input type='password' onChange={onChangeNewPwd} value={newUserPwdInput}/>
        </div>
        <div className='input-field'>
          <div>새로운 비밀번호 확인</div>
          <input type='password' onChange={onChangeNewPwdChk} value={newUserPwdChkInput}/>
        </div>
        <div className='input-field'>
          <button onClick={changePwd}>변경하기</button>
        </div>
      </div>
    </Modal>
  );
}

export default PwdChangePopup;
