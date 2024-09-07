import React, { useState, useEffect } from 'react';
import { SafeAreaView, Pressable, StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useNavigation, useRoute } from "@react-navigation/native";
import { getAuth, updateProfile } from 'firebase/auth';
import { getFirestore, onSnapshot, doc, updateDoc} from 'firebase/firestore';
import { RadioButton } from 'react-native-paper';
import moment from 'moment';

const Edit_in4Personal = () => {
  const navigation = useNavigation();
  const db = getFirestore();
  const auth = getAuth();
  const user = auth.currentUser;
  const [userData, setUserData] = useState(null);
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [birthdate, setBirthdate] = useState(moment("01/01/2000", 'DD/MM/YYYY').toDate()); // Chuyển đổi ngày sang đối tượng Date
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);

  useEffect(() => {
    const userDocRef = doc(db, 'users', user.uid);
    const unsubscribe = onSnapshot(userDocRef, (doc) => {
      if (doc.exists()) {
        const userData = doc.data();
        console.log('User data:', userData.name);
        setUserData(userData);
        setName(userData.name);
        setBirthdate(moment(userData.birthdate, 'DD/MM/YYYY').toDate());
        setGender(userData.gender);
      } else {
        console.log('User not found');
      }
    });
    return () => {
      unsubscribe();
    };
  }, [db, user]);

  console.log('userDat222a:', userData);

  const handleConfirm = (selectedDate) => {
    setBirthdate(selectedDate);
    hideDatePicker();
    // Thực hiện các thao tác cần thiết khi người dùng lưu ngày sinh
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const name_default = userData?.name;
  const gender_default = userData?.gender;
  const birthdate_default = userData?.birthdate;
  const [isDataChanged, setDataChanged] = useState(false);

  useEffect(() => {
    // Kiểm tra xem liệu dữ liệu có thay đổi không
    const dataChanged = name !== name_default || gender !== gender_default || moment(birthdate).format('DD/MM/YYYY') !== birthdate_default;
    setDataChanged(dataChanged);
  }, [name, gender, birthdate]);

  const saveChanges = async () => {
    try {
      // Kiểm tra tên không được để trống
      if (name.trim() === '') {
        Alert.alert('Tên không được để trống!');
        return;
      } else {
        
      }
      // Cập nhật thông tin trong Firestore
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        name: name,
        gender: gender,
        birthdate: moment(birthdate).format('DD/MM/YYYY')
      });
      // Cập nhật thông tin trong Firebase Authentication
      await updateProfile(auth.currentUser, {
        displayName: name
      });
      // Thông báo cập nhật thành công hoặc chuyển hướng đến màn hình khác
      console.log('Cập nhật thông tin thành công!');
    } catch (error) {
      console.error('Error updating profile:', error);
      // Xử lý lỗi, hiển thị thông báo cho người dùng hoặc thực hiện các thao tác phù hợp
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
            <Text style={styles.textSearch}>Chỉnh sửa thông tin</Text>
          </View>
        </View>  
        <View>
            <View style={{margin:20}}>
                <Text style={{fontWeight:"bold"}}>Thông tin cá nhân</Text>
            </View>
            <View style={{flexDirection:"row", marginLeft:20, marginBottom:20}}>
                <View style={{width:120}}>
                    <Text>Tên</Text>
                </View>
                <TextInput
                    style={{flex:1}}
                    value={name}
                    onChangeText={(text) => {
                      setName(text);
                      setIsEmpty(text.trim() === '');
                    }}
                />
                {isEmpty && (
                    <View style={{ marginRight: 40 }}>
                      <MaterialIcons name="error" size={24} color="red" />
                    </View>
                )}
            </View>
            <View style={{flexDirection:"row", marginLeft:20, marginBottom:20}}>
                <View style={{width:120}}>
                    <Text>Giới tính</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', flex:1 }}>
                <TouchableOpacity onPress={() => setGender('Nam')} style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <RadioButton.Android status={gender === 'Nam' ? 'checked' : 'unchecked'} onPress={() => setGender('Nam')} color="#006AF5"/>
                    <Text>Nam</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setGender('Nữ')} style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 20 }}>
                    <RadioButton.Android status={gender === 'Nữ' ? 'checked' : 'unchecked'} onPress={() => setGender('Nữ')} color="#006AF5"/>
                    <Text>Nữ</Text>
                </TouchableOpacity>
                </View>
            </View>
            <View style={{flexDirection:"row", marginLeft:20, marginBottom:20}}>
                <View style={{width:120}}>
                    <Text>Ngày sinh</Text>
                </View>
                <TouchableOpacity onPress={showDatePicker} style={{flex:1}}>
                  <Text >{moment(birthdate).format('DD/MM/YYYY')}</Text>
                </TouchableOpacity>
            </View>
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              date={birthdate}
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
            />
        </View>
        <View style={{ margin: 20 }}>
          {isDataChanged && (
            <TouchableOpacity onPress={saveChanges}>
              <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: "#006AF5", height: 50, borderRadius: 20 }}>
                <Text style={{ fontWeight: 'bold', color: 'white' }}>Lưu</Text>
              </View>
            </TouchableOpacity>
          )}
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

export default Edit_in4Personal;
