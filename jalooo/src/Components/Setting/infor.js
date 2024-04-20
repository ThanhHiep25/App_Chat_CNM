import React, {  useState, useEffect } from "react";
import logo from "../../IMG/6.png";
import background from "../../IMG/Background.jpg";
import "../../Css/infor.css";
import { useCookies } from "react-cookie";

import back from "../../IMG/back.png";
import next from "../../IMG/next.png";
import Setting_infor_Modal from "./Setting_infor_Modal";
import {
  getFirestore,
  collection,
  onSnapshot,
  doc,
  addDoc,
  query,
  orderBy,
  getDoc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";

const Infor = () => {
  const [cookies, setCookies] = useCookies(["user"]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const userId2 = cookies.user;
  // Check if cookies.user is null before accessing its properties
  const [name, setName] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [userData, setUserData] = useState(null);
  const [avatar, setAvatar] = useState("");
  const db = getFirestore();


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDocRef = doc(db, "users", userId2.uid);
        const userDocSnap = await getDoc(userDocRef);
        const userData = userDocSnap.data();
        if (userDocSnap.exists()) {
          setUserData(userData);
          setName(userData.name);
          setBirthdate(userData.birthdate);
          setGender(userData.gender);
          setEmail(userData.email);
          setAvatar(userData.photoURL);
          console.log(userData, "userData")
        } else {
          console.log("User not found");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();

    return () => {
      setUserData(null); // Xóa dữ liệu người dùng khi rời khỏi màn hình
    };
  }, [db, userId2.uid]);

  const images = [
    "https://cdn.glitch.global/69143e54-6fbc-477e-a834-78df48c40871/desert_landscape_by_elffyie_dgyvfsf-pre.jpg?v=1710040428432",
    "https://cdn.glitch.global/69143e54-6fbc-477e-a834-78df48c40871/H%C3%ACnh-n%E1%BB%81n-hoa-h%C6%B0%C6%A1ng-d%C6%B0%C6%A1ng-c%E1%BB%B1c-%C4%91%E1%BA%B9p.jpg?v=1710040436916",
    "https://cdn.glitch.global/69143e54-6fbc-477e-a834-78df48c40871/Coolmate.jpg?v=1710040454392",
    "https://cdn.glitch.global/69143e54-6fbc-477e-a834-78df48c40871/the_dho.jpg?v=1710040447854",
    "https://cdn.glitch.global/69143e54-6fbc-477e-a834-78df48c40871/long_way_to_eden_by_joeyjazz_dendurf-pre.jpg?v=1710040441311",
  ];


  

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleJumpToImage = (index) => {
    setCurrentImageIndex(index);
  };

  const sliderTransformValue = `translateX(-${currentImageIndex * 50}%)`;

  const [isLogoutModalOpen, setLogoutModalOpen] = useState(false);

  const handleChooseLogout = () => {
    setLogoutModalOpen(true);
  };

  const handleCloseModal = () => {
    setLogoutModalOpen(false);
  };

  return (
    <div className="infor-fr">
      <div className="bg-ig-user-infor">
        <img
          src={background}
          className="img-infor-background"
          alt="background"
        />
        <img src={avatar} className="img-infor-user" alt="background" />
        <p className="text-infor">{name}</p>
      </div>

      <div className="edit-infor">
        <button className="btn-edit-infor" onClick={handleChooseLogout}>
          Chinh sua trang ca nhan
        </button>
      </div>

      <div className="infor-inf">
       
        <p className="txt-inf">Ngày sinh : <span className="spa-inf">{birthdate}</span></p>
        <p className="txt-inf">Giới tính : <span className="spa-inf gt">{gender}</span></p> 
        <p className="txt-inf">Email : <span className="spa-inf mail">{email}</span></p>
      </div>

      <div className="story-infor">
        <p className="text-story">Hello ngày mới 🍃</p>
      </div>

      <div className="slider-set-fr">
        <div className="slider-container">
          <div
            className="slider-wrapper"
            style={{ transform: sliderTransformValue }}
          >
            {images.map((image, index) => (
              <img
                key={index}
                className={`slider-image ${
                  index === currentImageIndex ? "active" : ""
                }`}
                src={image}
                alt={`Image${index + 1}`}
                onClick={() => handleJumpToImage(index)}
              />
            ))}
          </div>
          <div className="btn-fr-infor">
            <button className="btn-slider" onClick={handlePrevImage}>
              <img src={back} className="ing-next-back" alt="back.png" />
            </button>
            <button className="btn-slider" onClick={handleNextImage}>
              <img src={next} className="ing-next-back" alt="next.png" />
            </button>
          </div>
        </div>
      </div>

      <div className="modal-setup-infor">
        <Setting_infor_Modal
          isOpen={isLogoutModalOpen}
          onClose={handleCloseModal}
        />
      </div>
    </div>
  );
};

export default Infor;
