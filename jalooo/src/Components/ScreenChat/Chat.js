import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
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
import Phone from "../ListPhone/Phone";
import ShortVideo from "../ShortVideo/shortVideo";
import Setting from "../Setting/setting";
import Infor from "../Setting/infor";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
import { Menu, MenuItem, Button } from "@mui/material";

const url = "https://65557a0784b36e3a431dc70d.mockapi.io/user";
const Chat = () => {
  const [cookies, setCookies] = useCookies(["user"]);
  const [currentChat, setCurrentChat] = useState(null);
  const [currentComponent, setCurrentComponent] = useState("LISTCHAT");
  const [color, setColor] = useState(0);
  const [mess, setMessages] = useState("");

  //Modal
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => {
    setShow(true);
  };

  const handleTabChange = (tab) => {
    setCurrentComponent(tab);
  };

  const handleSelectChat = (chatInfo) => {
    setCurrentChat(chatInfo);
  };

  return (
    <div className="App-chat">
      <div className="App-menu">
        <div>
          <button
            className={`btn-img ${color === 1 ? "selected" : null}`}
            onClick={() => {
              handleTabChange("INFOR");
              handleSelectChat(null, null);
              setColor(1);
            }}
          >
            <img src={logo} className="img-logo" alt="logo" />
          </button>
        </div>

        <div className="group-logo">
          <button
            className={`btn-img ${color === 2 ? "selected" : null}`}
            onClick={() => {
              handleTabChange("LISTCHAT");
              handleSelectChat(null, "MESSAGER");
              setColor(2);
            }}
          >
            <img src={messager} className="img-messager" alt="messager" />
          </button>
          <button
            className={`btn-img ${color === 3 ? "selected" : null}`}
            onClick={() => {
              handleTabChange("PHONE");
              handleSelectChat(null, "PHONE");
              setColor(3);
            }}
          >
            <img src={listphone} className="img-listphone" alt="listphone" />
          </button>
          <button
            className={`btn-img ${color === 4 ? "selected" : null}`}
            onClick={() => {
              handleTabChange("SHORTVIDEO");
              handleSelectChat(null, "SHORTVIDEO");
              setColor(4);
            }}
          >
            <img src={todo} className="img-to-do" alt="todo" />
          </button>
        </div>
        <div>
          {/* <button
            className={`btn-img ${color === 5 ? "selected" : null}`}
            onClick={() => {
              handleTabChange("SETTING");
              setColor(5);
            }}
          >
            <img src={setting} className="img-setting" alt="setting" />
          </button> */}
          <PopupState variant="popover" popupId="setting-menu">
            {(popupState) => (
              <React.Fragment>
                <Button
                  {...bindTrigger(popupState)}
                  className={`btn-img ${color === 5 ? "selected" : null}`}
                >
                  <img src={setting} className="img-setting" alt="setting" />
                </Button>
                <Menu {...bindMenu(popupState)}>
                  <MenuItem
                    onClick={() => {
                      handleTabChange("SETTING");
                      //handleSelectChat(null, "SETTING");
                      setColor(5);
                      popupState.close();
                    }}
                  >
                    Thông tin giới thiệu
                  </MenuItem>
                  <MenuItem >Logout</MenuItem>
                </Menu>
              </React.Fragment>
            )}
          </PopupState>
        </div>
      </div>

      {currentComponent === "INFOR" ? (
        <Infor />
      ) : currentComponent === "LISTCHAT" ? (
        <Listchat onSelectChat={handleSelectChat} />
      ) : currentComponent === "PHONE" ? (
        <Phone />
      ) : currentComponent === "SHORTVIDEO" ? (
        <ShortVideo />
      ) : (
        currentComponent === "SETTING" && <Setting />
      )}

      {currentChat && (
        <div className="frame-chat">
          <div className="sreen-chat">
            {/* Bar chat hien thi thong tin */}
            <div className="barr-chat">
              <div className="barr-chat-1">
                <img className="img-logo" src={currentChat.img} alt="Logo" />
                <p>{currentChat.resender}</p>
              </div>
              <div className="call">
                <button className="btn-chatcall">
                  <img
                    className="img-bar-chatcall"
                    src={call}
                    alt="call"
                    title="call"
                  />
                </button>
                <button className="btn-chatcall">
                  <img
                    className="img-bar-chatcall"
                    src={call_video}
                    alt="call_video"
                    title="video call"
                  />
                </button>
                <button className="btn-chatcall">
                  <img
                    className="img-bar-chatcall"
                    src={menu}
                    alt="menu"
                    title="Menu"
                  />
                </button>
              </div>
            </div>
            <div className="ren-chat">
              <div className="set-resenchat">
                <div className="resender-chat">
                  <img
                    className="img-logo-chatsend"
                    src={currentChat.img}
                    alt="Mess"
                  />{" "}
                  <p className="text-chat">{currentChat.messagersender}</p>
                </div>
              </div>
              <div className="set-senchat">
                <div className="sender-chat">
                  <p className="text-chat">{currentChat.messagersender}</p>
                  <img
                    className="img-logo-chatsend"
                    src={currentChat.img}
                    alt="Mess"
                  />
                </div>
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
                      setMessages("");
                      console.log("Update successful:", data);
                    })
                    .catch((error) => {
                      console.error("Error updating message:", error);
                    });
                }}
              >
                <img className="img-send-chat" src={send} alt="send" />
              </button>
            </div>
          </div>{" "}
        </div>
      )}
    </div>
  );
};

export default Chat;
