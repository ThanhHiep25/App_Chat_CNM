import React, { useState } from "react";
//import Image from 'react-bootstrap/Image';
import "../../Css/Chat.css";
import logo from "../../IMG/6.png";
import messager from "../../IMG/messager.png";
import listphone from "../../IMG/listphone.png";
import todo from "../../IMG/to_do.png";
import setting from "../../IMG/setting.png";
import { useCookies } from "react-cookie";
import Listchat from "./Listchat";

const Chat = () => {
  const [cookies, setCookies] = useCookies(["user"]);
  const [currentChat, setCurrentChat] = useState(null);
  const [currentComponent, setCurrentComponent] = useState("LISTCHAT");
  const [color, setColor] = useState(0);
  const handleSelectChat = (chatInfo) => {
    setCurrentChat(chatInfo);
  };

  return (
    <div className="App-chat">
      <div className="App-menu">
        <div>
          <button
            className="btn-img"
            onClick={() => {
              setColor(1);
            }}
          >
            <img src={logo} className="img-logo" alt="logo" />
            <p>{cookies.user.name}</p>
          </button>
        </div>
        <div className="group-logo">
          <button
            className={`btn-img ${color === 1 ? "selected" : null}`}
            onClick={() => {
              setCurrentChat(null, "MESSAGER");
              setColor(1);
            }}
          >
            <img src={messager} className="img-messager" alt="messager" />
          </button>
          <button
            className={`btn-img ${color === 2 ? "selected" : null}`}
            onClick={() => {
              setCurrentChat(null, "LISTPHONE");
              setColor(2);
            }}
          >
            <img src={listphone} className="img-listphone" alt="listphone" />
          </button>
          <button className="btn-img">
            <img src={todo} className="img-to-do" alt="todo" />
          </button>
        </div>
        <div>
          <button className="btn-img">
            <img src={setting} className="img-setting" alt="setting" />
          </button>
        </div>
      </div>
      {currentComponent === "LISTCHAT" && <Listchat onSelectChat={handleSelectChat} />}
      <div className="frame-chat">
        {currentChat && (
          <div className="barr-chat">
            <img className="img-logo" src={currentChat.img} alt="Logo" />
            <p>{currentChat.resender}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
