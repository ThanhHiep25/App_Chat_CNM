import React from "react";
import "../../Css/Login.css";
import logo from "../../IMG/6.png";
function Login() {
  return (
    <div className="App-Login">
      <div className="Bar-Border">
        <div className="Bar-img">
          <img src={logo} className="img_logo" alt="logo"/>
        </div>
        <div className="Group-login-pass">
            <input placeholder="SDT hoac Email" className="input-email"/>
            <input placeholder="Mật khẩu" className="input-pass" />
            <button type="submit" className="btn-sub">
                <p className="text-sub">Đăng nhập</p>
            </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
