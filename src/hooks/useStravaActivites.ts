import * as React from "react";
import { activities } from "../data/strava-activities-dummy";
import { sleep } from "../util";

/**
 * The base interface all timeline events extend
 */
export interface EventBase {
  date: Date;
}

// TODO move when there is a good place for this like a type util
type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

/**
 * An event of the strava type
 */
export interface StravaEvent extends EventBase {
  name: string /* The name of the events */;
  length: number /* the length of the run in meters? */;
  link: string /* a url link to the event on strava */;
  original?: ArrayElement<
    typeof activities
  > /* The raw object fetched from the strava ap, used to construct this simplified version */;
}

/**
 * Fetch strava events on mount, initially returns undefined which is replaced with event array when events are fetched.
 */
export const useStravaActivities: () => StravaEvent[] | undefined = () => {
  const [stravaEvents, setStravaEvents] = React.useState<StravaEvent[]>();

  React.useEffect(() => {
    // Simplify dummy activities into an array of simple objects sorted in ascending order by date
    // TODO: note what order these are in
    const fetchData = async () => {
      await sleep(1000);
      const simpleActivities: StravaEvent[] = activities
        .map((activity) => {
          return {
            date: new Date(activity.start_date),
            name: activity.name,
            length: activity.distance,
            link: `https://strava.com/activities/${activity.id}`,
            original: activity,
          };
        })
        .sort((a, b) => b.date.getTime() - a.date.getTime())
        .reverse();

      // console.log(simpleActivities);
      setStravaEvents(simpleActivities);
    };
    fetchData();
  }, []);

  return stravaEvents;
};
