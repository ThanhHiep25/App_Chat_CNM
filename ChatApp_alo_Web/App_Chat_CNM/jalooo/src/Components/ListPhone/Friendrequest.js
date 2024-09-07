import React from "react";
import "../../Css/Friendrequest.css";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Friend_request from "./Friend_request";
import Invitation_Sent from "./Invitation_Sent";

const Friendrequest = () => {
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }

  CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  };

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }

  return (
    <div className="container-fen">
      <div className="custom">
        <Box sx={{ width: "100%" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
            >
              <Tab label="Lời mời kết bạn" {...a11yProps(0)} />
              <Tab label="Lời mời đã gửi" {...a11yProps(1)} />
            </Tabs>
          </Box>
          <CustomTabPanel value={value} index={0}>
            <Friend_request />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            <Invitation_Sent/>
          </CustomTabPanel>
          {/* <CustomTabPanel value={value} index={2}>
          Item Three
        </CustomTabPanel> */}
        </Box>
      </div>
    </div>
  );
};

export default Friendrequest;
