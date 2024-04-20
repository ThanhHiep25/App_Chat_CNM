import React, { useState } from "react";
import "../../Css/Setting.css";
import { useNavigate } from "react-router-dom";
import LogoutModal from "./LogoutModal"; // Import LogoutModal
import { useCookies } from "react-cookie";

const Setting = () => {
  const navigate = useNavigate();
  const [isLogoutModalOpen, setLogoutModalOpen] = useState(false);
  const [cookies, , removeCookie] = useCookies(["user"]);

  const handleChooseLogout = () => {
    setLogoutModalOpen(true);
  };

  const handleLogout = () => {
    // Thực hiện logic đăng xuất ở đây
    // ...
    removeCookie("user");
    // Đóng modal và chuyển hướng sau khi đăng xuất
    setLogoutModalOpen(false);
    navigate("/"); // Chuyển hướng đến trang chính hoặc trang đăng nhập
  };

  const handleCloseModal = () => {
    setLogoutModalOpen(false);
  };

  return (
    <div className="setting-fr">
      <button className="btn-setting" onClick={handleChooseLogout}>
        Đăng xuất
      </button>

      {/* Render LogoutModal */}
      <div className="modal-setup">
        <LogoutModal
          isOpen={isLogoutModalOpen}
          onClose={handleCloseModal}
          onLogout={handleLogout}
        />
      </div>
    </div>
  );
};

export default Setting;
