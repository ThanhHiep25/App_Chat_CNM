import { StyleSheet, Text, View , FlatList, Pressable, Image, TouchableOpacity} from 'react-native'
import React, {useEffect, useState} from 'react'
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from "@react-navigation/native";
import { getFirestore, collection, onSnapshot, doc, addDoc, query, orderBy, getDoc, deleteDoc} from 'firebase/firestore';
import { getStorage, ref, uploadBytes } from 'firebase/storage';
import { getAuth } from 'firebase/auth';
const Forward_message = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const {messageData} = route.params;
    const {chats} = route.params;
    const db = getFirestore();
    const auth = getAuth();
    const user = auth.currentUser;
    const [userData, setUserData] = useState(null);
    console.log('messageData', messageData)
    console.log('chats', chats);   
    useEffect(() => {
        setUserData(user);
    }, [user]);

    const handleSend_ForwardMessage = async (item) => {
        console.log('first', item.ID_room);
        console.log('userData',userData.uid);
        const otherUser = item.otherUser;
        console.log('other', otherUser);
        const chatRoomId = item.ID_room;
        console.log("ok", chatRoomId);
        const { _id, createdAt, text, user, image, video, document } = messageData;
        try {
            const chatMessRef = collection(db, 'Chats', chatRoomId, 'chat_mess');
            await addDoc(chatMessRef, {
                _id: Math.random().toString(),
                createdAt: new Date(),
                text: text || '',
                user,
                image,
                video,
                document
            });
            console.log("Message forwarded successfully");
            navigation.goBack();
        } catch (error) {
            console.error('Error forwarding message:', error);
        }
    };

    // Render each chat item
    const renderItem = ({ item }) => (
      <Pressable 
        style={styles.itemContainer}>
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
          </View>
          <View style={{height:30, width:70, backgroundColor:"blue", borderRadius:15, alignItems:'center', justifyContent:'center'}}>
            <TouchableOpacity onPress={() => handleSend_ForwardMessage(item)}>
            <Text style={{color:'white', fontWeight:'bold'}}>Gửi</Text>
            </TouchableOpacity>
          </View>
        </View>
            
      </Pressable>
    );

    return (
        <View>
          <View style={styles.searchContainer}>
            <View style={styles.searchInput}>
              <Text style={styles.textSearch}>Gửi đến</Text>
            </View>
          </View> 
            <FlatList
                contentContainerStyle={{ paddingBottom: 100 }}
                data={chats}
                renderItem={renderItem}
                keyExtractor={(item, index) => item.ID_room.toString() + '_' + item.otherUser.UID}
            />
        </View>
    );
};


export default Forward_message

const styles = StyleSheet.create({ container: {
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
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    width:'100%',
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
    borderWidth: 2,  // Độ rộng của khung viền
    borderColor: '#006AF5',  // Màu sắc của khung viền, bạn có thể thay đổi màu tùy ý
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
    padding: 8,
    borderRadius: 5,
  },
  latestMessageText: {
    fontSize: 14,
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
  },})