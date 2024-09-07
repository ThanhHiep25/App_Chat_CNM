import React, { useEffect, useState } from "react";
import "../../Css/ListPhone.css";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  getDoc,
  onSnapshot,
} from "firebase/firestore";
import { ChatItem } from "react-chat-elements";
// RCE CSS
import "react-chat-elements/dist/main.css";
import { getAuth } from "firebase/auth";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import Paper from "@mui/material/Paper";

const ListPhone = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showUserList, setShowUserList] = useState(true); // Mặc định hiển thị danh sách
  const auth = getAuth();
  const [userFriendsList, setUserFriendsList] = useState([]);
  const [listFriend, setListFriend] = useState([]);

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
              ID_roomChat: friendData.ID_roomChat,
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
              ID_roomChat: friendData.ID_roomChat,
            });
          });
          console.table(userFriends);
          setUserFriendsList(userFriends); // Update friends list
        });
        return () => unsubscribe(); // Unsubscribe when component unmounts
      } else {
        console.log("No user signed in!");
      }
    });
    return unsubscribe;
  }, []);

       // Tạo hàm để truy vấn dữ liệu từ collection "users" dựa trên UID
       const fetchUserDataByUID = async (UID) => {
        try {
            const db = getFirestore();
            const userDocRef = doc(db, "users", UID);
            const userDocSnapshot = await getDoc(userDocRef);

            if (userDocSnapshot.exists()) {
                const userData = userDocSnapshot.data();
                return { photoURL: userData.photoURL, name: userData.name };
            } else {
                console.error(`User document does not exist for UID ${UID}`);
                return null;
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
            return null;
        }
    };

    // Hàm để lấy dữ liệu từ collection "users" cho tất cả các UID trong mảng userFriendsList
    const fetchUserDataForFriends = async () => {
        const updatedUserFriendsList = [];
    
        for (const friend of userFriendsList) {
            const userData = await fetchUserDataByUID(friend.UID_fr);
    
            if (userData) {
                // Tạo một đối tượng mới với dữ liệu photoURL, name, UID_fr và ID_roomChat
                const updatedFriend = {
                    id: friend.id, 
                    UID_fr: friend.UID_fr,
                    ID_roomChat: friend.ID_roomChat,
                    photoUrl: userData.photoURL,
                    name: userData.name
                };
    
                updatedUserFriendsList.push(updatedFriend);
            }
        }
    
        return updatedUserFriendsList;
    };
    

    useEffect(() => {
        // Gọi hàm fetchUserDataForFriends để lấy thông tin của bạn bè từ collection "users"
        fetchUserDataForFriends().then(updatedFriendsData => {
            // Cập nhật danh sách bạn bè đã được cập nhật vào state listFriend
            setListFriend(updatedFriendsData);
        });
    }, [userFriendsList]); // Thêm userFriendsList vào dependency array
    
console.log('listFriend', listFriend)

    // Sort userFriendsList alphabetically by name
    const sortedUserFriendsList = listFriend.slice().sort((a, b) => {
        return a.name.localeCompare(b.name);
    });

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
    return listFriend.filter((user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return (
    <div className="list-ff">
      <p className="text-listfriend">Bạn bè</p>
      <div className="list-fff">
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
                value={searchTerm}
                onChange={handleSearchInputChange}
                inputProps={{ "aria-label": "search google maps" }}
              />
              <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
                <SearchIcon />
              </IconButton>
            </Paper>
      </div>
      <div className="Border-list1">
        {showUserList &&
          sortedUserFriendsList.map((user) => (
            <ul className={`ul-set`} key={user.id}>
              <li className="li-set">
                <ChatItem
                  avatar={user.photoUrl}
                  alt={"Reactjs"}
                  title={user.name}
                  unread={0}
                />
              </li>
            </ul>
          ))}
        {!showUserList &&
          handleSearch().map((user) => (
            <ul className={`ul-set`} key={user.id}>
              <li className="li-set">
                <ChatItem
                  avatar={user.photoUrl}
                  alt={"Reactjs"}
                  title={user.name}
                  unread={0}
                />
              </li>
            </ul>
          ))}
      </div>
    </div>
  );
};

export default ListPhone;
