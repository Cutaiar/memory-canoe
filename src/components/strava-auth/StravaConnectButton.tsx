import { Button } from "@fluentui/react-components";
import { handleConnectClick } from "./utils";
export const StravaConnectButton = () => {
  return <Button onClick={handleConnectClick}>Connect to Strava</Button>;
};
