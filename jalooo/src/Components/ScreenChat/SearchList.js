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

const SearchList = ({open, handleClose}) => {
  const [loading, setLoading] = useState(false);
  const [showUserList, setShowUserList] = useState(true); // Mặc định hiển thị danh sách
  const [searchTerminGroup, setSearchTerminGroup] = useState("");
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    const getAllUsers = async () => {
      try {
        setLoading(true);
        const db = getFirestore();
        const usersQuery = query(collection(db, "users"));
        const usersSnapshot = await getDocs(usersQuery);
        const usersList = usersSnapshot.docs.map((doc) => {
          const userData = doc.data();
          return {
            id: doc.id,
            name: userData.name,
            photoUrl: userData.photoURL,
            UID: userData.UID,
          };
        });
        setAllUsers(usersList);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    getAllUsers();
  }, []);

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
    return allUsers.filter((user) =>
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
            {!showUserList &&
              handleSearchinGourp().map((user) => (
                <ul className={`ul-set`} key={user.id}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Checkbox inputProps={{ "aria-label": "controlled" }} />
                    <li className="li-set" style={{ width: "500px" }}>
                      <ChatItem
                        avatar={user.photoUrl}
                        alt={"Reactjs"}
                        title={user.name}
                        subtitle={"What are you doing?"}
                        date={new Date()}
                        unread={0}
                      />
                    </li>
                  </div>
                </ul>
              ))}
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button onClick={handleClose}>Hủy</Button>
            <Button>Tạo nhóm</Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default SearchList;
