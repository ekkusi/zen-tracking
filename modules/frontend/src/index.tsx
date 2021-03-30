import React from "react";
import ReactDOM from "react-dom";
import "react-calendar/dist/Calendar.css";
import { ColorModeScript } from "@chakra-ui/react";
import theme from "theme";
import ReactGA from "react-ga";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";

ReactGA.initialize("G-MBX4HJ1DJX");

serviceWorkerRegistration.register();

ReactDOM.render(
  <React.StrictMode>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
