import { React, useState, useEffect } from "react";
import styles from "../Dashboard/Dashboard.module.css";
import ProjectCreateModal from "../Modal/ProjectCreateModal";
import ProjectEdit from "./ProjectEdit";
import AddViewer from "../Modal/AddViewer";
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
import editdeleteproject from "../../assets/editdeleteproject.svg";
import addProject from "../../assets/addProject.svg";

const Project = () => {
  const [projectId, setProjectId] = useState();
  const [projectData, setProjectData] = useState([]);
  const dispatch = useDispatch();
  const projectDetail = useSelector((state) => state.projectReducer);
  const [isActive, setIsActive] = useState(false);
  let currentUser = useSelector((state) => state.currentUserReducer);

  const handleClick = (id) => {
    setIsActive((current) => !current);
  };

  const fetchProjectData = async () => {
    try {
      const q = query(collection(db, "project"));
      const doc = await getDocs(q);
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
      <div className='mt-5 container'>
        <table className='table table-striped'>
          <thead>
            <tr>
              <th scope='col'>Id</th>
              <th scope='col'>ProjectName</th>
              <th scope='col'>Action</th>
            </tr>
          </thead>
          <tbody>
            {projectDetail.map((item) => (
              <tr>
                <td>{item.id}</td>
                <td>{item.projectname}</td>
                <td>
                  <button
                    className='btn btn-primary px-3 me-3 shadow-none'
                    data-bs-toggle='modal'
                    data-bs-target='#exampleEditModal'
                    onClick={() => getProjectId(item.id)}
                  >
                    Edit
                  </button>
                  <ProjectEdit projectID={projectId} />
                  <button
                    className='btn btn-primary shadow-none'
                    data-bs-toggle='modal'
                    data-bs-target='#exampleDeleteModal'
                    onClick={() => getProjectId(item.id)}
                  >
                    Delete
                  </button>
                  <ProjectDeleteModal projectId={projectId} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Project;
