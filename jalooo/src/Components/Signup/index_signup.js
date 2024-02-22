import React, { useEffect, useState } from "react";
import "../../Css/Signup.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

  const [mail, setMail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [otp, setOtp] = useState(""); // Thêm state cho mã OTP
  const [isVerified, setIsVerified] = useState(false); // Thêm state cho trạng thái xác thực

  const Postuser = () => {
    if (password === password2) {
      fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          email: mail,
          pass: password,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
        });
    }
    toast.success("Đăng ký thành công!!");
    setMail("");
    setName("");
    setPassword("");
    setPassword2("");
    setOtp("");
  };

  const isEmailValid = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Email không hợp lệ.");
      return false;
    }
    return true;
  };

  const isNameValid = (name) => {
    if (!name) {
      toast.error("Vui lòng nhập tên.");
      return false;
    }
    return true;
  };

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

  // Hàm gửi OTP qua email
  const sendOTP = async () => {
    if (isNameValid(name) && isEmailValid(mail) && isPasswordValid(password)) {
      try {
        await fetch("http://localhost:3001/send-otp", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: mail,
          }),
        });
        toast.success("Mã OTP đã được gửi đến email của bạn!");
      } catch (error) {
        console.error("Error sending OTP:", error);
        toast.error("Đã có lỗi xảy ra khi gửi mã OTP.");
      }
    }
  };

  // Hàm xác thực và đăng ký
  const verifyAndRegister = () => {
    // Kiểm tra tất cả các trường dữ liệu
    if (isNameValid(name) && isEmailValid(mail) && isPasswordValid(password)) {
      if (otp) {
        fetch("http://localhost:3001/send-otp", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: mail,
            otp: otp,
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.success) {
              // Nếu mã OTP đúng, tiến hành đăng ký
              setIsVerified(true);
              Postuser();
              // Thêm phần logic đăng ký ở đây (có thể gọi hàm Postuser)
            } else {
              setIsVerified(false);
              toast.error("Mã OTP không hợp lệ!");
            }
          })
          .catch((error) => {
            console.error("Error verifying OTP:", error);
            toast.error("Đã có lỗi xảy ra khi xác thực mã OTP.");
          });
      } else {
        toast.error("Vui lòng nhập mã OTP.");
      }
    }
  };

  return (
    <div className="container">
      <ToastContainer />
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
          <input
            type="password"
            placeholder="Pass..."
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="in"
          />
          <input
            type="password"
            placeholder="Nhập lại pass lần nữa..."
            value={password2}
            onChange={(event) => setPassword2(event.target.value)}
            className="in"
          />
          <div>
            <button className="btn-sub" type="button" onClick={sendOTP}>
              <p className="text-sub">Gửi OTP</p>
            </button>
            {/* Thêm trường nhập OTP */}
            <input
              type="text"
              placeholder="Nhập mã OTP..."
              value={otp}
              onChange={(event) => setOtp(event.target.value)}
              className="in"
            />
          </div>

          <button className="btn-sub" type="button" onClick={verifyAndRegister}>
            <p className="text-sub">Xác nhận</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
