import React from "react";

import { useScrollable } from "./useScrollable";
import { useZoomable } from "./useZoomable";

import { Tooltip } from "@fluentui/react-components";

import { activities } from "../../data/strava-activities-dummy";

import { addDays, daysBetween, map } from "../../util";

/**
 * The zoomable, draggable timeline. Shows 1 year
 */
export const Timeline = () => {
  const zoomableRef = React.useRef<HTMLDivElement | null>(null);
  const scrollableRef = React.useRef<HTMLDivElement | null>(null);
  useScrollable(scrollableRef);
  useZoomable(zoomableRef, scrollableRef);

  const [days, setDays] = React.useState<Date[]>([]);
  const [stravaEvents, setStravaEvents] = React.useState<StravaEvent[]>([]);

  // Using the sample activities, make a day array that will accommodate all the activities
  React.useEffect(() => {
    // Simplify dummy activities into an array of simple objects sorted in ascending order by date
    const simpleActivities: StravaEvent[] = activities
      .map((activity) => {
        return {
          date: new Date(activity.start_date),
          name: activity.name,
          length: activity.distance,
        };
      })
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .reverse();

    // console.log(simpleActivities);
    setStravaEvents(simpleActivities);

    // Calculate how many days we need total on the timeline
    const firstDate = simpleActivities[0].date;
    const numberOfDays = daysBetween(
      firstDate,
      simpleActivities[simpleActivities.length - 1].date
    );

    // Set up an array of days to drive the timeline
    setDays(
      new Array(numberOfDays)
        .fill(undefined)
        .map((_, i) => addDays(firstDate, i))
    );
  }, []);

  return (
    <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
      <div
        style={{ overflowX: "hidden", cursor: "grab", width: "100%" }}
        ref={scrollableRef}
      >
        <div
          style={{
            background: "transparent",
            display: "flex",
            flexDirection: "column",
            alignItems: "start",
          }}
          ref={zoomableRef}
        >
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

const Tick = (props: { height?: number; opacity?: number; color?: string }) => {
  return (
    <div
      style={{
        height: props.height ?? "10px",
        width: "2px",
        background: props.color ?? "black",
        opacity: `${props.opacity}%` ?? "100%",
      }}
    ></div>
  );
};

interface Event {
  date: Date;
}
interface StravaEvent extends Event {
  name: string;
  length: number;
}

const StravaTimeline = (props: { allDays: Date[]; events: StravaEvent[] }) => {
  return (
    <div
      style={{
        height: "50px",
        width: "100%",
        background: "transparent",
        display: "flex",
        alignItems: "center",
      }}
    >
      {props.allDays.map((day, i) => {
        const event: StravaEvent | undefined = props.events.find(
          (e) => day.toDateString() === e.date.toDateString()
        );

        const l = event ? map(event.length, 0, 30000, 0, 25) : 0;
        return (
          <>
            {event && (
              <Tooltip content={event.name} relationship={"label"}>
                <Tick opacity={100} height={l} color="orange" />
              </Tooltip>
            )}
            {!event && <Tick opacity={0} />}
            <Space opacity={0} />
          </>
        );
      })}
    </div>
  );
};

// The below is a good example of how if the timelines are separate, it is hard to line them up

// const Grabber = () => {
//   return (
//     <div
//       style={{
//         height: "10px",
//         width: "10px",
//         borderRadius: "50%",
//         background: "teal",
//         opacity: "50%",
//       }}
//     ></div>
//   );
// };

// const TimeHighlighter = (days: number[]) => {
//   return (
//     <div
//       style={{
//         height: "50px",
//         width: "100%",
//         background: "transparent",
//         display: "flex",
//         alignItems: "center",
//       }}
//     >
//       {days.map((_, day) => {
//         return (
//           <>
//             <Grabber />
//             <Space opacity={0} />
//           </>
//         );
//       })}
//     </div>
//   );
// };
