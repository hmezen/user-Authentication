import React from "react";
import { Route, Switch } from "react-router-dom";
import Header from "./components/header/Header";
import Home from "./components/Home";
import GenericNotFound from "./components/GenericNotFound";
import { makeStyles } from "@material-ui/core/styles";
import { useAuth } from "./firebase/firebaseProvider";
import ReactChallenge from "./components/ReactChallenge";
import PrivateRoute from "./components/PrivateRoute";
import LoginRequired from "./components/LoginRequired";
import PrivatePage from "./components/PrivatePage";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    padding: theme.spacing(2),
    flexGrow: 1,
    height: "100vh",
    overflow: "auto",
  },
}));

function App() {
  const classes = useStyles();
  const { loading } = useAuth();

  if (loading) {
    return <div>loading ...</div>;
  }
  return (
    <>
      <div className={classes.root}>
        <Header />
        <main className={classes.content}>
          <div className={classes.appBarSpacer} />
          <Switch>
            <Route path="/" component={Home} exact />
            <Route path="/reactChallenge" component={ReactChallenge} exact />
            <Route path="/loginRequired" component={LoginRequired} exact />
            <PrivateRoute path="/privatePage" component={PrivatePage} exact />
            <Route component={GenericNotFound} exact />
          </Switch>
        </main>
      </div>
    </>
  );
}

export default App;
