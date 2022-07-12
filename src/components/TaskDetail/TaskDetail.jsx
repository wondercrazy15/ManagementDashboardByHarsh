import { React, useEffect } from "react";
import styles from "../Dashboard/Dashboard.module.css";
import downarrow from "../../assets/downarrow.svg";
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

const TaskDetail = () => {
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

  const taskData = taskDetail.filter(
    (item) => item.projectId === slug.projectId
  );
  console.log(taskData);
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
            <div className={styles.task}>
              <div className={styles.taskHeader}>
                <div className={styles.taskPriority}>
                  <p className={styles.taskpriorityText}>Low</p>
                </div>
                <img src={editdeleteproject} alt='noeditdeletetask' />
              </div>
              <div className={styles.taskName}>Brainstorming</div>
              <div className={styles.taskDescription}>
                Brainstorming brings team members' diverse experience into play.
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
          ) : (
            <div className={styles.task}>No Task Available</div>
          )}
        </div>
        <div className={styles.onprogresssection}></div>
        <div className={styles.donesection}></div>
      </div>
    </>
  );
};

export default TaskDetail;
