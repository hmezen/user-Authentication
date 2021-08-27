import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useAuth } from "../firebase/firebaseProvider";
import LoginRequired from "./LoginRequired";

const PrivateRoute = ({ path, component, ...rest }) => {
  const { user } = useAuth();

  return user ? (
    <Route path={path} component={component} {...rest} />
  ) : (
    <Redirect to={"/loginRequired"} />
  );
};

export default PrivateRoute;
