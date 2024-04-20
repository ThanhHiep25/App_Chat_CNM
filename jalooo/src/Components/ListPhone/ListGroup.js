import React, { useEffect, useState } from "react";
import "../../Css/ListPhone.css";
import {
  getFirestore,
  collection,
  query,
  getDocs,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
  where,
} from "firebase/firestore";
import { ChatItem } from "react-chat-elements";
// RCE CSS
import "react-chat-elements/dist/main.css";
import { getAuth } from "firebase/auth";
import { useCookies } from "react-cookie";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import Paper from "@mui/material/Paper";

const ListGroup = () => {
  const [cookies, setCookies] = useCookies(["user"]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showUserList, setShowUserList] = useState(true); // Mặc định hiển thị danh sách
  const user = cookies.user; 
  const [userGroups, setUserGroups] = useState([]);
  const db = getFirestore()

  useEffect(() => {
    const fetchUserGroups = async () => {
      try {
        if (!user) return;

        const chatsCollectionRef = collection(db, 'Group');
        const userGroupsQuery = query(chatsCollectionRef, where('UID', 'array-contains', user.uid));

        // Lắng nghe sự thay đổi của truy vấn
        const unsubscribe = onSnapshot(userGroupsQuery, (querySnapshot) => {
          const userGroupsData = querySnapshot.docs.map(doc => doc.data());
          // Sort the user groups alphabetically by group name
          userGroupsData.sort((a, b) => a.Name_group.localeCompare(b.Name_group));
          setUserGroups(userGroupsData);
        });

        return () => {
          // Hủy lắng nghe khi component bị unmount
          unsubscribe();
        };
      } catch (error) {
        console.error('Error fetching user groups:', error);
      }
    };

    fetchUserGroups();

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
    return userGroups.filter((user) =>
      user.Name_group.toLowerCase().includes(searchTerm.toLowerCase())
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
          userGroups.map((user) => (
            <ul className={`ul-set`} key={user.id}>
              <li className="li-set">
                <ChatItem
                  avatar={user.Photo_group}
                  alt={"Reactjs"}
                  title={user.Name_group}
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
                  avatar={user.Photo_group}
                  alt={"Reactjs"}
                  title={user.Name_group}
                  unread={0}
                />
              </li>
            </ul>
          ))}
      </div>
    </div>
  );
};

export default ListGroup;
