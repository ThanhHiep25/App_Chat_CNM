import React, { useEffect, useState } from "react";
const url = "https://65557a0784b36e3a431dc70d.mockapi.io/user";

export const AuthContext = React.createContext();

const AuthProvider = ({ children }) => {
  const [state, setState] = useState([]);
  const fechapi = () => {
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setState(data);
      });
  };

  useEffect(() => {
    fechapi();
  }, []);
  return (
    <AuthContext.Provider value={{ state }}>
      <children />
    </AuthContext.Provider>
  );
};

export default AuthProvider;
