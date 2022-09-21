import React from "react";

import { useScrollable } from "./useScrollable";
import { useZoomable } from "./useZoomable";

const weeks = new Array(52).fill(undefined);

/**
 * The zoomable, draggable timeline. Shows 1 year
 */
export const Timeline = () => {
  const zoomableRef = React.useRef<HTMLDivElement | null>(null);
  const scrollableRef = React.useRef<HTMLDivElement | null>(null);
  useScrollable(scrollableRef);
  useZoomable(zoomableRef, scrollableRef);

  return (
    <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
      <div
        style={{ overflowX: "hidden", cursor: "grab", width: "100%" }}
        ref={scrollableRef}
      >
        <div
          style={{
            height: "100px",
            background: "transparent",
            display: "flex",
            alignItems: "center",
          }}
          ref={zoomableRef}
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
