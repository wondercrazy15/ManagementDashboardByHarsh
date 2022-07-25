import { React, useEffect } from "react";
import styles from "../Dashboard/Dashboard.module.css";
import downarrow from "../../assets/downarrow.svg";
import Calendar from "react-calendar";
import { Edit_Task } from "../../redux/taskDetail/taskAction";
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
import "react-calendar/dist/Calendar.css";
import {
  query,
  collection,
  getDocs,
  where,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
  collectionGroup,
} from "firebase/firestore/lite";
import { auth, db } from "../../firebase/firebase";
import { Fetch_Task } from "../../redux/taskDetail/taskAction";
import { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

const TaskDetail = () => {
  const [docId, setDocId] = useState();
  const [taskDocId, setTaskDocId] = useState();
  const [priority, setPriority] = useState("");
  const [date, setDate] = useState();
  const [month, setMonth] = useState();
  const [monthText, setMonthText] = useState();
  const [day, setDay] = useState();
  const [year, setYear] = useState();
  const [showCalendar, setCalendar] = useState(false);
  const onDateChange = (date) => {
    setDate(date);
  };
  function toMonthName(monthNumber) {
    if (date) {
      setMonthText(
        date.toLocaleString("en-US", {
          month: "long",
        })
      );
    }
  }
  useEffect(() => {
    if (date) {
      setMonth(date.getUTCMonth() + 1);
      setYear(date.getUTCFullYear());
      setDay(date.getUTCDate() + 1);
      toMonthName(month);
    }
  }, [date]);

  const [taskId, setTaskId] = useState();
  const [onProgressData, setOnProgressData] = useState([]);
  const [doneData, setDoneData] = useState([]);
  const [onTodoData, setOnTodoData] = useState([]);
  const dispatch = useDispatch();
  const taskDetail = useSelector((state) => state.taskReducer);
  const slug = useParams();
  const projectDetail = useSelector((state) => state.projectReducer);
  const currentProject = projectDetail.find(
    (item) => item.id === slug.projectId
  );

  const fetchProjectData = async () => {
    try {
      const q = query(
        collection(db, "project"),
        where("id", "==", slug?.projectId)
      );
      const doc = await getDocs(q);
      doc.forEach((doc) => {
        setDocId(doc.id);
      });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProjectData();
  }, [slug?.projectId]);

  const fetchTaskData = async () => {
    try {
      const q = query(collection(db, "project", `${docId}`, "task"));
      const doc = await getDocs(q);
      doc.forEach((doc) => {
        dispatch(Fetch_Task(doc.data()));
      });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTaskData();
  }, [docId]);

  const [taskData, setTaskData] = useState([]);

  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;
    if (source.droppableId === "Todo") {
      const data = onTodoData.filter((item) => item.id !== draggableId);
      setOnTodoData(data);
    }
    if (source.droppableId === "onProgress") {
      const data = onProgressData.filter((item) => item.id !== draggableId);
      setOnProgressData(data);
    }
    if (source.droppableId === "done") {
      const data = doneData.filter((item) => item.id !== draggableId);
      setDoneData(data);
    }
    if (destination.droppableId === "Todo") {
      const data = taskData.find((item) => item.id === draggableId);
      data.status = "Todo";
      const q = query(
        collection(db, "project", `${docId}`, "task"),
        where("id", "==", draggableId)
      );
      let id;
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        id = doc.id;
      });
      const colRef = doc(db, `project/${docId}/task/${id}`);
      await updateDoc(colRef, {
        status: "Todo",
        taskname: data.taskname,
        taskdescription: data.taskdescription,
        taskpriority: data.taskpriority,
      });
      dispatch(Edit_Task(data));
    }
    if (destination.droppableId === "onProgress") {
      const data = taskData.find((item) => item.id === draggableId);
      data.status = "onProgress";
      const q = query(
        collection(db, "project", `${docId}`, "task"),
        where("id", "==", draggableId)
      );
      let id;
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        id = doc.id;
      });
      const colRef = doc(db, `project/${docId}/task/${id}`);
      await updateDoc(colRef, {
        status: "onProgress",
        taskname: data.taskname,
        taskdescription: data.taskdescription,
        taskpriority: data.taskpriority,
      });
      dispatch(Edit_Task(data));
    }
    if (destination.droppableId === "done") {
      const data = taskData.find((item) => item.id === draggableId);
      data.status = "done";
      const q = query(
        collection(db, "project", `${docId}`, "task"),
        where("id", "==", draggableId)
      );
      let id;
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        id = doc.id;
      });
      const colRef = doc(db, `project/${docId}/task/${id}`);
      await updateDoc(colRef, {
        status: "done",
        taskname: data.taskname,
        taskdescription: data.taskdescription,
        taskpriority: data.taskpriority,
      });
      dispatch(Edit_Task(data));
    }
  };

  const getProjectId = (id) => {
    setTaskId(id);
  };

  useEffect(() => {
    let taskdata = taskDetail.filter(
      (item) => item.projectId === slug.projectId
    );
    setTaskData(taskdata);
  }, [taskDetail, slug]);

  useEffect(() => {
    if (taskData) {
      const onpData = taskData.filter((item) => item.status === "onProgress");
      setOnProgressData(onpData);
    }
    if (month || priority) {
      if (month) {
        const onpData = taskData.filter((item) => {
          if (item.status === "onProgress") {
            return (
              item.createdDate.toDate().getUTCMonth() + 1 === month &&
              item.createdDate.toDate().getUTCDate() === day &&
              item.createdDate.toDate().getUTCFullYear() === year
            );
          }
        });
        setOnProgressData(onpData);
      }
      if (priority) {
        setOnProgressData(() =>
          taskData.filter((item) => {
            if (item.status === "onProgress") {
              return item.taskpriority === priority;
            }
          })
        );
      }
    }
    if (month && priority) {
      setOnProgressData(() =>
        taskData.filter((item) => {
          if (item.status === "onProgress") {
            return (
              item.taskpriority === priority &&
              item.createdDate.toDate().getUTCMonth() + 1 === month &&
              item.createdDate.toDate().getUTCDate() === day &&
              item.createdDate.toDate().getUTCFullYear() === year
            );
          }
        })
      );
    }
  }, [taskData, month, day, year, priority]);

  useEffect(() => {
    const ontData = taskData.filter((item) => item.status === "Todo");
    setOnTodoData(ontData);
    if (month || priority) {
      if (month) {
        const onpData = taskData.filter((item) => {
          if (item.status === "Todo") {
            return (
              item.createdDate.toDate().getUTCMonth() + 1 === month &&
              item.createdDate.toDate().getUTCDate() === day &&
              item.createdDate.toDate().getUTCFullYear() === year
            );
          }
        });
        setOnTodoData(onpData);
      }
      if (priority) {
        setOnTodoData(() =>
          taskData.filter((item) => {
            if (item.status === "Todo") {
              return item.taskpriority === priority;
            }
          })
        );
      }
    }
    if (month && priority) {
      setOnTodoData(() =>
        taskData.filter((item) => {
          if (item.status === "Todo") {
            return (
              item.taskpriority === priority &&
              item.createdDate.toDate().getUTCMonth() + 1 === month &&
              item.createdDate.toDate().getUTCDate() === day &&
              item.createdDate.toDate().getUTCFullYear() === year
            );
          }
        })
      );
    }
  }, [taskData, month, day, year, priority]);

  useEffect(() => {
    const doneData = taskData.filter((item) => item.status === "done");
    setDoneData(doneData);
    if (month || priority) {
      if (month) {
        const onpData = taskData.filter((item) => {
          if (item.status === "done") {
            return (
              item.createdDate.toDate().getUTCMonth() + 1 === month &&
              item.createdDate.toDate().getUTCDate() === day &&
              item.createdDate.toDate().getUTCFullYear() === year
            );
          }
        });
        setDoneData(onpData);
      }
      if (priority) {
        setDoneData(() =>
          taskData.filter((item) => {
            if (item.status === "done") {
              return item.taskpriority === priority;
            }
          })
        );
      }
    }
    if (month && priority) {
      setDoneData(() =>
        taskData.filter((item) => {
          if (item.status === "done") {
            return (
              item.taskpriority === priority &&
              item.createdDate.toDate().getUTCMonth() + 1 === month &&
              item.createdDate.toDate().getUTCDate() === day &&
              item.createdDate.toDate().getUTCFullYear() === year
            );
          }
        })
      );
    }
  }, [taskData, month, day, year, priority]);

  const removeFilter = () => {
    setDate();
    setMonth();
    setYear();
    setDay();
    setPriority("");
  };

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
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
              type='button'
              id='dropdownMenuButton1'
              data-bs-toggle='dropdown'
              aria-expanded='false'
              style={{ marginLeft: "12px", opacity: "0.8" }}
            />
            <ul className='dropdown-menu' aria-labelledby='dropdownMenuButton1'>
              <li
                onClick={() => {
                  setPriority("High");
                }}
              >
                <a className='dropdown-item' href='#'>
                  High
                </a>
              </li>
              <li
                onClick={() => {
                  setPriority("Low");
                }}
              >
                <a className='dropdown-item' href='#'>
                  Low
                </a>
              </li>
            </ul>
          </div>
          <div
            className={styles.filterbydate}
            onClick={() => {
              setCalendar(!showCalendar);
            }}
          >
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
        {showCalendar && (
          <div style={{ position: "absolute" }}>
            <Calendar onChange={onDateChange} value={date} />
          </div>
        )}

        {(date || priority) && (
          <p className={styles.filterText}>
            {date && priority ? (
              <span>
                you have selected tasks which created at date:
                <span
                  className={styles.filtertext}
                >{`${day} ${monthText} ${year}`}</span>
                and whose priority is:
                <span className={styles.filtertext}>{priority}</span>
              </span>
            ) : (
              <>
                {date ? (
                  <span>
                    you have selected tasks which created at date:
                    <span
                      className={styles.filtertext}
                    >{`${day} ${monthText} ${year}`}</span>
                  </span>
                ) : (
                  <span>
                    you have selected tasks whose priority is:
                    <span className={styles.filtertext}>{priority}</span>
                  </span>
                )}
              </>
            )}

            <i
              className='fa-solid fa-xmark'
              type='button'
              onClick={removeFilter}
            ></i>
          </p>
        )}

        <div className={styles.tasksection}>
          <Droppable droppableId='Todo'>
            {(provided) => (
              <div
                className={styles.todosection}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <div className={styles.todoHeader}>
                  <p className={styles.tododot}></p>
                  <p className={styles.todotext}>To Do</p>
                  <p className={styles.todolength}>{onTodoData.length}</p>
                  <img
                    src={inviteuser}
                    alt='noinviteuserimage'
                    className={styles.todoimage}
                    type='button'
                    data-bs-toggle='modal'
                    data-bs-target='#exampleTaskModal'
                  />
                  <TaskCreateModal docId={docId} />
                </div>
                <p className={styles.todoline}></p>
                {onTodoData.length > 0 ? (
                  onTodoData.map((item, index) => (
                    <Draggable draggableId={item.id} index={index}>
                      {(provided) => (
                        <div
                          className={styles.task}
                          key={index}
                          index={index}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          ref={provided.innerRef}
                        >
                          <div className={styles.taskHeader}>
                            <div className={styles.taskPriority}>
                              <p className={styles.taskpriorityText}>
                                {item.taskpriority}
                              </p>
                            </div>
                            <div
                              type='button'
                              id='dropdownMenuButton1'
                              data-bs-toggle='dropdown'
                              aria-expanded='false'
                            >
                              <img
                                src={editdeleteproject}
                                alt='noeditdeletetask'
                              />
                            </div>
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
                            <TaskDeleteModal taskId={taskId} docID={docId} />
                            <TaskEditModal taskId={taskId} docID={docId} />
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
                      )}
                    </Draggable>
                  ))
                ) : (
                  <div className={styles.task}>No Task Available</div>
                )}
              </div>
            )}
          </Droppable>
          <Droppable droppableId='onProgress'>
            {(provided) => (
              <div
                className={styles.onprogresssection}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <div className={styles.onprogressHeader}>
                  <p className={styles.onprogressdot}></p>
                  <p className={styles.onprogresstext}>On Progress</p>
                  <p className={styles.onprogresslength}>
                    {onProgressData?.length}
                  </p>
                </div>
                <p className={styles.onprogressline}></p>
                {onProgressData.length > 0 ? (
                  onProgressData.map((item, index) => (
                    <Draggable draggableId={item.id} index={index}>
                      {(provided) => (
                        <div
                          className={styles.task}
                          key={index}
                          index={index}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          ref={provided.innerRef}
                        >
                          <div className={styles.taskHeader}>
                            <div className={styles.taskPriority}>
                              <p className={styles.taskpriorityText}>
                                {item.taskpriority}
                              </p>
                            </div>
                            <div
                              type='button'
                              id='dropdownMenuButton1'
                              data-bs-toggle='dropdown'
                              aria-expanded='false'
                            >
                              <img
                                src={editdeleteproject}
                                alt='noeditdeletetask'
                              />
                            </div>
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
                      )}
                    </Draggable>
                  ))
                ) : (
                  <div className={styles.task}>No Task Available</div>
                )}
              </div>
            )}
          </Droppable>
          <Droppable droppableId='done'>
            {(provided) => (
              <div
                className={styles.donesection}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <div className={styles.onprogressHeader}>
                  <p className={styles.onprogressdot}></p>
                  <p className={styles.onprogresstext}>Done</p>
                  <p className={styles.onprogresslength}>{doneData?.length}</p>
                </div>
                <p className={styles.doneline}></p>
                {doneData.length > 0 ? (
                  doneData.map((item, index) => (
                    <Draggable draggableId={item.id} index={index}>
                      {(provided) => (
                        <div
                          className={styles.task}
                          key={index}
                          index={index}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          ref={provided.innerRef}
                        >
                          <div className={styles.taskHeader}>
                            <div className={styles.taskPriority}>
                              <p className={styles.taskpriorityText}>
                                {item.taskpriority}
                              </p>
                            </div>
                            <div
                              type='button'
                              id='dropdownMenuButton1'
                              data-bs-toggle='dropdown'
                              aria-expanded='false'
                            >
                              <img
                                src={editdeleteproject}
                                alt='noeditdeletetask'
                              />
                            </div>
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
                      )}
                    </Draggable>
                  ))
                ) : (
                  <div className={styles.task}>No Task Available</div>
                )}
              </div>
            )}
          </Droppable>
        </div>
      </DragDropContext>
    </>
  );
};

export default TaskDetail;
