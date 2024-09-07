import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Chat from './src/screens/Chat';
import StackNavigator from './src/navigation/StackNavigator';
import Bottomtab from './src/navigation/Bottomtab';
import { ChatsProvider } from './src/contextApi/ChatContext';

export default function App() {
  return (
    <ChatsProvider>
      <StackNavigator/>
    </ChatsProvider>
    
  );
}