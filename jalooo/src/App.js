import React from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import WellScreen from "./Components/ScreenWell/Well";
import Login from "./Components/ScreenWell/Login";
import Chat from "./Components/ScreenChat/Chat";
import { CookiesProvider } from "react-cookie";

function App() {
  return (
    <BrowserRouter>
      <CookiesProvider defaultSetOptions={{ path: '/' }}>
        <Routes>
          <Route path="/" element={<WellScreen />} />
          <Route path="me" element={<Login />} />
          <Route path="chat" element={<Chat />} />
        </Routes>
      </CookiesProvider>
    </BrowserRouter>
  );
}

export default App;
