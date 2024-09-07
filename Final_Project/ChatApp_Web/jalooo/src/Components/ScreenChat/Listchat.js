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
  query,
  orderBy,
  where,
} from "firebase/firestore";
import { ChatItem } from "react-chat-elements";
// RCE CSS
import "react-chat-elements/dist/main.css";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import Paper from "@mui/material/Paper";
import SearchList from "./SearchList";
import Searchuser from "./Searchuser";
import { getAuth } from "firebase/auth";
import { useCookies } from "react-cookie";


const Listchat = ({ onSelectChat, userId}) => {
  const db = getFirestore();
  const auth = getAuth();
  const user = auth.currentUser;
  const [cookies, setCookies] = useCookies(["user"]);
  const userId2 = cookies.user;
  const [searchTerm, setSearchTerm] = useState("");
  const [chats, setChats] = useState([]);
  const [showUserList, setShowUserList] = useState(true); // Mặc định hiển thị danh sách
  const [ID_room1, setID_room1] = useState("");
  const [selectedChat, setSelectedChat] = useState(null);

  useEffect(() => {
    const fetchChats = () => {
      
      const chatsCollectionRef = collection(db, 'Chats');
      const chatsQuery = query(chatsCollectionRef, where('UID', 'array-contains', userId2.uid));
      const unsubscribeChats = onSnapshot(chatsQuery, (snapshot) => {
        const chatsMap = new Map();
        const unsubscribeMessagesArray = [];
        snapshot.docs.forEach(async (chatDoc) => {
          const chatData = chatDoc.data();
          setID_room1(chatData.ID_roomChat);
          const chatUIDs = chatData.UID.filter((uid) => uid !== userId2.uid);
          const otherUID = chatUIDs[0];
          const userDocRef = doc(db, 'users', otherUID);
          const unsubscribeUser = onSnapshot(userDocRef, (userDocSnap) => {
            if (userDocSnap.exists()) {
              const userData = userDocSnap.data();
              const messQuery = query(
                collection(db, 'Chats', chatData.ID_roomChat, 'chat_mess'),
                orderBy('createdAt', 'desc')
              );
              const unsubscribeMessages = onSnapshot(messQuery, (messSnapshot) => {
                let latestMessage = null;
                let secondLatestMessage = null;
                if (!messSnapshot.empty) {
                  for (let doc of messSnapshot.docs) {
                    const message = doc.data();
                    const deleteDetailMess = message.deleteDetail_mess || [];
                    const hasUserDelete = deleteDetailMess.some(detail => detail.uidDelete === userId2.uid);
                    
                    if (!hasUserDelete) {
                      latestMessage = message;
                      break;
                    } else if (!secondLatestMessage) {
                      secondLatestMessage = message;
                    }
                  }
                }
                const detailDeleteArray = chatData.detailDelete || [];
                const latestDeleteTime = detailDeleteArray.reduce((latest, detail) => {
                  if (detail.uidDelete === userId2.uid && detail.timeDelete.toDate() > latest) {
                    return detail.timeDelete.toDate();
                  }
                  return latest;
                }, 0);
  
                const validMessage = (!latestDeleteTime || (latestMessage && latestMessage.createdAt && latestMessage.createdAt.toDate() > latestDeleteTime)) ? latestMessage : secondLatestMessage;
  
                if (validMessage) {
                  const chatItem = {
                    ID_room: chatData.ID_roomChat,
                    Admin_group: chatData.Admin_group,
                    Name_group: chatData.Name_group,
                    Photo_group: chatData.Photo_group,
                    UID: chatData.UID,
                    otherUser: {
                      UID: userData.UID,
                      name: userData.name,
                      photoURL: userData.photoURL,
                      userId: userData.userId
                    },
                    latestMessage: validMessage
                  };
                  if (validMessage && validMessage.createdAt) {
                    chatsMap.set(chatItem.ID_room, chatItem);
                  }
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
          unsubscribeMessagesArray.push(unsubscribeUser);
        });
        return () => {
          unsubscribeMessagesArray.forEach(unsubscribe => unsubscribe());
        };
      });
  
      return () => {
        unsubscribeChats();
      };
    };

    fetchChats();
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
    return chats.filter(
      (user) =>
        (user.Name_group &&
          user.Name_group.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.otherUser.name &&
          user.otherUser.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };

  const handleChatSelection = async (user) => {
    onSelectChat(user, user.otherUser, user.ID_room, chats);
    setSelectedChat(user); // Lưu thông tin về chat item được chọn
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
        <Paper
          component="form"
          sx={{
            p: "2px 4px",
            display: "flex",
            alignItems: "center",
            width: 400,
          }}
        >
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Tìm tên"
            value={searchTerm}
            onChange={handleSearchInputChange}
            inputProps={{ "aria-label": "search google maps" }}
          />
          <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
            <SearchIcon />
          </IconButton>
        </Paper>
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
              <button
                className={`st ${selectedChat === user ? "status" : null}`}
              ></button>
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
                  subtitle={user.latestMessage && `Tin nhắn : ${user.latestMessage.text}`}
                  date={user.latestMessage.createdAt.toDate()} 
                  unread={0}
                  statusColor="#8DECB4"
                  statusColorType="custom"
                  className={selectedChat === user ? "selected-chat" : ""}
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
                  date={user.latestMessage.createdAt.toDate()} // Convert Firestore Timestamp to JavaScript Date
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
