import React, { useEffect, useState } from "react";
import "../../Css/Login.css";
import logo from "../../IMG/6.png";
//import logo_google from "../../IMG/Google.png";
//import logo_facebook from "../../IMG/Facebook.png";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import unseen from "../../IMG/unseen.png";
import seen from "../../IMG/seen.png";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth"; // Update import statement
import { auth } from "../../config/firebase";

const url = "http://localhost:3001/api/users";

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
    if (isEmailValid(email) && isPasswordValid(password)) {
      signInWithEmailAndPassword(auth, email, password)
      .then(() => {
      const user = auth.currentUser;
      setCookies("user", user)
        toast.success("Đăng nhập thành công!");
          setTimeout(() => {
            navigate("/chat",user);
            console.log(user)
          }, 3000);
      })    
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
          <div className="lg-div">
            <label className="txt-lg">Email</label>
            <input
              type="email"
              value={email}
              placeholder="abc@gmail.com"
              onChange={(event) => setMail(event.target.value)}
              className="input-email"
              title=".... + @gmail.com"
            />
          </div>
          <div className="lg-div lg-m">
            <label className="txt-lg">Mật khẩu</label>
            <div className="group-pass-login">
              <input
                type={secureTextEntry ? "password" : "text"}
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
                  {secureTextEntry ? (
                    <img
                      src={unseen}
                      className="logo-unseen-sign"
                      alt="unseen"
                    />
                  ) : (
                    <img src={seen} className="logo-unseen-sign" alt="seen" />
                  )}
                </p>
              </button>
            </div>
          </div>

          <p
            className="fg-pass"
            onClick={() => {
              navigate("/fgpass");
            }}
          >
            Quên mật khẩu ?
          </p>

          <button
            type="submit"
            className="btn-sub"
            onClick={checkLogin}
            onKeyDown={handleEnterKeyPress}
          >
            <p className="text-sub">Đăng nhập</p>
          </button>
        </div>

        <div>
          <p>
            Bạn chưa có tài khoản?
            <Link to="/signup"> Đăng ký ngay</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;

/*<div className="Group-another-login">
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
*/
