import React, { useState } from 'react'
import send from "../../IMG/send.png";
import upload_file from "../../IMG/upload_file.png";
import upload_img from "../../IMG/upload_img.png";
import call from "../../IMG/call.png";
import call_video from "../../IMG/call_video.png";
import menu from "../../IMG/menu.png";

const Bar = () => {
  const [currentChat, setCurrentChat] = useState(null);
  const [mess, setMessages] = useState("");
    return (
      <div>
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
          </div>
        )}
      </div>
    )
}

export default Bar
