import { React, useState, useEffect } from "react";
import styles from "../Dashboard/Dashboard.module.css";
import ProjectCreateModal from "../Modal/ProjectCreateModal";
import { Link } from "react-router-dom";
import ProjectDeleteModal from "../Modal/ProjectDeleteModal";
import { Delete_Project } from "../../redux/projectDetail/projectAction";
import { Fetch_Project } from "../../redux/projectDetail/projectAction";
import {
  query,
  collection,
  getDocs,
  where,
  addDoc,
  doc,
  deleteDoc,
} from "firebase/firestore/lite";
import { auth, db } from "../../firebase/firebase";
import { useDispatch, useSelector } from "react-redux";
import ProjectEditModal from "../Modal/ProjectEditModal";
import editdeleteproject from "../../assets/editdeleteproject.svg";
import addProject from "../../assets/addProject.svg";

const ProjectDetail = () => {
  const [projectId, setProjectId] = useState();
  const dispatch = useDispatch();
  const projectDetail = useSelector((state) => state.projectReducer);
  const [isActive, setIsActive] = useState(false);

  const handleClick = (id) => {
    setIsActive((current) => !current);
  };

  const fetchProjectData = async () => {
    try {
      const q = query(collection(db, "project"));
      const doc = await getDocs(q);
      // const data = doc.docs[0].data();
      // const dataId = doc.docs[0].id;
      doc.forEach((doc) => {
        dispatch(Fetch_Project(doc.data()));
      });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProjectData();
  }, []);

  const getProjectId = (id) => {
    setProjectId(id);
  };

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
        {projectDetail.map((item, index) => (
          <div
            className={styles.projectContent}
            key={index}
            onClick={() => getProjectId(item.id)}
          >
            <Link
              to={"/dashboard/project/" + item.id}
              className={styles.projectLink}
            >
              <div className={styles.activeproject}>
                <p className={styles.projectIndex}></p>
                <p className={styles.projectName}>{item.projectname}</p>
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
                      data-bs-target='#exampleEditProjectModal'
                      onClick={() => getProjectId(item.id)}
                    >
                      Edit Project
                    </p>
                  </li>
                  <li>
                    <p
                      type='button'
                      data-bs-toggle='modal'
                      data-bs-target='#exampleDeleteModal'
                      onClick={() => getProjectId(item.id)}
                    >
                      Delete Project
                    </p>
                  </li>
                </ul>

                <ProjectDeleteModal projectId={projectId} />
              </div>
            </Link>
          </div>
        ))}
        <ProjectEditModal projectId={projectId} />
      </div>
    </>
  );
};

export default ProjectDetail;
