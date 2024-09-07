import React, { useState } from 'react';
import {SafeAreaView, Pressable, StyleSheet, Text, View, TextInput, Image, FlatList, TouchableOpacity } from 'react-native';
import { AntDesign, MaterialCommunityIcons, Feather, Ionicons, SimpleLineIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from "@react-navigation/native";
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, onSnapshot, doc, getDoc, getDocs, query , orderBy, where, updateDoc, deleteDoc} from 'firebase/firestore';

const Setting_group = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { RoomID1 } = route.params;
  const {Admin_group1} = route.params;
  const db = getFirestore();
  const auth = getAuth();
  const user = auth.currentUser;
  const [userData, setUserData] = useState(null);
  const RoomID = RoomID1;

  const dissolveGroup = async () => {
    try {
      // giải tán nhóm và xóa tất cả các tin nhắn trong nhóm
      const groupDocRef = doc(db, 'Group', RoomID);
      await deleteDoc(groupDocRef);
      const chatDocRef = doc(db, 'Chats', RoomID);
      await deleteDoc(chatDocRef);
      console.log("Giai tan nhom thanh cong")
      navigation.navigate("Main");
    } catch (error) {
      console.error("Error dissolving group:", error);
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
        <View style={{backgroundColor:'#dcdcdc', height:5}}></View>
          <TouchableOpacity style={{height:60, justifyContent:'center'}} onPress={dissolveGroup}>
            <View style={{marginLeft:20, flexDirection:'row'}}>
              <Text style={{marginLeft:20, fontSize:20, color:'red'}}>Giải tán nhóm</Text>
            </View>
          </TouchableOpacity>
        <View style={{backgroundColor:'#dcdcdc', height:5}}></View>
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

export default Setting_group;
