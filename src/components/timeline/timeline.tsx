import React from "react";

import { useScrollable } from "./useScrollable";
import { useZoomable } from "./useZoomable";

import { Tooltip, Text, Button } from "@fluentui/react-components";
import { ProgressBar } from "@fluentui/react-components/unstable";

import { AddCircle32Filled } from "@fluentui/react-icons";

import { addDays, daysBetween, map } from "../../util";
import { useHover } from "../../hooks";
import { StravaEvent, useStravaActivities } from "../../hooks";
import { StravaConnectButton } from "../strava-auth/StravaConnectButton";
import { useStravaAuth } from "../strava-auth/useStravaAuth";
import { useAuth } from "../strava-auth/authContext";

import { AthleteResponse } from "strava-v3";
const StravaAPI = require("strava-v3");

/**
 * The zoomable, draggable timeline. Shows 1 year
 */
export const Timeline = () => {
  const zoomableRef = React.useRef<HTMLDivElement | null>(null);
  const scrollableRef = React.useRef<HTMLDivElement | null>(null);
  useScrollable(scrollableRef);
  useZoomable(zoomableRef, scrollableRef);

  const [days, setDays] = React.useState<Date[]>();

  const stravaEvents = useStravaActivities();

  // Set up an array of days to drive the timeline
  React.useEffect(() => {
    // Calculate how many days we need total on the timeline
    // bail if there are no events
    if (!stravaEvents) return;
    const firstDate = stravaEvents[0]?.date;
    // bail if there were 0 events in the event array
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

  useStravaAuth();

  const [athlete, setAthlete] = React.useState<AthleteResponse>();
  const [error, setError] = React.useState(false);
  const [authState, setTokens] = useAuth();

  const strava = React.useMemo(() => {
    if (authState.tokens.strava) {
      const config = {
        access_token: authState.tokens.strava,
        client_id: process.env.REACT_APP_STRAVA_CLIENT_ID,
        client_secret: process.env.REACT_APP_STRAVA_CLIENT_SECRET,
        redirect_uri: "http://localhost:3000/redirect",
      };
      const strava = new StravaAPI.client(config.access_token);
      return strava;
    }
  }, [authState.tokens.strava]);

  React.useEffect(() => {
    if (strava) {
      const fetchAthelete = async () => {
        try {
          const payload = await strava.athlete.get({});
          setAthlete(payload);
          setError(false);
        } catch (error) {
          console.log(error);
          setError(true);
        }
      };
      fetchAthelete();
    }
  }, [strava]);

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
          <div>{error}</div>
          <AddTimeline />
          <StravaConnectButton />
          {days && stravaEvents ? (
            <StravaTimeline events={stravaEvents} allDays={days} />
          ) : (
            <TimelineLoader />
          )}
          {days ? <TimelineBase days={days} /> : <TimelineLoader />}
        </div>
      </div>
    </div>
  );
};

// Many components below assume the height of a timeline is 50px

const TimelineLoader = () => {
  return (
    <div
      style={{
        width: "100%",
        background: "transparent",
        height: "50px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "10px",
        boxSizing: "border-box",
      }}
    >
      <ProgressBar thickness="large" />
    </div>
  );
};

const TimelineBase = (props: { days: Date[] }) => {
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
      {props.days.map((day, i) => {
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
