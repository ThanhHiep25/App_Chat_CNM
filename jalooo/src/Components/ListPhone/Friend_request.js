import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  doc,
  setDoc,
  getDoc,
  addDoc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";
const Friend_request = () => {
  const auth = getAuth();
  const [userFriendsList, setUserFriendsList] = useState([]);
  const [ID_roomChat, setID_roomChat] = useState("");
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
          const friendsCollectionRef = collection(
            userDocRef,
            "friend_Receiveds"
          );

          // lắng nghe thay đổi từ firestore
          const unsubscribe = onSnapshot(friendsCollectionRef, (snapshot) => {
            const userFriends = [];
            snapshot.forEach((doc) => {
              const friend_Receiveds = doc.data();
              setID_roomChat(friend_Receiveds.ID_roomChat);
              userFriends.push({
                id: doc.id,
                name: friend_Receiveds.name_fr,
                photoUrl: friend_Receiveds.photoURL_fr,
                userId: friend_Receiveds.email_fr,
                UID: friend_Receiveds.UID_fr,
                ID_roomChat: friend_Receiveds.ID_roomChat,
              });
            });
            setUserFriendsList(userFriends); // cập nhật danh sách hiện thị
          });

          return () => unsubscribe(); // hủy việc lắng nghe
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
    fetchUserFriends();
  }, []);

  const handleAddFriend = async (friend) => {
    try {
      const db = getFirestore();
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();
          const friendData = {
            name_fr: friend.name,
            photoURL_fr: friend.photoUrl,
            email_fr: friend.userId,
            UID_fr: friend.UID,
            ID_roomChat: friend.ID_roomChat,
          };

          // thêm bạn bè vào friendData Firebase will automatically create a unique ID
          await addDoc(collection(userDocRef, "friendData"), friendData);

          console.log("Friend added successfully!");

          // Xóa hồ sơ đã nhận
          const friendReceivedDocRef = doc(
            userDocRef,
            "friend_Receiveds",
            friend.id
          );
          await deleteDoc(friendReceivedDocRef);

          console.log("Friend request removed from friend_Receiveds");

          // Cập nhật bạn bè vào thông tin người gửi
          const friendDocRef = doc(db, "users", friend.UID);

          const friendDocSnapshot = await getDoc(friendDocRef);
          if (friendDocSnapshot.exists()) {
            const friendData = {
              name_fr: userData.name,
              photoURL_fr: userData.photoURL,
              email_fr: userData.email,
              UID_fr: userData.UID,
              ID_roomChat: ID_roomChat,
            };
            await addDoc(collection(friendDocRef, "friendData"), friendData);
            console.log(
              "Profile information added to friendData of the sender"
            );

            // xóa hồ sơ dã gửi lời mời , từ người gửi
            const friendSentCollectionRef = collection(
              friendDocRef,
              "friend_Sents"
            );
            const friendSentQuery = query(
              friendSentCollectionRef,
              where("UID_fr", "==", user.uid)
            );
            const friendSentQuerySnapshot = await getDocs(friendSentQuery);
            friendSentQuerySnapshot.forEach(async (friendSentDoc) => {
              await deleteDoc(friendSentDoc.ref);
              console.log("Friend request removed from friend_Sents");
            });
          } else {
            console.error("Friend document does not exist!");
          }

          // Update the friends list after adding a new friend
          fetchUserFriends();
        } else {
          console.error("User document does not exist!");
        }
      } else {
        console.error("No user signed in!");
      }
    } catch (error) {
      console.error("Error adding friend:", error);
    }
  };

  return (
    <div className="list-fen">
      {userFriendsList.map((friend) => (
        <div key={friend.id} className="fenrequest">
          <div style={{display:'flex', flexDirection:'row', alignItems:'center',marginTop:"10px"}}>
            <img src={friend.photoUrl} className="img-fen" alt={friend.name} />
            <p style={{marginLeft:"10px"}}>{friend.name}</p>
          </div>

          <button
            type="button"
            className="btn-sub-fen"
            onClick={() => handleAddFriend(friend)}
          >
            Chấp nhận
          </button>
        </div>
      ))}
    </div>
  );
};

export default Friend_request;
