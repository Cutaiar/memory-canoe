import React from "react";

import { useScrollable } from "./useScrollable";
import { useZoomable } from "./useZoomable";

import { Tooltip, Text, Button, makeStyles } from "@fluentui/react-components";
import { AddCircle32Filled } from "@fluentui/react-icons";

import { addDays, daysBetween, map } from "../../util";
import { useHover } from "../../hooks";
import { StravaEvent, useStravaActivities } from "../../hooks";

/**
 * The zoomable, draggable timeline. Shows 1 year
 */
export const Timeline = () => {
  const zoomableRef = React.useRef<HTMLDivElement | null>(null);
  const scrollableRef = React.useRef<HTMLDivElement | null>(null);
  useScrollable(scrollableRef);
  useZoomable(zoomableRef, scrollableRef);

  const [days, setDays] = React.useState<Date[]>([]);

  const stravaEvents = useStravaActivities();

  // Set up an array of days to drive the timeline
  React.useEffect(() => {
    // Calculate how many days we need total on the timeline
    const firstDate = stravaEvents[0]?.date;
    if (!firstDate) return;

    const numberOfDays = daysBetween(
      firstDate,
      stravaEvents[stravaEvents.length - 1].date
    );

    setDays(
      new Array(numberOfDays)
        .fill(undefined)
        .map((_, i) => addDays(firstDate, i))
    );
  }, [stravaEvents]);

  return (
    <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
      <div
        style={{ overflowX: "hidden", cursor: "grab", width: "100%" }}
        ref={scrollableRef}
      >
        {/* Vertical stack containing all timelines */}
        <div
          style={{
            background: "transparent",
            display: "flex",
            flexDirection: "column",
            alignItems: "start",
          }}
          ref={zoomableRef}
        >
          <AddTimeline />
          <StravaTimeline events={stravaEvents} allDays={days} />
          {/* Regular timeline */}
          <div
            style={{
              height: "50px",
              width: "100%",
              background: "transparent",
              display: "flex",
              alignItems: "center",
            }}
          >
            {days.map((day, i) => {
              const isMonday = i % 7 === 0;
              return (
                <>
                  <Tick
                    opacity={isMonday ? 100 : 50}
                    height={isMonday ? 10 : 5}
                    name={day.toDateString()}
                  />
                  <Space opacity={50} />
                </>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

const Space = (props: { opacity: number }) => (
  <div
    style={{
      flexGrow: 1,
      height: 2,
      background: "grey",
      opacity: props.opacity,
    }}
  />
);

const Tick = (props: {
  height?: number;
  opacity?: number;
  color?: string;
  name?: string;
  onClick?: () => void;
}) => {
  const r = React.useRef<HTMLDivElement | null>(null);

  return (
    <Tooltip content={props.name ?? "unnamed event"} relationship={"label"}>
      <div
        ref={r}
        onClick={props.onClick}
        style={{
          height: props.height ?? "10px",
          maxWidth: "100px",
          minWidth: "1px",
          flexGrow: 1,
          background: props.color ?? "black",
          opacity: `${props.opacity}%` ?? "100%",
          cursor: "pointer",
          borderRadius: "1vmin",
        }}
      ></div>
    </Tooltip>
  );
};

const StravaTimeline = (props: { allDays: Date[]; events: StravaEvent[] }) => {
  const [hoverRef, isHovered] = useHover();

  return (
    <div
      ref={hoverRef}
      style={{
        height: "50px",
        width: "100%",
        background: "transparent",
        display: "flex",
        alignItems: "center",
      }}
    >
      <div
        style={{
          position: "absolute",
          height: "50px",
          background: "orange",
          opacity: isHovered ? 100 : 0,
          transition: "opacity ease 0.4s",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "10px",
          boxSizing: "border-box",
          color: "white",
          borderRadius: "0px 5px 5px 0px",
        }}
      >
        <Text size={400} weight="medium" color="white">
          Strava
        </Text>
      </div>

      {props.allDays.map((day, i) => {
        const event: StravaEvent | undefined = props.events.find(
          (e) => day.toDateString() === e.date.toDateString()
        );

        const l = event ? map(event.length, 0, 30000, 0, 25) : 0;
        return (
          <>
            {event && (
              <Tick
                opacity={100}
                height={l}
                color="orange"
                name={event.name}
                onClick={() => window.open(event.link)}
              />
            )}
            {!event && <Tick opacity={0} />}
            <Space opacity={0} />
          </>
        );
      })}
    </div>
  );
};

const AddTimeline = () => {
  return (
    <div
      style={{
        height: "50px",
        width: "100%",
        background: "transparent",
        display: "flex",
        alignItems: "center",
        padding: "10px",
        boxSizing: "border-box",
      }}
    >
      <div style={{ position: "absolute" }}>
        <Tooltip
          relationship="label"
          content="Add a timeline"
          positioning={"after"}
        >
          <Button
            onClick={() => console.log("add a new timeline clicked")}
            appearance="subtle"
            icon={<AddCircle32Filled />}
            size="large"
          ></Button>
        </Tooltip>
      </div>
    </div>
  );
};
