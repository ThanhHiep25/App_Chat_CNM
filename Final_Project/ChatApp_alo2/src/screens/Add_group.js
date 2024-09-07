import React, { useState, useEffect } from 'react';
import {SafeAreaView, Pressable, StyleSheet, Text, View, TextInput, Image, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { AntDesign, MaterialCommunityIcons, Feather, Entypo } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import { RadioButton } from 'react-native-paper';
import { getAuth } from "firebase/auth";
import { getFirestore, collection, onSnapshot, doc, getDoc, getDocs, query , where,setDoc } from "firebase/firestore";

const Add_group = () => {
    const navigation = useNavigation();
    const auth = getAuth();
    const user = auth.currentUser;
    const [inputName_group, setInputName_group] = useState("");
    const [search, setSearch] = useState("");
    const [friendsList, setFriendsList] = useState([]);
    const [listFriend, setListFriend] = useState([]);
    const [userFriendsList, setUserFriendsList] = useState([]);
    const [selectedFriend, setSelectedFriend] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showTabs, setShowTabs] = useState(true);
    const [isInputEmpty, setIsInputEmpty] = useState(false);    

useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
        if (!user) {
            console.log("Người dùng không đăng nhập");
        }
        }); 
        return unsubscribe;
}, []);
// Hàm kiểm tra tình trạng kết bạn
const checkFriendshipStatus = async (UID) => {
    console.log(UID);
    try {
        const db = getFirestore();
        const currentUser = auth.currentUser;
        console.log(currentUser);
        const currentUserDocRef = doc(db, "users", currentUser.uid);
        const friendDataQuery = query(collection(currentUserDocRef, "friendData"), where("UID_fr", "==", UID));
        const friendDataSnapshot = await getDocs(friendDataQuery);
        return !friendDataSnapshot.empty; // Trả về true nếu có dữ liệu, ngược lại trả về false
    } catch {
        console.log("Lỗi kiểm tra trạng thái bạn bè:");
        return false; // Trả về false nếu có lỗi xảy ra
    }
};
// tìm kiếm bạn bè
useEffect(() => {
    const handleSearch = async () => {
    try {
            setLoading(true); 
            const db = getFirestore();
            const userQuery = query(collection(db, "users"), where("name", "==", search));
            const userSnapshot = await getDocs(userQuery);
            const foundFriends = [];
            const currentUser = auth.currentUser;
                userSnapshot.forEach(doc => {
                const userData = doc.data(); 
                console.log(userData)
                if (userData.UID !== currentUser.uid) {
                    foundFriends.push({
                    id: doc.id,
                    name: userData.name,
                    photoUrl: userData.photoURL,
                    email: userData.email,
                    UID: userData.UID
                    });
                }
                });
                const updatedFriendsList = [];
                for (const friend of foundFriends) {
                const isFriend = await checkFriendshipStatus(friend.UID);
                updatedFriendsList.push({ ...friend, isFriend });
                }
                setFriendsList(updatedFriendsList);
            } catch {
            console.log("Lỗi truy vấn người dùng:");
            } finally {
            setLoading(false); 
        }
    };
        handleSearch();
}, [search, user.uid]); 

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
                        email: friendData.email_fr,
                        UID: friendData.UID_fr
                    });
                });
                setUserFriendsList(userFriends);
            } else {
                console.log("User document does not exist!");
            }
        } else {
            console.log("No user signed in!");
        }
    } catch {
        console.log("Lỗi truy vấn bạn bè người dùng:");
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
                        id: doc.id, // Gán ID bằng index và tăng index sau mỗi lần sử dụng
                        name: friendData.name_fr,
                        photoUrl: friendData.photoURL_fr,
                        email: friendData.email_fr,
                        UID: friendData.UID_fr
                    });
                });
                console.log(userFriends);
                setUserFriendsList(userFriends);
            });      
            return () => unsubscribe();
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
                console.log(`User document does not exist for UID ${UID}`);
                return null;
            }
        } catch {
            console.log("Lỗi  user data:", error);
            return null;
        }
    };

    // Hàm để lấy dữ liệu từ collection "users" cho tất cả các UID trong mảng userFriendsList
    const fetchUserDataForFriends = async () => {
        const updatedUserFriendsList = []; 
        for (const friend of userFriendsList) {
            const userData = await fetchUserDataByUID(friend.UID);
            if (userData) {
                // Tạo một đối tượng mới với dữ liệu photoURL, name, UID_fr và ID_roomChat
                const updatedFriend = {
                    id: friend.id, 
                    UID: friend.UID,
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
            console.log('userFriendsList', userFriendsList)
            console.log('listFriend', listFriend)
        });
    }, [userFriendsList]); // Thêm userFriendsList vào dependency array
    
console.log('listFriend', listFriend)

// sắp xếp danh sách bạn bè theo tên
const sortedUserFriendsList = listFriend.slice().sort((a, b) => {
    return a.name.localeCompare(b.name);
});

// chọn bạn bè theo vào nhóm
const toggleSelection = (UID, name) => {
    const isSelected = selectedFriend.includes(UID);
    if (!isSelected) {
        setSelectedFriend([...selectedFriend, UID]);
    } else {
        setSelectedFriend(selectedFriend.filter(friendUID => friendUID !== UID));
    }
};
console.log('UID bạn bè đã chọn:', selectedFriend);

const renderUserFriendItem = ({ item }) => (
    <View style={styles.itemContainer2}>
        <Pressable>
            <View style={styles.containerProfile}>
                <Image style={styles.avatar} source={{ uri: item.photoUrl }} />
                <Text style={styles.text1}>{item.name}</Text>
                <RadioButton
                    value={item.UID}
                    status={selectedFriend.includes(item.UID) ? 'checked' : 'unchecked'}
                    onPress={() => toggleSelection(item.UID)}
                    color="#006AF5"
                />
            </View>
        </Pressable>
    </View>
);

const handleInputChange = (text) => {
    setInputName_group(text);
};

const handleInputChange2 = (text) => {
    setSearch(text);
    if (text.trim() === "") {
        setIsInputEmpty(true);
        setShowTabs(true); 
    } else {
        setIsInputEmpty(false);
        setShowTabs(false); 
    }
};

// Hàm tạo nhóm theo UID đã chọn
const handleCreateGroup = async () => {
    try {
        const db = getFirestore();
        const currentUser = auth.currentUser;
        // Thêm currentUser.uid vào mảng createUid
        const updatedCreateUid = [...selectedFriend, currentUser.uid];
        // Sắp xếp mảng UID theo thứ tự từ điển
        const sortedUIDs = updatedCreateUid.sort();
        // Kiểm tra xem có ít nhất hai UID trong mảng sortedUIDs không
        if (sortedUIDs.length < 3) {
            console.log("At least two UIDs are required to create a group.");
            return;
        }
        let groupName = inputName_group; // Mặc định là inputName_group
        // Nếu inputName_group trống, tạo tên nhóm từ createName
        if (!inputName_group && createName.length > 0) {
            groupName = createName.join(", "); // Concatenate names with a comma separator
        }
        const chatRoomId = generateRandomId();
        // Tạo reference cho document trong "Chat_group" collection
        const chatGroupRef = doc(db, "Group", chatRoomId);
        // Lấy thông tin của phòng chat
        const chatGroupSnapshot = await getDoc(chatGroupRef);
        // Nếu phòng chat không tồn tại
        if (!chatGroupSnapshot.exists()) {
            // Tạo một phòng chat mới trong Chat_group
            await setDoc(chatGroupRef, {
                // Thêm thông tin phòng chat tại đây
                Admin_group: user.uid, // UID của người tạo nhóm
                Name_group: groupName, // Sử dụng tên nhóm được tạo
                Photo_group: 'https://firebasestorage.googleapis.com/v0/b/demo1-c4035.appspot.com/o/Gr2.png?alt=media&token=9e4d975e-bad4-4adc-a258-c52ff9ac821c',
                ID_roomChat: chatRoomId,
                UID: sortedUIDs, // Sử dụng mảng đã sắp xếp
                UID_Chats: sortedUIDs.join("_")
            });
            console.log("New chat room created in Chat_group:", sortedUIDs);
        }

        // Tạo reference cho document trong "Chats" collection
        const chatsRef = doc(db, "Chats", chatRoomId);
        // Lấy thông tin của phòng chat trong "Chats"
        const chatsSnapshot = await getDoc(chatsRef);
        // Nếu phòng chat không tồn tại
        if (!chatsSnapshot.exists()) {
            // Tạo một phòng chat mới trong Chats
            await setDoc(chatsRef, {
                // Thêm thông tin phòng chat tại đây
                Admin_group: user.uid, // UID của người tạo nhóm
                Name_group: groupName, // Sử dụng tên nhóm được tạo
                Photo_group: 'https://firebasestorage.googleapis.com/v0/b/demo1-c4035.appspot.com/o/Gr2.png?alt=media&token=9e4d975e-bad4-4adc-a258-c52ff9ac821c',
                ID_roomChat: chatRoomId,
                UID: sortedUIDs, // Sử dụng mảng đã sắp xếp
                UID_Chats: sortedUIDs.join("_")
            });
            console.log("New chat room created in Chats:", sortedUIDs);
        }
        navigation.navigate("Main");
    } catch (error) {
        console.error("Error creating or navigating to chat room:", error);
    }
}
// Hàm tạo ID ngẫu nhiên
const generateRandomId = () => {
    const characters = 'abcdef0123456789';
    let result = '0x';
    const charactersLength = characters.length;
    for (let i = 0; i < 12; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};

const renderFriendItem = ({ item }) => (
    <View style={styles.itemContainer2}>
    <Pressable > 
        <View style={styles.containerProfile}>
            <Image style={styles.avatar} source={{ uri: item.photoUrl }} />
            <Text style={styles.text1}>{item.name}</Text>
            <RadioButton
                    value={item.UID}
                    status={selectedFriend.includes(item.UID) ? 'checked' : 'unchecked'}
                    onPress={() => toggleSelection( item.UID)}
                    color="#006AF5"
                />
        </View> 
    </Pressable>
    
    </View>
);

return (
    <View style={styles.container}>
        <SafeAreaView>
            <View style={styles.searchContainer}>
                <Pressable onPress={() => navigation.navigate("Main")}>
                    <View style={{marginLeft:10}}>
                        <AntDesign name="arrowleft" size={20} color="white" />
                    </View>
                </Pressable>
                <Text style={styles.textSearch}>Tạo nhóm mới</Text>
                {selectedFriend.length >= 2 && ( // Conditionally render the button
                    <TouchableOpacity onPress={handleCreateGroup}>
                        <Text style={styles.textSearch1}>TẠO</Text>
                    </TouchableOpacity>
                )}
            </View>
            <View style={styles.searchContainer2}>
                <View>
                    <View style={styles.avatarPlaceholder}>
                        <AntDesign name="camera" size={24} color="black" />
                    </View>
                </View>
                <View style={styles.searchInput}>
                    <TextInput
                        value={inputName_group}
                        onChangeText={handleInputChange}
                        placeholder="Nhập tên nhóm..."
                        placeholderTextColor="black"
                    />
                </View>
            </View>
            <View style={styles.searchContainer3}>
                <View style={{marginLeft:15}}>
                    <AntDesign name="search1" size={20} color="black"/>
                </View>
                <TextInput
                    style={styles.searchInput2}
                    value={search}
                    onChangeText={handleInputChange2}
                    placeholder="Tìm tên"
                    placeholderTextColor="black"
                />
            </View>  
            <View style={{ flexDirection: 'row', marginTop:10 }}>
                <FlatList
                    horizontal
                    data={selectedFriend}
                    renderItem={({ item }) => (
                        <View style={{ margin: 5 }}>
                            <Image style={styles.avatar} source={{ uri: (listFriend.find(friend => friend.UID === item) || friendsList.find(friend => friend.UID === item))?.photoUrl }} />
                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={() => toggleSelection(item)}
                            >
                                <AntDesign name="close" size={20} color="white" />
                            </TouchableOpacity>
                        </View>
                    )}
                    keyExtractor={(item) => item}
                />
            </View>
            {showTabs ? ( // Hiển thị Tabs nếu showTabs là true
                    <View>
                        <View style={{marginLeft:15,marginTop:10, fontWeight:'bold'}}>
                            <Text> Gợi ý</Text>
                        </View>
                        {/* <Tab.Navigator>
                            <Tab.Screen name="Gần đây" component={Current_mess} />
                            <Tab.Screen name="Danh bạ" component={Phonebook_2} />
                        </Tab.Navigator> */}
                        <View >
                            <FlatList
                                data={sortedUserFriendsList}
                                renderItem={renderUserFriendItem}   
                                keyExtractor={(item, index) => item.id.toString()}
                            />
                        </View>
                    </View>
                    ) : ( // Ngược lại, hiển thị nội dung 
                    <View>
                        {loading ? (
                        <ActivityIndicator style={styles.loadingIndicator} size="large" color="#006AF5" />
                        ) : (
                        <FlatList
                            data={friendsList}
                            renderItem={renderFriendItem}
                            keyExtractor={ (item) => item.id}
                        />
                        )}
                    </View>
            )}
            
        </SafeAreaView>
    </View>
)
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems:'center'
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#006AF5",
        height: 48,
        width: '100%',
    },
    searchContainer2: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "white",
        height: 68,
        width: '100%',
    },
    searchContainer3: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#dcdcdc",
        height: 48,
        borderRadius:12,
        marginLeft:10,
        marginRight:10,
    },
    searchContainer4: {
        
    },
    searchInput: {   
        flex:1,
        justifyContent:"center",
        height:48,
        marginLeft: 30,  
    },
    searchInput2: {   
        flex:1,
        justifyContent:"center",
        height:48,
        marginLeft: 10,  
    },
    textSearch:{ 
        flex:1,
        color:"white",
        fontWeight:'bold',
        marginLeft:20
    },
    textSearch1:{ 
        color:"white",
        fontWeight:'bold',
        marginRight:20
    },
    itemContainer: {
        marginTop: 20,
        flex: 1,
        margin: 20,
    },
    itemContainer2: {
        marginTop: 5,
        flex: 1,
        margin: 5,
    },
    image: {
        width: 100,
        height: 100,
        resizeMode: 'cover',
    },
    text: {
        marginTop: 10,
    },
    avatarPlaceholder: {
        marginLeft: 15,
        backgroundColor: "white",
        width: 55,
        height: 55,
        borderRadius: 35,
        justifyContent: "center",
        alignItems: "center",
    },
    avatarPlaceholderText: {
        fontSize: 8,
        color: "#8E8E93",
    },  
    loadingIndicator: {
        marginTop: 20,
    },
    containerProfile: {
        marginTop:10,
        flexDirection: 'row',
        alignItems:'center',
        width: '100%',
        height:60,
    }, 
    avatar: {
        marginLeft: 15,
        width: 55,
        height: 55,
        borderRadius: 35,
        borderWidth: 2,  // Độ rộng của khung viền
        borderColor: '#006AF5',  // Màu sắc của khung viền, bạn có thể thay đổi màu tùy ý
    },
    avatar1: {
        marginLeft: 5,
        width: 55,
        height: 55,
        borderRadius: 35,
        borderWidth: 2,  // Độ rộng của khung viền
        borderColor: '#006AF5',  // Màu sắc của khung viền, bạn có thể thay đổi màu tùy ý
    },
    text1:{
        marginLeft: 20,
        fontSize: 20,
        flex: 1,         
    },
    vAdd_gr:{
        marginTop: 10,
        flexDirection: 'row',
        alignItems:'center',
        width: '100%',
        height:60,
        backgroundColor: '#006AF5',
        
    },
    cancelButton: {
        position: 'absolute',
        top: 0,
        right: -5,
        backgroundColor: '#dcdcdc',
        borderRadius: 10,
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
export default Add_group