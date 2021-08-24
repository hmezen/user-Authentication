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
  FormControlLabel,
  Checkbox,
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

const LoginDialog = (props) => {
  const classes = useStyles();

  return (
    <Dialog
      open={props.loginModalIsOpen}
      TransitionComponent={Transition}
      keepMounted
      onClose={props.setLoginModalIsOpen}
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
        <Typography variant="h5">Sign in</Typography>
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={props.setLoginModalIsOpen}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Container component="main" maxWidth="xs">
          <div className={classes.modalPaper}>
            <form className={classes.form} validate>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="signInEmail"
                autoComplete="email"
                autoFocus
                value={props.state.signInEmail}
                onChange={(event) =>
                  props.handleLoginDialogChange({
                    type: "updateField",
                    field: "signInEmail",
                    value: event.target.value,
                  })
                }
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="signInPassword"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={props.state.signInPassword}
                onChange={(event) =>
                  props.handleLoginDialogChange({
                    type: "updateField",
                    field: "signInPassword",
                    value: event.target.value,
                  })
                }
              />
              <FormControlLabel
                control={
                  <Checkbox
                    value="remember"
                    color="primary"
                    checked={props.state.signInRememberMe}
                    onChange={(event) =>
                      props.handleLoginDialogChange({
                        type: "updateField",
                        field: "signInRememberMe",
                        value: event.target.checked,
                      })
                    }
                  />
                }
                label="Remember me"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                onClick={props.handleSignIn}
              >
                Sign In
              </Button>
              <Grid container>
                <Grid item xs>
                  {/* <Link to="#" variant="body2">
                    Forgot password?
                  </Link> */}
                </Grid>
                <Grid item>
                  <Link to="#" variant="body2" onClick={props.signUp}>
                    Don't have an account? Sign Up
                  </Link>
                </Grid>
              </Grid>
            </form>
          </div>
          <Box mt={8}></Box>
        </Container>
      </DialogContent>
    </Dialog>
  );
};

export default LoginDialog;
