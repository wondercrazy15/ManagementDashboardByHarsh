import { React, useEffect, useState } from "react";
import Input from "../../atoms/Input";
import { useForm, Controller } from "react-hook-form";
import { Edit_User } from "../../redux/userDetail/userDetailAction";
import { Fetch_User } from "../../redux/userDetail/userDetailAction";
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

const AddViewer = ({ projectId }) => {
  const dispatch = useDispatch();
  const projectDetail = useSelector((state) => state.projectReducer);
  const userDetail = useSelector((state) => state.userReducer);
  let currentProject = projectDetail.find((item) => item.id === projectId);
  let currentUser = useSelector((state) => state.currentUserReducer);
  const fetchUser = async () => {
    try {
      const q = query(collection(db, "user"));
      const doc = await getDocs(q);
      doc.forEach((doc) => {
        dispatch(Fetch_User(doc.data()));
      });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

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
    data.user = currentUser?.uid;
    data.projectname = currentProject?.projectname;
    const viewUser = userDetail.find((item) => item.email === data?.viewer);
    data.viewer = [...currentProject.viewer, viewUser?.uid];

    try {
      const q = query(collection(db, "project"), where("id", "==", data.id));
      const querySnapshot = await getDocs(q);
      let docId;
      querySnapshot.forEach((doc) => {
        docId = doc.id;
      });
      const collectionRef = doc(db, "project", docId);
      await updateDoc(collectionRef, {
        viewer: [...currentProject.viewer, viewUser?.uid],
      });
      dispatch(Edit_Project(data));

      const que = query(
        collection(db, "user"),
        where("uid", "==", viewUser?.uid)
      );
      const querySnap = await getDocs(que);
      let docID;
      querySnap.forEach((doc) => {
        docID = doc.id;
      });
      const collectionReff = doc(db, "user", docID);
      await updateDoc(collectionReff, {
        role: "viewer",
      });
      dispatch(
        Edit_User({
          country: viewUser.country,
          email: viewUser.email,
          firstname: viewUser.firstname,
          lastname: viewUser.lastname,
          state: viewUser.state,
          uid: viewUser.uid,
          url: viewUser.url,
          role: "viewer",
        })
      );
      reset({
        viewer: "",
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div
        className='modal fade'
        id='exampleViewerModal'
        tabIndex='-1'
        aria-labelledby='exampleEditModalLabel'
        aria-hidden='true'
      >
        <div className='modal-dialog'>
          <div className='modal-content'>
            <div className='modal-header'>
              <h5 className='modal-title' id='exampleEditModalLabel'>
                Add Viewer
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
                  fieldName='viewer'
                  type='text'
                  register={register}
                  errors={errors}
                  placeHolder='Assign Viewer*'
                  isRequired={true}
                  minimLength={3}
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

export default AddViewer;
