import React from "react";
import "../../Css/Forgotpassword.css";

const Forgotpassword = () => {
  return (
    <div className="container-forgotpassword">
      <div className="form-fg">
        <div className="div-fg">
          <label className="l-fg">Email: </label>
          <input type="email" className="in-fg" />
        </div>
        <div className="div-fg">
          <label className="l-fg">Reset password: </label>
          <input type="password" className="in-fg" />
        </div>
        <div className="div-fg">
          <label className="l-fg">OTP: </label>
          <input type="password" className="in-fg" />
        </div>
        <button className="btn-fg">Xác nhận</button>
      </div>
    </div>
  );
};

export default Forgotpassword;
