import "../css/Header.css"

function Header() {

    const loginPopup = () => {
        alert(11);
    }

    return (
        <div className="body">
            <div className="left">
                <a className="title" href="/">웹기반 소득세 계산기</a>    
            </div>
            <div className="right">
                <a onClick={loginPopup} className="login">로그인</a>
            </div>
        </div>
    );
}

export default Header;