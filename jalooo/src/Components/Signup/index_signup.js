import React, { useState } from "react";
import "../../Css/Signup.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const url = "https://65557a0784b36e3a431dc70d.mockapi.io/user";

const Signup = () => {
  // API test

  //

  const [mail, setMail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [otp, setOtp] = useState(""); // Thêm state cho mã OTP
  const [isVerified, setIsVerified] = useState(false); // Thêm state cho trạng thái xác thực
  // Định nghĩa biến trạng thái để lưu mã OTP được tạo ra
  const [generatedOTP, setGeneratedOTP] = useState("");
  // Định nghĩa biến trạng thái để theo dõi xem OTP đã được gửi hay chưa
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();

  //Post signup user mockapi
  /* const Postuser = () => {
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
        .then((data) => {});
    }
    setTimeout(() => {
      navigate("/me");
    }, 3000);
    setMail("");
    setName("");
    setPassword("");
    setPassword2("");
    setOtp("");
    toast.success("Đăng ký thành công!!");
  };
*/

  // POST mongodb
  const Postuser = () => {
    if (password === password2) {
      fetch("http://localhost:3001/api/register", {
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
          if (data.success) {
            toast.success(data.message);
            setTimeout(() => {
              navigate("/me");
            }, 3000);
            setMail("");
            setName("");
            setPassword("");
            setPassword2("");
            setOtp("");
            // Thực hiện các thao tác sau khi đăng ký thành công (chuyển hướng, làm mới trang, vv.)
          } else {
            toast.error(data.message);
          }
        })
        .catch((error) => {
          console.error("Error registering user:", error);
          toast.error("Đã có lỗi xảy ra khi đăng ký.");
        });
    }
  };

  // Check mail
  const isEmailValid = async (email) => {
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
        // Kiểm tra xem OTP đã được gửi hay chưa
        if (!otpSent) {
          // Gọi endpoint trên server để tạo và gửi OTP
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
            // Lấy đối tượng JSON từ phản hồi của server
            const responseData = await response.json();

            // Lấy mã OTP từ thuộc tính 'otp' của đối tượng
            const otp = responseData?.otp;

            if (otp) {
              // Lưu mã OTP vào trạng thái
              setGeneratedOTP(otp);

              // Đặt cờ để chỉ định rằng OTP đã được gửi
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
  // ... Mã khác ...

  // Hàm xác thực và đăng ký
  const verifyAndRegister = () => {
    // Kiểm tra tất cả các trường dữ liệu
    if (isNameValid(name) && isEmailValid(mail) && isPasswordValid(password)) {
      if (otp) {
        // Kiểm tra xem mã OTP nhập vào có khớp với mã OTP được tạo ra hay không
        if (Number(otp) === Number(generatedOTP)) {
          // Nếu mã OTP đúng, tiến hành đăng ký
          setIsVerified(true);
          Postuser();
          // Thêm phần logic đăng ký ở đây (có thể gọi hàm Postuser)
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
          <div className="group-otp">
            {/* Thêm trường nhập OTP */}
            <input
              type="text"
              placeholder="Nhập mã OTP..."
              value={otp}
              onChange={(event) => setOtp(event.target.value)}
              className="in-otp"
            />
            <button className="btn-otp" type="button" onClick={sendOTP}>
              <p className="text-sub">Gửi OTP</p>
            </button>
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
