import React from "react";
import "../../Css/App.css";
import logo from "../../IMG/6.png";
import gif_1 from "../../IMG/chat_1.gif";
import gif_2 from "../../IMG/chat_2.gif";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <a href="../ScreenWell/App.js">
          <img src={logo} className="App-logo" alt="logo" />
        </a>
      </header>
      <body className="App-body">
        <div className="chat_gif">
          <div className="Image_chat_1">
            <img src={gif_1} className="Gif_chat" alt="Gifchat" />
          </div>

          <div className="Image_chat_2">
            <img src={gif_2} className="Gif_chat" alt="Gifchat" />
          </div>
        </div>

        <div className="group_title">
          <h1 className="title">Chào mừng bạn đến với Alo</h1>
          <p className="title_2">
            Nơi giúp bạn liên hệ với các bạn bè của mình thông qua hình thức
            chat và video call.
          </p>
          <p className="title_3">Bắt đầu thôi nào : </p>

          <div className="">
            <button className="btn_dn">
              <p>Đăng nhập</p>
            </button>
          </div>
          <p className="title_3">
            Còn nếu bạn chưa có tài khoản thì chọn bên dưới này nhé !! :{" "}
          </p>
          <div className="">
            <button className="btn_dn">
              <p>Đăng ký đi nào</p>
            </button>
          </div>
        </div>
      </body>
    </div>
  );
}

export default App;
