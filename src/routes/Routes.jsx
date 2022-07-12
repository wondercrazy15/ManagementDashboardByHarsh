import React from "react";
import LoginUser from "../pages/Login";
import SignupUser from "../pages/Signup";
import Dashboard from "../components/Dashboard/Dashboard";
import Project from "../pages/Project";
import { useDispatch, useSelector } from "react-redux";
import Home from "../pages/Home";
import { Routes, Route } from "react-router";

const ApplicationRoutes = () => {
  const userDetail = useSelector((state) => state.currentUserReducer);

  return (
    <>
      <Routes>
        <Route path='/' element={<LoginUser />} />
        <Route path='/registration' element={<SignupUser />} />
        {userDetail.firstname && (
          <Route
            path='/dashboard'
            element={
              <Dashboard>
                <Home />
              </Dashboard>
            }
          />
        )}
        {userDetail.firstname && (
          <Route
            path='/dashboard/project/:projectId'
            element={
              <Dashboard>
                <Project />
              </Dashboard>
            }
          />
        )}
        {/* <Route path='/dashboard' element={<DashboardPage />} /> */}
      </Routes>
    </>
  );
};

export default ApplicationRoutes;
