import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { Provider } from "react-redux";
import store from "./redux/store";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";

const lightTheme = createTheme({
  palette: {
    mode: "light",
    darken: "rgba(0, 0, 0, 0.04)",
    primary: { main: "hsl(282, 50%, 55%)" },
    secondary: { main: "hsl(50, 100%, 50%)" },
    error: {
      main: "hsl(10, 100%, 50%)",
    },
    text: {
      primary: "hsl(282, 50%, 25%)",
    },
    background: {
      paper: "hsl(0, 0%, 100%)",
      default: "hsl(0, 0%, 97%)",
    },
  },
  shape: {
    borderRadius: 6,
  },
});

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    darken: "rgba(0, 0, 0, 0.15)",
    primary: { main: "hsl(201, 49%, 40%)" },
    secondary: { main: "hsl(48, 100%, 50%)" },
    error: {
      main: "hsl(10, 100%, 50%)",
    },
    text: {
      primary: "hsl(50, 100%, 50%)",
    },
    background: {
      paper: "hsl(0, 0%, 5%)",
      default: "hsl(0, 0%, 10%)",
    },
  },
  shape: {
    borderRadius: 6,
  },
});

ReactDOM.render(
  <ThemeProvider theme={true ? darkTheme : lightTheme}>
    <Provider store={store}>
      <CssBaseline />
      <App />
    </Provider>
  </ThemeProvider>,
  document.getElementById("root")
);
