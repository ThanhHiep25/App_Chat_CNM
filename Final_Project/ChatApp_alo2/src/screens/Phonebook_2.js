import React, { useState, useEffect } from 'react';
import { SafeAreaView, Pressable, StyleSheet, Text, View, TextInput, Image, FlatList} from 'react-native';
import { AntDesign, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';
import { RadioButton } from 'react-native-paper';
import { useNavigation } from "@react-navigation/native";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, onSnapshot, doc, getDoc, getDocs } from "firebase/firestore";

const Phonebook_2 = () => {
    const navigation = useNavigation();
    const auth = getAuth();
    const [userFriendsList, setUserFriendsList] = useState([]);
    const [selectedFriend, setSelectedFriend] = useState([]);
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
                            UID_fr: friendData.UID_fr
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
                            UID_fr: friendData.UID_fr
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

    // Sort userFriendsList alphabetically by name
    const sortedUserFriendsList = userFriendsList.slice().sort((a, b) => {
        return a.name.localeCompare(b.name);
    });

    const toggleSelection = (id) => {
        if (selectedFriend.includes(id)) {
            setSelectedFriend(selectedFriend.filter(friendId => friendId !== id)); // Remove id if already selected
        } else {
            setSelectedFriend([...selectedFriend, id]); // Add id if not selected
        }
    };
    
    const renderUserFriendItem = ({ item }) => (
        <View style={styles.itemContainer}>
            <Pressable>
                <View style={styles.containerProfile}>
                    <Image style={styles.avatar} source={{ uri: item.photoUrl }} />
                    <Text style={styles.text}>{item.name}</Text>
                    <RadioButton
                        value={item.id}
                        status={selectedFriend.includes(item.id) ? 'checked' : 'unchecked'}
                        onPress={() => toggleSelection(item.id)} // Use toggleSelection function here
                        color="#006AF5"
                    />
                </View>
            </Pressable>
        </View>
    );

    return (
        <View style={styles.container}>
            <SafeAreaView>
                <View>
                    <FlatList
                        data={sortedUserFriendsList}
                        renderItem={renderUserFriendItem}   
                        keyExtractor={(item) => item.id}
                    />
                </View>
            </SafeAreaView>
        </View>
    );
};

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
        marginTop: 5,
        flex: 1,
        margin: 10,
    },
    image: {
        width: 100,
        height: 100,
        resizeMode: 'cover',
    },
    text: {
        marginLeft: 20,
        fontSize: 20,
        flex: 1,         
    },
    view1: {
        flexDirection: 'row',
        margin: 10,
    },
    text1: {
        fontSize: 15,
        justifyContent: "center",
        marginLeft: 10
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
        borderRadius: 25,
        borderWidth: 2,  // Độ rộng của khung viền
        borderColor: '#006AF5',  // Màu sắc của khung viền, bạn có thể thay đổi màu tùy ý
    },
});

export default Phonebook_2;
