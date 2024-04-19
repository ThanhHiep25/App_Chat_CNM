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
  const [friendData, setFriendData] = useState([]);
  const db = getFirestore();
  const userId = cookies.user;
  const [currentUser, setCurrentUser] = useState(userId.uid);
  console.log(currentUser, "currentUser");
  const [inputSend, setInputSend] = useState("");
  const storage = getStorage();
  const fileInputRef = useRef(null);
  const [forwardedUser, setForwardedUser] = useState(null);
  const [roomID, setRoomID] = useState("");
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

  const handleSelectChat = async (chatInfo, User, Room) => {
    setFriendData(chatInfo); 
    setRoomID(Room);
    setOrtherUser(User.user);
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
              if (
                !latestDeleteDetail ||
                data.createdAt.toDate() > latestDeleteDetail.timeDelete.toDate()
              ) {
                messages.push({
                  _id: doc.id,
                  createdAt: data.createdAt.toDate(),
                  text: data.text,
                  user: data.user,
                  image: data.image,
                  video: data.video,
                  document: data.document,
                });
              }
            });
            setMessages(messages);
            const photoUrl = friendData.Photo_group ? friendData.Photo_group : otherUser.photoURL;
            const displayName = friendData.Name_group ? friendData.Name_group : otherUser.name;
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

  const renderMessage = (props) => {
    const isCurrentUser =
      props.currentMessage.user &&
      props.currentMessage.user._id === currentUser;
    const isFirstMessage =
      isCurrentUser ||
      !props.previousMessage ||
      (props.previousMessage.user &&
        props.previousMessage.user._id !== props.currentMessage.user._id);

    // Hiển thị nút hoạt động cho mỗi tin nhắn
    const renderActions = () => {
      if (isCurrentUser) {
        // Hiển thị nút xóa và thu hồi cho tin nhắn của người dùng hiện tại
        return (
          <div className="group-actions">
            <button
              className="btn-action"
              onClick={() => handleDelete(props.currentMessage)}
            >
              <AiOutlineDelete />
            </button>
            <button
              className="btn-action"
              onClick={() => handleRecall(props.currentMessage)}
            >
              <TbMessageCircleCancel />
            </button>
          </div>
        );
      } else {
        // Hiển thị nút trả lời và chuyển tiếp cho tin nhắn của người khác
        return (
          <div className="group-actions">
            <button
              className="btn-action"
              onClick={() => handleReply(props.currentMessage)}
            >
              <BiShare />
            </button>
            <button
              className="btn-action"
              onClick={() => handleForward(props.currentMessage)}
            >
              <RiShareForwardLine />
            </button>
            <button
              className="btn-action"
              onClick={() => handleDelete(props.currentMessage)}
            >
              <AiOutlineDelete />
            </button>
          </div>
        );
      }
    };

    return (
      <div>
        {isFirstMessage && (
          <p
            style={{
              fontSize: "12px",
              color: "gray",
              textAlign: "center",
              marginBottom: "5px",
            }}
          >
            {props.currentMessage.createdAt.toLocaleDateString()}
          </p>
        )}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: isCurrentUser ? "flex-end" : "flex-start",
            marginBottom: "10px",
          }}
        >
          {!isCurrentUser && isFirstMessage && props.currentMessage.user && (
            <div style={{ marginLeft: 10 }}>
              <img
                src={props.currentMessage.user.avatar}
                style={{ width: "30px", height: " 30px", borderRadius: "15px" }}
              />
            </div>
          )}
          <div style={{ display: "flex", flexDirection: "column" }}>
            {isFirstMessage && !isCurrentUser && props.currentMessage.user && (
              <p
                style={{
                  fontSize: "16px",
                  fontWeight: "bold",
                  marginLeft: "10px",
                }}
              >
                {props.currentMessage.user.name}
              </p>
            )}
            <div
              style={{
                backgroundColor: isCurrentUser ? "#87cefa" : "white",
                padding: "5px",
                borderRadius: 10,
                maxWidth: 250,
                marginLeft: isFirstMessage ? 0 : 40,
                marginRight: isFirstMessage ? 10 : 0,
                marginTop: isFirstMessage ? 5 : 5,
              }}
            >
              {props.currentMessage.document ? (
                <div>
                  <p style={{ fontSize: " 16px", marginTop: "5px " }}>
                    <a
                      href={props.currentMessage.document}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {props.currentMessage.text}
                    </a>
                  </p>
                  <p
                    style={{
                      fontSize: "12px",
                      marginTop: "5px",
                      color: "gray",
                    }}
                  >
                    {props.currentMessage.createdAt.getHours()}:
                    {props.currentMessage.createdAt.getMinutes()}
                  </p>
                </div>
              ) : props.currentMessage.image ? (
                <div>
                  <img
                    src={props.currentMessage.image}
                    style={{
                      width: "250px",
                      height: "200px",
                      borderRadius: "10px",
                    }}
                  />
                  <p
                    style={{
                      fontSize: "12px",
                      marginTop: "5px",
                      color: "gray",
                    }}
                  >
                    {props.currentMessage.createdAt.getHours()}:
                    {props.currentMessage.createdAt.getMinutes()}
                  </p>
                </div>
              ) : props.currentMessage.video ? (
                <div>
                  <video
                    src={props.currentMessage.video}
                    style={{
                      width: "200px",
                      height: "200px",
                      borderRadius: " 10px",
                    }}
                    controls={true}
                  />
                  <p style={{ fontSize: "12px", marginTop: 5, color: "gray" }}>
                    {props.currentMessage.createdAt.getHours()}:
                    {props.currentMessage.createdAt.getMinutes()}
                  </p>
                </div>
              ) : (
                <>
                  <p style={{ fontSize: "16px", margin: "5px" }}>
                    {props.currentMessage.text}
                  </p>
                  <p
                    style={{
                      fontSize: "12px",
                      marginTop: "5px",
                      color: "gray",
                    }}
                  >
                    {props.currentMessage.createdAt.getHours()}:
                    {props.currentMessage.createdAt.getMinutes()}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
        {renderActions()}
      </div>
    );
  };

  const onSend = useCallback(
    async (messages = []) => {
      const messageToSend = messages[0];
      if (!messageToSend) {
        return;
      }

      const { _id, createdAt, text, user, image, video, document } =
        messageToSend;
      console.log(document, "document");
      const chatRoomId = roomID;
      const chatMessRef = collection(db, "Chats", chatRoomId, "chat_mess");

      try {
        let imageDownloadURL = null;
        let videoDownloadURL = null;
        let documentDownloadURL = null;
        let imageContentType = null;
        let videoContentType = null;
        let documentContentType = null;

        if (image) {
          imageContentType = 'image/jpeg'; // assuming image is always jpeg for simplicity
          imageDownloadURL = await uploadFileToFirebaseStorage(image,
            userId?.uid, imageContentType);
        }
        if (video) {
          videoContentType = 'video/mp4'; // assuming video is always mp4 for simplicity
          videoDownloadURL = await uploadFileToFirebaseStorage(video,
            userId?.uid, videoContentType);
        }
        if (document) {
          documentContentType = ""; // assuming you have a function getFileType to determine content type
          documentDownloadURL = await uploadFileToFirebaseStorage(
            document,
            userId?.uid
          );
        }

        await addDoc(chatMessRef, {
          _id,
          createdAt,
          text: text || "",
          user,
          image: imageDownloadURL,
          video: videoDownloadURL,
          document: documentDownloadURL,
          imageContentType,
          videoContentType,
          documentContentType,
        });
      } catch (error) {
        console.error("Error sending message:", error);
      }
    },
    [db, roomID]
  );

  const uploadFileToFirebaseStorage = async (file, uid, contentType) => {
    try {
        const response = await fetch(file);
        const blob = await response.blob();

        let storagePath = ''; // Initialize storage path variable

        // Determine storage path based on file type
        if (contentType === 'image') {
            storagePath = `images/${uid}/${new Date().getTime()}/${file.name}`;
        } else if (contentType === 'video') {
            storagePath = `videos/${uid}/${new Date().getTime()}/${file.name}`;
        } else {
            storagePath = `documents/${uid}/${new Date().getTime()}`;
        }

        // Create a reference to the appropriate location in Firebase Storage
        const storageRef = ref(storage, storagePath); // Make sure `storage` is referencing the root of your storage bucket

        // Upload the file to Firebase Storage
        await uploadBytes(storageRef, blob);
        console.log("Upload complete");

        // Get the download URL of the uploaded file
        const downloadURL = await getDownloadURL(storageRef);
        console.log(downloadURL, "downloadURL");
        return downloadURL;
    } catch (error) {
        console.error("Error uploading file:", error);
        throw error;
    }
};


  // Ref to the chat messages container
  const chatMessagesRef = useRef(null);

  // Function to scroll chat messages to the bottom
  const scrollToBottom = () => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  };

  // Effect to scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]); // Trigger effect whenever messages change

  // Hàm xử lý khi người dùng chọn tệp tin

  // const handlelPickup = async (event) => {
  //   const file = event.target.files[0];
  //   const fileRef = storage.ref().child(`images/${file.name}`);

  //   try {
  //     // Upload hình ảnh lên Firebase Storage
  //     await fileRef.put(file);

  //     // Lấy URL tải xuống của hình ảnh
  //     const imageUrl = await fileRef.getDownloadURL();

  //     // Gửi tin nhắn với URL hình ảnh
  //     onSend([
  //       {
  //         _id: Math.random().toString(),
  //         createdAt: new Date(),
  //         user: {
  //           _id: userId.uid,
  //           avatar: userData?.photoURL || "default_avatar_url",
  //         },
  //         image: imageUrl,
  //       },
  //     ]);
  //   } catch (error) {
  //     console.error("Lỗi khi tải lên hình ảnh:", error);
  //   }
  // };

  const handlelPickup = (event) => {
    const file = event.target.files[0];
    const fileURL = URL.createObjectURL(file);
    console.log("da chon file", fileURL);
    const text = file.name;

    // Get the file extension
    const fileExtension = file.name.split('.').pop().toLowerCase();

    // Check the file extension to determine its type
    let documentType;
    if (['pdf', 'doc', 'docx', 'txt'].includes(fileExtension)) {
        documentType = 'document';
    } else if (['mp4', 'avi', 'mov'].includes(fileExtension)) {
        documentType = 'video';
    } else if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)) {
        documentType = 'image';
    } else {
        documentType = 'unknown';
    }

    onSend([
      {
        _id: Math.random().toString(),
        createdAt: new Date(),
        user: {
          _id: userId.uid,
          avatar: userData?.photoURL || "default_avatar_url",
        },
        text: text,
        document: documentType === 'document' ? fileURL : null,
        video: documentType === 'video' ? fileURL : null,
        image: documentType === 'image' ? fileURL : null,
      },
    ]);
};


 
const handleDelete = async (message) => {
  try {
    const chatMessRef = doc(db, "Chats", roomID, "chat_mess", message._id);
    await deleteDoc(chatMessRef);
    console.log("Message deleted successfully");
  } catch (error) {
    console.error("Error deleting message:", error);
  }
};


const handleRecall = async (message) => {
  try {
    const chatRoomId = roomID;
    const chatMessRef = collection(db, "Chats", chatRoomId, "chat_mess");

    // Xóa tin nhắn khỏi cơ sở dữ liệu bằng cách cập nhật trạng thái của nó
    await updateDoc(doc(chatMessRef, message._id), {
      text: "Đã thu hồi tin nhắn",
      document:"",
    });

    console.log("Message recalled successfully");
  } catch (error) {
    console.error("Error recalling message:", error);
  }
};

const handleReply = (message) => {
  if (message.user && message.user.name) {
    // Lấy tên người gửi từ tin nhắn
    const senderName = message.user.name;
    // Tạo nội dung tin nhắn trả lời với tên người gửi
    const replyMessage = `@${senderName} ${message.text} : `;
    // Đặt giá trị của inputSend
    setInputSend(replyMessage);
  }
};


// Hàm để xử lý chuyển tiếp tin nhắn và đóng popup
const handleForward = async (message, receiver) => {
  try {
    // Tạo tin nhắn được chuyển tiếp với người nhận được chỉ định
    const forwardedMessage = {
      _id: Math.random().toString(),
      createdAt: new Date(),
      text: message.text,
      user: {
        _id: userId?.uid,
        name: userData?.name || "Unknown User",
        avatar: userData?.photoURL || "default_avatar_url",
      },
    };

    // Thêm tin nhắn đã chuyển tiếp vào cơ sở dữ liệu của người nhận
    const chatRoomId = [userId?.uid, receiver.uid].sort().join("_");
    const chatMessRef = collection(db, "Chats", chatRoomId, "chat_mess");
    await addDoc(chatMessRef, forwardedMessage);

    console.log("Message forwarded successfully");
    
    
  } catch (error) {
    console.error("Error forwarding message:", error);
  }
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
        <div className="frame-chat">
          <div className="sreen-chat">
            {/* Bar chat hien thi thong tin */}
            <div className="barr-chat">
              <div className="barr-chat-1">
                <img
                  className="img-logo"
                  src={currentChat.photoUrl}
                  alt="Logo"
                />
                <p>{currentChat.displayName}</p>
              </div>
              <div className="call">
                <button className="btn-chatcall">
                  <DuoOutlinedIcon fontSize="large" />
                </button>
                <button className="btn-chatcall">
                  <AutoAwesomeMosaicOutlinedIcon fontSize="large" />
                </button>
              </div>
            </div>
            <div className="message-list" ref={chatMessagesRef}>
              {currentChat && currentChat.messages ? (
                currentChat.messages
                  .slice()
                  .reverse()
                  .map((message, index) => (
                    <div
                      key={index}
                      className={`message ${
                        message.user._id === currentUser
                          ? "modalOverlay-right right"
                          : "left"
                      }`}
                    >
                      {/* Kiểm tra xem tin nhắn có chứa hình ảnh không */}
                      {
                        renderMessage({
                          currentMessage: message,
                          previousMessage:
                            index > 0
                              ? currentChat.messages[
                                  currentChat.messages.length - index
                                ]
                              : null,
                        })
                      }
                    </div>
                  ))
              ) : (
                <div className="message-placeholder">No messages yet</div>
              )}
            </div>

            <div className="chat-send-bottom">
              <UploadFileIcon
                fontSize="large"
                cursor="pointer"
                onClick={() => fileInputRef.current.click()}
              />

              {/* Button để chọn tệp tin */}
              <AddPhotoAlternateIcon
                fontSize="large"
                cursor="pointer"
                className="btn-chat-upload-img"
                onClick={() => fileInputRef.current.click()}
              />

              {/* Input để chọn tệp tin, được ẩn đi */}
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handlelPickup}
              />

              <input
                type="text"
                placeholder="Type here..."
                value={inputSend}
                onChange={(event) => setInputSend(event.target.value)}
                className="input-chat"
              />
              <Button
                className="btn-send"
                onClick={() => {
                  onSend([
                    {
                      // Assuming you pass an array of messages
                      _id: Math.random().toString(),
                      createdAt: new Date(),
                      text: inputSend, //Thay gia tri
                      user: {
                        _id: userId?.uid,
                        avatar: userData?.photoURL || "default_avatar_url",
                        name: userData?.name || "No name",
                      }, // Assuming you have user info available
                    },
                    setInputSend(""),
                  ]);
                }}
              >
                <SendIcon fontSize="large" cursor="pointer" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
