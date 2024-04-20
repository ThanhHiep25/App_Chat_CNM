import React from "react";

const Invitation_Sent = () => {
  return (
    <div className="list-fen">
      <div className="fenrequest">
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <img
            src="https://cdn.glitch.global/69143e54-6fbc-477e-a834-78df48c40871/user1.png?v=1706763631346"
            className="img-fen"
            alt="vn"
          />
          <p style={{ marginLeft: "10px" }}>hello</p>
        </div>
        <button type="submit" className="btn-sub-fen">
          Đã gửi lời mời
        </button>
      </div>
    </div>
  );
};

export default Invitation_Sent;
