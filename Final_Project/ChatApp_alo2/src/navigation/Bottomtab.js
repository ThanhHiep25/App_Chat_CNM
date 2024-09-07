import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Chat from '../screens/Chat'
import Diary from '../screens/TimeLine'
import Explore from '../screens/Discovery'
import Phonebook from '../screens/Phonebook'
import Profile from '../screens/Profile'    
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
const Tab = createBottomTabNavigator();
const Bottomtab = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator id="RootNavigator">
        <Tab.Screen name="Tin nhắn" component={Chat} />
        <Tab.Screen name="Danh bạ" component={Phonebook} />
        <Tab.Screen name="Khám phá" component={Explore} />
        <Tab.Screen name="Nhật kí" component={Diary} />
        <Tab.Screen name="Cá nhân" component={Profile} />
      </Tab.Navigator>
    </NavigationContainer>
  )
}

export default Bottomtab