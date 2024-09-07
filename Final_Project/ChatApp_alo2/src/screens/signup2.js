import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, StatusBar, Alert } from "react-native";
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { auth } from '../../config/firebase';
import { MaterialIcons } from '@expo/vector-icons'; // Import Material Icons hoặc thư viện biểu tượng tương tự
import { Picker } from '@react-native-picker/picker'; // Import Picker từ thư viện mới

export default function Signup({ navigation, setIsLoggedIn }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [gender, setGender] = useState('male');
  const [day, setDay] = useState('1');
  const [month, setMonth] = useState('1');
  const [year, setYear] = useState('2000');
  const db = getFirestore();

  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString());
  const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
  const years = Array.from({ length: 120 }, (_, i) => (2024 - i).toString());

  const isPasswordValid = () => {
    if (password !== confirmPassword) {
      Alert.alert("Signup error", "Mật khẩu xác nhận không khớp");
      return false;
    }
    return true;
  };

  const onHandleSignup = () => {
    if (email !== '' && password !== '' && confirmPassword !== '' && name !== '') {
      if (!isPasswordValid()) {
        return;
      }
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
              birthdate: `${day}/${month}/${year}`
            }).then(() => {
              setIsLoggedIn(false);
              Alert.alert(
                'Signup success',
                'You have signed up successfully!',
                [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
              );
            }).catch((error) => {
              console.log("Error adding document: ", error);
            });
          }).catch((error) => {
            console.log("Update profile error: ", error);
          });
        })
        .catch((err) => Alert.alert("Signup error", err.message));
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.whiteSheet} />
      <View style={styles.form}>
        <Text style={styles.title}>Đăng Ký</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          autoCapitalize="none"keyboardType="email-address"
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
              style={[styles.radioButtonMale, gender === 'male' && styles.selectedRadioButton]}
              onPress={() => setGender('male')}
            >
              <Text style={styles.radioText}>Nam</Text>
            </TouchableOpacity><TouchableOpacity
              style={[styles.radioButtonFMale, gender === 'female' && styles.selectedRadioButton]}
              onPress={() => setGender('female')}
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
    // alignSelf: "center",
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
    marginTop:50,
    // justifyContent: 'center',
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
});