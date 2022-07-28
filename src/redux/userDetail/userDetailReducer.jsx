import { FETCH_USER, UPDATE_USER } from "./userDetailType";
let initialState = [];

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_USER:
      // const updatState = [...state, action.payload];
      // const uData = [];

      // const uniqueData = updatState.filter((element) => {
      //   const isDuplicate = uData.includes(element.id);
      //   if (!isDuplicate) {
      //     uData.push(element.id);
      //     return true;
      //   }
      //   return false;
      // });

      return [...state, action.payload];

    case UPDATE_USER:
      const updatedState = state.map((user) =>
        user.uid === action.payload.uid ? action.payload : user
      );
      console.log(updatedState);
      return updatedState;

    default:
      return state;
  }
};

export default userReducer;
