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
} from "firebase/firestore";
import { ChatItem } from "react-chat-elements";
// RCE CSS
import "react-chat-elements/dist/main.css";
import { getAuth } from "firebase/auth";


const ListPhone = ({ onSelectChat }) => {

  const [searchTerm, setSearchTerm] = useState("");
  const [showUserList, setShowUserList] = useState(true); // Mặc định hiển thị danh sách
  const auth = getAuth();
  const [userFriendsList, setUserFriendsList] = useState([]);

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
                          ID_roomChat: friendData.ID_roomChat
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
                        ID_roomChat: friendData.ID_roomChat
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
    return userFriendsList.filter((user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return (
    <div className="list-ff">
      <p className="text-listfriend">Bạn bè</p>
      <div className="list-fff">
        <input
          placeholder="Tìm bạn"
          className="search-chat1"
          value={searchTerm}
          onChange={handleSearchInputChange}
        />
      </div>
      <div className="Border-list1">
      {showUserList &&
          userFriendsList.map((user) => (
            <ul className={`ul-set`} key={user.id}>
              <li className="li-set">
                <ChatItem
                  avatar={user.photoUrl}
                  alt={"Reactjs"}
                  title={user.name}
                  subtitle={"What are you doing?"}
                  date={new Date()}
                  unread={0}
                />
              </li>
            </ul>
          ))}
          {!showUserList  &&
          handleSearch().map((user) => (
            <ul className={`ul-set`} key={user.id}>
              <li className="li-set">
                <ChatItem
                  avatar={user.photoUrl}
                  alt={"Reactjs"}
                  title={user.name}
                  subtitle={"What are you doing?"}
                  date={new Date()}
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
