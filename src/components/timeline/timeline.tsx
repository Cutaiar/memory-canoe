import React from "react";

import { useScrollable } from "./scrollable";
import { useZoomable } from "./zoomable";

const weeks = new Array(52).fill(undefined);

/**
 * The zoomable, draggable timeline. Shows 1 year
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
          {weeks.map((_) => (
            <>
              <Tick />
              <Week />
            </>
          ))}
        </div>
      </div>
    </div>
  );
};

const Week = () => {
  return (
    <div
      style={{
        flexGrow: 1,
        height: "2px",
        background: "black",
        display: "flex",
        alignItems: "center",
      }}
    >
      {/* 7 days in a week */}
      {[0, 0, 0, 0, 0, 0].map((_) => (
        <>
          <div
            style={{
              flexGrow: 1,
            }}
          />
          <Tick height={5} opacity={20} />
        </>
      ))}
      <div
        style={{
          flexGrow: 1,
        }}
      />
    </div>
  );
};

const Tick = (props: { height?: number; opacity?: number }) => {
  return (
    <div
      style={{
        height: props.height ?? "10px",
        width: "2px",
        background: "black",
        opacity: `${props.opacity}%` ?? "100%",
      }}
    ></div>
  );
};
