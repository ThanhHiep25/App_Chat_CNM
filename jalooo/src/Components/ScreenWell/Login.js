import React, { useEffect, useState } from "react";
import "../../Css/Login.css";
import logo from "../../IMG/6.png";
import logo_google from "../../IMG/Google.png";
import logo_facebook from "../../IMG/Facebook.png";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { set } from "mongoose";
import unseen from "../../IMG/unseen.png";
import seen from "../../IMG/seen.png";

const url = "http://localhost:3001/api/usermongodb";

//const url = "https://7982d9fe-9cfa-4392-a3a5-33658b4e2511-00-pzw56jxzki3b.janeway.replit.dev/"
function Login() {
  const [state, setState] = useState([]);
  const [cookies, setCookies] = useCookies();
  const [email, setMail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const fechapi = async () => {
    await fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setState(data);
      });
  };

  useEffect(() => {
    fechapi();
  }, []);

  const handleEnterKeyPress = (event) => {
    if (event.key === "Enter") {
      checkLogin();
    }
  };

  // Check mail
  const isEmailValid = async (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Email không hợp lệ.");
      return false;
    }

    if (!email.endsWith("@gmail.com")) {
      toast.error("Email phải là địa chỉ Gmail.");
      return false;
    }

    return true;
  };
  // Check password
  const isPasswordValid = (password) => {
    if (!password) {
      toast.error("Vui lòng nhập mật khẩu.");
      return false;
    }
    // Điều kiện password (in hoa chữ đầu kèm số)
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
    if (!passwordRegex.test(password)) {
      toast.error(
        "Mật khẩu phải chứa ít nhất một chữ in hoa, một số và có ít nhất 6 ký tự."
      );
      return false;
    }
    return true;
  };

  const checkLogin = () => {
    const user = state.find((user) => user.email === email);
    if (isEmailValid(email) && isPasswordValid(password)) {
      if (user) {
        // 3. Compare the entered password with the fetched password
        if (user.pass === password) {
          const userWithoutPassword = { name: user.name, email: user.email };
          // Tạo đối tượng mới chỉ chứa thông tin cần thiết
          setCookies("user", userWithoutPassword);
          toast.success("Đăng nhập thành công!");
          setTimeout(() => {
            navigate("/chat");
          }, 3000);
        } else {
          toast.error("Sai mật khẩu!");
          setPassword("");
        }
      } else {
        toast.error("Không tìm thấy mail đã đăng ký!");
        setPassword("");
      }
    }
    document.addEventListener("keydown", handleEnterKeyPress);
  };

  const handlePasswordVisibility = () => {
    setSecureTextEntry(!secureTextEntry);
  };
  return (
    <div className="App-Login">
      <div className="Bar-Border">
        <ToastContainer />
        <div className="Bar-img">
          <img src={logo} className="img_logo" alt="logo" />
        </div>
        <div className="Group-login-pass">
          <input
            type="email"
            placeholder="SDT hoac Email"
            value={email}
            onChange={(event) => setMail(event.target.value)}
            className="input-email"
            title=".... + @gmail.com"
          />

          <div className="group-pass-login">
            <input
              type={secureTextEntry ? "password" : "text"}
              placeholder="Mật khẩu"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="input-pass"
              title="Password bao gồm 1 chữ cái in Hoa và 6 chữ số"
            />

            <button
              onClick={handlePasswordVisibility}
              className="btn-pass-login"
            >
              <p className="text-pass-login">
                {" "}
                {secureTextEntry ? (
                  <img src={unseen} className="logo-unseen-sign" alt="unseen" />
                ) : (
                  <img src={seen} className="logo-unseen-sign" alt="seen" />
                )}
              </p>
            </button>
          </div>

          <button
            type="submit"
            className="btn-sub"
            onClick={checkLogin}
            onKeyDown={handleEnterKeyPress}
          >
            <p className="text-sub">Đăng nhập</p>
          </button>
        </div>
        <div className="Group-another-login">
          <p>- Hoặc sử dụng tài khoản khác -</p>
          <div className="another-login">
            <Link to="">
              <img
                src={logo_google}
                className="logo-another-login"
                alt="google"
              />
            </Link>

            <Link to="">
              <img
                src={logo_facebook}
                className="logo-another-login"
                alt="facebook"
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
