import React from "react";
import "../../Css/Signup.css";

const Signup = () => {
  return (
    <div className="container">
      <div className="title-bar">
        <p className="title">Đăng ký</p>
        <div className="group-in">
          <input placeholder="Ten..." className="in" />
          <input type="email" placeholder="Email..." className="in" />
          <input type="password" placeholder="Pass..." className="in" />
          <input type="password" placeholder="Nhập lại pass lần nữa..." className="in" />
        </div>
      </div>
    </div>
  );
};

export default Signup;
