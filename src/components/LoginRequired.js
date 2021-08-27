import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import img from "../you-need-to-login.svg";
import { Alert } from "@material-ui/lab";
import { Grid } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: "20px",
  },
  image: {
    margin: "auto",
    height: "auto",
    maxHeight: "100%",
    maxWidth: "80%",
  },
  alert: {
    maxHeight: "100%",
    maxWidth: "100%",
  },
}));

const LoginRequired = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={4}
      >
        <Grid item xs={12} sm={12} lg={12}>
          {" "}
          <img className={classes.image} src={img} alt={""} />
        </Grid>
        <Grid item xs={12} sm={12} lg={12}>
          <Alert className={classes.alert} severity="error">
            This page cannot be accessed - you have to sign in first!
          </Alert>
        </Grid>
      </Grid>
    </div>
  );
};

export default LoginRequired;
