import React, { useReducer } from "react";
import clsx from "clsx";
import CssBaseline from "@material-ui/core/CssBaseline";
import {
  Drawer,
  Divider,
  IconButton,
  Tooltip,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Link,
} from "@material-ui/core";
import {
  ChevronLeft,
  Dashboard,
  BarChart,
  VerifiedUser,
} from "@material-ui/icons";
import { useTheme, makeStyles } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import firebase from "../../firebase/firebaseApp";
import { useSnackbar } from "notistack";
import AppBarSection from "./AppBarSection";
import MenuListItem from "./MenuListItem";
import { useAuth } from "../../firebase/firebaseProvider";
import { withRouter } from "react-router-dom";
import LockIcon from "@material-ui/icons/Lock";
import SignInDialog from "../DialogComponent";
import SignUpDialog from "../DialogComponent";

const useStyles = makeStyles((theme) => ({
  toolbarIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar,
  },
  drawerPaper: {
    position: "relative",
    whiteSpace: "nowrap",
    width: "240px",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(0),
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(7),
    },
  },
  appBarSpacer: theme.mixins.toolbar,

  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const mediumPassword = new RegExp(
  "(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})"
);
const strongPassword = new RegExp(
  "((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{6,}))|((?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9])(?=.{8,}))"
);

function strengthChecker(PasswordParameter) {
  if (strongPassword.test(PasswordParameter)) return "Strong password.";
  else if (mediumPassword.test(PasswordParameter)) return "Medium password.";
  else return "Weak password.";
}

const headerReducer = (state, action) => {
  switch (action.type) {
    case "signUpSuccess":
      return {
        ...state,
        signUpFirstName: "",
        signUpLastName: "",
        signUpEmail: "",
        signUpPassword: "",
        showLoadingAnimation: false,
        signUpModalIsOpen: false,
        signUpConfirmPassword: "",
      };
    case "setLoadingAnimation":
      return {
        ...state,
        showLoadingAnimation: action.value,
      };
    case "updateField": {
      if (
        action.field === "signInEmail" &&
        localStorage.getItem(action.value) !== null
      ) {
        return {
          ...state,
          [action.field]: action.value,
          signInPassword: localStorage.getItem(action.value),
          signInRememberMe: true,
        };
      } else if (action.field === "signUpPassword") {
        let passwordStrength = strengthChecker(action.value);
        return {
          ...state,
          [action.field]: action.value,
          paswordStrength: passwordStrength,
        };
      } else {
        return {
          ...state,
          [action.field]: action.value,
        };
      }
    }
    case "clickOnSignInSignUpButton":
      return {
        ...state,
        showLoadingAnimation: true,
      };
    case "signInSuccess":
      return {
        ...state,
        showLoadingAnimation: false,
        signInEmail: "",
        signInPassword: "",
        loginModalIsOpen: false,
      };
    case "signInFailure":
      return {
        ...state,
        showLoadingAnimation: false,
      };
    case "toggleDrawer":
      return {
        ...state,
        drawerIsOpen:
          action.value !== undefined ? action.value : !state.drawerIsOpen,
      };
    case "setLoginModal":
      return {
        ...state,
        loginModalIsOpen: action.value,
      };
    case "openSignUpModal":
      return {
        ...state,
        loginModalIsOpen: false,
        signUpModalIsOpen: true,
      };
    case "closeSignUpModal":
      return {
        ...state,
        signUpModalIsOpen: false,
      };
    case "changeSelectedTab":
      return {
        ...state,
        menuSelectedTab: action.value,
      };
    case "toggleCustomerMenuTab":
      return {
        ...state,
        customerMenuTabIsExtended: !state.customerMenuTabIsExtended,
      };
    case "toggleCustomerMenuAnchorEl":
      return {
        ...state,
        customerMenuAnchorEl: action.payload,
      };
    default:
      return state;
  }
};

function Header({ history }) {
  const classes = useStyles();
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const isBigScreen = useMediaQuery(theme.breakpoints.up("sm"));
  const { setUser } = useAuth();

  const [state, dispatchHeaderReducer] = useReducer(headerReducer, {
    signUpFirstName: "",
    signUpLastName: "",
    signUpEmail: "",
    signUpPassword: "",
    signInEmail: "",
    signInPassword: "",
    signInRememberMe: false,
    showLoadingAnimation: false,
    drawerIsOpen: false,
    loginModalIsOpen: false,
    signUpModalIsOpen: false,
    menuSelectedTab: "home",
    customerMenuTabIsExtended: false,
    customerMenuAnchorEl: null,
    paswordStrength: null,
    signUpConfirmPassword: "",
  });

  const handleSignIn = (event) => {
    event.preventDefault();
    dispatchHeaderReducer({ type: "clickOnSignInSignUpButton" });
    firebase
      .auth()
      .signInWithEmailAndPassword(state.signInEmail, state.signInPassword)
      .then((responseUser) => {
        enqueueSnackbar("Login Successfully", { variant: "success" });
        dispatchHeaderReducer({ type: "signInSuccess" });
        if (state.signInRememberMe)
          localStorage.setItem(state.signInEmail, state.signInPassword);
        else localStorage.removeItem(state.signInEmail);

        history.push("/");
        dispatchHeaderReducer({ type: "changeSelectedTab", value: "home" });
      })
      .catch((err) => {
        enqueueSnackbar(err.message, { variant: "error" });
        dispatchHeaderReducer({ type: "signInFailure" });
      });
  };

  function validateEmail(email) {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  const validateSignUpFields = () => {
    let errorMessage = "";
    if (state.signUpEmail === "") errorMessage += "Email is required. \n";
    else if (!validateEmail(state.signUpEmail))
      errorMessage += "Invalid email. \n";

    if (state.signUpConfirmPassword === "" || state.signUpPassword === "")
      errorMessage += "Password and Confirm password are required \n";
    else if (state.signUpConfirmPassword !== state.signUpPassword)
      errorMessage += "Passwords don't match. \n";

    if (errorMessage !== "") {
      enqueueSnackbar(errorMessage, {
        variant: "error",
        style: { whiteSpace: "pre-line" },
      });
      return false;
    } else return true;
  };

  const handleSignUpUser = (event) => {
    // by default new users don't have admin role
    event.preventDefault();
    dispatchHeaderReducer({ type: "clickOnSignInSignUpButton" });
    if (validateSignUpFields()) {
      firebase
        .auth()
        .createUserWithEmailAndPassword(state.signUpEmail, state.signUpPassword)
        .then((res) => {
          firebase
            .firestore()
            .collection("users")
            .doc(state.signUpEmail)
            .set({
              firstName: state.signUpFirstName,
              lastName: state.signUpLastName,
              roles: {
                isAdmin: false,
              },
              avatarUrl: "",
              email: res.user.email,
              uid: res.user.uid,
            })
            .then(() => {
              setUser({
                email: res.user.email,
                uid: res.user.uid,
                firstName: state.signUpFirstName,
                lastName: state.signUpLastName,
                roles: {
                  isAdmin: false,
                },
                avatarUrl: "",
              });
              dispatchHeaderReducer({ type: "signUpSuccess" });
              enqueueSnackbar("Sign up Successfully", {
                variant: "success",
              });
            });
        })
        .catch((err) => {
          enqueueSnackbar(err.message, { variant: "error" });
        });
    } else {
      dispatchHeaderReducer({ type: "setLoadingAnimation", value: false });
    }
  };

  return (
    <>
      <CssBaseline />
      <AppBarSection dispatchHeaderReducer={dispatchHeaderReducer} />
      <Drawer
        variant={isBigScreen ? "permanent" : "temporary"}
        classes={{
          paper: clsx(
            classes.drawerPaper,
            !state.drawerIsOpen && classes.drawerPaperClose
          ),
        }}
        open={state.drawerIsOpen}
      >
        {isBigScreen ? (
          <div className={classes.appBarSpacer} />
        ) : (
          <>
            <div className={classes.toolbarIcon}>
              <IconButton
                onClick={() => dispatchHeaderReducer({ type: "toggleDrawer" })}
              >
                <ChevronLeft />
              </IconButton>
            </div>
            <Divider />
          </>
        )}
        <MenuListItem
          eventClick={(event) => {
            dispatchHeaderReducer({ type: "toggleDrawer", value: false });
            dispatchHeaderReducer({ type: "changeSelectedTab", value: "home" });
          }}
          to={"/"}
          menuSelectedTab={state.menuSelectedTab === "home"}
          icon={
            state.drawerIsOpen ? (
              <Dashboard style={{ fontSize: 25 }} />
            ) : (
              <Tooltip title="Home" placement="right">
                <Dashboard style={{ fontSize: 25 }} />
              </Tooltip>
            )
          }
          title={"Home"}
        />

        <MenuListItem
          eventClick={(event) => {
            dispatchHeaderReducer({ type: "toggleDrawer", value: false });
            dispatchHeaderReducer({
              type: "changeSelectedTab",
              value: "reactChallenge",
            });
          }}
          to={"/reactChallenge"}
          menuSelectedTab={state.menuSelectedTab === "reactChallenge"}
          icon={
            state.drawerIsOpen ? (
              <BarChart style={{ fontSize: 25 }} />
            ) : (
              <Tooltip title="React challenge" placement="right">
                <BarChart style={{ fontSize: 25 }} />
              </Tooltip>
            )
          }
          title={"React challenge"}
        />

        <MenuListItem
          eventClick={(event) => {
            dispatchHeaderReducer({ type: "toggleDrawer", value: false });
            dispatchHeaderReducer({
              type: "changeSelectedTab",
              value: "privatePage",
            });
          }}
          to={"/privatePage"}
          menuSelectedTab={state.menuSelectedTab === "privatePage"}
          icon={
            state.drawerIsOpen ? (
              <VerifiedUser style={{ fontSize: 25 }} />
            ) : (
              <Tooltip title="Private page" placement="right">
                <VerifiedUser style={{ fontSize: 25 }} />
              </Tooltip>
            )
          }
          title={"Private page"}
        />
        <MenuListItem
          eventClick={(event) => {
            dispatchHeaderReducer({ type: "toggleDrawer", value: false });
            dispatchHeaderReducer({
              type: "changeSelectedTab",
              value: "adminPage",
            });
          }}
          to={"/adminPage"}
          menuSelectedTab={state.menuSelectedTab === "adminPage"}
          icon={
            state.drawerIsOpen ? (
              <LockIcon style={{ fontSize: 25 }} />
            ) : (
              <Tooltip title="Admin page" placement="right">
                <LockIcon style={{ fontSize: 25 }} />
              </Tooltip>
            )
          }
          title={"Admin page"}
        />

        <Divider />
      </Drawer>

      <SignInDialog
        isOpen={state.loginModalIsOpen}
        handleClose={() =>
          dispatchHeaderReducer({ type: "setLoginModal", value: false })
        }
        title={"Welcome to My App"}
        subTitle={
          "Sign in to continue to your account and to discover private pages."
        }
      >
        <form className={classes.form} validate>
          <TextField
            color="secondary"
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="signInEmail"
            autoComplete="email"
            autoFocus
            value={state.signInEmail}
            onChange={(event) =>
              dispatchHeaderReducer({
                type: "updateField",
                field: "signInEmail",
                value: event.target.value,
              })
            }
          />
          <TextField
            color="secondary"
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="signInPassword"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={state.signInPassword}
            onChange={(event) =>
              dispatchHeaderReducer({
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
                color="secondary"
                checked={state.signInRememberMe}
                onChange={(event) =>
                  dispatchHeaderReducer({
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
            onClick={(event) => handleSignIn(event)}
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
              <Link
                to="#"
                variant="body2"
                onClick={() =>
                  dispatchHeaderReducer({ type: "openSignUpModal" })
                }
              >
                Don't have an account? Sign Up
              </Link>
            </Grid>
          </Grid>
        </form>
      </SignInDialog>

      <SignUpDialog
        isOpen={state.signUpModalIsOpen}
        handleClose={() => dispatchHeaderReducer({ type: "closeSignUpModal" })}
        title={"Join My App for free"}
        subTitle={"Sign up to create an account and to discover the project."}
      >
        <form className={classes.form} validate>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                color="secondary"
                autoComplete="fname"
                name="signUpFirstName"
                variant="outlined"
                fullWidth
                id="firstName"
                label="First Name"
                autoFocus
                value={state.signUpFirstName}
                onChange={(event) =>
                  dispatchHeaderReducer({
                    type: "updateField",
                    field: "signUpFirstName",
                    value: event.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                color="secondary"
                variant="outlined"
                fullWidth
                id="lastName"
                label="Last Name"
                name="signUpLastName"
                autoComplete="lname"
                value={state.signUpLastName}
                onChange={(event) =>
                  dispatchHeaderReducer({
                    type: "updateField",
                    field: "signUpLastName",
                    value: event.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                color="secondary"
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="signUpEmail"
                autoComplete="email"
                value={state.signUpEmail}
                onChange={(event) =>
                  dispatchHeaderReducer({
                    type: "updateField",
                    field: "signUpEmail",
                    value: event.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                color="secondary"
                variant="outlined"
                required
                fullWidth
                name="signUpPassword"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={state.signUpPassword}
                onChange={(event) =>
                  dispatchHeaderReducer({
                    type: "updateField",
                    field: "signUpPassword",
                    value: event.target.value,
                  })
                }
                helperText={state.signUpPassword ? state.paswordStrength : null}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                color="secondary"
                variant="outlined"
                required
                fullWidth
                name="signUpPassword"
                label="Confirm password"
                type="password"
                id="signUpConfirmPassword"
                autoComplete="current-password"
                value={state.signUpConfirmPassword}
                onChange={(event) =>
                  dispatchHeaderReducer({
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
            onClick={(e) => handleSignUpUser(e)}
          >
            Sign Up
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link
                to="#"
                variant="body2"
                onClick={() => {
                  dispatchHeaderReducer({ type: "closeSignUpModal" });
                  dispatchHeaderReducer({ type: "setLoginModal", value: true });
                }}
              >
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </form>
      </SignUpDialog>
    </>
  );
}

export default withRouter(Header);
