import React, { useState } from 'react';
import {SafeAreaView, Pressable, StyleSheet, Text, View, TextInput, Image, FlatList } from 'react-native';
import { AntDesign, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import dataApp from "../../data/Nameapp.js";
import { useNavigation } from "@react-navigation/native";
import Friends from '../screens/Friends';
import Groups from '../screens/Groups';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const Phonebook = () => {
  const navigation = useNavigation();
  const [input, setInput] = useState("");
  const TabTop = createMaterialTopTabNavigator();

  return (
    <View style={styles.container}>
      <SafeAreaView>
            
        <View style={styles.searchContainer}>
          <Pressable >
          <AntDesign name="search1" size={20} color="white" />
          </Pressable>
          <Pressable style={styles.searchInput} onPress={() => navigation.navigate("SearchFriend")}>
          <Text style={styles.textSearch}>Tìm kiếm</Text>
          </Pressable>
          <MaterialCommunityIcons name="qrcode-scan" size={24} color="white" />
          <Feather name="plus" size={30} color="white" />
        </View>     
        <TabTop.Navigator>
          <TabTop.Screen name="Bạn bè" component={Friends} />
          <TabTop.Screen name="Nhóm" component={Groups} />
        </TabTop.Navigator>
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
});

export default Phonebook;
