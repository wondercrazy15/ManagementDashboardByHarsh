import React from "react";
import LoginUser from "../pages/Login";
import SignupUser from "../pages/Signup";
import { useDispatch, useSelector } from "react-redux";
import DashboardPage from "../pages/Dashboard";
import { Routes, Route } from "react-router";

const ApplicationRoutes = () => {
  const userDetail = useSelector((state) => state.currentUserReducer);
  console.log(userDetail);
  return (
    <>
      <Routes>
        <Route path='/' element={<LoginUser />} />
        <Route path='/registration' element={<SignupUser />} />
        {userDetail.firstname && (
          <Route path='/dashboard' element={<DashboardPage />} />
        )}
        {/* <Route path='/dashboard' element={<DashboardPage />} /> */}
      </Routes>
    </>
  );
};

export default ApplicationRoutes;
