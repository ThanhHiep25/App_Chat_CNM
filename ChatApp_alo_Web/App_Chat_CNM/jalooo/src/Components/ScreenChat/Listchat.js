import React, { useEffect, useState } from "react";
import "../../Css/Listchat.css";
import add_user from "../../IMG/add-user.png";
import add_group from "../../IMG/add-group.png";
import {
  getFirestore,
  collection,
  onSnapshot,
  doc,
  getDoc,
  getDocs,
  query,
  orderBy,
  where,
  updateDoc,
  setDoc,
} from "firebase/firestore";
import { ChatItem } from "react-chat-elements";
// RCE CSS
import "react-chat-elements/dist/main.css";
// MessageBox component
import { MessageBox } from "react-chat-elements";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import SearchList from "./SearchList";
import Searchuser from "./Searchuser";
import { getAuth } from "firebase/auth";

const Listchat = ({ onSelectChat, userId, navigation }) => {
  const db = getFirestore();
  const auth = getAuth();
  const user = auth.currentUser;
  const [list, setList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [chats, setChats] = useState([]);
  const [showUserList, setShowUserList] = useState(true); // Mặc định hiển thị danh sách
  const [ID_room1, setID_room1] = useState("");

  useEffect(() => {
    const chatsCollectionRef = collection(db, "Chats");
    const chatsQuery = query(
      chatsCollectionRef,
      where("UID", "array-contains", user.uid)
    );
    const unsubscribeChats = onSnapshot(chatsQuery, (snapshot) => {
      const chatsMap = new Map();
      const unsubscribeMessagesArray = [];
      snapshot.docs.forEach(async (chatDoc) => {
        const chatData = chatDoc.data();
        setID_room1(chatData.ID_roomChat);
        const chatUIDs = chatData.UID.filter((uid) => uid !== user.uid);
        const otherUID = chatUIDs[0];
        const userDocRef = doc(db, "users", otherUID);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          const messQuery = query(
            collection(db, "Chats", chatData.ID_roomChat, "chat_mess"),
            orderBy("createdAt", "desc")
          );
          const unsubscribeMessages = onSnapshot(messQuery, (messSnapshot) => {
            let latestMessage = null;
            if (!messSnapshot.empty) {
              latestMessage = messSnapshot.docs[0].data();
            }
            // Kiểm tra xem có thông tin về thời gian xóa mới nhất không
            const detailDeleteArray = chatData.detailDelete || [];
            console.log(user.uid, "ddd");
            const latestDeleteTime = detailDeleteArray.reduce(
              (latest, detail) => {
                if (
                  detail.uidDelete === user.uid &&
                  detail.timeDelete.toDate() > latest
                ) {
                  return detail.timeDelete.toDate();
                }
                return latest;
              },
              0
            );
            // Kiểm tra xem thời gian tin nhắn cuối cùng có lớn hơn thời gian xóa mới nhất không
            if (
              !latestDeleteTime ||
              (latestMessage &&
                latestMessage.createdAt.toDate() > latestDeleteTime)
            ) {
              const chatItem = {
                ID_room: chatData.ID_roomChat,
                Admin_group: chatData.Admin_group,
                Name_group: chatData.Name_group,
                Photo_group: chatData.Photo_group,
                otherUser: {
                  UID: userData.UID,
                  name: userData.name,
                  photoURL: userData.photoURL,
                  userId: userData.userId,
                },
                latestMessage: latestMessage,
              };
              chatsMap.set(chatItem.ID_room, chatItem);
            }
            const sortedChats = Array.from(chatsMap.values()).sort((a, b) => {
              if (a.latestMessage && b.latestMessage) {
                return b.latestMessage.createdAt - a.latestMessage.createdAt;
              }
              return 0;
            });
            setChats([...sortedChats]);
          });
          unsubscribeMessagesArray.push(unsubscribeMessages);
        }
      });
      return () => {
        unsubscribeMessagesArray.forEach((unsubscribe) => unsubscribe());
      };
    });
    return () => {
      unsubscribeChats();
    };
  }, [db, user]);

  // Khi người dùng bắt đầu nhập từ khóa tìm kiếm, ẩn danh sách người dùng
  const handleSearchInputChange = (e) => {
    setSearchTerm(e.target.value);
    if (e.target.value !== "") {
      setShowUserList(false); // Ẩn danh sách nếu có từ khóa tìm kiếm
    } else {
      setShowUserList(true); // Hiển thị danh sách khi không có từ khóa tìm kiếm
    }
  };
  const handleSearch = () => {
    return chats.filter((user) =>
      (user.Name_group && user.Name_group.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.otherUser.name && user.otherUser.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };
  

  const generateRandomId = () => {
    const min = 100000;
    const max = 999999;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const handleChatSelection = async (user) => {  
      onSelectChat(user,{user:user.otherUser},user.ID_room);
  };

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const [openAdd, setOpenAdd] = React.useState(false);
  const handleOpenAdd = () => {
    setOpenAdd(true);
  };
  const handleCloseAdd = () => {
    setOpenAdd(false);
  };

  //Checkbox
  //

  return (
    <div className="Chat-list">
      <SearchList open={open} handleClose={handleClose} />
      <Searchuser openAdd={openAdd} handleCloseAdd={handleCloseAdd} />
      <div className="bar-chat">
        <input
          placeholder="search"
          className="search-chat"
          value={searchTerm}
          onChange={handleSearchInputChange} // Sử dụng hàm xử lý mới
        />
        <div className="add-chat">
          <button className="btn-add" onClick={handleOpenAdd}>
            <img src={add_user} className="img-add" alt="add-user" />
          </button>
          <button className="btn-add" onClick={handleOpen}>
            <img src={add_group} className="img-add" alt="add-group" />
          </button>
        </div>
      </div>

      <div className="Border-list">
        {showUserList &&
          chats.map((user) => (
            <ul className={`ul-set`} key={user.id}>
              <li className="li-set">
                <ChatItem
                  avatar={
                    user.Photo_group
                      ? user.Photo_group
                      : user.otherUser.photoURL && user.otherUser.photoURL
                  }
                  alt={"Reactjs"}
                  title={
                    user.Name_group ? user.Name_group : user.otherUser.name
                  }
                  subtitle={user.latestMessage && user.latestMessage.text}
                  date={new Date()}
                  unread={0}
                  onClick={() => handleChatSelection(user)}
                />
              </li>
            </ul>
          ))}
        {!showUserList &&
          handleSearch().map((user) => (
            <ul className={`ul-set`} key={user.id}>
              <li className="li-set">
              <ChatItem
                  avatar={
                    user.Photo_group
                      ? user.Photo_group
                      : user.otherUser.photoURL && user.otherUser.photoURL
                  }
                  alt={"Reactjs"}
                  title={
                    user.Name_group ? user.Name_group : user.otherUser.name
                  }
                  subtitle={user.latestMessage && user.latestMessage.text}
                  date={new Date()}
                  unread={0}
                  onClick={() => handleChatSelection(user)}
                />
              </li>
            </ul>
          ))}
      </div>
    </div>
  );
};

export default Listchat;
