import React, { useState } from "react";
import "../../Css/Bar.css";

import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
import { Menu, MenuItem, Button } from "@mui/material";
import { BiShare } from "react-icons/bi";
import { RiShareForwardLine } from "react-icons/ri";
import { AiOutlineDelete } from "react-icons/ai";
import { TbMessageCircleCancel } from "react-icons/tb";

const Bar = ({ onDeleteMessage, onRecallMessage, messages }) => {
  const [color, setColor] = useState(0);
  return (
    <PopupState variant="popover" popupId="setting-menu">
      {(popupState) => (
        <React.Fragment>
          <Button
            {...bindTrigger(popupState)}
            className={`btn-ac ${color === 5 ? "selected" : null}`}
          >
            <button className="modal-chat">...</button>
          </Button>
          <Menu {...bindMenu(popupState)}>
            <div className="group-actions">
              {/* Trả lời */}
              <button className="btn-action">
                <BiShare />
              </button>
              {/* Chuyển tiếp */}
              <button className="btn-action">
                <RiShareForwardLine />
              </button>

              {/* Xóa tin nhắn */}
              <button
                className="btn-action"
                onClick={() => messages && onDeleteMessage(messages._id)}
              >
                <AiOutlineDelete />
              </button>

              {/* Thu hồi tin nhắn */}
              <button
                className="btn-action"
                onClick={() =>messages && onRecallMessage(messages._id)}
              >
                <TbMessageCircleCancel />
              </button>
            </div>
          </Menu>
        </React.Fragment>
      )}
    </PopupState>
  );
};

export default Bar;
