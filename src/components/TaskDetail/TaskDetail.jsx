import { React, useEffect } from "react";
import styles from "../Dashboard/Dashboard.module.css";
import downarrow from "../../assets/downarrow.svg";
import TaskEditModal from "../Modal/TaskEdit";
import TaskDeleteModal from "../Modal/TaskDelete";
import TaskCreateModal from "../Modal/TaskCreate";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import files from "../../assets/files.png";
import comments from "../../assets/comments.png";
import editdeleteproject from "../../assets/editdeleteproject.svg";
import inviteuser from "../../assets/inviteuser.svg";
import editIcon from "../../assets/editIcon.svg";
import linkIcon from "../../assets/linkIcon.svg";
import calendar from "../../assets/calendar.svg";
import filterIcon from "../../assets/filterIcon.svg";
import users from "../../assets/users.svg";
import user from "../../assets/user.png";
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
import { Fetch_Task } from "../../redux/taskDetail/taskAction";
import { useState } from "react";

const TaskDetail = () => {
  const [taskId, setTaskId] = useState();
  const [onProgressData, setOnProgressData] = useState([]);
  const dispatch = useDispatch();
  const taskDetail = useSelector((state) => state.taskReducer);
  const slug = useParams();
  const projectDetail = useSelector((state) => state.projectReducer);
  const currentProject = projectDetail.find(
    (item) => item.id === slug.projectId
  );

  const fetchTaskData = async () => {
    try {
      const q = query(collection(db, "task"));
      const doc = await getDocs(q);
      // const data = doc.docs[0].data();
      // const dataId = doc.docs[0].id;
      doc.forEach((doc) => {
        dispatch(Fetch_Task(doc.data()));
      });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTaskData();
  }, []);

  const [taskData, setTaskData] = useState([]);

  useEffect(() => {
    let taskdata = taskDetail.filter(
      (item) => item.projectId === slug.projectId
    );
    setTaskData(taskdata);
  }, [taskDetail, slug]);

  const getProjectId = (id) => {
    setTaskId(id);
  };

  const dragStarted = (e, id) => {
    console.log("Drag has started");
    e.dataTransfer.setData("taskId", id);
  };

  const draggingOver = (e) => {
    e.preventDefault();
    console.log("Dragging over now");
  };

  const dragDropped = (e) => {
    console.log("you have dropped");
    let transferedTaskId = e.dataTransfer.getData("taskId");
    const data = taskData.filter((item) => item.id === transferedTaskId);
    setOnProgressData((current) => [...current, data[0]]);
    const tData = taskData.filter((item) => item.id !== transferedTaskId);
    setTaskData(tData);
  };

  return (
    <>
      <div className={styles.projectnameandinvite}>
        <div className={styles.projectInfo}>
          {currentProject ? <p>{currentProject.projectname}</p> : ""}
          <img src={editIcon} alt='noediticonimage' />
          <img src={linkIcon} alt='nolinkiconimage' />
        </div>
        <div className={styles.inviteuserinfo}>
          <img
            src={inviteuser}
            alt='noinviteuserimage'
            className={styles.inviteuserimage}
          />
          <p>Invite</p>
          <img src={users} alt='nousersimage' className={styles.usersimage} />
        </div>
      </div>
      <div className={styles.filtersection}>
        <div className={styles.filter}>
          <img
            src={filterIcon}
            alt='nofiltericonimage'
            className={styles.filtericonimage}
          />
          <p>Filter</p>
          <img
            src={downarrow}
            alt='nodownarrowimage'
            className={styles.downarrowimage}
          />
        </div>
        <div className={styles.filterbydate}>
          <img
            src={calendar}
            alt='nocalendarimage'
            className={styles.calendarimage}
          />
          <p>Today</p>
          <img
            src={downarrow}
            alt='nodownarrowimage'
            className={styles.downarrowimage}
          />
        </div>
      </div>
      <div className={styles.tasksection}>
        <div className={styles.todosection}>
          <div className={styles.todoHeader}>
            <p className={styles.tododot}></p>
            <p className={styles.todotext}>To Do</p>
            <p className={styles.todolength}>{taskData.length}</p>
            <img
              src={inviteuser}
              alt='noinviteuserimage'
              className={styles.todoimage}
              type='button'
              data-bs-toggle='modal'
              data-bs-target='#exampleTaskModal'
            />
            <TaskCreateModal />
          </div>
          <p className={styles.todoline}></p>
          {taskData.length > 0 ? (
            taskData.map((item, index) => (
              <div
                className={styles.task}
                key={index}
                onDragStart={(e) => dragStarted(e, item.id)}
                draggable
              >
                <div className={styles.taskHeader}>
                  <div className={styles.taskPriority}>
                    <p className={styles.taskpriorityText}>
                      {item.taskpriority}
                    </p>
                  </div>
                  <img
                    src={editdeleteproject}
                    alt='noeditdeletetask'
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
                        data-bs-target='#exampleTaskEditModal'
                        onClick={() => getProjectId(item.id)}
                      >
                        Edit Task
                      </p>
                    </li>
                    <li>
                      <p
                        type='button'
                        data-bs-toggle='modal'
                        data-bs-target='#exampleDeleteTaskModal'
                        onClick={() => getProjectId(item.id)}
                      >
                        Delete Task
                      </p>
                    </li>
                  </ul>
                  <TaskDeleteModal taskId={taskId} />
                  <TaskEditModal taskId={taskId} />
                </div>
                <div className={styles.taskName}>{item.taskname}</div>
                <div className={styles.taskDescription}>
                  {item.taskdescription}
                </div>
                <div className={styles.taskFooter}>
                  <img
                    src={user}
                    alt='nouserImage'
                    className={styles.userImage}
                  />
                  <div className={styles.comments}>
                    <img
                      src={comments}
                      alt='nocommentsImage'
                      className={styles.commentsImage}
                    />
                    <p className={styles.commentsText}>12 comments</p>
                  </div>
                  <div className={styles.files}>
                    <img
                      src={files}
                      alt='nofilesImage'
                      className={styles.filesImage}
                    />
                    <p className={styles.filesText}>0 files</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className={styles.task}>No Task Available</div>
          )}
        </div>
        <div
          className={styles.onprogresssection}
          droppable='true'
          onDragOver={(e) => draggingOver(e)}
          onDrop={(e) => dragDropped(e)}
        >
          <div className={styles.onprogressHeader}>
            <p className={styles.onprogressdot}></p>
            <p className={styles.onprogresstext}>On Progress</p>
            <p className={styles.onprogresslength}>{onProgressData.length}</p>
          </div>
          <p className={styles.onprogressline}></p>
          {onProgressData.length > 0 ? (
            onProgressData.map((item, index) => (
              <div
                className={styles.task}
                key={index}
                onDragStart={(e) => dragStarted(e, item.id)}
                draggable
              >
                <div className={styles.taskHeader}>
                  <div className={styles.taskPriority}>
                    <p className={styles.taskpriorityText}>
                      {item.taskpriority}
                    </p>
                  </div>
                  <img
                    src={editdeleteproject}
                    alt='noeditdeletetask'
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
                        Edit Task
                      </p>
                    </li>
                    <li>
                      <p
                        type='button'
                        data-bs-toggle='modal'
                        data-bs-target='#exampleDeleteTaskModal'
                        onClick={() => getProjectId(item.id)}
                      >
                        Delete Task
                      </p>
                    </li>
                  </ul>
                  <TaskDeleteModal taskId={taskId} />
                </div>
                <div className={styles.taskName}>{item.taskname}</div>
                <div className={styles.taskDescription}>
                  {item.taskdescription}
                </div>
                <div className={styles.taskFooter}>
                  <img
                    src={user}
                    alt='nouserImage'
                    className={styles.userImage}
                  />
                  <div className={styles.comments}>
                    <img
                      src={comments}
                      alt='nocommentsImage'
                      className={styles.commentsImage}
                    />
                    <p className={styles.commentsText}>12 comments</p>
                  </div>
                  <div className={styles.files}>
                    <img
                      src={files}
                      alt='nofilesImage'
                      className={styles.filesImage}
                    />
                    <p className={styles.filesText}>0 files</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className={styles.task}>No Task Available</div>
          )}
        </div>
        <div className={styles.donesection}></div>
      </div>
    </>
  );
};

export default TaskDetail;
