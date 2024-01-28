import React from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import WellScreen from "./Components/ScreenWell/Well";
import Login from "./Components/ScreenWell/Login";
import Chat from "./Components/ScreenChat/Chat";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WellScreen />} />
        <Route path="me" element={<Login />} />
        <Route path="chat" element={<Chat />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
