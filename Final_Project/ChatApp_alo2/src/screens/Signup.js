import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, StatusBar, Alert, Modal, Pressable } from "react-native";
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { auth } from '../../config/firebase';
import { MaterialIcons } from '@expo/vector-icons'; 
import { Picker } from '@react-native-picker/picker';
import emailjs from 'emailjs-com';

export default function Signup({ navigation, setIsLoggedIn }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [gender, setGender] = useState('Nam');
  const [day, setDay] = useState('1');
  const [month, setMonth] = useState('1');
  const [year, setYear] = useState('2000');
  const [photoURL, setPhotoURL] = useState('');
  const [enteredOTP, setEnteredOTP] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpModal, setShowOtpModal] = useState(false);
  const db = getFirestore();

  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  const years = Array.from({ length: 120 }, (_, i) => (2024 - i).toString());

  const validateEmail = (email) => {
    // Regular expression to validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isPasswordValid = () => {
    if (password !== confirmPassword) {
      Alert.alert("Signup error", "Mật khẩu xác nhận không khớp");
      return false;
    }
    return true;
  };

  const generateOTP = () => {
    const digits = '0123456789';
    let otp = '';
    for (let i = 0; i < 6; i++) {
      otp += digits[Math.floor(Math.random() * 10)];
    }
    return otp;
  };
  
  const sendEmail = (otp) => {
    const serviceId = 'service_d8kpz2c'; // Thay thế bằng ID của dịch vụ bạn đã tạo trên EmailJS
    const templateId = 'template_20y2nax'; // Thay thế bằng ID của template email bạn đã tạo trên EmailJS
    const templateParams = {
      to_name: email,
      from_name: 'alochat',
      message: otp,
    };
    const publicKey = 'yhWCN85GSYnTtPHD4'; // Thay thế bằng khóa công khai của bạn từ EmailJS
    const privateKey = 'pOGHaWmRpJBFi-lynvTFp'; // Thay thế bằng khóa riêng tư của bạn từ EmailJS
    emailjs.send(serviceId, templateId, templateParams, publicKey, privateKey)
      .then((response) => {
        console.log('Gửi email thành công:', response);
      })
      .catch((error) => {
        console.error('Gửi email thất bại:', error);
      });
  };
  

  const onHandleSignup = () => {
    if (email.trim() === "" && password.trim() === "" && confirmPassword.trim() === "" && name.trim() === "") {
      Alert.alert("Thông tin không được để trống");
    }else if (email.trim() === "") {
      Alert.alert("Email không được để trống"); 
    }else if (!validateEmail(email)) {
      Alert.alert("Email không đúng định dạng");  
    }else if (password.trim() === "") {
      Alert.alert("Mật khẩu không được để trống")
    }else if (confirmPassword.trim() === ""){
      Alert.alert("Mật khẩu xác nhận không được để trống")
    }else if(name.trim() === ""){
      Alert.alert("Tên không được để trống")
    }else if (password.trim() === "") {
      Alert.alert("Mật khẩu không được để trống");
    }else if (password.length < 6) {
      Alert.alert("Mật khẩu phải có ít nhất 6 kí tự");
    }else if (!/\d/.test(password) || !/[a-zA-Z]/.test(password)) {
      Alert.alert("Mật khẩu phải chứa ít nhất 1 chữ số và 1 chữ cái");
    }else{
      if (!isPasswordValid()) {
        return;
      }
      const generatedOTP = generateOTP(); // Tạo mã OTP
      setOtp(generatedOTP); // Lưu mã OTP vào state
      setShowOtpModal(true);
      const tempPhotoURL = gender === 'Nam' ? 'https://firebasestorage.googleapis.com/v0/b/demo1-14597.appspot.com/o/avatar%2Favatar_male.png?alt=media&token=c800b68c-1e1c-4660-b8a0-4dd8563cf74a' : 'https://firebasestorage.googleapis.com/v0/b/demo1-14597.appspot.com/o/avatar%2Favatar_fmale.png?alt=media&token=2301ca57-cf3d-49c2-b7bc-1bf472513dff';
      setPhotoURL(tempPhotoURL);
      sendEmail(generatedOTP); // Gửi email với mã OTP
    } 
  };
  

  const verifyOTP = () => {
    if (otp === enteredOTP) { // So sánh OTP nhập vào với OTP đã được lưu
      // Mã OTP hợp lệ
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          updateProfile(userCredential.user, {
            displayName: name
          }).then(() => {
            setDoc(doc(db, "users", userCredential.user.uid), {
              name: name,
              UID: userCredential.user.uid,
              email: email,
              gender: gender,
              birthdate: `${day}/${month}/${year}`,
              photoURL:photoURL
            }).then(() => {
              setIsLoggedIn(true);
              Alert.alert(
                'Đăng ký thành công',
                'Bạn đã đăng kí thành công!',
                [{ text: 'OK' }]
              );
            }).catch((error) => {
              console.log("Error adding document: ", error);
            });
          }).catch((error) => {
            console.log("Update profile error: ", error);
          });
  
        })
        .catch((err) => Alert.alert("Signup error", err.message));
    } else {
      // Mã OTP không hợp lệ
      Alert.alert("OTP incorrect", "Mã OTP không đúng. Vui lòng thử lại.");
    }
  
    setShowOtpModal(false);
  };
  
  

  return (
    <View style={styles.container}>
      <View style={styles.whiteSheet} />
      <View style={styles.form}>
        <Text style={styles.title}>Đăng Ký</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          textContentType="emailAddress"
          autoFocus={true}
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <View style={[styles.input, styles.passwordInputContainer]}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Mật khẩu"
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry={!showPassword}
            textContentType="password"
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
          <TouchableOpacity style={styles.passwordToggle} onPress={() => setShowPassword(!showPassword)}>
            <MaterialIcons name={showPassword ? 'visibility' : 'visibility-off'} size={24} color="gray" />
          </TouchableOpacity>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Xác nhận mật khẩu"
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry={!showPassword}
          textContentType="password"
          value={confirmPassword}
          onChangeText={(text) => setConfirmPassword(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Tên"
          autoCapitalize="words"
          value={name}
          onChangeText={(text) => setName(text)}
        />
        <View>
          <Text style={styles.radioLabel}>Ngày sinh</Text>
          <View style={styles.datePickerContainer}>
            <Picker
              style={styles.datePicker}
              selectedValue={day}
              onValueChange={(itemValue, itemIndex) => setDay(itemValue)}
            >
              {days.map((day) => (
                <Picker.Item label={day} value={day} key={day} />
              ))}
            </Picker>
            <Picker
              style={styles.datePicker}
              selectedValue={month}
              onValueChange={(itemValue, itemIndex) => setMonth(itemValue)}
            >
              {months.map((month) => (
                <Picker.Item label={month} value={month} key={month} />
              ))}
            </Picker>
            <Picker
              style={styles.datePicker}
              selectedValue={year}
              onValueChange={(itemValue, itemIndex) => setYear(itemValue)}
            >
              {years.map((year) => (
                <Picker.Item label={year} value={year} key={year} />
              ))}
            </Picker>
          </View>
        </View>  
        <View style={styles.radioContainer}>
          <Text style={styles.radioLabel}>Giới tính</Text>
          <View style={styles.radioOptions}>
            <TouchableOpacity
              style={[styles.radioButtonMale, gender === 'Nam' && styles.selectedRadioButton]}
              onPress={() => setGender('Nam')}
            >
              <Text style={styles.radioText}>Nam</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.radioButtonFMale, gender === 'Nữ' && styles.selectedRadioButton]}
              onPress={() => setGender('Nữ')}
            >
              <Text style={styles.radioText}>Nữ</Text>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity style={styles.button} onPress={onHandleSignup}>
          <Text style={{ fontWeight: 'bold', color: '#fff', fontSize: 18 }}>Đăng Ký</Text>
        </TouchableOpacity>
        <View style={{ marginTop: 20, flexDirection: 'row', alignItems: 'center', alignSelf: 'center' }}>
          <Text style={{ color: 'gray', fontWeight: '600', fontSize: 14 }}>Bạn đã có tài khoản? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={{ color: '#006AF5', fontWeight: '600', fontSize: 14 }}>Đăng nhập</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showOtpModal}
        onRequestClose={() => setShowOtpModal(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Nhập mã OTP</Text>
            <TextInput
              style={styles.input}
              placeholder="Mã OTP"
              keyboardType="numeric"
              value={enteredOTP}
              onChangeText={(text) => setEnteredOTP(text)}
            />
            <Pressable
              style={[styles.button, styles.modalButton]}
              onPress={verifyOTP}
            >
              <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>Xác nhận</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <StatusBar barStyle="light-content" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: "#006AF5",
    paddingBottom: 24,
  },
  input: {
    backgroundColor: "#F6F7FB",
    height: 58,
    marginBottom: 20,
    fontSize: 16,
    borderRadius: 10,
    padding: 12,
  },
  whiteSheet: {
    width: '100%',
    height: '75%',
    position: "absolute",
    bottom: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 60,
  },
  form: {
    flex: 1,
    marginTop: 50,
    marginHorizontal: 30,
  },
  button: {
    backgroundColor: '#006AF5',
    height: 58,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordInput: {
    fontSize:16,
    flex: 1,
  },
  passwordToggle: {
    position: 'absolute',
    right: 12,
  },
  radioContainer: {
    marginTop: 20,
  },
  radioLabel: {
    fontSize: 16,
    marginBottom: 10,
  },
  radioOptions: {
    flexDirection: 'row',
  },
  radioButtonMale: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'gray',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginRight: 5,
  },
  radioButtonFMale: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'gray',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginLeft: 5,
  },
  selectedRadioButton: {
    backgroundColor: '#006AF5',
    borderColor: '#006AF5',
  },
  radioText: {
    color: 'black',
  },
  datePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  datePicker: {
    flex: 1,
    height: 58,
    backgroundColor: "#F6F7FB",
    borderRadius: 10,
    marginRight: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalButton: {
    backgroundColor: '#006AF5',
    marginTop: 20,
    width: '100%',
    height: 58,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});