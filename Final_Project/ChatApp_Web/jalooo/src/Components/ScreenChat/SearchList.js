import React, { useEffect, useState } from "react";
import "../../Css/Listchat.css";
import {
  getFirestore,
  collection,
  query,
  getDocs,
  doc,
  getDoc,
  where,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import { ChatItem } from "react-chat-elements";
// RCE CSS
import "react-chat-elements/dist/main.css";
import { getAuth } from "firebase/auth";
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

const SearchList = ({ open, handleClose }) => {
  const [loading, setLoading] = useState(false);
  const [showUserList, setShowUserList] = useState(true); // Mặc định hiển thị danh sách
  const [searchTerminGroup, setSearchTerminGroup] = useState("");
  const [friendsList, setFriendsList] = useState([]);
  const [userFriendsList, setUserFriendsList] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState([]);
  const [createUid, setCreateUid] = useState([]);
  const [createName, setCreateName] = useState([]);
  const auth = getAuth();
  const firestore = getFirestore();
  const user = auth.currentUser;
  const [showTabs, setShowTabs] = useState(true);
  const [isInputEmpty, setIsInputEmpty] = useState(false);
  const [inputName_group, setInputName_group] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        console.log("User not logged in.");
        // You might want to navigate to the login screen here if not logged in
      }
    });
    return unsubscribe;
  }, []);

  const checkFriendshipStatus = async (UID) => {
    console.log(UID);
    try {
      const db = getFirestore();
      const currentUser = auth.currentUser;
      console.log(currentUser);
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

  useEffect(() => {
    const handleSearch = async () => {
      try {
        setLoading(true); // Set loading state to true while fetching data
        const db = getFirestore();
        const userQuery = query(
          collection(db, "users"),
          where("name", "==", searchTerminGroup)
        );
        const userSnapshot = await getDocs(userQuery);
        const foundFriends = [];
        const currentUser = auth.currentUser;
        let index = 0; // Bắt đầu với index = 0
        userSnapshot.forEach((doc) => {
          const userData = doc.data();
          console.log(userData);
          if (userData.UID !== currentUser.uid) {
            foundFriends.push({
              id: index++,
              name: userData.name,
              photoUrl: userData.photoURL,
              email: userData.email,
              UID: userData.UID,
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

  const fetchUserFriends = async () => {
    try {
      const db = getFirestore();
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnapshot = await getDoc(userDocRef);
        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();
          const friendsCollectionRef = collection(userDocRef, "friendData");
          const friendsSnapshot = await getDocs(friendsCollectionRef);
          const userFriends = [];
          friendsSnapshot.forEach((doc) => {
            const friendData = doc.data();
            userFriends.push({
              id: doc.id,
              name: friendData.name_fr,
              photoUrl: friendData.photoURL_fr,
              userId: friendData.email_fr,
              UID_fr: friendData.UID_fr,
            });
          });
          setUserFriendsList(userFriends);
        } else {
          console.error("User document does not exist!");
        }
      } else {
        console.error("No user signed in!");
      }
    } catch (error) {
      console.error("Error fetching user friends:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        console.log(user);
        fetchUserFriends(); // Fetch friends when user is authenticated
        const db = getFirestore();
        const userDocRef = doc(db, "users", user.uid);
        const friendsCollectionRef = collection(userDocRef, "friendData");
        const unsubscribe = onSnapshot(friendsCollectionRef, (snapshot) => {
          const userFriends = [];
          let index = 0; // Bắt đầu với index = 0
          snapshot.forEach((doc) => {
            const friendData = doc.data();
            userFriends.push({
              id: index++, // Gán ID bằng index và tăng index sau mỗi lần sử dụng
              name: friendData.name_fr,
              photoUrl: friendData.photoURL_fr,
              userId: friendData.email_fr,
              UID_fr: friendData.UID_fr,
            });
          });
          console.log(userFriends);
          setUserFriendsList(userFriends); // Update friends list
        });

        return () => unsubscribe(); // Unsubscribe when component unmounts
      } else {
        console.log("No user signed in!");
      }
    });
    return unsubscribe;
  }, []);

  // Sort userFriendsList alphabetically by name
  const sortedUserFriendsList = userFriendsList.slice().sort((a, b) => {
    return a.name.localeCompare(b.name);
  });

  // Toggle friend selection
  const toggleSelection = (id, name, UID_fr) => {
    // Check if the friend is already selected
    const isSelected = selectedFriend.includes(id);

    // If the friend is not selected, add them to the selected list and createUid list
    if (!isSelected) {
      setSelectedFriend([...selectedFriend, id]);
      setCreateUid([...createUid, UID_fr]);
      setCreateName([...createName, name]); // Add the name to createName state
    } else {
      // If the friend is already selected, remove them from all lists
      setSelectedFriend(selectedFriend.filter((friendId) => friendId !== id));
      setCreateUid(createUid.filter((uid) => uid !== UID_fr));
      setCreateName(createName.filter((friendName) => friendName !== name)); // Remove the name from createName state
    }
  };

  const handleInputChange = (text) => {
    setInputName_group(text);
  };

  const handleInputChange2 = (text) => {
    setSearchTerminGroup(text);
    if (text.trim() === "") {
      setIsInputEmpty(true);
      setShowTabs(true); // Ẩn Tabs nếu input rỗng
    } else {
      setIsInputEmpty(false);
      setShowTabs(false); // Hiển thị Tabs nếu input không rỗng
    }
  };

  const handleCreateGroup = async () => {
    try {
      const db = getFirestore();
      const currentUser = auth.currentUser;
      // Thêm currentUser.uid vào mảng createUid
      const updatedCreateUid = [...createUid, currentUser.uid];
      // Sắp xếp mảng UID theo thứ tự từ điển
      const sortedUIDs = updatedCreateUid.sort();
      // Kiểm tra xem có ít nhất hai UID trong mảng sortedUIDs không
      if (sortedUIDs.length < 3) {
        console.error("At least two UIDs are required to create a group.");
        return;
      }
      let groupName = inputName_group; // Mặc định là inputName_group
      // Nếu inputName_group trống, tạo tên nhóm từ createName
      if (!inputName_group && createName.length > 0) {
        groupName = createName.join(", "); // Concatenate names with a comma separator
      }
      const chatRoomId = generateRandomId();
      // Tạo reference cho document trong "Chat_group" collection
      const chatGroupRef = doc(db, "Group", chatRoomId);
      // Lấy thông tin của phòng chat
      const chatGroupSnapshot = await getDoc(chatGroupRef);
      // Nếu phòng chat không tồn tại
      if (!chatGroupSnapshot.exists()) {
        // Tạo một phòng chat mới trong Chat_group
        await setDoc(chatGroupRef, {
          // Thêm thông tin phòng chat tại đây
          Admin_group: user.uid, // UID của người tạo nhóm
          Name_group: groupName, // Sử dụng tên nhóm được tạo
          Photo_group:
            "https://firebasestorage.googleapis.com/v0/b/demo1-c4035.appspot.com/o/Gr2.png?alt=media&token=9e4d975e-bad4-4adc-a258-c52ff9ac821c",
          ID_roomChat: chatRoomId,
          UID: sortedUIDs, // Sử dụng mảng đã sắp xếp
          UID_Chats: sortedUIDs.join("_"),
        });
        console.log("New chat room created in Chat_group:", sortedUIDs);
      }

      // Tạo reference cho document trong "Chats" collection
      const chatsRef = doc(db, "Chats", chatRoomId);
      // Lấy thông tin của phòng chat trong "Chats"
      const chatsSnapshot = await getDoc(chatsRef);
      // Nếu phòng chat không tồn tại
      if (!chatsSnapshot.exists()) {
        // Tạo một phòng chat mới trong Chats
        await setDoc(chatsRef, {
          // Thêm thông tin phòng chat tại đây
          Admin_group: user.uid, // UID của người tạo nhóm
          Name_group: groupName, // Sử dụng tên nhóm được tạo
          Photo_group:
            "https://firebasestorage.googleapis.com/v0/b/demo1-c4035.appspot.com/o/Gr2.png?alt=media&token=9e4d975e-bad4-4adc-a258-c52ff9ac821c",
          ID_roomChat: chatRoomId,
          UID: sortedUIDs, // Sử dụng mảng đã sắp xếp
          UID_Chats: sortedUIDs.join("_"),
        });
        console.log("New chat room created in Chats:", sortedUIDs);
      }
    } catch (error) {
      console.error("Error creating or navigating to chat room:", error);
    }
  };

  const generateRandomId = () => {
    const characters = "abcdef0123456789";
    let result = "0x";
    const charactersLength = characters.length;
    for (let i = 0; i < 12; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
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

  // search group
  const handleSearchInputChangeinGroup = (e) => {
    setSearchTerminGroup(e.target.value);
    if (e.target.value !== "") {
      setShowUserList(false); // Ẩn danh sách nếu có từ khóa tìm kiếm
    } else {
      setShowUserList(true); // Hiển thị danh sách khi không có từ khóa tìm kiếm
    }
  };

  const handleSearchinGourp = () => {
    return userFriendsList.filter((user) =>
      user.name.toLowerCase().includes(searchTerminGroup.toLowerCase())
    );
  };

  return (
    <div>
      {/* Tạo nhóm mới */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{ ...style }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Avatar src={""} alt="no img" sx={{ width: 56, height: 56 }} />

            <TextField
              id="standard-basic"
              sx={{ height: 56, width: 500 }}
              label="Tên nhóm"
              variant="standard"
              value={inputName_group}
              onChange={(e) => setInputName_group(e.target.value)}
            />
          </div>
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
                value={searchTerminGroup}
                onChange={handleSearchInputChangeinGroup}
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
            {showUserList &&
              userFriendsList.map((user) => (
                <ul className={`ul-set`} key={user.id}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Checkbox
                      value={user.id}
                      status={
                        selectedFriend.includes(user.id)
                          ? "checked"
                          : "unchecked"
                      }
                      onClick={() =>
                        toggleSelection(user.id, user.name, user.UID_fr)
                      }
                      inputProps={{ "aria-label": "controlled" }}
                    />
                    <li className="li-set" style={{ width: "500px" }}>
                      <ChatItem
                        avatar={user.photoUrl}
                        alt={"Reactjs"}
                        title={user.name}
                        date=""
                        unread={0}
                      />
                    </li>
                  </div>
                </ul>
              ))}
            {!showUserList &&
              handleSearchinGourp().map((user) => (
                <ul className={`ul-set`} key={user.id}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Checkbox
                      value={user.id}
                      status={
                        selectedFriend.includes(user.id)
                          ? "checked"
                          : "unchecked"
                      }
                      onClick={() =>
                        toggleSelection(user.id, user.name, user.UID_fr)
                      }
                      inputProps={{ "aria-label": "controlled" }}
                    />
                    <li className="li-set" style={{ width: "500px" }}>
                      <ChatItem
                        avatar={user.photoUrl}
                        alt={"Reactjs"}
                        title={user.name}
                        date=""
                        unread={0}
                      />
                    </li>
                  </div>
                </ul>
              ))}
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button onClick={handleClose}>Hủy</Button>
            <Button onClick={() => handleCreateGroup()}>Tạo nhóm</Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default SearchList;
