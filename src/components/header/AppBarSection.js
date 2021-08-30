import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Avatar,
  Button,
  Badge,
  Menu,
  MenuItem,
  ListItemText,
  Tooltip,
  Grid,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import { useStyles } from "./header-styles";
import UpdateProfileDialog from "./UpdateProfileDialog";
import firebase from "../../firebase/firebaseApp";
import { useSnackbar } from "notistack";
import { useAuth } from "../../firebase/firebaseProvider";
import { withRouter } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import greenLantern from "../../lantern.png";

function AppBarSection({ history, ...props }) {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const { user, setUser } = useAuth();
  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState(null);
  const [updateProfileDialogIsOpen, setUpdateProfileDialogIsOpen] =
    useState(false);

  const [
    showUpdateProfileLoadingAnimation,
    setShowUpdateProfileLoadingAnimation,
  ] = useState(false);

  const [userProfileContent, setUserProfileContent] = useState({
    firstName: "",
    lastName: "",
    avatarUrl: "",
  });

  useEffect(() => {
    user &&
      setUserProfileContent({
        firstName: user.firstName,
        lastName: user.lastName,
        avatarUrl: user.avatarUrl,
      });
  }, [user]);

  const saveProfileChnages = (e) => {
    e.preventDefault();
    setShowUpdateProfileLoadingAnimation(true);

    firebase
      .firestore()
      .collection("users")
      .doc(user.email)
      .set({
        ...user,
        firstName: userProfileContent.firstName,
        lastName: userProfileContent.lastName,
        avatarUrl: userProfileContent.avatarUrl,
      })
      .then(() => {
        enqueueSnackbar("Update success", { variant: "success" });
        setUser({
          ...user,
          firstName: userProfileContent.firstName,
          lastName: userProfileContent.lastName,
          avatarUrl: userProfileContent.avatarUrl,
        });
        setUserProfileContent({
          firstName: "",
          lastName: "",
          avatarUrl: "",
        });
        setUpdateProfileDialogIsOpen(false);
        setShowUpdateProfileLoadingAnimation(false);
      })
      .catch((error) => {
        enqueueSnackbar(error.message, { variant: "error" });
        setShowUpdateProfileLoadingAnimation(false);
      });
  };

  const MyMenuItem = withStyles({
    root: {
      "&:hover": {
        backgroundColor: "rgb(231, 233, 236)",
        borderRadius: "4px",
      },
    },
  })(MenuItem);

  return (
    <>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar className={classes.toolbar}>
          <Grid
            container
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Grid item style={{ maxWidth: "100px" }}>
              <IconButton
                edge="start"
                color="primary"
                aria-label="open drawer"
                onClick={() =>
                  props.dispatchHeaderReducer({ type: "toggleDrawer" })
                }
                className={classes.menuButton}
              >
                <MenuIcon style={{ fontSize: 25 }} />
              </IconButton>
            </Grid>
            <Grid
              item
              style={{
                flexGrow: "100",
                textAlign: "center",
              }}
            >
              <img
                src={greenLantern}
                style={{
                  width: "50px",
                  height: "50px",
                }}
              />
            </Grid>
            <Grid item style={{ maxWidth: "200px" }}>
              {user ? (
                <div>
                  <div onClick={(e) => setUserMenuAnchorEl(e.currentTarget)}>
                    <Tooltip
                      title={
                        user.firstName + user.lastName !== ""
                          ? user.firstName + " " + user.lastName
                          : user.email
                      }
                      placement="left"
                    >
                      <Badge
                        color="secondary"
                        overlap="circular"
                        badgeContent=" "
                        variant="dot"
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "left",
                        }}
                      >
                        <Avatar src={user.avatarUrl} />
                      </Badge>
                    </Tooltip>
                  </div>

                  <Menu
                    anchorEl={userMenuAnchorEl}
                    keepMounted
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "left",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    open={Boolean(userMenuAnchorEl)}
                    onClose={() => {
                      setUserMenuAnchorEl(null);
                    }}
                    PaperProps={{
                      style: {
                        minWidth: "223px",
                        padding: "16px 20px",
                      },
                    }}
                    getContentAnchorEl={null}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Grid
                        container
                        direction="column"
                        justifyContent="center"
                        alignItems="center"
                        spacing={2}
                      >
                        <Grid item xs={12}>
                          <Avatar
                            src={user.avatarUrl}
                            className={classes.largeAvatar}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <p style={{ fontWeight: "700" }}>
                            {user.firstName} {user.lastName}{" "}
                          </p>
                        </Grid>
                      </Grid>
                    </div>

                    <hr />
                    <MyMenuItem
                      onClick={() => {
                        setUserMenuAnchorEl(null);
                        setUpdateProfileDialogIsOpen(true);
                      }}
                    >
                      <ListItemText
                        style={{
                          textAlign: "center",
                        }}
                        primary="Profile"
                      />
                    </MyMenuItem>
                    <MyMenuItem
                      onClick={() => {
                        setUserMenuAnchorEl(null);
                        firebase.auth().signOut();
                        history.push("/");
                        props.dispatchHeaderReducer({
                          type: "changeSelectedTab",
                          value: "home",
                        });
                      }}
                    >
                      <ListItemText
                        primary="Sign Out"
                        style={{
                          textAlign: "center",
                        }}
                      />
                    </MyMenuItem>
                  </Menu>
                </div>
              ) : (
                <div className={classes.toTheRight}>
                  <Button
                    color="primary"
                    variant="contained"
                    onClick={() =>
                      props.dispatchHeaderReducer({
                        type: "openSignUpModal",
                        value: true,
                      })
                    }
                  >
                    Sign Up
                  </Button>
                  &nbsp; &nbsp;
                  <Button
                    color="primary"
                    variant="outlined"
                    onClick={() =>
                      props.dispatchHeaderReducer({
                        type: "setLoginModal",
                        value: true,
                      })
                    }
                  >
                    Sign In
                  </Button>
                </div>
              )}
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <UpdateProfileDialog
        updateProfileDialogIsOpen={updateProfileDialogIsOpen}
        setUpdateProfileDialogIsOpen={() => setUpdateProfileDialogIsOpen(false)}
        saveProfileChnages={(e) => saveProfileChnages(e)}
        userProfileContent={userProfileContent}
        setUserContent={(event) =>
          setUserProfileContent({
            ...userProfileContent,
            [event.target.name]: event.target.value,
          })
        }
        showAnimation={showUpdateProfileLoadingAnimation}
      />
    </>
  );
}

export default withRouter(AppBarSection);
