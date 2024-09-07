import React, { useState, useEffect, useCallback } from 'react';
import { SafeAreaView, Pressable, StyleSheet, Text, View, Image, FlatList, Modal, RefreshControl, ActivityIndicator } from 'react-native';
import { AntDesign, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { formatDistanceToNowStrict } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, onSnapshot, doc, getDoc, query, orderBy, where, updateDoc, getDocs } from 'firebase/firestore';
import { useChats } from '../contextApi/ChatContext';

const Chat = () => {  
  const navigation = useNavigation();
  const db = getFirestore();
  const auth = getAuth();
  const user = auth.currentUser;
  const [userData, setUserData] = useState(null);
  const { chats, setChats } = useChats();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [ID_room1, setID_room1] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  // truy xuất dữ liệu người dùng từ firestore
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          console.log('User data:', userData);
          setUserData(userData);
        } else {
          console.log('User not found');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    if (user) {
      fetchUserData();
    }
  }, [db, user]);

  // truy xuất dữ liệu cuộc trò chuyện từ firestore
  useEffect(() => {
    const fetchChats = () => {
      setLoading(true);
      const chatsCollectionRef = collection(db, 'Chats');
      const chatsQuery = query(chatsCollectionRef, where('UID', 'array-contains', user.uid));
      const unsubscribeChats = onSnapshot(chatsQuery, (snapshot) => {
        const chatsMap = new Map();
        const unsubscribeMessagesArray = [];
        snapshot.docs.forEach(async (chatDoc) => {
          const chatData = chatDoc.data();
          setID_room1(chatData.ID_roomChat);
          const chatUIDs = chatData.UID.filter((uid) => uid !== user.uid);
          const otherUID = chatUIDs[0];
          const userDocRef = doc(db, 'users', otherUID);
          const unsubscribeUser = onSnapshot(userDocRef, (userDocSnap) => {
            if (userDocSnap.exists()) {
              const userData = userDocSnap.data();
              const messQuery = query(
                collection(db, 'Chats', chatData.ID_roomChat, 'chat_mess'),
                orderBy('createdAt', 'desc')
              );
              const unsubscribeMessages = onSnapshot(messQuery, (messSnapshot) => {
                let latestMessage = null;
                let secondLatestMessage = null;
                if (!messSnapshot.empty) {
                  for (let doc of messSnapshot.docs) {
                    const message = doc.data();
                    const deleteDetailMess = message.deleteDetail_mess || [];
                    const hasUserDelete = deleteDetailMess.some(detail => detail.uidDelete === user.uid);
                    
                    if (!hasUserDelete) {
                      latestMessage = message;
                      break;
                    } else if (!secondLatestMessage) {
                      secondLatestMessage = message;
                    }
                  }
                }
                const detailDeleteArray = chatData.detailDelete || [];
                const latestDeleteTime = detailDeleteArray.reduce((latest, detail) => {
                  if (detail.uidDelete === user.uid && detail.timeDelete.toDate() > latest) {
                    return detail.timeDelete.toDate();
                  }
                  return latest;
                }, 0);
  
                const validMessage = (!latestDeleteTime || (latestMessage && latestMessage.createdAt && latestMessage.createdAt.toDate() > latestDeleteTime)) ? latestMessage : secondLatestMessage;
  
                if (validMessage) {
                  const chatItem = {
                    ID_room: chatData.ID_roomChat,
                    Admin_group: chatData.Admin_group,
                    Name_group: chatData.Name_group,
                    Photo_group: chatData.Photo_group,
                    UID: chatData.UID,
                    otherUser: {
                      UID: userData.UID,
                      name: userData.name,
                      photoURL: userData.photoURL,
                      userId: userData.userId
                    },
                    latestMessage: validMessage
                  };
                  if (validMessage && validMessage.createdAt) {
                    chatsMap.set(chatItem.ID_room, chatItem);
                  }
                }
                const sortedChats = Array.from(chatsMap.values()).sort((a, b) => {
                  if (a.latestMessage && b.latestMessage) {
                    return b.latestMessage.createdAt - a.latestMessage.createdAt;
                  }
                  return 0;
                });
                setChats([...sortedChats]);
                setLoading(false);
              });
              unsubscribeMessagesArray.push(unsubscribeMessages);
            }
          });
          unsubscribeMessagesArray.push(unsubscribeUser);
        });
        return () => {
          unsubscribeMessagesArray.forEach(unsubscribe => unsubscribe());
        };
      });
  
      return () => {
        unsubscribeChats();
      };
    };

    fetchChats();
  }, [db, user]);

  const onRefresh = () => {
    setRefreshing(true);
    // truy xuất dữ liệu cuộc trò chuyện từ firestore khi refresh
    const fetchChats = async () => {
      try {
        const chatsCollectionRef = collection(db, 'Chats');
        const chatsQuery = query(chatsCollectionRef, where('UID', 'array-contains', user.uid));
        const snapshot = await getDocs(chatsQuery);
        const chatsMap = new Map();
        const fetchMessagesPromises = snapshot.docs.map(async (chatDoc) => {
          const chatData = chatDoc.data();
          setID_room1(chatData.ID_roomChat);
          const chatUIDs = chatData.UID.filter((uid) => uid !== user.uid);
          const otherUID = chatUIDs[0];
          const userDocRef = doc(db, 'users', otherUID);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            const messQuery = query(
              collection(db, 'Chats', chatData.ID_roomChat, 'chat_mess'),
              orderBy('createdAt', 'desc')
            );
            const messSnapshot = await getDocs(messQuery);
            let latestMessage = null;
            let secondLatestMessage = null;
            if (!messSnapshot.empty) {
              for (let doc of messSnapshot.docs) {
                const message = doc.data();
                const deleteDetailMess = message.deleteDetail_mess || [];
                const hasUserDelete = deleteDetailMess.some(detail => detail.uidDelete === user.uid);
                
                if (!hasUserDelete) {
                  latestMessage = message;
                  break;
                } else if (!secondLatestMessage) {
                  secondLatestMessage = message;
                }
              }
            }
            const detailDeleteArray = chatData.detailDelete || [];
            const latestDeleteTime = detailDeleteArray.reduce((latest, detail) => {
              if (detail.uidDelete === user.uid && detail.timeDelete.toDate() > latest) {
                return detail.timeDelete.toDate();
              }
              return latest;
            }, 0);
  
            const validMessage = (!latestDeleteTime || (latestMessage && latestMessage.createdAt && latestMessage.createdAt.toDate() > latestDeleteTime)) ? latestMessage : secondLatestMessage;
  
            if (validMessage) {
              const chatItem = {
                ID_room: chatData.ID_roomChat,
                Admin_group: chatData.Admin_group,
                Name_group: chatData.Name_group,
                Photo_group: chatData.Photo_group,
                UID: chatData.UID,
                otherUser: {
                  UID: userData.UID,
                  name: userData.name,
                  photoURL: userData.photoURL,
                  userId: userData.userId
                },
                latestMessage: validMessage
              };
              if (validMessage && validMessage.createdAt) {
                chatsMap.set(chatItem.ID_room, chatItem);
              }
            }
          }
        });
        await Promise.all(fetchMessagesPromises);
        const sortedChats = Array.from(chatsMap.values()).sort((a, b) => {
          if (a.latestMessage && b.latestMessage) {
            return b.latestMessage.createdAt - a.latestMessage.createdAt;
          }
          return 0;
        });
        setChats([...sortedChats]);
      } catch (error) {
        console.error('Error fetching chats:', error);
      } finally {
        setRefreshing(false);
      }
    };

    fetchChats();
  };

  useFocusEffect(
    useCallback(() => {
      onRefresh();
    }, [])
  );

  const setModalVisibility = (isVisible, chats) => {
    console.log(chats)
    setModalData(chats);
    setModalVisible(isVisible);
  };

  const handleDeleteChat = async (chats) => {
    chats.forEach(async (chat) => {
      try {
        console.log("otherUser", chat);
        const chatRoomId = chat.ID_room;
        const timeDelete = new Date();
        const uidDelete = userData.UID;
        const chatRoomRef = doc(db, "Chats", chatRoomId);
        const deleteDetail = {
          timeDelete: timeDelete,
          uidDelete: uidDelete
        };
        const chatRoomSnapshot = await getDoc(chatRoomRef);
        if (chatRoomSnapshot.exists()) {
          const chatRoomData = chatRoomSnapshot.data();
          const detailDeleteArray = chatRoomData.detailDelete || [];
          detailDeleteArray.push(deleteDetail);
          await updateDoc(chatRoomRef, {
            detailDelete: detailDeleteArray
          });
          setModalVisible(false);
          console.log("Successfully added timeDelete to Chat with chatRoomId:", chatRoomId);
        } else {
          console.log("Chat with chatRoomId:", chatRoomId, "does not exist.");
        }
      } catch (error) {
        console.error("Error adding timeDelete to Chat:", error);
      }
    });
  };

  const renderItem = ({ item }) => (
    <Pressable 
      style={styles.itemContainer} 
      onPress={() => navigation.navigate("Chat_fr", { friendData: item.otherUser, ID_room1: item.ID_room, chatData: item })}
      onLongPress={() => setModalVisibility(true, [item])}>
      <View style={styles.contentContainer}>
        {item.Photo_group ? (
          <Image source={{ uri: item.Photo_group }} style={styles.avatar} />
        ) : (
          item.otherUser.photoURL && (
            <Image source={{ uri: item.otherUser.photoURL }} style={styles.avatar} />
          )
        )}
        <View style={styles.messageContainer}>
          {item.Name_group ? (
            <Text style={styles.userName}>{item.Name_group}</Text>
          ) : (
            <Text style={styles.userName}>{item.otherUser.name}</Text>
          )}
          {item.latestMessage && (
            <View style={styles.latestMessageContent}>
              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.latestMessageText}>{item.latestMessage.text}</Text>
                <Text style={styles.latestMessageTimestamp}>
                  {`${formatDistanceToNowStrict(item.latestMessage.createdAt.toDate(), { addSuffix: true, locale: vi })}`}
                </Text>
              </View>
              <View style={styles.separator}></View>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <View style={styles.searchContainer}>
          <AntDesign name="search1" size={20} color="white" />
          <Pressable style={styles.searchInput} onPress={() => navigation.navigate("SearchFriend")}>
            <Text style={styles.textSearch}>Tìm kiếm</Text>
          </Pressable>
          <MaterialCommunityIcons name="qrcode-scan" size={24} color="white" />
          <Feather name="plus" size={30} color="white" />
        </View>
        <View>
        {loading ? (
          <ActivityIndicator style={styles.loadingIndicator} size="large" color="#006AF5" />
        ) : (
          <FlatList
            contentContainerStyle={{ paddingBottom: 200 }} // Ensure the end isn't covered by the Tab Navigator
            data={chats}
            renderItem={renderItem}
            keyExtractor={(item, index) => item.ID_room.toString() + '_' + item.otherUser.UID}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
              />
            }
          />
        )}
        </View>
      </SafeAreaView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisibility(false)}
      >
        <View style={styles.centeredView}>
          <Pressable
            onPress={() => setModalVisible(false)}
            style={{ flex: 1, width: '100%', justifyContent: 'center'}}
          >
            <View style={styles.modalView}>
              <View style={styles.modalOverlay}>
                <Pressable style={styles.iconchat} onPress={() => handleDeleteChat(modalData)}>
                  <MaterialCommunityIcons
                    name="delete-off"
                    size={24}
                    color="black"
                  />
                  <Text style={styles.modalText}>Xóa cuộc trò chuyện</Text>
                </Pressable>
              </View>
            </View>
          </Pressable>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#006AF5",
    padding: 9,
    height: 48,
    width: '100%',
  },
  searchInput: {
    flex: 1,
    justifyContent: "center",
    height: 48,
    marginLeft: 10,
  },
  textSearch: {
    color: "white",
    fontWeight: '500'
  }, 
  itemContainer: {
    margin: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 35,
    marginRight: 10,
    borderWidth: 2,
    borderColor: '#006AF5',
  },
  messageContainer: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  latestMessageContent: {
    backgroundColor: 'white',
    padding: 2,
    borderRadius: 5,
    marginRight: 20,
  },
  latestMessageText: {
    flex: 1,
    fontSize: 14,
    padding: 10,
  },
  latestMessageTimestamp: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  separator: {
    height: 1,
    backgroundColor: '#dcdcdc',
    width: '100%',
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flexDirection: "row", 
    alignItems: "center",
  },
  iconchat: {
    height: 70,
    width: '100%',
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
  },
  loadingIndicator: {
    marginTop: 20,
  },
});

export default Chat;
