import { ADD_PROJECT, UPDATE_PROJECT, DELETE_PROJECT } from "./projectType";

export function Add_Project(data) {
  return {
    type: ADD_PROJECT,
    payload: data,
  };
}

export function Edit_Project(data) {
  return {
    type: UPDATE_PROJECT,
    payload: data,
  };
}

export function Delete_Project(id) {
  return {
    type: DELETE_PROJECT,
    payload: id,
  };
}
