import React, { useState, useEffect, useCallback, useRef } from "react";
import Modal from "react-bootstrap/Modal";
//import Image from 'react-bootstrap/Image';
import "../../Css/Chat.css";
import logo from "../../IMG/6.png";
import messager from "../../IMG/messager.png";
import listphone from "../../IMG/listphone.png";
import todo from "../../IMG/to_do.png";
import setting from "../../IMG/setting.png";
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
import { BiShare } from "react-icons/bi";
import { RiShareForwardLine } from "react-icons/ri";
import { AiOutlineDelete } from "react-icons/ai";
import { TbMessageCircleCancel } from "react-icons/tb";
import { Menu, MenuItem, Button } from "@mui/material";
import {
  getFirestore,
  collection,
  onSnapshot,
  doc,
  addDoc,
  query,
  orderBy,
  getDoc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { getDownloadURL } from "firebase/storage";
import { firestore, auth } from "../../config/firebase";
import { useNavigate } from "react-router-dom";
import { MessageList, Input } from "react-chat-elements";
import Bar from "./Bar";
import axios from "axios";
import "react-chat-elements/dist/main.css";
// MessageBox component
import { MessageBox } from "react-chat-elements";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import SendIcon from "@mui/icons-material/Send";
import DuoOutlinedIcon from "@mui/icons-material/DuoOutlined";
import AutoAwesomeMosaicOutlinedIcon from "@mui/icons-material/AutoAwesomeMosaicOutlined";
import { getAuth } from "firebase/auth";
import Chat_fr from "./Chat_fr";

const Chat = () => {
  const navigate = useNavigate();
  const [cookies, setCookies] = useCookies(["user"]);
  const [currentChat, setCurrentChat] = useState(null);
  const [currentComponent, setCurrentComponent] = useState("LISTCHAT");
  const [color, setColor] = useState(0);
  const [userData, setUserData] = useState(null);
  const [displayName, setDisplayName] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [personal, setPersonal] = useState("");
  const [messages, setMessages] = useState([]);
  const [chatInfo, setChatInfo] = useState(null);
  const db = getFirestore();
  const userId = cookies.user;
  const [currentUser, setCurrentUser] = useState(userId.uid);
  const [roomID, setRoomID] = useState("");
  const [chats, setChats] = useState([]);
  const [otherUser, setOrtherUser] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDocRef = doc(db, "users", userId.uid);
        const userDocSnap = await getDoc(userDocRef);
        const userData = userDocSnap.data();
        if (userDocSnap.exists()) {
          setUserData(userData);
        } else {
          console.log("User not found");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();

    return () => {
      setUserData(null); // Xóa dữ liệu người dùng khi rời khỏi màn hình
    };
  }, [db, userId.uid]);

  const handleSelectChat = async (chatInfo, User, Room, Chats) => {
    setChatInfo(chatInfo);
    console.log('chatInfo', chatInfo);
    setOrtherUser(User);
    console.log('user', User);
    setRoomID(Room);
    setChats(Chats);
  };

  useEffect(() => {
    const fetchChatMessages = async () => {
      try {
        const chatRoomId = roomID;
        const chatRoomRef = doc(db, "Chats", chatRoomId);
        const chatRoomSnapshot = await getDoc(chatRoomRef);

        if (chatRoomSnapshot.exists()) {
          const chatRoomData = chatRoomSnapshot.data();
          const detailDelete = chatRoomData.detailDelete || [];
          let latestDeleteDetail;

          // Tìm phần tử có timeDelete mới nhất của người dùng hiện tại
          detailDelete.forEach((detail) => {
            if (detail.uidDelete === userData?.UID) {
              if (
                !latestDeleteDetail ||
                detail.timeDelete.toDate() >
                  latestDeleteDetail.timeDelete.toDate()
              ) {
                latestDeleteDetail = detail;
              }
            }
          });

          const chatMessRef = collection(db, "Chats", chatRoomId, "chat_mess");
          const q = query(chatMessRef, orderBy("createdAt", "desc"));
          const unsubscribe = onSnapshot(q, (snapshot) => {
            const messages = [];
            snapshot.forEach((doc) => {
              const data = doc.data();
             // Kiểm tra mảng deleteDetail_mess của từng tin nhắn
              const deleteDetailMess = data.deleteDetail_mess || [];
              const isDeletedForCurrentUser = deleteDetailMess.some(detail => detail.uidDelete === userData?.UID);
  
              if (!latestDeleteDetail || data.createdAt.toDate() > latestDeleteDetail.timeDelete.toDate()) {
                if (!isDeletedForCurrentUser) {
                  messages.push({
                    _id: doc.id,
                    createdAt: data.createdAt.toDate(),
                    text: data.text,
                    user: data.user,
                    image: data.image,
                    video: data.video,
                    document: data.document
                  });
                }
              }
            });
            setMessages(messages);
            const photoUrl = chatInfo.Photo_group
              ? chatInfo.Photo_group
              : otherUser.photoURL;
            const displayName = chatInfo.Name_group
              ? chatInfo.Name_group
              : otherUser.name;
            setCurrentChat({
              photoUrl: photoUrl,
              displayName: displayName,
              messages: messages,
            });
            console.log("danh sach tin nhan", messages);
            console.log("danh sach tin nhan", photoURL);
            console.log("danh sach tin nhan", currentChat);
          });
          return unsubscribe;
        }
      } catch (error) {
        console.error("Error fetching chat messages:", error);
      }
    };

    const unsubscribe = fetchChatMessages();
    return () => {
      if (unsubscribe && typeof unsubscribe === "function") {
        unsubscribe();
      }
      setMessages([]); // Xóa dữ liệu tin nhắn khi rời khỏi màn hình
    };
  }, [db, roomID]);
  // Rest of the code...

  // //Modal
  useEffect(() => {
    const userRef = doc(firestore, "users", userId.uid);
    const unsubscribeFirestore = onSnapshot(userRef, (doc) => {
      if (doc.exists()) {
        const userData = doc.data();
        setPersonal(userData);
        console.log("haha", userData.photoURL);
        setPhotoURL(userData.photoURL);
        console.log("done", photoURL);
      }
    });
    return () => {
      unsubscribeFirestore();
    };
  }, []);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => {
    setShow(true);
  };

  const handleTabChange = (tab) => {
    setCurrentComponent(tab);
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
              setCurrentChat(null);
              setColor(1);
            }}
          >
            <img src={photoURL} className="img-logo" alt="logo" />
          </button>
        </div>

        <div className="group-logo">
          <button
            className={`btn-img ${color === 2 ? "selected" : null}`}
            onClick={() => {
              handleTabChange("LISTCHAT");
              handleSelectChat(null, "MESSAGER");
              setCurrentChat(null);
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
              setCurrentChat(null);
              setColor(3);
            }}
          >
            <img src={listphone} className="img-listphone" alt="listphone" />
          </button>
          <button
            className={`btn-img ${color === 4 ? "selected" : null}`}
            onClick={() => {
              handleTabChange("SHORT");
              handleSelectChat(null, "SHORT");
              setCurrentChat(null);
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
                  <MenuItem>Thong tin ca nhan</MenuItem>
                  <MenuItem
                    onClick={() => {
                      handleTabChange("SETTING");
                      handleSelectChat(null, "SETTING");
                      setColor(5);
                      setCurrentChat(null);
                      popupState.close();
                    }}
                  >
                    Dang xuat
                  </MenuItem>
                </Menu>
              </React.Fragment>
            )}
          </PopupState>
        </div>
      </div>

      {currentComponent === "INFOR" ? (
        <Infor />
      ) : currentComponent === "LISTCHAT" ? (
        <Listchat userId={userId} onSelectChat={handleSelectChat} />
      ) : currentComponent === "PHONE" ? (
        <Phone />
      ) : currentComponent === "SHORT" ? (
        <ShortVideo />
      ) : (
        currentComponent === "SETTING" && <Setting />
      )}

      {currentChat && (
        <Chat_fr
          currentChat={currentChat}
          currentUser={currentUser}
          messages={messages}
          userData={userData}
          userId={userId}
          roomID={roomID}
          chatInfo={chatInfo}
          otherUser={otherUser}
          chats={chats}
        />
      )}
    </div>
  );
};

export default Chat;
