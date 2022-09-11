import React from "react";

import { useScrollable } from "./scrollable";
import { useZoomable } from "./zoomable";

/**
 * The zoomable, draggable timeline
 */
export const Timeline = () => {
  const zRef = React.useRef<HTMLDivElement | null>(null);
  const sRef = React.useRef<HTMLDivElement | null>(null);
  useScrollable(sRef.current);
  useZoomable(zRef.current, sRef.current);

  return (
    <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
      <div
        style={{ overflowX: "hidden", cursor: "grab", width: "100%" }}
        ref={sRef}
      >
        <div
          style={{
            height: "100px",
            background: "transparent",
            display: "flex",
            alignItems: "center",
          }}
          ref={zRef}
        >
          <Spacer />
          {new Array(50).fill(undefined).map((_) => (
            <>
              <Tick />
              <Spacer />
            </>
          ))}
          <Spacer />
        </div>
      </div>
    </div>
  );
};

const Spacer = () => {
  return (
    <div
      style={{
        flexGrow: 1,
        height: "2px",
        background: "black",
      }}
    />
  );
};

const Tick = () => {
  return (
    <div
      style={{
        height: "10px",
        width: "2px",
        background: "black",
      }}
    ></div>
  );
};
