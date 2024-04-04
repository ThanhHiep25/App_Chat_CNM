import React, { useState } from "react";
import "../../Css/Forgotpassword.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import unseen from "../../IMG/unseen.png";
import seen from "../../IMG/seen.png";
import { useNavigate } from "react-router-dom";

const Forgotpassword = () => {
  const navigate = useNavigate();
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [generatedOTP, setGeneratedOTP] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const isEmailValid = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Email không hợp lệ.");
      return false;
    }
    return true;
  };

  const isPasswordValid = (password) => {
    if (!password) {
      toast.error("Vui lòng nhập mật khẩu.");
      return false;
    }
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
    if (!passwordRegex.test(password)) {
      toast.error(
        "Mật khẩu phải chứa ít nhất một chữ in hoa, một số và có ít nhất 6 ký tự."
      );
      return false;
    }
    return true;
  };

  const handlePasswordVisibility = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  const sendOTP = async () => {
    if (isEmailValid(mail)) {
      try {
        if (!otpSent) {
          const response = await fetch("http://localhost:3001/send-otp", {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: mail,
            }),
          });

          if (response.ok) {
            const responseData = await response.json();
            const otp = responseData?.otp;

            if (otp) {
              setGeneratedOTP(otp);
              setOtpSent(true);
              toast.success("Mã OTP đã được gửi đến email của bạn!");
            } else {
              toast.error("Không nhận được mã OTP từ phản hồi của server.");
            }
          } else {
            toast.error("Đã có lỗi xảy ra khi tạo và gửi OTP.");
          }
        } else {
          toast.info(
            "Mã OTP đã được gửi trước đó. Vui lòng kiểm tra email của bạn."
          );
        }
      } catch (error) {
        console.error("Error sending OTP:", error);
        toast.error("Đã có lỗi xảy ra khi gửi mã OTP.");
      }
    }
  };

  const resetPassword = async () => {
    try {
      const response = await fetch("http://localhost:3001/reset-password", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: mail,
          newPassword: password,
        }),
      });

      if (response.ok) {
        const responseData = await response.json();

        if (responseData.success) {
          toast.success(responseData.message);
        } else {
          toast.error(responseData.message);
        }
      } else {
        toast.error("Đã có lỗi xảy ra khi đặt lại mật khẩu.");
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      toast.error("Đã có lỗi xảy ra khi đặt lại mật khẩu.");
    }
  };

  // Hàm xác thực và đăng ký
  const verifyAndRegister = () => {
    // Kiểm tra tất cả các trường dữ liệu
    if (isEmailValid(mail) && isPasswordValid(password)) {
      if (otp) {
        // Kiểm tra xem mã OTP nhập vào có khớp với mã OTP được tạo ra hay không
        if (Number(otp) === Number(generatedOTP)) {
          // Nếu mã OTP đúng, tiến hành đăng ký
          setIsVerified(true);
          resetPassword();
          setTimeout(() => {
            navigate("/me");
          }, 3000);
          setTimeout(() => {
            window.location.reload();
          }, 8000);
        } else {
          setIsVerified(false);
          toast.error("Mã OTP không hợp lệ!");
        }
      } else {
        toast.error("Vui lòng nhập mã OTP.");
      }
    }
  };

  return (
    <div className="container-forgotpassword">
      <ToastContainer />
      <div className="form-fg">
        <div className="div-fg">
          <label className="l-fg">Email: </label>
          <input
            type="email"
            value={mail}
            onChange={(event) => setMail(event.target.value)}
            className="in-fg"
          />
        </div>

        <div className="div-fg">
          <label className="l-fg">Reset password: </label>
          <div className="group-pass-fg">
            <input
              type={secureTextEntry ? "password" : "text"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="in-fg-pass"
            />
            <button onClick={handlePasswordVisibility} className="btn-pass-fg">
              <p className="text-pass-fg">
                {secureTextEntry ? (
                  <img src={unseen} className="logo-unseen-fg" alt="unseen" />
                ) : (
                  <img src={seen} className="logo-unseen-fg" alt="seen" />
                )}
              </p>
            </button>
          </div>
        </div>

        <div className="div-fg">
          <label className="l-fg">OTP: </label>

          <div className="group-otp-fg">
            <input
              type="text"
              value={otp}
              onChange={(event) => setOtp(event.target.value)}
              className="in-fg otp"
            />
            <button className="btn-otp-fg" type="button" onClick={sendOTP}>
              <p className="text-sub-fg">Gửi OTP</p>
            </button>
          </div>
        </div>
        <button className="btn-fg" onClick={verifyAndRegister}>
          Đặt lại mật khẩu
        </button>
      </div>
    </div>
  );
};

export default Forgotpassword;
