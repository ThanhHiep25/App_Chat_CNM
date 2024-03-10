import React, { useState } from "react";
import logo from "../../IMG/6.png";
import background from "../../IMG/Background.jpg";
import "../../Css/infor.css";
import { useCookies } from "react-cookie";

import back from "../../IMG/back.png";
import next from "../../IMG/next.png";

const Infor = () => {
  const [cookies, setCookies] = useCookies(["user"]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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

  return (
    <div className="infor-fr">
      <div className="bg-ig-user-infor">
        <img
          src={background}
          className="img-infor-background"
          alt="background"
        />
        <img src={logo} className="img-infor-user" alt="background" />
        <p className="text-infor">{cookies.user.name}</p>
      </div>

      <div className="edit-infor">
        <button className="btn-edit-infor">Chinh sua trang ca nhan</button>
      </div>

      <div className="story-infor">
        <p className="text-story">
          Thực ra thế giới vẫn vậy chỉ có em là thay thế anh bằng người khác.
        </p>
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
                className={`slider-image ${index === currentImageIndex ? 'active' : ''}`}
                src={image}
                alt={`Image${index + 1}`}
                onClick={() => handleJumpToImage(index)}
              />
            ))}
          </div>
          <div className="btn-fr-infor">
            <button className="btn-slider" onClick={handlePrevImage}>
              <img src={back} className="ing-next-back" alt="back.png"/>
            </button>
            <button className="btn-slider" onClick={handleNextImage}>
            <img src={next} className="ing-next-back" alt="next.png"/>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Infor;
