import React, { useEffect, useState } from "react";
import "../../Css/Listchat.css";
import add_user from "../../IMG/add-user.png";
import add_group from "../../IMG/add-group.png";

const url = "https://65557a0784b36e3a431dc70d.mockapi.io/chats";

// Listchat.js
const Listchat = ({ onSelectChat }) => {
  const [list, setList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentChat, setCurrentChat] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null); // Thêm state để lưu trữ ID của người dùng được chọn

  const fechapiList = async () => {
    await fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setList(data);
      });
  };

  useEffect(() => {
    fechapiList();
  }, []);

  const seenResenders = new Set();
  const filteredList = list.filter(
    (item) =>
      item.resender.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.messagerresender.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChatSelection = (item) => {
    setCurrentChat(item);
    onSelectChat(item);
    setSelectedUserId(item.id); // Cập nhật state với ID của người dùng được chọn
  };

  const renderedList = filteredList.map((item) => {
    const isSelected = item.id === selectedUserId; // Kiểm tra xem người dùng có được chọn không

    if (!seenResenders.has(item.resender)) {
      seenResenders.add(item.resender);
      return (
        <ul className={`ul-set ${isSelected ? "selected" : ""}`} key={item.id}>
          <li className="li-set">
            <button className={`btn-chat ${isSelected ? "selected" : ""}`} onClick={() => handleChatSelection(item)}>
            <img src={item.img} alt="imguser" className="Logo-user" />
              <div className="chat-set-message">
                <p className="name-user-resender">{item.resender}</p>
                <p className="messager-user-resender">{item.messagerresender}</p>
              </div>
            </button>
          </li>
        </ul>
      );
    }
    return null;
  });

  return (
    <div className="Chat-list">
      <div className="bar-chat">
        <input
          placeholder="search"
          className="search-chat"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="add-chat">
          <button className="btn-add">
            <img src={add_user} className="img-add" alt="add-user" />
          </button>
          <button className="btn-add">
            <img src={add_group} className="img-add" alt="add-group" />
          </button>
        </div>
      </div>
      <div className="Border-list">
        {renderedList.filter((button) => button)}
      </div>
    </div>
  );
};


export default Listchat;
