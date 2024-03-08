import React, { useEffect, useState } from "react";
import add_user from "../../IMG/add-user.png";
import add_group from "../../IMG/add-group.png";
import list_friend from "../../IMG/list_friend.png";
import list_group from "../../IMG/list_group.png";
import make_friend from "../../IMG/make_friend.png";
import "../../Css/ListPhone.css";
import { useNavigate } from "react-router-dom";
import "../../Css/ListPhone.css";

const url = "https://65557a0784b36e3a431dc70d.mockapi.io/chats";

const Phone = ({ onSelectChat }) => {
  const navigate = useNavigate();

  const [currentTab, setCurrentTab] = useState("listGroup");

  const handleTabChange = (tab) => {
    setCurrentTab(tab);
  };

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
            <button className="btn-chat1">
              <div className="chat-set-phone">
                <img src={item.img} alt="imguser" className="Logo-user" />
                <p className="lphone-user-resender">{item.resender}</p>
              </div>
              
             <button type="submit" className="btn-lp-menu">. . .</button>
            </button>
          </li>
        </ul>
      );
    }
    return null;
  });
  return (
    <div className="Chat-list11">
      <div>
        <div className="bar-chat"></div>
        <div className="list-friend">
          <button className="btn-list">
            <img src={list_friend} className="img-list" alt="List fen" />
            <p className="text-list">Danh sách bạn bè</p>
          </button>
        </div>
        <div className="list-friend">
          <button className="btn-list">
            <img src={list_group} className="img-list" alt="List group" />
            <p className="text-list">Danh sách nhóm</p>
          </button>
        </div>
        <div className="list-friend">
          <button className="btn-list">
            <img
              src={make_friend}
              className="img-list"
              alt="Dach sach ket ban"
            />
            <p
              className="text-list"
              onClick={() => handleTabChange("Avaatar2")}
            >
              Lời mời kết bạn
            </p>
          </button>
        </div>
      </div>
      <div className="list-ff">
        <p className="text-listfriend">Bạn bè</p>
        <div className="list-fff">
          <input
            placeholder="Tìm bạn"
            className="search-chat1"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <input
            className="list-option"
            type="text"
            id="lang"
            name="lang"
            list="items"
            placeholder="Chọn vào đây"
          ></input>
          <datalist id="items">
            <option value="Nguyên Khang">Nguyên Khang</option>
            <option value="Văn Quy">Văn Quy</option>
            <option value="VNG">VNG</option>
            <option value="Spotify">Spotify</option>
            <option value="Hoàng">Hoàng</option>
          </datalist>
        </div>
        <div className="Border-list1">
          {renderedList.filter((button) => button)}
        </div>
      </div>
    </div> // kết thục danh sách bạn bè
  );
};

export default Phone;
