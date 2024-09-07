import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, SafeAreaView, Pressable, ImageBackground, TouchableOpacity, Image } from 'react-native'
import { useNavigation, useRoute } from "@react-navigation/native";
import { getAuth, signOut } from "firebase/auth";
import * as ImagePicker from 'expo-image-picker';
import { AntDesign, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { getFirestore, doc, setDoc, getDoc, onSnapshot } from "firebase/firestore";
const Personal_page = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const [displayName, setDisplayName] = useState('');
    const [photoURL, setPhotoURL] = useState(null);
    const [gender, setGender] = useState('');
    const [birthdate, setBirthdate] = useState('');
    const [email, setEmail] = useState('');
    const auth = getAuth();
    const user = auth.currentUser;
    const [userData, setUserData] = useState(null);
    const db = getFirestore();
    const { PersonalData } = route.params;
    const PersonalData2 = PersonalData;

    console.log("thong tin ca nhan",PersonalData)
    
    useEffect(() => {
      const userDocRef = doc(db, 'users', user.uid);
      const unsubscribe = onSnapshot(userDocRef, (doc) => {
        if (doc.exists()) {
          const userData = doc.data();
          console.log('User data:', userData);
          setUserData(userData);
          setDisplayName(userData.name);
          setPhotoURL(userData.photoURL);
          setBirthdate(userData.birthdate);
          setEmail(userData.email);
          setGender(userData.gender);
        } else {
          console.log('User not found');
        }
      });
    
      return () => {
        unsubscribe();
      };
    }, [db, user]);

  // Cập nhật ảnh đại diện
  const handleUpdatePhoto = async () => {
    try {
      // Chọn ảnh mới từ thư viện ảnh trên thiết bị
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
        console.log(result);
      if (!result.cancelled) {
        // Nếu người dùng chọn ảnh, tiến hành cập nhật
        const Ure = result.assets[0].uri
        console.log("URI before fetch:", Ure);
        // Xóa ảnh hiện tại trên Firebase Storage và cập nhật URL ảnh mới
        await deletePreviousPhoto(auth.currentUser.uid);    
        // Tải ảnh mới lên Firebase Storage và cập nhật URL ảnh mới
        const newPhotoURL = await uploadImageAsync(Ure, auth.currentUser.uid);
        if (newPhotoURL) {
          // Cập nhật URL ảnh mới vào Firestore chỉ khi có giá trị hợp lệ
          await updatePhotoURL(newPhotoURL, auth.currentUser.uid);
          // Cập nhật trạng thái hiển thị của ảnh trên ứng dụng
          setPhotoURL(newPhotoURL);
        } else {
          // Xử lý khi không có URL ảnh mới
          console.log("No valid URL for the new photo.");
        }
      }
    } catch  {
      console.log("không thể cập nhật ảnh");
    }
  };
  
  // xóa ảnh đã setup trước đó
  const deletePreviousPhoto = async (userId) => {
    try {
      // Lấy URL ảnh hiện tại từ Firestore
      const userRef = doc(db, 'users', userId);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        const userData = docSnap.data();
        const currentPhotoURL = userData.photoURL;
        // Nếu có URL ảnh hiện tại, xóa ảnh đó trên Firebase Storage
        if (currentPhotoURL) {
          const storage = getStorage();
          const photoRef = ref(storage, currentPhotoURL);
          await deleteObject(photoRef);
          // Xóa URL ảnh trong tài liệu của người dùng trong Firestore
          await setDoc(userRef, { photoURL: null }, { merge: true });
        }
      }
    } catch (error) {
      console.log("Error deleting previous photo: ", error);
    }
  };
  
  // Method tải ảnh lên storage
  const uploadImageAsync = async (ure, userId) => {
    try {
      if (!ure) {
        throw new Error("URI của hình ảnh không xác định hoặc là null");
      }
      const storage = getStorage();
      const filename = `photos/${userId}/${Date.now()}`;
      // Lấy dữ liệu hình ảnh
      const response = await fetch(ure);
      if (!response.ok) {
        throw new Error("Không thể lấy dữ liệu hình ảnh");
      }
      // Chuyển đổi dữ liệu hình ảnh thành blob
      const blob = await response.blob();
      // Tải blob lên Firebase Storage
      const photoRef = ref(storage, filename);
      await uploadBytes(photoRef, blob);
      // Lấy URL của hình ảnh đã tải lên
      const downloadURL = await getDownloadURL(photoRef);
      return downloadURL;
    } catch (error) {
      console.error("Lỗi khi tải lên hình ảnh: ", error);
      throw error; // Ném lỗi ra ngoài
    }
  };
  
// Method cập nhật đường dẫn ảnh mới vào firestore
const updatePhotoURL = async (newURL, userId) => {
  try {
    // Cập nhật URL ảnh mới vào Firestore
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, { photoURL: newURL }, { merge: true });
  } catch {
    console.log("chưa chọn ảnh mới");
  }
};

    
    return (
    <View style={styles.container}>
        <SafeAreaView>
            <View style={styles.PersonalContainer}>
                <ImageBackground source={require('../../assets/img/per1.png')} style={styles.background}>
                    <Pressable onPress={() => navigation.goBack()} style={{margin:20}}>
                        <AntDesign name="arrowleft" size={20} color="white" />
                    </Pressable>
                    <View style={styles.containerProfile}>
                        <TouchableOpacity onPress={handleUpdatePhoto}>
                            {photoURL ? (
                                <Image source={{ uri: photoURL }} style={styles.avatar} />
                            ) : (
                                <View style={styles.avatarPlaceholder}>
                                <Text style={styles.avatarPlaceholderText}>Tap to add photo</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                            <View style={{flex:1}}>
                                <Text style={styles.title}>{displayName}</Text>
                            </View>
                    </View>
                </ImageBackground>
            </View> 
            <View>
                <View style={{margin:20}}>
                    <Text style={{fontWeight:"bold"}}>Thông tin cá nhân</Text>
                </View>
                <View style={{flexDirection:"row", marginLeft:20, marginBottom:20}}>
                    <View style={{width:120}}>
                        <Text>Giới tính</Text>
                    </View>
                    <Text>{gender}</Text>
                </View>
                <View style={{flexDirection:"row", marginLeft:20, marginBottom:20}}>
                    <View style={{width:120}}>
                        <Text>Ngày sinh</Text>
                    </View>
                    <Text>{birthdate}</Text>
                </View>
                <View style={{flexDirection:"row", marginLeft:20, marginBottom:20}}>
                    <View style={{width:120}}>
                        <Text>Email</Text>
                    </View>
                    <Text>{email}</Text>
                </View>
            </View>
            <View style={{margin:20}}>
                <TouchableOpacity onPress={()=> navigation.navigate("Edit_in4Personal", {PersonalData2})}>
                    <View style={{justifyContent:'center',alignItems:'center', backgroundColor:"#a9a9a9", height:50, borderRadius:20}}>
                        <Text style={{fontWeight:'bold'}}>Chỉnh sửa</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    </View>
    )}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    PersonalContainer: {
        height: 200,
        width: '100%',
    },
    background: {
        flex: 1,
        resizeMode: 'cover', // hoặc 'contain' tùy thuộc vào yêu cầu của bạn
    },
    containerProfile: {
        marginTop:20,
        flexDirection: 'row',
        alignItems:'center',
        width: '100%',
        height:90,
    }, 
    avatar: {
        marginLeft: 15,
        width: 75,
        height: 75,
        borderRadius: 35,
        borderWidth: 2,  // Độ rộng của khung viền
        borderColor: 'white',  // Màu sắc của khung viền, bạn có thể thay đổi màu tùy ý
    },
    avatarPlaceholder: {
        marginLeft: 15,
        backgroundColor: "#E1E2E6",
        width: 75,
        height: 75,
        borderRadius: 35,
        justifyContent: "center",
        alignItems: "center",
    },
    avatarPlaceholderText: {
        fontSize: 8,
        color: "#8E8E93",
    },  
    title: {
        fontSize: 24,
        marginLeft: 10,
        color: 'white'
    },
});
export default Personal_page