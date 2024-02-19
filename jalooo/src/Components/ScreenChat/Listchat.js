import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import "../../Css/Listchat.css";
import add_user from "../../IMG/add-user.png";
import add_group from "../../IMG/add-group.png";

const url = "https://65557a0784b36e3a431dc70d.mockapi.io/chats";

const Listchat = () => {
  const [cookies, setCookies] = useCookies(["user"]);
  const [list, setList] = useState([]);

  const fechapiList = async () => {
    await fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setList(data);
        // console.log('====================================');
        // console.log(data);
        // console.log('====================================');
      });
  };

  useEffect(() => {
    fechapiList();
  }, []);
  const seenResenders = new Set();
  const renderedList = list.map((item) => {
    if (!seenResenders.has(item.resender)) {
      seenResenders.add(item.resender);
      return (
        <ul className="ul-set">
          <li className="li-set">
            <button
              className="btn-chat"
            
            >
              <img src={item.img} alt="imguser" className="Logo-user" />
              <div className="chat-set-message">
                <p className="name-user-resender">{item.resender}</p>
                <p className="messager-user-resender">
                  {item.messagerresender}
                </p>
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
        <input placeholder="search" className="search-chat" />
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
