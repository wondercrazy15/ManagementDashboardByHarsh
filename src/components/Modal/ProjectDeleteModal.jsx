import { React, useEffect, useState } from "react";
import { auth, db } from "../../firebase/firebase";
import {
  query,
  collection,
  getDocs,
  where,
  addDoc,
  doc,
  deleteDoc,
} from "firebase/firestore/lite";
import { Delete_Project } from "../../redux/projectDetail/projectAction";
import { useDispatch, useSelector } from "react-redux";

const ProjectDeleteModal = ({ projectId }) => {
  const dispatch = useDispatch();
  const deleteProject = async (id) => {
    try {
      const q = query(collection(db, "project"), where("id", "==", id));
      const querySnapshot = await getDocs(q);
      let docId;
      querySnapshot.forEach((doc) => {
        docId = doc.id;
      });
      await deleteDoc(doc(db, "project", docId));

      dispatch(Delete_Project(id));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div
        className='modal fade'
        id='exampleDeleteModal'
        tabIndex='-1'
        aria-labelledby='exampleEditModalLabel'
        aria-hidden='true'
      >
        <div className='modal-dialog'>
          <div className='modal-content'>
            <div className='modal-header'>
              <h5 className='modal-title' id='exampleEditModalLabel'>
                Do you want to delete project?
              </h5>
              <button
                type='button'
                className='btn-close'
                data-bs-dismiss='modal'
                aria-label='Close'
              ></button>
            </div>
            <div className='modal-body'>
              <button
                type='button'
                className='btn btn-secondary'
                data-bs-dismiss='modal'
                onClick={() => deleteProject(projectId)}
              >
                Yes
              </button>
              <button
                type='button'
                className='btn btn-secondary ms-3'
                data-bs-dismiss='modal'
              >
                No
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectDeleteModal;
