import React, { useState } from 'react';
import {SafeAreaView, Pressable, StyleSheet, Text, View, TextInput, Image, FlatList, TouchableOpacity, Alert } from 'react-native';
import { AntDesign, MaterialCommunityIcons, Feather, Ionicons, SimpleLineIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from "@react-navigation/native";
import { getAuth, signOut } from "firebase/auth";

const Setting_app = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const auth = getAuth();
    const onHandleLogout = () => {
        signOut(auth)
          .then(() => {
            Alert.alert(
              'Bạn đã đăng xuất thành công!',         
            );
          })
          .catch((err) => Alert.alert("Logout error", err.message));
      };

return (
    <View style={styles.container}>
        <SafeAreaView>      
            <View style={styles.searchContainer}>
                <Pressable onPress={() => navigation.goBack()}>
                    <AntDesign name="arrowleft" size={20} color="white" />
                </Pressable>
                <View style={styles.searchInput}>
                    <Text style={styles.textSearch}>Cài đặt</Text>
                </View>
        </View>  
        <View style={{backgroundColor:'#dcdcdc', height:2}}></View>
          <TouchableOpacity style={{height:60, justifyContent:'center'}} onPress={onHandleLogout}>
            <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center',margin:5, backgroundColor:'#dcdcdc',height:40,borderRadius:15}}>
              <Feather name="log-out" size={24} color="black" />
              <Text style={{marginLeft:5, fontSize:20, color:'black'}}>Đăng xuất</Text>
            </View>
          </TouchableOpacity>
        <View style={{backgroundColor:'#dcdcdc', height:2}}></View>
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

export default Setting_app;
