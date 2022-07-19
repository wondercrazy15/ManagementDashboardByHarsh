import { React, useEffect, useState } from "react";
import Input from "../../atoms/Input";
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Edit_Project } from "../../redux/projectDetail/projectAction";
import { auth, db } from "../../firebase/firebase";
import {
  query,
  collection,
  getDocs,
  where,
  addDoc,
  updateDoc,
  doc,
} from "firebase/firestore/lite";
import { connectStorageEmulator } from "firebase/storage";

const ProjectEditModal = ({ projectId }) => {
  const dispatch = useDispatch();
  const projectDetail = useSelector((state) => state.projectReducer);
  let currentProject = projectDetail.find((item) => item.id === projectId);

  const {
    register,
    handleSubmit,
    watch,
    formState,
    reset,
    control,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    data.id = projectId;
    try {
      const q = query(collection(db, "project"), where("id", "==", data.id));
      const querySnapshot = await getDocs(q);
      let docId;
      querySnapshot.forEach((doc) => {
        docId = doc.id;
      });
      const collectionRef = doc(db, "project", docId);
      await updateDoc(collectionRef, {
        projectname: data.projectname,
      });
      dispatch(Edit_Project(data));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div
        className='modal fade'
        id='exampleEditProjectModal'
        tabIndex='-1'
        aria-labelledby='exampleEditModalLabel'
        aria-hidden='true'
      >
        <div className='modal-dialog'>
          <div className='modal-content'>
            <div className='modal-header'>
              <h5 className='modal-title' id='exampleEditModalLabel'>
                Edit Project
              </h5>
              <button
                type='button'
                className='btn-close'
                data-bs-dismiss='modal'
                aria-label='Close'
              ></button>
            </div>
            <div className='modal-body'>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Input
                  fieldName='projectname'
                  type='text'
                  register={register}
                  errors={errors}
                  placeHolder='Enter ProjectName*'
                  isRequired={true}
                  minimLength={3}
                  defaultValue={currentProject?.projectname}
                />
                <button
                  type='submit'
                  className='btn btn-primary ms-3 btn-sm'
                  data-bs-dismiss='modal'
                >
                  submit
                </button>
              </form>
            </div>
            <div className='modal-footer'>
              <button
                type='button'
                className='btn btn-secondary'
                data-bs-dismiss='modal'
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectEditModal;
