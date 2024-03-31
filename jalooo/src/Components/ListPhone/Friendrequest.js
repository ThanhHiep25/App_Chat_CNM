import React from "react";
import "../../Css/Friendrequest.css";

const Friendrequest = () => {
  return (
    <div className="container-fen">
      <h2>Lời mời kết bạn</h2>
      <div className="list-fen">
        <div className="fenrequest">
          <img src="https://cdn.glitch.global/69143e54-6fbc-477e-a834-78df48c40871/user1.png?v=1706763631346" className="img-fen" alt="vn" />
          <button type="submit" className="btn-sub-fen">Thêm bạn</button>
        </div>
      </div>
    </div>
  );
};

export default Friendrequest;
