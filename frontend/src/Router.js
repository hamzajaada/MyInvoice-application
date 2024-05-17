import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Aos from "aos";
import "aos/dist/aos.css";
import App from "./App";
import Login from "./components/Login/Login";

const Router = () => {
  

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/Login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
