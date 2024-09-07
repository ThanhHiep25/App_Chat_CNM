import React, { useEffect, useState } from "react";
import add_user from "../../IMG/add-user.png";
import add_group from "../../IMG/add-group.png";
import list_friend from "../../IMG/list_friend.png";
import list_group from "../../IMG/list_group.png";
import make_friend from "../../IMG/make_friend.png";
import "../../Css/ListPhone.css";
import { useNavigate } from "react-router-dom";
import ListPhone from "./ListPhone";
import ListFen from "./ListGroup";
import Friendrequest from "./Friendrequest";

const Phone = () => {
  const [currentComponent, setCurrentComponent] = useState(null);

  const handleTabChange = (tab) => {
    setCurrentComponent(tab);
  };

  return (
    <div className="Chat-list11">
      <div>
        <div className="bar-chat"></div>
        <div className="list-friend">
          <button
            className="btn-list"
            onClick={() => {
              handleTabChange("LISTPHONE");
            }}
          >
            <img src={list_friend} className="img-list" alt="List fen" />
            <p className="text-list">Danh sách bạn bè</p>
          </button>
        </div>
        <div className="list-friend">
          <button
            className="btn-list"
            onClick={() => {
              handleTabChange("LISTG");
            }}
          >
            <img src={list_group} className="img-list" alt="List group" />
            <p className="text-list">Danh sách nhóm</p>
          </button>
        </div>
        <div className="list-friend">
          <button
            className="btn-list"
            onClick={() => {
              handleTabChange("FENRS");
            }}
          >
            <img
              src={make_friend}
              className="img-list"
              alt="Dach sach ket ban"
            />
            <p className="text-list">Lời mời kết bạn</p>
          </button>
        </div>
      </div>
      {currentComponent === "LISTPHONE" ? (
        <ListPhone />
      ) : currentComponent === "LISTG" ? (
        <ListFen />
      ) : (
        currentComponent === "FENRS" && <Friendrequest />
      )}
    </div> // kết thục danh sách bạn bè
  );
};

export default Phone;
