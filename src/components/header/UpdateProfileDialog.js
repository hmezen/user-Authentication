import React, { forwardRef } from "react";
import CreateIcon from "@material-ui/icons/Create";
import CloseIcon from "@material-ui/icons/Close";
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
  IconButton,
  Fab,
  CircularProgress,
} from "@material-ui/core";
import { useAuth } from "../../firebase/firebaseProvider";

const Transition = forwardRef((props, ref) => {
  return <Slide direction="down" ref={ref} {...props} />;
});

const UpdateProfileDialog = (props) => {
  const { user } = useAuth();
  const classes = useStyles();

  return (
    <Dialog
      open={props.updateProfileDialogIsOpen}
      TransitionComponent={Transition}
      keepMounted
      onClose={props.setUpdateProfileDialogIsOpen}
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle className={classes.dialogHeader}>
        <div className={classes.wrapper}>
          <Fab aria-label="save" color="secondary">
            <CreateIcon />
          </Fab>
          {props.showAnimation ? (
            <CircularProgress size={68} className={classes.fabProgress} />
          ) : null}
        </div>
        <Typography variant="h5">Profile</Typography>
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={props.setUpdateProfileDialogIsOpen}
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
                    name="firstName"
                    variant="outlined"
                    fullWidth
                    id="update-profile-first-name"
                    label="First name"
                    autoFocus
                    value={props.userProfileContent.firstName}
                    onChange={props.setUserContent}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    variant="outlined"
                    fullWidth
                    id="update-profile-last-name"
                    label="Last Name"
                    name="lastName"
                    autoComplete="lname"
                    value={props.userProfileContent.lastName}
                    onChange={props.setUserContent}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    multiline
                    rows={2}
                    fullWidth
                    label="Avatar Url"
                    name="avatarUrl"
                    autoComplete="avatar url"
                    value={props.userProfileContent.avatarUrl}
                    onChange={props.setUserContent}
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                onClick={props.saveProfileChnages}
              >
                save changes
              </Button>
            </form>
          </div>
          <Box mt={5}></Box>
        </Container>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateProfileDialog;
