import React, { forwardRef } from "react";
import { Link } from "react-router-dom";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import { useStyles } from "./header-styles";
import {
  Typography,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Slide,
  TextField,
  Grid,
  Box,
  Container,
  CircularProgress,
  Fab,
  IconButton,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const SignUpDialog = (props) => {
  const classes = useStyles();

  return (
    <Dialog
      open={props.signUpModalIsOpen}
      TransitionComponent={Transition}
      keepMounted
      onClose={props.setSignUpModalIsOpen}
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle className={classes.dialogHeader}>
        <div className={classes.wrapper}>
          <Fab aria-label="save" color="secondary">
            <LockOutlinedIcon />
          </Fab>
          {props.state.showLoadingAnimation && (
            <CircularProgress size={68} className={classes.fabProgress} />
          )}
        </div>
        <Typography variant="h5">Sign up</Typography>
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={props.setSignUpModalIsOpen}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Container component="main" maxWidth="xs">
          <div className={classes.modalPaper}>
            <form className={classes.form} validate>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    autoComplete="fname"
                    name="signUpFirstName"
                    variant="outlined"
                    fullWidth
                    id="firstName"
                    label="First Name"
                    autoFocus
                    value={props.state.signUpFirstName}
                    onChange={(event) =>
                      props.dispatchHeaderReducer({
                        type: "updateField",
                        field: "signUpFirstName",
                        value: event.target.value,
                      })
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    variant="outlined"
                    fullWidth
                    id="lastName"
                    label="Last Name"
                    name="signUpLastName"
                    autoComplete="lname"
                    value={props.state.signUpLastName}
                    onChange={(event) =>
                      props.dispatchHeaderReducer({
                        type: "updateField",
                        field: "signUpLastName",
                        value: event.target.value,
                      })
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="signUpEmail"
                    autoComplete="email"
                    value={props.state.signUpEmail}
                    onChange={(event) =>
                      props.dispatchHeaderReducer({
                        type: "updateField",
                        field: "signUpEmail",
                        value: event.target.value,
                      })
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    name="signUpPassword"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    value={props.state.signUpPassword}
                    onChange={(event) =>
                      props.dispatchHeaderReducer({
                        type: "updateField",
                        field: "signUpPassword",
                        value: event.target.value,
                      })
                    }
                    helperText={
                      props.state.signUpPassword
                        ? props.state.paswordStrength
                        : null
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    name="signUpPassword"
                    label="Confirm password"
                    type="password"
                    id="signUpConfirmPassword"
                    autoComplete="current-password"
                    value={props.state.signUpConfirmPassword}
                    onChange={(event) =>
                      props.dispatchHeaderReducer({
                        type: "updateField",
                        field: "signUpConfirmPassword",
                        value: event.target.value,
                      })
                    }
                  />
                </Grid>
              </Grid>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                onClick={props.handleSignUpUSer}
              >
                Sign Up
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link to="#" variant="body2" onClick={props.signIn}>
                    Already have an account? Sign in
                  </Link>
                </Grid>
              </Grid>
            </form>
          </div>
          <Box mt={5}></Box>
        </Container>
      </DialogContent>
    </Dialog>
  );
};

export default SignUpDialog;
