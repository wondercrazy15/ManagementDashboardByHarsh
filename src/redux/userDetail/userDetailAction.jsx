import { FETCH_USER, UPDATE_USER } from "./userDetailType";

export function Fetch_User(data) {
  return {
    type: FETCH_USER,
    payload: data,
  };
}

export function Edit_User(data) {
  return {
    type: UPDATE_USER,
    payload: data,
  };
}
