import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { ProvideAuth } from "./firebase/firebaseProvider";
import { SnackbarProvider } from "notistack";
import { createTheme, ThemeProvider } from '@material-ui/core/styles';

const myTheme = createTheme({
  typography:{
    fontFamily: "DM Sans",
    fontSize: "16px",
    // line-height: 19px;
    // font-weight: 400;
    // font-family: DM Sans;
  },
  palette: {
    primary: {
      main: "rgba(0,255,132,1)",
      light: "rgba(0,255,132,1)",
      dark:"rgba(0,255,132,1)"
    },
  },
});

ReactDOM.render(
  <ProvideAuth>
    <BrowserRouter>
      <React.StrictMode>
        <SnackbarProvider maxSnack={3}>
           <ThemeProvider theme={myTheme}> <App /></ThemeProvider>
         
        </SnackbarProvider>
      </React.StrictMode>
    </BrowserRouter>
  </ProvideAuth>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
