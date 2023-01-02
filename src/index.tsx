import React from "react";
import ReactDOM from "react-dom";
import reportWebVitals from "./reportWebVitals";
import "./index.css";
import { App, ErrorFallback } from "./components";
import { ErrorBoundary } from "react-error-boundary";
import { FluentProvider, teamsLightTheme } from "@fluentui/react-components";

ReactDOM.render(
  <React.StrictMode>
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => window.location.reload()}
    >
      <FluentProvider theme={teamsLightTheme}>
        <App />
      </FluentProvider>
    </ErrorBoundary>
    ,
  </React.StrictMode>,

  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
