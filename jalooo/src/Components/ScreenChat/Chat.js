import React from "react";
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
  
  return (
    <div className="App-chat">
      <div className="App-menu">
        <div>
          <button className="btn-img">
            <img src={logo} className="img-logo" alt="logo" />
          </button>
        </div>
        <div className="group-logo">
          <button className="btn-img">
            <img src={messager} className="img-messager" alt="messager" />
          </button>
          <button className="btn-img">
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

     
        <Listchat/>
     

      <div></div>
    </div>
  );
};

export default Chat;
