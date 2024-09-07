import React, { useState, useEffect } from 'react';
import {SafeAreaView, Pressable, StyleSheet, Text, View, TextInput, Image, FlatList, TouchableOpacity } from 'react-native';
import { AntDesign, MaterialCommunityIcons, Feather, Ionicons, SimpleLineIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from "@react-navigation/native";
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, onSnapshot, doc, getDoc, getDocs, query , orderBy, where, updateDoc, deleteDoc, arrayRemove} from 'firebase/firestore';

const Select_Ad = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const auth = getAuth();
    const user = auth.currentUser;
    const { RoomID1 } = route.params;
    console.log('roomID', RoomID1);
    const [memberDetails, setMemberDetails] = useState([]);
    const [manager_group, setManager_group] = useState([]);
    const [admin, setAdmin] = useState('');
    const [adminCheck, setAdminCheck] = useState('');
    const [subAdmin, setSubAdmin] = useState([]);
    const [subAdminCheck, setSubAdminCheck] = useState('');
    const [mergedUIDs, setMergedUIDs] = useState([]);

    useEffect(() => {
        const mergedUIDs = [];
        if (adminCheck) {
            mergedUIDs.push(adminCheck);
        }
        mergedUIDs.push(...subAdmin);
        setMergedUIDs(mergedUIDs);
    }, [adminCheck, subAdmin]);

    useEffect(() => {
        const fetchUserDetails = async () => {
            const firestore = getFirestore();
            try {
                const groupRef = doc(firestore, "Group", RoomID1);
                const unsubscribe = onSnapshot(groupRef, async (docSnapshot) => {
                    if (docSnapshot.exists()) {
                        const groupData = docSnapshot.data();
                        const groupAdmin = groupData.Admin_group;
                        setAdminCheck(groupAdmin);
                        setAdmin(groupAdmin === user.uid ? groupAdmin : '');
                        setSubAdmin(groupData.Sub_Admin || []); // Fix here
                        setSubAdminCheck(groupData.Sub_Admin && groupData.Sub_Admin.includes(user.uid) ? user.uid : '');
                        const UIDArray = groupData.UID || [];
                        const promises = UIDArray.map(async (uid) => {
                            try {
                                const userRef = doc(firestore, 'users', uid);
                                const userDocSnapshot = await getDoc(userRef);
                                if (userDocSnapshot.exists()) {
                                    return userDocSnapshot.data();
                                }
                            } catch (error) {
                                console.error('Error fetching user details: ', error);
                            }
                        });
                        const memberDetailsArray = await Promise.all(promises);
                        setMemberDetails(memberDetailsArray.filter(Boolean));
                        
                    } else {
                        console.error("Document does not exist!");
                    }
                });
                return () => unsubscribe();
            } catch (error) {
                console.error('Error fetching group details: ', error);
            }
        };
        fetchUserDetails();
    }, [RoomID1, user.uid]);

    useEffect(() => {
        const fetchUserManager = async () => {
            const firestore = getFirestore();
            try {
                const promises = mergedUIDs.map(async (uid) => {
                    try {
                        const userRef = doc(firestore, 'users', uid);
                        const userDocSnapshot = await getDoc(userRef);
                        if (userDocSnapshot.exists()) {
                            const userData = userDocSnapshot.data();
                            return {
                                UID: userData.UID,
                                birthdate: userData.birthdate,
                                gender: userData.gender,
                                name: userData.name,
                                photoURL: userData.photoURL
                            };
                        }
                    } catch (error) {
                        console.error('Error fetching user details: ', error);
                    }
                });
                const userDetails = await Promise.all(promises);
                setManager_group(userDetails.filter(Boolean));
            } catch (error) {
                console.error('Error fetching user details: ', error);
            }
        };
        fetchUserManager();
    }, [mergedUIDs]);

    const renderItem = ({ item }) => (
        <View style={styles.itemContainer}>
            <Pressable onPress={() => select_Admin(item)}>
                <View style={styles.containerProfile}>
                    <Image source={{ uri: item.photoURL }} style={styles.avatar} />
                    <View style={{ flexDirection: 'column' }}>
                        <Text style={styles.textName}>{item.name}</Text>
                        {item.UID === adminCheck && <Text style={styles.textAdmin}>Trưởng nhóm</Text>}
                        {subAdmin.includes(item.UID) && <Text style={styles.textAdmin}>Phó nhóm</Text>}
                    </View>
                </View>
            </Pressable>
        </View>
    );

    const select_Admin = async (item) => {
        const firestore = getFirestore();

        //
        const groupRef = doc(firestore, "Group", RoomID1);
        try {
            await updateDoc(groupRef, {
                Admin_group: item.UID
            });
            // Kiểm tra và xóa UID nếu nó nằm trong mảng Sub_Admin
            const groupSnapshot = await getDoc(groupRef);
            const groupData = groupSnapshot.data();
            if (groupData && groupData.Sub_Admin && groupData.Sub_Admin.includes(item.UID)) {
                const filteredSubAdmin = groupData.Sub_Admin.filter(uid => uid !== item.UID);
                await updateDoc(groupRef, {
                    Sub_Admin: filteredSubAdmin
                });
            }
            // Thực hiện các hành động khác sau khi cập nhật thành công nếu cần
            // Remove user's UID from the group document
            const del_groupDocRef = doc(collection(firestore, 'Group'), RoomID1);
            await updateDoc(del_groupDocRef, {
                UID: arrayRemove(adminCheck)
            });
            //
            const del_chatGroupDocRef = doc(collection(firestore, 'Group'), RoomID1);
            await updateDoc(del_chatGroupDocRef, {
                UID: arrayRemove(adminCheck)
            });
            //
            navigation.navigate('Main');
        } catch (error) {
            console.error('Error updating group details: ', error);
        }//
        const groupChatRef = doc(firestore, "Chats", RoomID1);
        try {
            await updateDoc(groupChatRef, {
                Admin_group: item.UID
            });
            // Kiểm tra và xóa UID nếu nó nằm trong mảng Sub_Admin
            const groupChatSnapshot = await getDoc(groupChatRef);
            const groupChatData = groupChatSnapshot.data();
            if (groupChatData && groupChatData.Sub_Admin && groupChatData.Sub_Admin.includes(item.UID)) {
                const filteredChatSubAdmin = groupChatData.Sub_Admin.filter(uid => uid !== item.UID);
                await updateDoc(groupChatRef, {
                    Sub_Admin: filteredChatSubAdmin
                });
            }
            // Thực hiện các hành động khác sau khi cập nhật thành công nếu cần
            // Remove user's UID from the group document
            const del_groupChatDocRef = doc(collection(firestore, 'Chats'), RoomID1);
            await updateDoc(del_groupChatDocRef, {
                UID: arrayRemove(adminCheck)
            });
            //
            const del_chatGroupChatDocRef = doc(collection(firestore, 'Chats'), RoomID1);
            await updateDoc(del_chatGroupChatDocRef, {
                UID: arrayRemove(adminCheck)
            });
            //
            navigation.navigate('Main');
        } catch (error) {
            console.error('Error updating group details: ', error);
        }
    };
    

    return (
        <View style={styles.container}>
          <SafeAreaView>      
            <View style={styles.searchContainer}>
              <Pressable onPress={() => navigation.goBack()}>
                <AntDesign name="arrowleft" size={20} color="white" />
              </Pressable>
              <View style={styles.searchInput}>
                <Text style={styles.textSearch}>Chọn trưởng nhóm trước khi rời</Text>
              </View>
            </View>  
            <View>
                <FlatList
                                contentContainerStyle={{ paddingBottom: 300 }}
                                data={memberDetails}
                                renderItem={renderItem}
                                keyExtractor={(item, index) => index.toString()} />
            </View>
          </SafeAreaView>
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
        justifyContent: "center",
        backgroundColor: "#006AF5",
        padding: 9,
        height: 48,
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
        marginTop: 20,
        marginHorizontal: 20,
    },
    avatar: {
        width: 55,
        height: 55,
        borderRadius: 35,
        borderWidth: 2,
        borderColor: '#006AF5',
    },
    containerProfile: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 10,
    },
    text1: {
        fontSize: 15,
        marginLeft: 10,
    },
    tab1: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        height: 50,
        alignItems: 'center',
    },
    view1: {
        alignItems: "center",
        flexDirection: 'row',
        margin: 10,
    },
    iconAddgroup: {
        backgroundColor: "#f0f8ff",
        width: 55,
        height: 55,
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center",
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
    },
    modalView: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: 300,
        backgroundColor: "#dcdcdc",
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    modalText1: {
        padding: 10,
        textAlign: "center",
        fontSize: 18,
        fontWeight: 'bold',
    },
    modalText2: {
        padding: 10,
        textAlign: "center",
        fontSize: 18,
        fontWeight: 'bold',
    },
    modalOverlay: {   
        backgroundColor: 'white',
        height: 1,
    },
    image: {
        marginLeft: 15,
        width: 55,
        height: 55,
        borderRadius: 35,
        borderWidth: 2,  // Độ rộng của khung viền
        borderColor: '#006AF5',  // Màu sắc của khung viền, bạn có thể thay đổi màu tùy ý
    },
    text: {
        marginLeft: 20,
        fontSize: 20,
        flex: 1,
    },
    textName: {
        marginLeft: 10,

    },
    textAdmin: {
        marginLeft: 10,
        color: '#808080',
    }
  
  });
export default Select_Ad