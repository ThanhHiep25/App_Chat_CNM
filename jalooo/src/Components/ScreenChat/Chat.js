import React, { useState } from "react";
//import Image from 'react-bootstrap/Image';
import "../../Css/Chat.css";
import logo from "../../IMG/6.png";
import messager from "../../IMG/messager.png";
import listphone from "../../IMG/listphone.png";
import todo from "../../IMG/to_do.png";
import setting from "../../IMG/setting.png";
import send from "../../IMG/send.png";
import upload_file from "../../IMG/upload_file.png";
import upload_img from "../../IMG/upload_img.png";
import call from "../../IMG/call.png";
import call_video from "../../IMG/call_video.png";
import menu from "../../IMG/menu.png";
import { useCookies } from "react-cookie";
import Listchat from "./Listchat";
const url = "https://65557a0784b36e3a431dc70d.mockapi.io/user";
const Chat = () => {
  const [cookies, setCookies] = useCookies(["user"]);
  const [currentChat, setCurrentChat] = useState(null);
  const [currentComponent, setCurrentComponent] = useState("LISTCHAT");
  const [color, setColor] = useState(0);
  const [mess, setMessages] = useState("");

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
      {currentComponent === "LISTCHAT" && (
        <Listchat onSelectChat={handleSelectChat} />
      )}
      <div className="frame-chat">
        {currentChat && (
          <div className="sreen-chat">
            {/* Bar chat hien thi thong tin */}
            <div className="barr-chat">
              <div className="barr-chat-1">
                <img className="img-logo" src={currentChat.img} alt="Logo" />
                <p>{currentChat.resender}</p>
              </div>
              <div className="call">
                <button className="btn-chatcall">
                  <img className="img-bar-chatcall" src={call} alt="call" title="call"/>
                </button>
                <button className="btn-chatcall">
                  <img className="img-bar-chatcall" src={call_video} alt="call_video" title="video call"/>
                </button>
                <button className="btn-chatcall">
                  <img className="img-bar-chatcall" src={menu} alt="menu" title="Menu" />
                </button>
              </div>
            </div>
            <div className="ren-chat">
              <div className="sender-chat">
                <img
                  className="img-logo-chatsend"
                  src={currentChat.img}
                  alt="Mess"
                />
                <p className="text-chat">{currentChat.messagersender}</p>
              </div>
            </div>

            <div className="chat-send-bottom">
              <button className="btn-chat-upload-file">
                <img
                  className="img-upload"
                  src={upload_file}
                  alt="upload_file"
                />
              </button>

              <button className="btn-chat-upload-img">
                <img className="img-upload" src={upload_img} alt="upload_img" />
              </button>
              <input
                className="input-chat"
                type="text"
                value={mess}
                onChange={(event) => setMessages(event.target.value)}
                placeholder="..."
              />
              <button
                className="btn-send"
                onClick={() => {
                  fetch(
                    `https://65557a0784b36e3a431dc70d.mockapi.io/chats/${currentChat.id}`,
                    {
                      method: "PUT", // Sử dụng PUT để cập nhật dữ liệu
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        messagersender: mess, // Đặt thông tin mới của messagerresender
                      }),
                    }
                  )
                    .then((response) => response.json())
                    .then((data) => {
                      // Xử lý kết quả trả về sau khi cập nhật
                      console.log("Update successful:", data);
                      setMessages("");
                    })
                    .catch((error) => {
                      console.error("Error updating message:", error);
                    });
                }}
              >
                <img className="img-send-chat" src={send} alt="send" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
