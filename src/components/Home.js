import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typography, Paper, Grid } from "@material-ui/core";
import image from "../assests/dreamer.png";
const useStyles = makeStyles((theme) => ({
  paper: {
    width: "100%",
  },
  content: {
    padding: theme.spacing(2),
  },
  image: {
    margin: "auto",
    height: "auto",
    maxHeight: "100%",
    maxWidth: "100%",
  },
}));

function Home() {
  const classes = useStyles();
  return (
    <React.Fragment>
      <Paper className={classes.paper}>
        <div className={classes.content}>
          <Typography variant="h1" color="primary" gutterBottom>
            Home
          </Typography>

          <Grid container spacing={3}>
            <Grid item sm={12} lg={6} xs={12}>
              <br />

              <Typography variant="h5" color="inherit" paragraph>
                Welcome to my Firebase user authentication proof-of-concept.
                <br />
                This is a responsive react application that uses Firebase for
                user authentication. a user can create an account, sign in and
                update their profile.
                <br />
                Current capabilities :
                <ul>
                  <li>Sign in</li>
                  <li>Sign up</li>
                  <li>Update profile</li>
                  <li>Access "Private page" when a user is logged in</li>
                  <li>
                    Access "Admin page" when a user has admin permissions (by
                    default new signed up users won't have the admin
                    permissions, these are user credentials with admin
                    permission you can use them for testing purposes)
                  </li>
                </ul>
                <br />
                upcoming features :{" "}
                <ul>
                  <li>Welcoming email</li>
                  <li>Forgot email</li>
                </ul>
              </Typography>
            </Grid>
            <Grid item sm={12} lg={6} xs={6}>
              <img className={classes.image} src={image} alt={""} />
            </Grid>
          </Grid>
        </div>
      </Paper>
    </React.Fragment>
  );
}

export default Home;
