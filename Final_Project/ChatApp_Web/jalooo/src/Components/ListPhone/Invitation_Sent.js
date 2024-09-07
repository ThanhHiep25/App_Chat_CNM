import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, query, where, getDocs, doc, setDoc, getDoc, addDoc, deleteDoc , writeBatch, onSnapshot } from "firebase/firestore";
const Invitation_Sent = () => {
  const auth = getAuth();
  const [userFriendsList, setUserFriendsList] = useState([]);

  useEffect(() => {
    const fetchUserFriends = async () => {
      try {
        const db = getFirestore();
        const auth = getAuth();
        const user = auth.currentUser;
        if (user) {
          const userDocRef = doc(db, "users", user.uid);
          const unsubscribe = onSnapshot(userDocRef, async (userDocSnapshot) => {
            if (userDocSnapshot.exists()) {
              const userData = userDocSnapshot.data();
              // Thực hiện truy vấn để lấy danh sách gửi lời mời kết bạn
              const friendsCollectionRef = collection(db, "users", user.uid, "friend_Sents");
              const friendsQuery = query(friendsCollectionRef);
              
              const unsubscribeFriends = onSnapshot(friendsQuery, async (friendsSnapshot) => {
                const userFriends = [];
                const batch = writeBatch(db);
                for (const friendDoc of friendsSnapshot.docs) {
                  const friend_Sents = friendDoc.data();
                  const friendUID = friend_Sents.UID_fr;
                  
                  // truy cập dữ liệu firestore của friendData
                  const friendDataRef = collection(db, "users", user.uid, "friendData");
                  const friendDataQuery = query(friendDataRef, where("UID_fr", "==", friendUID));
                  const friendDataSnapshot = await getDocs(friendDataQuery);
                  if (!friendDataSnapshot.empty) {
                    // Nếu UID_fr tồn tại trong friendData, xóa nó từ friend_Sents
                    batch.delete(friendDoc.ref);
                  } else {
                    // Nếu không, thêm vào mảng userFriends
                    userFriends.push({
                      id: friendDoc.id,
                      name: friend_Sents.name_fr,
                      photoUrl: friend_Sents.photoURL_fr,
                      userId: friend_Sents.email_fr,
                      UID: friend_Sents.UID_fr,
                      ID_roomChat: friend_Sents.ID_roomChat
                    });
                  }
                }
  
                // Thực hiện các thao tác ghi trong batch
                await batch.commit();
  
                setUserFriendsList(userFriends);
              });
  
              return () => {
                unsubscribeFriends();
              };
            } else {
              console.error("User document does not exist!");
            }
          });
  
          return () => unsubscribe();
        } else {
          console.error("No user signed in!");
        }
      } catch (error) {
        console.error("Error fetching user friends:", error);
      }
    };
  
    fetchUserFriends();
  }, []);

  return (
    <div className="list-fen">
      {userFriendsList.map((friend) => (
        <div key={friend.id} className="fenrequest">
          <div style={{display:'flex', flexDirection:'row', alignItems:'center',marginTop:"10px"}}>
            <img src={friend.photoUrl} className="img-fen" alt={friend.name} />
            <p style={{marginLeft:"10px"}}>{friend.name}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Invitation_Sent;
