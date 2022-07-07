import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createStore, applyMiddleware, compose, combineReducers } from "redux";
import currentUserReducer from "./redux/currentUser/currentUserReducer";
import { composeWithDevTools } from "redux-devtools-extension";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// const rootReducer = combineReducers({});
const store = createStore(
  currentUserReducer,
  composeEnhancers(applyMiddleware(thunk))
);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <App />
      </Router>
    </Provider>
  </React.StrictMode>
);
