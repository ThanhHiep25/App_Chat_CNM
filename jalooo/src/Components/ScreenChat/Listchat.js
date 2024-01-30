import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import "../../Css/Listchat.css";
const url = "https://65557a0784b36e3a431dc70d.mockapi.io/chats";

const Listchat = () => {
  const [cookies, setCookies] = useCookies(["user"]);
  const [list, setList] = useState([]);

  const fechapiList = async () => {
    await fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setList(data);
        // console.log('====================================');
        // console.log(data);
        // console.log('====================================');
      });
  };

  useEffect(() => {
    fechapiList();
  }, []);

  const seenResenders = new Set();
  const renderedList = list.map((item) => {
    if (!seenResenders.has(item.resender)) {
      seenResenders.add(item.resender);
      return (
        <ul className="ul-set">
          <li className="li-set">
            <button className="btn-chat">{item.resender}</button>
          </li>
        </ul>
      );
    }
    return null;
  });

  return (
    <div className="Chat-list">
      <div className="Border-list">
        {renderedList.filter((button) => button)}
      </div>
    </div>
  );
};

export default Listchat;
