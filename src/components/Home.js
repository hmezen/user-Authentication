import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typography, Paper } from "@material-ui/core";
import { useAuth } from "../firebase/firebaseProvider";

const useStyles = makeStyles((theme) => ({
  paper: {
    width: "100%",
  },
  content: {
    padding: theme.spacing(2),
  },
}));

function Home() {
  const { user } = useAuth();
  const classes = useStyles();
  return (
    <React.Fragment>
      <Paper className={classes.paper}>
        <div className={classes.content}>
          <Typography variant="h4" color="primary" gutterBottom>
            Home
          </Typography>

          <Typography variant="h5" color="inherit" paragraph>
            Welcome to my Firebase user authentication proof-of-concept. <br />
            This is a responsive react application that uses Firebase for user
            authetication. a user can create an account, sign in and update
            profile. <br />
            <br />
            upcomming features :{" "}
            <ul>
              <li>Welcoming email.</li>
              <li>Forgot email.</li>
              <li>
                Enable private route (only give access to certain pages to
                logged in users).
              </li>
              <li>Enable users' permissions (like admin permissions...).</li>
            </ul>
          </Typography>
        </div>
      </Paper>
    </React.Fragment>
  );
}

export default Home;
