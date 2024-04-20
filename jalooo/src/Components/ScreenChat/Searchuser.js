import React, { useEffect, useState } from "react";
import "../../Css/Listchat.css";
import {
  getFirestore,
  collection,
  query,
  getDocs,
  doc,
  getDoc,
  setDoc,
  where,
  addDoc,
} from "firebase/firestore";
import { ChatItem } from "react-chat-elements";
import { getAuth } from "firebase/auth";
// RCE CSS
import "react-chat-elements/dist/main.css";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import Paper from "@mui/material/Paper";

const Searchuser = ({ openAdd, handleCloseAdd }) => {
  const [loading, setLoading] = useState(false);
  const [showUserList, setShowUserList] = useState(true); // Mặc định hiển thị danh sách
  const [searchTermAdd, setSearchTermAdd] = useState("");
  const [friendsList, setFriendsList] = useState([]);
  const auth = getAuth();
  const user = auth.currentUser;
  const [ID_roomChat, setID_roomChat] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        console.log("User not logged in.");
        // You might want to navigate to the login screen here if not logged in
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const handleSearch = async () => {
      try {
        setLoading(true); // Set loading state to true while fetching data
        const db = getFirestore();

        const userQuery = query(collection(db, "users"));
        const userSnapshot = await getDocs(userQuery);

        const foundFriends = [];
        const currentUser = auth.currentUser;
        let index = 0; // Bắt đầu với index = 0
        userSnapshot.forEach((doc) => {
          const userData = doc.data();
          if (userData.UID !== currentUser.uid) {
            foundFriends.push({
              id: index++,
              name: userData.name,
              photoUrl: userData.photoURL,
              email: userData.email,
              UID: userData.UID,
              ID_roomChat: ID_roomChat,
            });
          }
        });

        const updatedFriendsList = [];
        for (const friend of foundFriends) {
          const isFriend = await checkFriendshipStatus(friend.UID);
          updatedFriendsList.push({ ...friend, isFriend });
        }
        setFriendsList(updatedFriendsList);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false); // Set loading state back to false
      }
    };
    handleSearch();
  }, []);

  const checkFriendshipStatus = async (UID) => {
    //console.log(UID);
    try {
      const db = getFirestore();
      const currentUser = auth.currentUser;
      //console.log(currentUser);
      const currentUserDocRef = doc(db, "users", currentUser.uid);
      const friendDataQuery = query(
        collection(currentUserDocRef, "friendData"),
        where("UID_fr", "==", UID)
      );
      const friendDataSnapshot = await getDocs(friendDataQuery);
      return !friendDataSnapshot.empty; // Trả về true nếu có dữ liệu, ngược lại trả về false
    } catch (error) {
      console.error("Error checking friendship status:", error);
      return false; // Trả về false nếu có lỗi xảy ra
    }
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 600,
    height: "auto",
    bgcolor: "background.paper",
    border: "none",
    borderRadius: "20px",
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
  };

  // Search add user
  const handleSearchInputChangeAdd = (e) => {
    setSearchTermAdd(e.target.value);
    if (e.target.value !== "") {
      setShowUserList(false); // Ẩn danh sách nếu có từ khóa tìm kiếm
    } else {
      setShowUserList(true); // Hiển thị danh sách khi không có từ khóa tìm kiếm
    }
  };

  const handleSearchAdd = () => {
    return friendsList.filter((user) =>
      user.name.toLowerCase().includes(searchTermAdd.toLowerCase())
    );
  };

  const createChatRoom = async (friendData) => {
    const generateRandomId = () => {
      const characters = "abcdef0123456789";
      let result = "0x";
      const charactersLength = characters.length;
      for (let i = 0; i < 12; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * charactersLength)
        );
      }
      return result;
    };
    console.log("Creating chat room with:", friendData);
    try {
      const db = getFirestore();
      const currentUser = auth.currentUser;
      const chatRoomId = generateRandomId(); // Tạo ID ngẫu nhiên
      setID_roomChat(chatRoomId); // Lưu ID phòng chat

      // Sắp xếp UID của hai người dùng theo thứ tự từ điển
      const sortedUIDs = [currentUser.uid, friendData.UID].sort();

      // Tạo reference cho document trong "Chats" collection
      const chatRoomRef = doc(db, "Chats", chatRoomId); // Sử dụng chatRoomId thay vì ID_roomChat

      // Lấy thông tin của phòng chat
      const chatRoomSnapshot = await getDoc(chatRoomRef);

      // Nếu phòng chat không tồn tại
      if (!chatRoomSnapshot.exists()) {
        // Tạo một phòng chat mới
        await setDoc(chatRoomRef, {
          // Thêm thông tin phòng chat tại đây
          ID_roomChat: chatRoomId, // Sử dụng chatRoomId thay vì ID_roomChat
          UID: sortedUIDs,
          UID_Chats: sortedUIDs.join("_"),
        });
        console.log("New chat room created:", friendData);
      }

      // Return chatRoomId
      return chatRoomId;
    } catch (error) {
      console.error("Error creating or navigating to chat room:", error);
      return null; // Return null nếu có lỗi xảy ra
    }
  };

  // nút thêm bạn
  const handleAddFriend = async (friend) => {
    try {
      // Create chat room and get chatRoomId
      const chatRoomId = await createChatRoom(friend);

      if (chatRoomId) {
        const db = getFirestore();
        const currentUser = auth.currentUser;

        if (currentUser) {
          const currentUserDocRef = doc(db, "users", currentUser.uid);
          const currentUserDocSnapshot = await getDoc(currentUserDocRef);

          if (currentUserDocSnapshot.exists()) {
            const currentUserData = currentUserDocSnapshot.data();

            const friendSentsQuery = query(
              collection(currentUserDocRef, "friend_Sents"),
              where("email_fr", "==", friend.email)
            );
            const friendSentsSnapshot = await getDocs(friendSentsQuery);

            if (friendSentsSnapshot.empty) {
              const friend_Sents = {
                name_fr: friend.name,
                photoURL_fr: friend.photoUrl,
                email_fr: friend.email,
                UID_fr: friend.UID,
                ID_roomChat: chatRoomId, // Sử dụng chatRoomId đã nhận từ createChatRoom
              };

              await addDoc(
                collection(currentUserDocRef, "friend_Sents"),
                friend_Sents
              );
              console.log("Added friend request sent");
              const friendDocRef = doc(db, "users", friend.UID);
              const friendDocSnapshot = await getDoc(friendDocRef);
              if (friendDocSnapshot.exists()) {
                const friend_Receiveds = {
                  name_fr: currentUserData.name,
                  photoURL_fr: currentUserData.photoURL,
                  email_fr: currentUserData.email,
                  UID_fr: currentUserData.UID,
                  ID_roomChat: chatRoomId, // Sử dụng chatRoomId đã nhận từ createChatRoom
                };
                await addDoc(
                  collection(friendDocRef, "friend_Receiveds"),
                  friend_Receiveds
                );
                console.log("Friend request sent successfully");
              } else {
                console.error("Friend document does not exist!");
              }
            } else {
              console.log("Friend request already sent");
            }
          } else {
            console.error("User document does not exist!");
          }
        } else {
          console.error("No user signed in!");
        }
      } else {
        console.error("Chat room creation failed");
      }
    } catch (error) {
      console.error("Error adding friend:", error);
    }
  };

  return (
    <div>
      {/* Thêm bạn mới */}
      <Modal
        open={openAdd}
        onClose={handleCloseAdd}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{ ...style, width: 400 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: "20px",
            }}
          >
            <Paper
              component="form"
              sx={{
                p: "2px 4px",
                display: "flex",
                alignItems: "center",
                width: 600,
              }}
            >
              <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="Tìm tên"
                value={searchTermAdd}
                onChange={handleSearchInputChangeAdd}
                inputProps={{ "aria-label": "search google maps" }}
              />
              <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
                <SearchIcon />
              </IconButton>
            </Paper>
          </div>
          <div
            style={{
              height: "400px",
              overflowX: "scroll",
              marginTop: "10px",
            }}
          >
            {!showUserList &&
              handleSearchAdd().map((user) => (
                <ul className={`ul-set`} key={user.id}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <li className="li-set" style={{ width: "500px" }}>
                      <ChatItem
                        avatar={user.photoUrl}
                        alt={"Reactjs"}
                        title={user.name}
                        date={new Date()}
                        unread={0}
                      />
                    </li>
                    <Button variant="outlined" onClick={() => handleAddFriend(user)}>Thêm</Button>
                  </div>
                </ul>
              ))}
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button onClick={handleCloseAdd}>Hủy</Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default Searchuser;
