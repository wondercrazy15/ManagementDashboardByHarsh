import { React, useState, useEffect } from "react";
import styles from "./Dashboard.module.css";
import colorFilter from "../../assets/colorfilter.svg";
import TaskDetail from "../TaskDetail/TaskDetail";
import home from "../../assets/home.svg";
import members from "../../assets/members.svg";
import settings from "../../assets/settings.svg";
import tasks from "../../assets/tasks.svg";
import downarrow from "../../assets/downarrow.svg";
import profileimage from "../../assets/profileimage.svg";
import sidebarArrow from "../../assets/siderbar_arrow.svg";
import { LogoutUser } from "../../redux/currentUser/currentUserAction";
import { signOut } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { auth, db } from "../../firebase/firebase";
import { Link, useNavigate } from "react-router-dom";
import ProjectDetail from "../ProjectDetail/ProjectDetail";

const Dashboard = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogOut = () => {
    signOut(auth);
    const userdata = {
      firstname: "",
      lastname: "",
      email: "",
      country: "",
      state: "",
      uid: "",
      url: "",
    };
    dispatch(LogoutUser(userdata));
    navigate("/");
  };
  const userDetail = useSelector((state) => state.currentUserReducer);

  return (
    <>
      <div className={styles.maincontainer}>
        <div className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <div className={styles.sidebarHeaderContent}>
              <div className={styles.sidebarContent}>
                <img src={colorFilter} alt='nocolorfilterimage' />
                <p className={styles.sidebarHeaderContentText}>Project M.</p>
              </div>
              <img src={sidebarArrow} alt='nosidebararrowimage' />
            </div>
          </div>
          <div className={styles.sidebarMenu}>
            <div className={styles.sidebarHome}>
              <img src={home} alt='nohomeimage' />
              <Link to='/dashboard' className={styles.homeLink}>
                <p className={styles.sidebarMenuContentText}>Home</p>
              </Link>
            </div>
            <div className={styles.sidebarTasks}>
              <img src={tasks} alt='notaskimage' />
              <p className={styles.sidebarMenuContentText}>Tasks</p>
            </div>
            <div className={styles.sidebarMembers}>
              <img src={members} alt='nomemberimage' />
              <p className={styles.sidebarMenuContentText}>Members</p>
            </div>
            <div className={styles.sidebarSettings}>
              <img src={settings} alt='nosettingimage' />
              <p className={styles.sidebarMenuContentText}>Settings</p>
            </div>
            <div className={styles.sidebarLine}></div>
          </div>
          <ProjectDetail />
        </div>
        <div className={styles.maincontainerright}>
          <div className={styles.maincontainerrightHeader}>
            <div className={styles.a}>
              <div className={styles.userText}>
                <p className={styles.userName}>
                  {userDetail.firstname} {userDetail.lastname}
                </p>
                <p className={styles.userAddress}>
                  {userDetail.state}, {userDetail.country}
                </p>
              </div>
              <img
                src={userDetail.url}
                alt='noprofileimage'
                className={styles.profileimage}
              />

              <div className='dropdown'>
                <img
                  src={downarrow}
                  alt='nodownarrowimage'
                  className='dropdown-toggle'
                  type='button'
                  id='dropdownMenuButton1'
                  data-bs-toggle='dropdown'
                  aria-expanded='false'
                />
                <ul
                  className='dropdown-menu'
                  aria-labelledby='dropdownMenuButton1'
                >
                  <li>
                    <p className={styles.logout} onClick={handleLogOut}>
                      Logout
                    </p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className={styles.maincontainerrightContent}>{children}</div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
