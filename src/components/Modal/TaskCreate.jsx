import { React, useEffect, useState } from "react";
import Input from "../../atoms/Input";
import { useForm, Controller } from "react-hook-form";
import { useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { Add_Task } from "../../redux/taskDetail/taskAction";
import {
  query,
  collection,
  getDocs,
  where,
  addDoc,
  doc,
} from "firebase/firestore/lite";
import { auth, db } from "../../firebase/firebase";
import { useDispatch, useSelector } from "react-redux";

const TaskCreateModal = ({ docId }) => {
  const slug = useParams();
  const dispatch = useDispatch();
  const taskDetail = useSelector((state) => state.taskReducer);

  const {
    register,
    handleSubmit,
    watch,
    formState,
    reset,
    control,
    isSubmitSuccessful,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      taskpriority: "",
      taskname: "",
      taskdescription: "",
    },
  });

  const onSubmit = async (data) => {
    const id = uuidv4();
    data.id = id;
    data.projectId = slug.projectId;
    data.status = "Todo";
    data.createdDate = new Date();
    try {
      const docRef = doc(db, "project", docId);
      const colRef = collection(docRef, "task");
      await addDoc(colRef, {
        id: id,
        projectId: slug.projectId,
        taskpriority: data.taskpriority,
        taskname: data.taskname,
        taskdescription: data.taskdescription,
        status: "Todo",
        createdDate: new Date(),
      });

      dispatch(Add_Task(data));
      reset({
        taskpriority: "",
        taskname: "",
        taskdescription: "",
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <>
      <div
        className='modal fade'
        id='exampleTaskModal'
        tabIndex='-1'
        aria-labelledby='exampleModalLabel'
        aria-hidden='true'
      >
        <div className='modal-dialog'>
          <div className='modal-content'>
            <div className='modal-header'>
              <h5 className='modal-title' id='exampleModalLabel'>
                Add Task
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
                  fieldName='taskname'
                  type='text'
                  register={register}
                  errors={errors}
                  placeHolder='Enter TaskName*'
                  isRequired={true}
                  minimLength={3}
                  className='w-75'
                />
                <select
                  {...register("taskpriority")}
                  className='d-block my-3 w-50'
                >
                  <option selected value=''>
                    Select priority
                  </option>
                  <option value='High'>High</option>
                  <option value='Low'>Low</option>
                </select>
                <textarea {...register("taskdescription")} className='w-50' />
                <button
                  type='submit'
                  className='btn btn-primary ms-3 btn-sm d-block'
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

export default TaskCreateModal;
