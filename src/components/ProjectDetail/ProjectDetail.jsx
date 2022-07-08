import { React, useState, useEffect } from "react";
import styles from "../Dashboard/Dashboard.module.css";
import ProjectCreateModal from "../Modal/ProjectCreateModal";
import { Add_Project } from "../../redux/projectDetail/projectAction";
import {
  query,
  collection,
  getDocs,
  where,
  addDoc,
} from "firebase/firestore/lite";
import { auth, db } from "../../firebase/firebase";
import { useDispatch, useSelector } from "react-redux";
import ProjectEditModal from "../Modal/ProjectEditModal";
import editdeleteproject from "../../assets/editdeleteproject.svg";
import addProject from "../../assets/addProject.svg";

const ProjectDetail = () => {
  const dispatch = useDispatch();
  const projectDetail = useSelector((state) => state.projectReducer);
  console.log(projectDetail);
  const [isActive, setIsActive] = useState(false);
  const handleClick = (event) => {
    setIsActive((current) => !current);
  };
  const fetchUserData = async () => {
    // const projectdata = [];
    try {
      const q = query(collection(db, "project"));
      const doc = await getDocs(q);
      const data = doc.docs[0].data();
      const dataId = doc.docs[0].id;
      doc.forEach((doc) => {
        dispatch(Add_Project(doc.data()));
      });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <>
      <div className={styles.sidebarProjects}>
        <div className={styles.addProject}>
          <p>my projects</p>
          <img
            src={addProject}
            alt='noprojectimage'
            type='button'
            data-bs-toggle='modal'
            data-bs-target='#exampleModal'
          />
          <ProjectCreateModal />
        </div>
        <div className={styles.projectContent}>
          {isActive ? (
            <>
              {" "}
              <div className={styles.activeproject}>
                <p className={styles.projectIndex}></p>
                <p className={styles.projectName} onClick={handleClick}>
                  Mobile App
                </p>
                <img
                  src={editdeleteproject}
                  alt='noeditdeleteproject'
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
                    <p
                      type='button'
                      data-bs-toggle='modal'
                      data-bs-target='#exampleEditModal'
                    >
                      Edit Project
                    </p>
                  </li>
                  <li>
                    <p>Delete Project</p>
                  </li>
                </ul>
              </div>
            </>
          ) : (
            <>
              <div className={styles.projectDetails}>
                <p className={styles.projectIndex}></p>
                <p className={styles.projectName} onClick={handleClick}>
                  Mobile App
                </p>
              </div>
            </>
          )}
          <ProjectEditModal />
          <div className={styles.projectDetails}>
            <p className={styles.projectIndex}></p>
            <p className={styles.projectName}>Website Redesign</p>
          </div>
          <div className={styles.projectDetails}>
            <p className={styles.projectIndex}></p>
            <p className={styles.projectName}>Design System</p>
          </div>
          <div className={styles.projectDetails}>
            <p className={styles.projectIndex}></p>
            <p className={styles.projectName}>Wireframes</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectDetail;
