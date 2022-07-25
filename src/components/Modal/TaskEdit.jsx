import { React, useEffect, useState } from "react";
import Input from "../../atoms/Input";
import { useForm, Controller } from "react-hook-form";
import { useParams } from "react-router-dom";
import { Edit_Task } from "../../redux/taskDetail/taskAction";
import { v4 as uuidv4 } from "uuid";
import { Add_Task } from "../../redux/taskDetail/taskAction";
import {
  query,
  collection,
  getDocs,
  where,
  addDoc,
  updateDoc,
  doc,
} from "firebase/firestore/lite";
import { auth, db } from "../../firebase/firebase";
import { useDispatch, useSelector } from "react-redux";

const TaskEditModal = ({ taskId, docID }) => {
  const slug = useParams();
  const dispatch = useDispatch();
  const taskDetail = useSelector((state) => state.taskReducer);

  const currentTask = taskDetail.find((item) => item.id === taskId);
  const {
    register,
    handleSubmit,
    watch,
    formState,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });
  const [docId, setDocId] = useState();

  const fetchTaskData = async () => {
    try {
      const q = query(
        collection(db, "project", `${docID}`, "task"),
        where("id", "==", taskId)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setDocId(doc.id);
      });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTaskData();
  }, [docID, taskId]);

  const onSubmit = async (data) => {
    data.id = taskId;
    data.projectId = slug.projectId;
    data.status = currentTask?.status;
    data.createdDate = currentTask?.createdDate;

    try {
      const colRef = doc(db, `project/${docID}/task/${docId}`);
      await updateDoc(colRef, {
        taskname: data.taskname,
        taskdescription: data.taskdescription,
        taskpriority: data.taskpriority,
      });
      dispatch(Edit_Task(data));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div
        className='modal fade'
        id='exampleTaskEditModal'
        tabIndex='-1'
        aria-labelledby='exampleModalLabel'
        aria-hidden='true'
      >
        <div className='modal-dialog'>
          <div className='modal-content'>
            <div className='modal-header'>
              <h5 className='modal-title' id='exampleModalLabel'>
                Edit Task
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
                  defaultValue={currentTask?.taskname}
                />
                <select
                  {...register("taskpriority")}
                  className='d-block my-3 w-50'
                  defaultValue={currentTask?.taskpriority}
                >
                  <option selected value=''>
                    Select priority
                  </option>
                  <option value='High'>High</option>
                  <option value='Low'>Low</option>
                </select>
                <textarea
                  {...register("taskdescription")}
                  className='w-50'
                  defaultValue={currentTask?.taskdescription}
                />
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

export default TaskEditModal;
