import React, { useState } from 'react';
import {SafeAreaView, Pressable, StyleSheet, Text, View, TextInput, Image, FlatList } from 'react-native';
import { AntDesign, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import Friend_received from './Friend_received';
import Friend_sent from './Friend_sent';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const FriendRequest = () => {
  const navigation = useNavigation();
  const Tab = createMaterialTopTabNavigator();
  
  return (
    <View style={styles.container}>
      <SafeAreaView>
        <View style={styles.searchContainer}>
          <Pressable onPress={() => navigation.navigate("Main")}>
            <AntDesign name="arrowleft" size={20} color="white" />
          </Pressable>
          <Text style={styles.textSearch}>Lời mời kết bạn</Text>
          <MaterialIcons name="settings" size={24} color="white" />
        </View>
        <Tab.Navigator>
            <Tab.Screen name="Đã Nhận" component={Friend_received} />
            <Tab.Screen name="Đã gửi" component={Friend_sent} />
        </Tab.Navigator>
      </SafeAreaView>
    </View>
  );
}

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
    flex:1,
    color:"white",
    fontWeight:'500',
    marginLeft:20
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
});

export default FriendRequest;
