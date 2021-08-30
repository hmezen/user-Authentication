import React, { useReducer } from "react";
import clsx from "clsx";
import CssBaseline from "@material-ui/core/CssBaseline";
import { Drawer, Divider, IconButton, Tooltip } from "@material-ui/core";
import { ChevronLeft, Dashboard, BarChart } from "@material-ui/icons";
import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import firebase from "../../firebase/firebaseApp";
import { useSnackbar } from "notistack";
import { useStyles } from "./header-styles";
import LogInDialog from "./LoginDialog";
import SignUpDialog from "./SignUpDialog";
import AppBarSection from "./AppBarSection";
import MenuListItem from "./MenuListItem";
import { useAuth } from "../../firebase/firebaseProvider";
import { withRouter } from "react-router-dom";
import LockIcon from "@material-ui/icons/Lock";

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
    menuSelectedTab: 0,
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
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
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
                <ChevronLeft  />
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
              <BarChart style={{ fontSize: 25 }}/>
            ) : (
              <Tooltip title="React challenge" placement="right">
                <BarChart style={{ fontSize: 25 }}/>
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
              <LockIcon style={{ fontSize: 25 }}/>
            ) : (
              <Tooltip title="Private page" placement="right">
                <LockIcon style={{ fontSize: 25 }}/>
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
              <LockIcon style={{ fontSize: 25 }}/>
            ) : (
              <Tooltip title="adminPage" placement="right">
                <LockIcon style={{ fontSize: 25 }}/>
              </Tooltip>
            )
          }
          title={"adminPage"}
        />

        <Divider />
      </Drawer>

      <LogInDialog
        loginModalIsOpen={state.loginModalIsOpen}
        state={state}
        handleLoginDialogChange={dispatchHeaderReducer}
        handleSignIn={(event) => handleSignIn(event)}
        signUp={() => {
          dispatchHeaderReducer({ type: "openSignUpModal" });
        }}
        setLoginModalIsOpen={() =>
          dispatchHeaderReducer({ type: "setLoginModal", value: false })
        }
      />
      <SignUpDialog
        signUpModalIsOpen={state.signUpModalIsOpen}
        setSignUpModalIsOpen={() =>
          dispatchHeaderReducer({ type: "closeSignUpModal" })
        }
        state={state}
        dispatchHeaderReducer={dispatchHeaderReducer}
        handleSignUpUSer={(e) => handleSignUpUser(e)}
        signIn={() => {
          dispatchHeaderReducer({ type: "closeSignUpModal" });
          dispatchHeaderReducer({ type: "setLoginModal", value: true });
        }}
      />
    </>
  );
}

export default withRouter(Header);
