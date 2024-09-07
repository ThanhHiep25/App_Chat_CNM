import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import "../../Css/Setting_modal.css";
import { getAuth, updateProfile } from 'firebase/auth';
import { getFirestore, doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

const Setting_infor_Modal = ({ isOpen, onClose, onSave, userData }) => {
  const db = getFirestore();
  const auth = getAuth();
  const [selectedImage, setSelectedImage] = useState('');
  const [initialImage, setInitialImage] = useState('');
  const [selectedNewImage, setSelectedNewImage] = useState('');
  const [name, setName] = useState('');
  const [initialName, setInitialName] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [initialBirthdate, setInitialBirthdate] = useState('');
  const [gender, setGender] = useState('');
  const [initialGender, setInitialGender] = useState('');
  const [email, setEmail] = useState('');
  const [initialEmail, setInitialEmail] = useState('');
  const [isDirty, setIsDirty] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedNewImage(reader.result);
        setIsDirty(true);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (userData) {
      setSelectedImage(userData.photoURL || '');
      setInitialImage(userData.photoURL || '');
      setName(userData.name || '');
      setInitialName(userData.name || '');
      setBirthdate(userData.birthdate || '');
      setInitialBirthdate(userData.birthdate || '');
      setGender(userData.gender || '');
      setInitialGender(userData.gender || '');
      setEmail(userData.email || '');
      setInitialEmail(userData.email || '');
    }
  }, [userData]);

  const formatDate = (birthdateString) => {
    if (!birthdateString) return "";
    const [year, month, day] = birthdateString.split("-");
    return `${day}/${month}/${year}`;
  };

  const deletePreviousPhoto = async (userId) => {
    try {
      const userRef = doc(db, 'users', userId);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        const userData = docSnap.data();
        const currentPhotoURL = userData.photoURL;
        if (currentPhotoURL) {
          const storage = getStorage();
          const photoRef = ref(storage, currentPhotoURL);
          await deleteObject(photoRef);
          await setDoc(userRef, { photoURL: null }, { merge: true });
        }
      }
    } catch (error) {
      console.log("Error deleting previous photo: ", error);
    }
  };

  const handleSave = async () => {
    try {
      let downloadURL = selectedImage;

      if (selectedNewImage) {
        await deletePreviousPhoto(userData.UID);

        const storage = getStorage();
        const storageRef = ref(storage, `photos/${userData.UID}/${Date.now()}`);
        const blob = await (await fetch(selectedNewImage)).blob();
        await uploadBytes(storageRef, blob);
        downloadURL = await getDownloadURL(storageRef);
      }

      const formattedBirthdate = birthdate !== initialBirthdate ? formatDate(birthdate) : initialBirthdate;

      const userRef = doc(db, 'users', userData.UID);
      await updateDoc(userRef, {
        name: name,
        gender: gender,
        birthdate: formattedBirthdate,
        photoURL: downloadURL
      });

      await updateProfile(auth.currentUser, {
        displayName: name,
        photoURL: downloadURL
      });

      setIsDirty(false);
      onClose();
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  const handleClose = () => {
    setSelectedNewImage('');
    setIsDirty(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen && !!userData}
      onRequestClose={onClose}
      contentLabel="Edit Profile Modal"
      className="Modal"
    >
      {userData && (
        <div className="container-Logout-infor">
          <form action="" className="form-infor">
            <div className="form-group-img">
              <p className="text-logout-infor">Thay đổi thông tin cá nhân</p>
              <img src={selectedNewImage || selectedImage} alt="img-user" className="img-user-infor"/>
              <input
                type="file"
                className="input-img-infor"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
                id="file-input"
              />
              <label htmlFor="file-input" className="custom-file-input">Chọn ảnh</label>
            </div>
            <div className="form-group">
              <label>Họ và tên</label>
              <input
                type="text"
                className="form-control"
                placeholder="Nhập họ và tên"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setIsDirty(e.target.value !== initialName || birthdate !== initialBirthdate || gender !== initialGender || email !== initialEmail || selectedNewImage);
                }}
              />
            </div>
            <div className="form-group">
              <label>Ngày sinh</label>
              <input
                type="date"
                className="form-control"
                placeholder="Nhập ngày sinh"
                value={birthdate ? new Date(birthdate).toLocaleDateString('en-CA') : ''}
                onChange={(e) => {
                  setBirthdate(e.target.value);
                  setIsDirty(name !== initialName || e.target.value !== initialBirthdate || gender !== initialGender || email !== initialEmail || selectedNewImage);
                }}
              />
            </div>
            <div className="form-group">
              <label>Giới tính</label>
              <div className="radio-buttons">
                <label>
                  <input
                    type="radio"
                    name="gender"
                    value="Nam"
                    checked={gender === "Nam"}
                    onChange={() => {
                      setGender("Nam");
                      setIsDirty(name !== initialName || birthdate !== initialBirthdate || "Nam" !== initialGender || email !== initialEmail || selectedNewImage);
                    }}
                  />
                  Nam
                </label>
                <label style={{marginLeft:20}}>
                  <input
                    type="radio"
                    name="gender"
                    value="Nữ"
                    checked={gender === "Nữ"}
                    onChange={() => {
                      setGender("Nữ");
                      setIsDirty(name !== initialName || birthdate !== initialBirthdate || "Nữ" !== initialGender || email !== initialEmail || selectedNewImage);
                    }}
                  />
                  Nữ
                </label>
              </div>
            </div>
          </form>
          
          <div className="btn-setup-modal-infor">
            {isDirty && (
              <button onClick={handleSave}>Lưu</button>
            )}
            <button onClick={handleClose}>Hủy</button>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default Setting_infor_Modal;
