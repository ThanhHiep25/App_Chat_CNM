import React, { useEffect, useState } from "react";
import "../../Css/Signup.css";

const url = "https://65557a0784b36e3a431dc70d.mockapi.io/user";

const Signup = () => {
  // API test
  const [state, setState] = useState();

  const fechapi = async () => {
    await fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setState(data);
      });
  };

  useEffect(() => {
    // code
    fechapi();
  }, []);

  //

  const [mail, setMail] = useState();
  const [name, setName] = useState();
  const [password, setPassword] = useState();
  const [password2, setPassword2] = useState();

  return (
    <div className="container">
      <div className="title-bar">
        <p className="title">Đăng ký</p>
        <div className="group-in">
          <input
            placeholder="Ten..."
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="in"
          />
          <input
            type="email"
            placeholder="Email..."
            value={mail}
            onChange={(event) => setMail(event.target.value)}
            className="in"
          />
          <input type="password" placeholder="Pass..." className="in" />
          <input
            type="password"
            placeholder="Nhập lại pass lần nữa..."
            className="in"
          />
          <button className="btn-sub" type="submit">
            <p className="text-sub">Xác nhận</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
