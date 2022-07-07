import React from "react";
import ApplicationRoutes from "./routes/Routes";
import CurrentUser from "./utils/currentUser";

export const App = () => {
  return (
    <>
      <ApplicationRoutes />
      <CurrentUser />
    </>
  );
};

export default App;
