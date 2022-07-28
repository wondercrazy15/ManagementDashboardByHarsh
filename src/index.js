import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import userReducer from "./redux/userDetail/userDetailReducer";
import taskReducer from "./redux/taskDetail/taskReducer";
import { createStore, applyMiddleware, compose, combineReducers } from "redux";
import currentUserReducer from "./redux/currentUser/currentUserReducer";
import { composeWithDevTools } from "redux-devtools-extension";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";
import projectReducer from "./redux/projectDetail/projectReducer";

const root = ReactDOM.createRoot(document.getElementById("root"));
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const rootReducer = combineReducers({
  currentUserReducer,
  projectReducer,
  taskReducer,
  userReducer,
});
const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk))
);
root.render(
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>
);
