import React, { useCallback, useEffect, useRef, useState } from "react";

import Modal from "react-bootstrap/Modal";
//import Image from 'react-bootstrap/Image';
import "../../Css/Chat.css";
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
  getDoc,
  deleteDoc,
  updateDoc,
  getDocs,
  setDoc,
  arrayRemove,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { getDownloadURL } from "firebase/storage";
import "react-chat-elements/dist/main.css";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import SendIcon from "@mui/icons-material/Send";
import DuoOutlinedIcon from "@mui/icons-material/DuoOutlined";
import AutoAwesomeMosaicOutlinedIcon from "@mui/icons-material/AutoAwesomeMosaicOutlined";
import { getAuth } from "firebase/auth";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";


const Chat_fr = ({
  currentUser,
  currentChat,
  userId,
  userData,
  messages,
  roomID,
  chats,
  chatInfo,
  otherUser,
}) => {
  console.log("chats", chats);
  console.log("chatInfo", chatInfo);
  console.log("otherUser", otherUser);
  const uid = userId.uid;
  const RoomID = roomID;
  const [color, setColor] = useState(0);
  const [inputSend, setInputSend] = useState("");
  const [replyingToMessage, setReplyingToMessage] = useState(null);
  const storage = getStorage();
  const fileInputRef = useRef(null);
  const db = getFirestore();
  const [showForwardModal, setShowForwardModal] = useState(false); // State to control modal visibility
  const [showin4ChatModal, setShowin4ChatModal] = useState(false); // State to control modal visibility
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showMembers, setShowMembers] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);

  const [admin, setAdmin] = useState("");
  const [adminCheck, setAdminCheck] = useState("");
  const [subAdmin, setSubAdmin] = useState([]);
  const [subAdminCheck, setSubAdminCheck] = useState("");
  const [memberDetails, setMemberDetails] = useState([]);
  const [memberCount, setMemberCount] = useState(0);

  const [userFriendsList, setUserFriendsList] = useState([]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const firestore = getFirestore();
      try {
        const groupRef = doc(firestore, "Group", RoomID);
        const unsubscribe = onSnapshot(groupRef, async (docSnapshot) => {
          if (docSnapshot.exists()) {
            const groupData = docSnapshot.data();
            const groupAdmin = groupData.Admin_group;
            setAdminCheck(groupAdmin);
            setAdmin(groupAdmin === userId.uid ? groupAdmin : null);
            setSubAdmin(groupData.Sub_Admin || []);
            setSubAdminCheck(
              groupData.Sub_Admin && groupData.Sub_Admin.includes(userId.uid)
                ? userId.uid
                : ""
            );
            const UIDArray = groupData.UID || [];
            const promises = UIDArray.map(async (uid) => {
              try {
                const userRef = doc(firestore, "users", uid);
                const userDocSnapshot = await getDoc(userRef);
                if (userDocSnapshot.exists()) {
                  return userDocSnapshot.data();
                }
              } catch (error) {
                console.error("Error fetching user details: ", error);
              }
            });
            const memberDetailsArray = await Promise.all(promises);
            setMemberDetails(memberDetailsArray.filter(Boolean));
            setMemberCount(memberDetailsArray.length);
          } else {
            console.error("Document does not exist!");
          }
        });
        return () => unsubscribe();
      } catch (error) {
        console.error("Error fetching group details: ", error);
      }
    };
    fetchUserDetails();
  }, [RoomID, userId.uid]);

  console.log("memberDetails", memberDetails);

  useEffect(() => {
    const fetchUserFriends = async () => {
      try {
        const db = getFirestore();
        const auth = getAuth();
        const user = auth.currentUser;
        if (user) {
          const userDocRef = doc(db, "users", userId.uid);
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
                photoURL: friendData.photoURL_fr,
                email: friendData.email_fr,
                UID: friendData.UID_fr,
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
    fetchUserFriends();
  }, [userId.uid]);

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
          <div className="group-actionsRight">
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
            <button
              className="btn-action"
              onClick={() => handleForward(props.currentMessage)}
            >
              <RiShareForwardLine />
            </button>
          </div>
        );
      } else {
        // Hiển thị nút trả lời và chuyển tiếp cho tin nhắn của người khác
        return (
          <div className="group-actionsLeft">
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

    const handleDelete = async (message) => {
      console.log("Message deleted successfully", message);
      try {
        const chatRoomId = RoomID;
        const timeDelete_mess = new Date();
        const uidDelete_mess = userData.UID;
        const chatMessRef = doc(
          db,
          "Chats",
          chatRoomId,
          "chat_mess",
          message._id
        );
        // Tạo đối tượng chứa timeDelete và uidDelete
        const deleteDetail_mess = {
          timeDelete: timeDelete_mess,
          uidDelete: uidDelete_mess,
        };
        // Lấy dữ liệu hiện tại của tài liệu chatMessRef
        const chatMessSnapshot = await getDoc(chatMessRef);
        if (chatMessSnapshot.exists()) {
          const chatMessData = chatMessSnapshot.data();
          // Kiểm tra xem đã có mảng detailDelete chưa
          const detailDelete_mess_Array = chatMessData.deleteDetail_mess || [];
          // Thêm deleteDetail vào mảng detailDelete
          detailDelete_mess_Array.push(deleteDetail_mess);
          // Cập nhật tài liệu chatMessRef với mảng detailDelete mới
          await updateDoc(chatMessRef, {
            deleteDetail_mess: detailDelete_mess_Array,
          });

          console.log(
            "Successfully added timeDelete to Chat with chatRoomId:",
            chatRoomId
          );
        } else {
          console.log("Chat with chatRoomId:", chatRoomId, "does not exist.");
        }
      } catch (error) {
        console.error("Error adding timeDelete to Chat:", error);
      }
    };

    const handleRecall = async (message) => {
      try {
        const chatRoomId = roomID;
        const chatMessRef = collection(db, "Chats", chatRoomId, "chat_mess");

        // Xóa tin nhắn khỏi cơ sở dữ liệu bằng cách cập nhật trạng thái của nó
        await updateDoc(doc(chatMessRef, message._id), {
          text: "Tin nhắn đã được thu hồi!",
          document: "",
          video: "",
          image: "",
        });

        console.log("Message recalled successfully");
      } catch (error) {
        console.error("Error recalling message:", error);
      }
    };

    const handleReply = (message) => {
      if (message.user && message.user.name) {
        const senderName = message.user.name;
        setReplyingToMessage(message);
      }
    };

    // Hàm để xử lý chuyển tiếp tin nhắn và đóng popup
    // Sử dụng hàm handleOpenModal khi muốn mở modal, ví dụ: khi nhấp vào nút chuyển tiếp tin nhắn
    const handleForward = async (message) => {
      // Gọi hàm handleOpenModal để mở modal
      console.log("message", message);
      setShowForwardModal(true);
      setSelectedMessage(message);
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
                style={{ width: "50px", height: " 50px", borderRadius: "50px" }}
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
                marginLeft: isFirstMessage ? 0 : 60,
                marginRight: isFirstMessage ? 10 : 10,
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
                      width: "200px",
                      height: "250px",
                      borderRadius: "10px",
                    }}
                  />
                  <p style={{ fontSize: " 16px", marginTop: "5px " }}>
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
                </div>
              ) : props.currentMessage.video ? (
                <div>
                  <video
                    src={props.currentMessage.video}
                    style={{
                      width: "200px",
                      height: "250px",
                      borderRadius: " 10px",
                    }}
                    controls={true}
                  />
                  <p style={{ fontSize: " 16px", marginTop: "5px " }}>
                    {props.currentMessage.text}
                  </p>
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

      const text = replyingToMessage
        ? `[${replyingToMessage.user.name}: ${replyingToMessage.text}]\n\n${messageToSend.text}`
        : messageToSend.text;

      const { _id, createdAt, user, image, video, document } = messageToSend;

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
          imageContentType = "image/jpeg"; // assuming image is always jpeg for simplicity
          imageDownloadURL = await uploadFileToFirebaseStorage(
            image,
            userId?.uid,
            imageContentType
          );
        }
        if (video) {
          videoContentType = "video/mp4"; // assuming video is always mp4 for simplicity
          videoDownloadURL = await uploadFileToFirebaseStorage(
            video,
            userId?.uid,
            videoContentType
          );
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

        setReplyingToMessage(null); // clear replying state after sending the message
        setInputSend(""); // clear input after sending the message
      } catch (error) {
        console.error("Error sending message:", error);
      }
    },
    [db, roomID, replyingToMessage, setReplyingToMessage, setInputSend]
  );

  const uploadFileToFirebaseStorage = async (file, uid, contentType) => {
    try {
      const response = await fetch(file);
      const blob = await response.blob();

      let storagePath = ""; // Initialize storage path variable

      // Determine storage path based on file type
      if (contentType === "image") {
        storagePath = `images/${uid}/${new Date().getTime()}/${file.name}`;
      } else if (contentType === "video") {
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

  const handlelPickup = (event) => {
    const file = event.target.files[0];
    const fileURL = URL.createObjectURL(file);
    console.log("da chon file", fileURL);
    const text = file.name;

    // Get the file extension
    const fileExtension = file.name.split(".").pop().toLowerCase();

    // Check the file extension to determine its type
    let documentType;
    if (["pdf", "doc", "docx", "txt"].includes(fileExtension)) {
      documentType = "document";
    } else if (["mp4", "avi", "mov"].includes(fileExtension)) {
      documentType = "video";
    } else if (["jpg", "jpeg", "png", "gif"].includes(fileExtension)) {
      documentType = "image";
    } else {
      documentType = "unknown";
    }

    onSend([
      {
        _id: Math.random().toString(),
        createdAt: new Date(),
        user: {
          _id: userId.uid,
          name: userData?.name || "Unknown User",
          avatar: userData?.photoURL || "default_avatar_url",
        },
        text: text,
        document: documentType === "document" ? fileURL : null,
        video: documentType === "video" ? fileURL : null,
        image: documentType === "image" ? fileURL : null,
      },
    ]);
  };

  const ReplyMessageInfo = ({ replyingToMessage, onCancelReply }) => {
    return (
      <div>
        {/* Check if there is a message being replied to */}
        {replyingToMessage && (
          <div
            style={{
              marginBottom: "10px",
              display: "flex",
              flexDirection: "row",
              margin:"10px",
              marginLeft:"20px",
            }}
          >
            <div style={{
              width:"200px",
              height:"80px",
              backgroundColor:"#BED7DC",
              borderRadius: "10px",
              padding:"10px"
            }}>
              {/* Display information of the replying message */}
              <p style={{ fontSize: "18px" }}>
                Replying to: {replyingToMessage.user.name}
              </p>
              <p>{replyingToMessage.text}</p>
            </div>
            {/* Button to cancel replying */}
            <div
              style={{
                height: "20px",
                width: "20px",
                border: "none",
                borderRadius: "50%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              <ClearOutlinedIcon fontSize="small" onClick={onCancelReply} />
            </div>
          </div>
        )}
      </div>
    );
  };

  const handleCancelReply = () => {
    setReplyingToMessage(null); // Clear replying message state
  };

  const btnForwardMessage = async (message, chatId) => {
    const forwardMessage = {
      _id: message._id,
      createdAt: new Date(),
      text: message.text || "",
      user: {
        _id: userId.uid,
        name: userData?.name || "Unknown User",
        avatar: userData?.photoURL || "default_avatar_url",
      },
      image: message.image,
      video: message.video,
      document: message.document,
    };
    const chatRoomId = chatId;
    const { _id, createdAt, text, user, image, video, document } =
      forwardMessage;
    try {
      const chatMessRef = collection(db, "Chats", chatRoomId, "chat_mess");
      await addDoc(chatMessRef, {
        _id: Math.random().toString(),
        createdAt: new Date(),
        text: text || "",
        user,
        image,
        video,
        document,
      });
      console.log("Message forwarded successfully");
      setShowForwardModal(false);
    } catch (error) {
      console.error("Error forwarding message:", error);
    }
  };
  const handleIn4Chat = async (message) => {
    console.log("message");
    setShowin4ChatModal(true);
  };
  const closeModalin4 = () => {
    setShowin4ChatModal(false);
    setShowSettings(false);
    setShowMembers(false);
  };

  const handleToggleSettings = () => {
    setShowSettings(!showSettings);
    setShowMembers(false); // Ensure members view is hidden
  };

  const handleToggleMembers = () => {
    setShowMembers(!showMembers);
    setShowSettings(false); // Ensure settings view is hidden
  };

  const dissolveGroup = async () => {
    try {
      // giải tán nhóm và xóa tất cả các tin nhắn trong nhóm
      const groupDocRef = doc(db, "Group", RoomID);
      await deleteDoc(groupDocRef);
      const chatDocRef = doc(db, "Chats", RoomID);
      await deleteDoc(chatDocRef);
      console.log("Giai tan nhom thanh cong");
      setShowin4ChatModal(false);
    } catch (error) {
      console.error("Error dissolving group:", error);
    }
  };

  const addmember = async () => {
    setShowin4ChatModal(false);
    setShowSettings(false);
    setShowMembers(false);
    setShowin4ChatModal(false);
    setShowAddMember(true);
  };

  const addMember = async (user) => {
    try {
      const db = getFirestore();
      // Thêm thành viên vào collection Group
      const groupRef = doc(db, "Group", RoomID);
      const groupDocSnapshot = await getDoc(groupRef);
      if (groupDocSnapshot.exists()) {
        const groupData = groupDocSnapshot.data();
        const currentMembers = groupData.UID || [];
        const updatedMembers = [...currentMembers, user];
        await setDoc(groupRef, { UID: updatedMembers }, { merge: true });
        console.log("Thành viên đã được thêm vào nhóm thành công!");
      } else {
        console.error("Tài liệu nhóm không tồn tại!");
      }
      // Thêm thành viên vào collection Chats
      const chatRef = doc(db, "Chats", RoomID);
      const chatDocSnapshot = await getDoc(chatRef);
      if (chatDocSnapshot.exists()) {
        const chatData = chatDocSnapshot.data();
        const currentChatMembers = chatData.UID || [];
        const updatedChatMembers = [...currentChatMembers, user];
        await setDoc(chatRef, { UID: updatedChatMembers }, { merge: true });
        console.log("Thành viên đã được thêm vào cuộc trò chuyện thành công!");
      } else {
        console.error("Tài liệu cuộc trò chuyện không tồn tại!");
      }
      // Reset danh sách các bạn được chọn
    } catch (error) {
      console.error(
        "Lỗi khi thêm thành viên vào nhóm hoặc cuộc trò chuyện:",
        error
      );
    }
  };

  const leavegroup = async () => {
    try {
      // Check if user is in the Sub_Admin array of the Group document
      const groupDocRef = doc(collection(db, "Group"), RoomID);
      const groupDocSnapshot = await getDoc(groupDocRef);
      const subAdminArray = groupDocSnapshot.data().Sub_Admin;
      // Check if user.uid is in Sub_Admin array
      if (subAdminArray && subAdminArray.includes(userId.uid)) {
        // If user is in Sub_Admin array, remove user's UID from it
        await updateDoc(groupDocRef, {
          Sub_Admin: arrayRemove(userId.uid),
        });
      }
      // Remove user's UID from the group document
      await updateDoc(groupDocRef, {
        UID: arrayRemove(userId.uid),
      });
      // Remove user's UID from all chat documents where they are present
      const groupChatDocRef = doc(collection(db, "Chats"), RoomID);
      const groupChatDocSnapshot = await getDoc(groupChatDocRef);
      const subChatAdminArray = groupChatDocSnapshot.data().Sub_Admin;

      // Check if user.uid is in Sub_Admin array
      if (subChatAdminArray && subChatAdminArray.includes(userId.uid)) {
        // If user is in Sub_Admin array, remove user's UID from it
        await updateDoc(groupChatDocRef, {
          Sub_Admin: arrayRemove(userId.uid),
        });
      }

      // Remove user's UID from the group document
      await updateDoc(groupChatDocRef, {
        UID: arrayRemove(userId.uid),
      });
      // Navigate back after leaving the group
    } catch (error) {
      console.error("Error leaving group: ", error);
    }
  };

  return (
    <div className="frame-chat">
      <div className="sreen-chat">
        {/* Bar chat hien thi thong tin */}
        <div className="barr-chat">
          <div className="barr-chat-1">
            <img className="img-logo" src={currentChat.photoUrl} alt="Logo" />
            <p style={{ fontSize: "23px", fontWeight: "bold" }}>
              {currentChat.displayName}
            </p>
          </div>
          <div className="call">
            <button className="btn-chatcall">
              <DuoOutlinedIcon fontSize="large" />
            </button>
            <button onClick={handleIn4Chat} className="btn-chatcall">
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
                    message.user._id === currentUser ? "right" : "left"
                  }`}
                >
                  {/* Kiểm tra xem tin nhắn có chứa hình ảnh không */}
                  {renderMessage({
                    currentMessage: message,
                    previousMessage:
                      index > 0
                        ? currentChat.messages[
                            currentChat.messages.length - index
                          ]
                        : null,
                  })}
                </div>
              ))
          ) : (
            <div className="message-placeholder">No messages yet</div>
          )}
        </div>
        <ReplyMessageInfo
          replyingToMessage={replyingToMessage}
          onCancelReply={handleCancelReply}
        />
        <div className="chat-send-bottom">
          <UploadFileIcon
            fontSize="large"
            cursor="pointer"
            onClick={() => fileInputRef.current.click()}
          />

          {/* Button để chọn tệp tin */}
          {/* <AddPhotoAlternateIcon
            fontSize="large"
            cursor="pointer"
            className="btn-chat-upload-img"
            onClick={() => fileInputRef.current.click()}
          /> */}

          {/* Input để chọn tệp tin, được ẩn đi */}
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handlelPickup}
          />
          {/* Reply message info component */}

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
          {/* Forward Modal */}
          <Modal
            show={showForwardModal}
            onHide={() => setShowForwardModal(false)}
          >
            <Modal.Header closeButton>
              <Modal.Title>Gửi đến</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <ul>
                {chats.map((chat) => (
                  <li
                    key={chat.id}
                    className="li-modal"
                    style={{ padding: "10px", flexDirection: "row" }}
                  >
                    <img
                      src={
                        chat.Photo_group
                          ? chat.Photo_group
                          : chat.otherUser.photoURL
                      }
                      alt="User"
                      className="avatar"
                    />
                    <span className="text-modal" style={{ padding: "10px" }}>
                      {chat.Name_group ? chat.Name_group : chat.otherUser.name}
                    </span>
                    <button
                      style={{ marginRight: 40, borderRadius: 5, width: 60 }}
                      onClick={() =>
                        btnForwardMessage(selectedMessage, chat.ID_room)
                      }
                    >
                      Gửi
                    </button>
                  </li>
                ))}
              </ul>
            </Modal.Body>
            <Modal.Footer>
              <button onClick={() => setShowForwardModal(false)}>Close</button>
            </Modal.Footer>
          </Modal>
          {/* infochat Modal */}
          <Modal
            show={showin4ChatModal}
            onHide={() => setShowin4ChatModal(false)}
          >
            <Modal.Header closeButton>
              <Modal.Title>Thông tin thoại </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {!showSettings && !showMembers ? (
                <div>
                  <div className="header-info">
                    <img
                      src={chatInfo.Photo_group || currentChat.photoUrl}
                      alt="User"
                      className="avatar"
                    />
                    <span className="text-modal2">
                      {chatInfo.Name_group || currentChat.displayName}
                    </span>
                  </div>
                  {chatInfo.Admin_group === userId?.uid && (
                    <div className="body-info">
                      <button
                        style={{
                          borderRadius: 5,
                          width: "100%",
                          marginTop: 30,
                        }}
                        onClick={handleToggleSettings}
                      >
                        Cài đặt nhóm
                      </button>
                    </div>
                  )}
                  {chatInfo.Admin_group && (
                    <div className="body-info">
                      <button
                        style={{
                          borderRadius: 5,
                          width: "100%",
                          marginTop: 30,
                        }}
                        onClick={handleToggleMembers}
                      >
                        Thành viên nhóm
                      </button>
                      <button
                        style={{
                          borderRadius: 5,
                          width: "100%",
                          marginTop: 30,
                          color: "red",
                        }}
                        onClick={leavegroup}
                      >
                        Rời nhóm
                      </button>
                    </div>
                  )}
                </div>
              ) : showSettings ? (
                <div>
                  <div className="body-info">
                    <button
                      style={{
                        borderRadius: 5,
                        width: "100%",
                        marginTop: 30,
                        color: "red",
                      }}
                      onClick={dissolveGroup}
                    >
                      Giản tán nhóm
                    </button>
                  </div>
                </div>
              ) : showMembers ? (
                <div>
                  <button
                    style={{ borderRadius: 5, width: "100%", marginTop: 30 }}
                    onClick={addmember}
                  >
                    Thêm thành viên
                  </button>
                  <p>Thành viên nhóm: {memberCount}</p>
                  <div
                    style={{
                      maxHeight: "400px",
                      overflowY: "auto",
                      marginTop: 10,
                    }}
                  >
                    {/* Replace this with the actual content */}
                    <ul>
                      {memberDetails.map((member) => (
                        <li
                          key={member.id}
                          className="li-modal"
                          style={{ padding: "10px", flexDirection: "row" }}
                        >
                          <img
                            src={member.photoURL}
                            alt="User"
                            className="avatar"
                          />
                          <span
                            className="text-modal"
                            style={{ padding: "10px" }}
                          >
                            {member.name}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : null}
            </Modal.Body>
            <Modal.Footer>
              <button onClick={closeModalin4}>Close</button>
            </Modal.Footer>
          </Modal>

          {/* addmember Modal */}
          <Modal show={showAddMember} onHide={() => setShowAddMember(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Thêm thành viên nhóm</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {userFriendsList.map((userFR) => {
                const isMember = memberDetails.some(
                  (member) => member.UID === userFR.UID
                );
                return (
                  <li
                    key={userFR.id}
                    className="li-modal"
                    style={{ padding: "10px", flexDirection: "row" }}
                  >
                    <img src={userFR.photoURL} alt="User" className="avatar" />
                    <span className="text-modal" style={{ padding: "10px" }}>
                      {userFR.name}
                    </span>
                    {isMember ? (
                      <span className="text-modal" style={{ padding: "10px" }}>
                        đã tham gia
                      </span>
                    ) : (
                      <button
                        style={{ borderRadius: 5 }}
                        onClick={() => addMember(userFR.UID)}
                      >
                        Thêm
                      </button>
                    )}
                  </li>
                );
              })}
            </Modal.Body>
            <Modal.Footer>
              <button onClick={() => setShowAddMember(false)}>Close</button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default Chat_fr;
