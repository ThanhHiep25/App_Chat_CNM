import React from "react";
import Modal from "react-modal";
import "../../Css/Setting_modal.css";

const Setting_infor_Modal = ({ isOpen, onClose, onSave }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Logout Modal"
      className="Modal"
    >
      <div className="container-Logout-infor">
        <p className="text-logout-infor">Thay đổi thông tin cá nhân</p>

        <form action="" className="form-infor">

        <div className="form-group-img">
           <img src="" alt="img-user" className="img-user-infor"/>
           <input type="file" className="form-control" accept="image/*"/>
          </div>

          <div className="form-group">
            <label>Họ và tên</label>
            <input
              type="text"
              className="form-control"
              placeholder="Nhập họ và tên"
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="text"
              className="form-control"
              placeholder="Nhập email"
            />
          </div>
          <div className="form-group">
            <label>Số điện thoại</label>
            <input
              type="text"
              className="form-control"
              placeholder="Nhập số điện thoại"
            />
          </div>
          <div className="form-group">
            <label>Địa chỉ</label>
            <input
              type="text"
              className="form-control"
              placeholder="Nhập địa chỉ"
            />
          </div>
        </form>

        <div className="btn-setup-modal-infor">
          <button onClick={onSave} >Lưu</button>
          <button onClick={onClose} >Hủy</button>
        </div>
      </div>
    </Modal>
  );
};

export default Setting_infor_Modal;
