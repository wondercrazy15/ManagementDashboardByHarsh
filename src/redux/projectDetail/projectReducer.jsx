import {
  ADD_PROJECT,
  UPDATE_PROJECT,
  DELETE_PROJECT,
  FETCH_PROJECT,
} from "./projectType";
let initialState = [];

const projectReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_PROJECT:
      const updatState = [...state, action.payload];
      const uData = [];

      const uniqueData = updatState.filter((element) => {
        const isDuplicate = uData.includes(element.id);
        if (!isDuplicate) {
          uData.push(element.id);
          return true;
        }
        return false;
      });
      return uniqueData;

    case ADD_PROJECT:
      return [...state, action.payload];

    case UPDATE_PROJECT:
      const updatedState = state.map((project) =>
        project.id === action.payload.id ? action.payload : project
      );
      return updatedState;

    case DELETE_PROJECT:
      const uState = state.filter((project) => project.id !== action.payload);
      return uState;

    default:
      return state;
  }
};

export default projectReducer;
