import React from "react";
import Modal from "react-modal";
import "../../Css/Logout.css";

const LogoutModal = ({ isOpen, onClose, onLogout }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Logout Modal"
      className="Modal"
    >
      <div className="container-Logout">
        <p className="text-logout">Bạn có chắc chắn muốn đăng xuất?</p>
        <div className="btn-setup-modal">
          <button onClick={onLogout}>Đồng ý</button>
          <button onClick={onClose}>Hủy</button>
        </div>
      </div>
    </Modal>
  );
};

export default LogoutModal;
