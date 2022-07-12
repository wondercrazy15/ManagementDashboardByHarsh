import { FETCH_TASK, ADD_TASK, UPDATE_TASK, DELETE_TASK } from "./taskType";
let initialState = [];

const taskReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_TASK:
      return [...state, action.payload];

    case ADD_TASK:
      return [...state, action.payload];

    case UPDATE_TASK:
      const updatedState = state.map((task) =>
        task.id === action.payload.id ? action.payload : task
      );
      return updatedState;

    case DELETE_TASK:
      const uState = state.filter((task) => task.id !== action.payload);
      return uState;

    default:
      return state;
  }
};

export default taskReducer;
