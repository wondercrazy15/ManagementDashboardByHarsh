import React from "react";
import LoginUser from "../pages/Login";
import SignupUser from "../pages/Signup";
import { Routes, Route } from "react-router";

const ApplicationRoutes = () => {
  return (
    <>
      <Routes>
        <Route path='/' element={<LoginUser />} />
        <Route path='/registration' element={<SignupUser />} />
      </Routes>
    </>
  );
};

export default ApplicationRoutes;
