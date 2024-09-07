import React, { useState, useEffect } from 'react';
import { SafeAreaView, Pressable, StyleSheet, Text, View, TextInput, Image, FlatList } from 'react-native';
import { AntDesign, MaterialCommunityIcons, Feather, MaterialIcons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, onSnapshot, doc, getDoc, getDocs, query , orderBy, where, updateDoc} from 'firebase/firestore';

const Groups = () => {
    const navigation = useNavigation();
    const db = getFirestore();
    const auth = getAuth();
    const user = auth.currentUser;
    const [userData, setUserData] = useState(null);
    const [userGroups, setUserGroups] = useState([]);

    console.log(userGroups)

 // Fetch user data
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

// Fetch user groups data
useEffect(() => {
    const fetchUserGroups = async () => {
      try {
        if (!user) return;

        const chatsCollectionRef = collection(db, 'Group');
        const userGroupsQuery = query(chatsCollectionRef, where('UID', 'array-contains', user.uid));

        // Lắng nghe sự thay đổi của truy vấn
        const unsubscribe = onSnapshot(userGroupsQuery, (querySnapshot) => {
          const userGroupsData = querySnapshot.docs.map(doc => doc.data());
          // Sort the user groups alphabetically by group name
          userGroupsData.sort((a, b) => a.Name_group.localeCompare(b.Name_group));
          setUserGroups(userGroupsData);
        });

        return () => {
          // Hủy lắng nghe khi component bị unmount
          unsubscribe();
        };
      } catch (error) {
        console.error('Error fetching user groups:', error);
      }
    };

    fetchUserGroups();

}, [db, user]);



  const renderItem = ({ item }) => (
    <View style={styles.itemContainer2}>
        <Pressable onPress={() => navigation.navigate("Chat_fr", {GroupData:item})}>
        <View style={styles.containerProfile}>
            <Image source={{ uri: item.Photo_group }} style={styles.avatar} />
            <Text style={styles.text1}>{item.Name_group}</Text>
        </View>
        </Pressable>
    </View>
  );

  return (
    <View style={styles.container}>
            <SafeAreaView>
                <View>
                    <Pressable onPress={() => navigation.navigate("Add_group")}>
                        <View style={styles.view1}>
                            <View style={styles.iconAddgroup}>
                            <MaterialIcons name="group-add" size={24} color="#006AF5" />
                            </View>
                            <Text style={styles.text1}>Tạo nhóm mới</Text>
                        </View>
                    </Pressable>
                    
                </View>
                <View style={{backgroundColor:'#dcdcdc', height:2}}></View>
                <View style={{marginBottom:220}}>
                  <FlatList
                      data={userGroups}
                      renderItem={renderItem}
                      keyExtractor={item => item.ID_roomChat.toString()} // Assuming ID_roomChat is unique
                  />
                </View>
            </SafeAreaView>
        </View>
  )
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
      marginTop: 20,
      flex: 1,
      margin: 20,
  },
  image: {
      width: 100,
      height: 100,
      resizeMode: 'cover',
  },
  text: {
      marginTop: 10,
  },
  view1: {
      alignItems: "center",
      flexDirection: 'row',
      margin: 10,
  },
  text1: {
      fontSize: 15,
      justifyContent: "center",
      marginLeft: 10
  },
  iconAddgroup: {
      backgroundColor: "#f0f8ff",
      width: 55,
      height: 55,
      borderRadius: 25,
      justifyContent: "center",
      alignItems: "center",
  },
  itemContainer2: {
    marginTop: 5,
    flex: 1,
    margin: 5,
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
});

export default Groups