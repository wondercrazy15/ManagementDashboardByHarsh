import { FETCH_TASK, ADD_TASK, UPDATE_TASK, DELETE_TASK } from "./taskType";

export function Fetch_Task(data) {
  return {
    type: FETCH_TASK,
    payload: data,
  };
}

export function Add_Task(data) {
  return {
    type: ADD_TASK,
    payload: data,
  };
}

export function Edit_Task(data) {
  return {
    type: UPDATE_TASK,
    payload: data,
  };
}

export function Delete_Task(id) {
  return {
    type: DELETE_TASK,
    payload: id,
  };
}
