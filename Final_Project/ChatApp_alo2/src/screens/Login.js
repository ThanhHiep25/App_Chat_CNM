import React, { useState } from "react";
import { StyleSheet, Text, View, Button, TextInput, Image, SafeAreaView, TouchableOpacity, StatusBar, Alert, Modal } from "react-native";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth"; // Update import statement
import { auth } from "../../config/firebase";
import { MaterialIcons } from '@expo/vector-icons';

export default function Login({ navigation, setIsLoggedIn}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showModal, setShowModal] = useState(false); // State để kiểm soát việc hiển thị modal
  const [showPassword, setShowPassword] = useState(false);
  const validateEmail = (email) => {
    // Regular expression to validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  const onHandleLogin = () => {
    if (email.trim() === "" && password.trim() === "") {
      Alert.alert("Email hoặc mật khẩu không được để trống");
    } else if (email.trim() === "") {
      Alert.alert("Email không được để trống");
    } else if (!validateEmail(email)) {
      Alert.alert("Email không đúng định dạng");
    }else if (password.trim() === "") {
      Alert.alert("Mật khẩu không được để trống");
    }else if (password.length < 6) {
      Alert.alert("Mật khẩu phải có ít nhất 6 kí tự");
    }else if (!/\d/.test(password) || !/[a-zA-Z]/.test(password)) {
      Alert.alert("Mật khẩu phải chứa ít nhất 1 chữ số và 1 chữ cái");
    } else {
      signInWithEmailAndPassword(auth, email, password)
        .then(() => {
          setIsLoggedIn(true);
          // Alert.alert(
          //   'Đăng nhập thành công',
          //   'Bạn đã đăng nhập thành công!',         
          // );
        })
        .catch((err) => Alert.alert("Đăng nhập không thành công", "Mật khẩu hoặc Tài khoản không đúng"));
    }
  };
  
  const onHandleForgotPassword = () => {
    setShowModal(true); // Mở modal khi người dùng nhấn vào "Quên mật khẩu"
  };

  const onCloseModal = () => {
    setShowModal(false); // Đóng modal
  };

  const sendResetEmail = () => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        Alert.alert(
          'Email sent',
          'We have sent you an email to reset your password. Please check your inbox.',
        );
        onCloseModal();
      })
      .catch((error) => {
        Alert.alert(
          'Error',
          error.message,
        );
      });
  };
  

  return (
    <View style={styles.container}>
      <View style={styles.whiteSheet} />
      <SafeAreaView style={styles.form}>
        <Text style={styles.title}>Đăng nhập</Text>
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
        <TouchableOpacity style={styles.button} onPress={onHandleLogin}>
          <Text style={{fontWeight: 'bold', color: '#fff', fontSize: 18}}>Đăng nhập</Text>
        </TouchableOpacity>
        <View style={{marginTop: 20, flexDirection: 'row', alignItems: 'center', alignSelf: 'center'}}>
          <Text style={{color: 'gray', fontWeight: '600', fontSize: 14}}>Bạn chưa có tài khoản? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
            <Text style={{color: '#006AF5', fontWeight: '600', fontSize: 14}}> Đăng ký </Text>
          </TouchableOpacity></View>
        <View style={{marginTop: 20, flexDirection: 'row', alignItems: 'center', alignSelf: 'center'}}>
          <TouchableOpacity onPress={onHandleForgotPassword}> 
            <Text style={{color: '#006AF5', fontWeight: '600', fontSize: 14}}>Quên mật khẩu</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      <StatusBar barStyle="light-content" />
      {/* Modal */}
      <Modal visible={showModal} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nhập Email</Text>
            <TextInput
              style={styles.input1}
              placeholder="Email"
              autoCapitalize="none"
              keyboardType="email-address"
              textContentType="emailAddress"
              value={email}
              onChangeText={(text) => setEmail(text)}
            />
            <TouchableOpacity style={styles.button2} onPress={sendResetEmail}>
              <Text style={{fontWeight: 'bold', color: '#fff', fontSize: 18}}>Gửi</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={onCloseModal}>
              <Text style={{fontWeight: 'bold', color: '#006AF5', fontSize: 18}}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    alignSelf: "center",
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
  input1: {
    backgroundColor: "#F6F7FB",
    height: 58,
    marginBottom: 20,
    fontSize: 16,
    borderRadius: 10,
    padding: 12,
    width:220,
  },
  input2: {
    backgroundColor: "#F6F7FB",
    height: 58,
    marginBottom: 20,
    fontSize: 16,
    borderRadius: 10,
  },
  backImage: {
    width: "100%",
    height: 340,
    position: "absolute",
    top: 0,
    resizeMode: 'cover',
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
    justifyContent: 'center',
    marginHorizontal: 30,
  },
  button: {
    backgroundColor: '#006AF5',
    height: 58,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  button2: {
    backgroundColor: '#006AF5',
    height: 58,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    width:220,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#006AF5',
    marginBottom: 20,
  },
  closeButton: {
    marginTop: 10,
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
});