import React, { useState } from 'react';
import {SafeAreaView, Pressable, StyleSheet, Text, View, TextInput, Image, FlatList, TouchableOpacity } from 'react-native';
import { AntDesign, MaterialCommunityIcons, Feather, Ionicons, SimpleLineIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from "@react-navigation/native";
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, onSnapshot, doc, getDoc, getDocs, query , orderBy, where, updateDoc, arrayRemove} from 'firebase/firestore';

const Option_chat = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { RoomID, name, avatar, Admin_group, UID, ChatData_props } = route.params;
  const Admin_group1 = Admin_group ? Admin_group : null;

  const RoomID1 = RoomID;
  const UID1 = UID;
  const ChatData_props1 = ChatData_props;
  const auth = getAuth();
  const user = auth.currentUser;
  const db = getFirestore();

  console.log('chatdata',ChatData_props1)
  console.log('Admin_group',Admin_group, 'UID',UID1)
  console.log('roomID',RoomID1)

const handleLeaveGroup = async () => {
  try {
    if (Admin_group1 === user.uid) {
      // If user is admin, navigate to select admin screen
      navigation.navigate("Select_Ad", { RoomID1 });
    } else {
      // Check if user is in the Sub_Admin array of the Group document
      const groupDocRef = doc(collection(db, 'Group'), RoomID1);
      const groupDocSnapshot = await getDoc(groupDocRef);
      const subAdminArray = groupDocSnapshot.data().Sub_Admin;
      // Check if user.uid is in Sub_Admin array
      if (subAdminArray && subAdminArray.includes(user.uid)) {
        // If user is in Sub_Admin array, remove user's UID from it
        await updateDoc(groupDocRef, {
          Sub_Admin: arrayRemove(user.uid)
        });
      }
      // Remove user's UID from the group document
      await updateDoc(groupDocRef, {
        UID: arrayRemove(user.uid)
      });
      // Remove user's UID from all chat documents where they are present
      const groupChatDocRef = doc(collection(db, 'Chats'), RoomID1);
      const groupChatDocSnapshot = await getDoc(groupChatDocRef);
      const subChatAdminArray = groupChatDocSnapshot.data().Sub_Admin;

      // Check if user.uid is in Sub_Admin array
      if (subChatAdminArray && subChatAdminArray.includes(user.uid)) {
        // If user is in Sub_Admin array, remove user's UID from it
      await updateDoc(groupChatDocRef, {
          Sub_Admin: arrayRemove(user.uid)
      });
      }

      // Remove user's UID from the group document
      await updateDoc(groupChatDocRef, {
      UID: arrayRemove(user.uid)
      });
      // Navigate back after leaving the group
      navigation.navigate("Main");
    }
  } catch (error) {
    console.error("Error leaving group: ", error);
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
            <Text style={styles.textSearch}>Tùy chọn</Text>
          </View>
        </View>  
        <View>
          <View style={styles.containerProfile}>
                <TouchableOpacity >                
                  <Image source={{ uri: avatar }} style={styles.avatar} />
                </TouchableOpacity>
                <View style={{flex:1}}>
                  <Text style={styles.title}>{name}</Text>
                </View>
          </View>
        </View>
        {Admin_group1 ? (
          <View>
            <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
              <TouchableOpacity style={styles.h1}>
                <View>
                  <AntDesign name="search1" size={24} color="black" />
                </View>
                <Text style={{marginTop:5}}>Tìm tin nhắn</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.h1} onPress={()=>navigation.navigate('Add_mem_gr', {ChatData_props1, RoomID1})}>
                <View>
                  <AntDesign name="addusergroup" size={24} color="black" />
                </View>
                <Text style={{marginTop:5}}>Thêm thành viên</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.h1}>
                <View>
                  <Ionicons name="notifications-outline" size={24} color="black" />
                </View>
                <Text style={{marginTop:5}}>Tắt thông báo</Text>
              </TouchableOpacity>
            </View>
            <View style={{backgroundColor:'#dcdcdc', height:5}}></View>
            {Admin_group1 === user.uid && (
              <TouchableOpacity style={{height:60, justifyContent:'center'}} onPress={() => navigation.navigate("Setting_group", {RoomID1, Admin_group1})}>
                <View style={{marginLeft:20, flexDirection:'row'}}>
                  <SimpleLineIcons name="settings" size={30} color="black" />
                  <Text style={{marginLeft:20, fontSize:20}}>Cài đặt nhóm</Text>
                </View>
              </TouchableOpacity>
            )}
            <View style={{backgroundColor:'#dcdcdc', height:5}}></View>
            <View>
              <TouchableOpacity style={{height:60, justifyContent:'center'}} onPress={() => navigation.navigate("Manager_group", {RoomID1, UID1})}>
                <View style={{marginLeft:20, flexDirection:'row'}}>
                  <MaterialCommunityIcons name="account-group" size={30} color="black" />
                  <Text style={{marginLeft:20, fontSize:20, color:'black'}}>Thành viên nhóm</Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={{backgroundColor:'#dcdcdc', height:5}}></View> 
            <TouchableOpacity style={{height:60, justifyContent:'center'}} onPress={handleLeaveGroup}>
              <View style={{marginLeft:20, flexDirection:'row'}}>
                <Feather name="log-out" size={30} color="red" />
                <Text style={{marginLeft:20, fontSize:20, color:'red'}}>Rời nhóm</Text>
              </View>
            </TouchableOpacity>
            <View style={{backgroundColor:'#dcdcdc', height:5}}></View>
          </View>
        ) : (
          <View>
              <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
                <TouchableOpacity style={styles.h1}>
                  <View>
                    <AntDesign name="search1" size={24} color="black" />
                  </View>
                  <Text style={{marginTop:5}}>Tìm tin nhắn</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.h1}>
                  <View>
                    <AntDesign name="user" size={24} color="black" />
                  </View>
                  <Text style={{marginTop:5}}>Trang cá nhân</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.h1}>
                  <View>
                    <Ionicons name="notifications-outline" size={24} color="black" />
                  </View>
                  <Text style={{marginTop:5}}>Tắt thông báo</Text>
                </TouchableOpacity>
            </View>
          </View>
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#006AF5",
    padding: 9,
    height: 48,
    width: '100%',
  },
  searchInput: {   
    flex: 1,
    justifyContent:"center",
    height:48,
    marginLeft: 10,      
  },
  textSearch:{
    color:"white",
    fontWeight:'500'
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
  containerProfile: {
    marginTop: 20,
    flexDirection: 'column',
    alignItems:'center',
    backgroundColor:'white',
    width: '100%',
    height:120,
  },
  title: {
    fontSize: 24,
  },
  avatar: {
    width: 75,
    height: 75,
    borderRadius: 35,
    borderWidth: 2,  // Độ rộng của khung viền
    borderColor: '#006AF5',  // Màu sắc của khung viền, bạn có thể thay đổi màu tùy ý
  },
  h1: {
    margin: 20,
    flexDirection: "column",
    alignItems: "center",
  },

});

export default Option_chat;
