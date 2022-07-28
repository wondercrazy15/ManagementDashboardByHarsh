import { GET_CURRENT_USER, LOGOUT } from "./currentUserType";
let initialState = {
  firstname: "",
  lastname: "",
  email: "",
  country: "",
  state: "",
  uid: "",
  url: "",
  role: "",
};

const currentUserReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_CURRENT_USER:
      return action.payload;
    case LOGOUT:
      return action.payload;
    default:
      return state;
  }
};

export default currentUserReducer;
