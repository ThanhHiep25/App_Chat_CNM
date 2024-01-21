import React from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import WellScreen from "./Components/ScreenWell/Well";
import Login from "./Components/ScreenWell/Login";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WellScreen />} />
        <Route path="me" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
