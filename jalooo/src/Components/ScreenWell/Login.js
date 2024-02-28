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

const url = "https://65557a0784b36e3a431dc70d.mockapi.io/user";
function Login() {
  const [state, setState] = useState([]);
  const [cookies, setCookies] = useCookies();
  const [email, setMail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();


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

  const checkLogin = () => {
    const user = state.find((user) => user.email === email);

    if (user) {
      // 3. Compare the entered password with the fetched password
      if (user.pass === password) {
        const userWithoutPassword = { name: user.name, email: user.email };
        // Tạo đối tượng mới chỉ chứa thông tin cần thiết
        // 4. Login successful: Handle successful login logic here
        setCookies("user", userWithoutPassword);
        //sessionStorage.setItem("user", JSON.stringify(userWithoutPassword));
        toast.success("Đăng nhập thành công!");
        navigate("/chat");

        // For example, navigate to a protected route or store user data in local storage
      } else {
        // 5. Incorrect password: Handle invalid password scenario
        toast.error("Sai mật khẩu!");
        setPassword("");
        // Display an error message to the user
      }
    } else {
      // 6. User not found: Handle user not found scenario
      // Display an error message to the user
      toast.error("Không tìm thấy mail đã đăng ký!");
      setMail("");
      setPassword("");
    }
    document.addEventListener("keydown", handleEnterKeyPress);
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
          />
          <input
            type="password"
            placeholder="Mật khẩu"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="input-pass"
          />

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
