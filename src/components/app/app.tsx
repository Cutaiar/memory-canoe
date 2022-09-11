import React from "react";

import { Timeline } from "..";

export const App = () => {
  return (
    <div
      id="root"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        height: "100vh",
        width: "100vw",
        boxSizing: "border-box",
      }}
    >
      <h1 style={{ margin: 20, marginBottom: "auto" }}>Memory Canoe</h1>
      <Timeline />
      <div style={{ marginTop: "auto" }} />
    </div>
  );
};
