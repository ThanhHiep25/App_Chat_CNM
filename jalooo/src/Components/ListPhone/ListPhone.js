
import React, { useEffect, useState } from 'react'
import "../../Css/ListPhone.css"

const url = "https://65557a0784b36e3a431dc70d.mockapi.io/chats";
const ListPhone = ({ onSelectChat }) => {
    const [list, setList] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
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
  )
}

export default ListPhone