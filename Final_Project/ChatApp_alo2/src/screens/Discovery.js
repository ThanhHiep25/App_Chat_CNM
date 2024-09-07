import React, { useState } from 'react';
import {SafeAreaView, Pressable, StyleSheet, Text, View, TextInput, Image, FlatList } from 'react-native';
import { AntDesign, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import dataApp from "../../data/Nameapp.js";
import { useNavigation } from "@react-navigation/native";

const Discovery = () => {
  const navigation = useNavigation();
  const [input, setInput] = useState("");
  const handleInputChange = (text) => {
    setInput(text);
  };

  const [state, SetState] = useState(dataApp);
  
  const truncateName = (name, maxLength) => {
    if (name.length > maxLength) {
      return name.substring(0, maxLength) + '...';
    } else {
      return name;
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Pressable>
        <Image style={styles.image} source={item.img} />
        <Text style={styles.text}>{truncateName(item.name, 9)}</Text>
      </Pressable>
    </View>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView>
            
        <View style={styles.searchContainer}>
          <AntDesign name="search1" size={20} color="white" />
          <Pressable style={styles.searchInput} onPress={() => navigation.navigate("SearchFriend")}>
          <Text style={styles.textSearch}>Tìm kiếm</Text>
          </Pressable>
          <MaterialCommunityIcons name="qrcode-scan" size={24} color="white" />
          <Feather name="plus" size={30} color="white" />
        </View>
      
      <View>
      <FlatList
        data={state}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={3}
        // contentContainerStyle={{ flexGrow: 1 }}
      />
      </View>
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

export default Discovery;
