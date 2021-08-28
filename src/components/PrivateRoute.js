import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useAuth } from "../firebase/firebaseProvider";

const PrivateRoute = ({ path, component, permission, ...rest }) => {
  const { user } = useAuth();
  return user ? (
    permission ? (
      user.roles[permission] ? (
        <Route path={path} component={component} {...rest} />
      ) : (
        <Redirect to={"/accessDenied"} />
      )
    ) : (
      <Route path={path} component={component} {...rest} />
    )
  ) : (
    <Redirect to={"/loginRequired"} />
  );
};

export default PrivateRoute;
