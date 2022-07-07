import { GET_CURRENT_USER, LOGOUT } from "./currentUserType";

export function Get_CurrentUser(data) {
  return {
    type: GET_CURRENT_USER,
    payload: data,
  };
}

export function LogoutUser(data) {
  return {
    type: LOGOUT,
    payload: data,
  };
}
