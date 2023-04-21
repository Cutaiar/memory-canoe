import React from "react";

import { cleanUpAuthToken, getAccessAndRefreshTokens } from "./utils";
import { useAuth } from "./authContext";

/**
 * This is a simple FC which expects to be rendered when a strava auth flow redirects to redirect_uri (usually using React Router).
 *
 * When it mounts, it will try to get the auth token from the url, exchange it for an access token adds it to the auth context, and redirects to the another page.
 *
 * The render from the component is not usually visible as the token exchange usually happens quickly.
 *
 * Based on [this article](https://levelup.gitconnected.com/add-strava-oauth2-login-to-your-react-app-in-15-minutes-6c92e845919e).
 */
export const useStravaAuth = () => {
  const [authState, setToken] = useAuth();

  React.useEffect(() => {
    const authenticate = async () => {
      try {
        // Save the Auth Token to the Store (it's located under 'search' for some reason)
        const stravaAuthToken = cleanUpAuthToken(window.location.search);
        // const stravaAuthToken = new URLSearchParams(window.location.search).get(
        //   "code"
        // );

        if (!stravaAuthToken) {
          console.log("no token");
          return;
        }

        console.log("got token", stravaAuthToken);

        // Post Request to Strava (with AuthToken) which returns Refresh Token and and Access Token
        const response = await getAccessAndRefreshTokens(stravaAuthToken);
        const responseJson = await response?.json();
        const accessToken = responseJson.access_token;

        // TODO exchange gives us more than just an access token.
        // It gives
        // {
        //     "token_type": "Bearer",
        //     "expires_at": 1568775134,
        //     "expires_in": 21600,
        //     "refresh_token": "e5n567567...",
        //     "access_token": "a4b945687g...",
        //     "athlete": {
        //       #{summary athlete representation}
        //     }
        //   }
        // So maybe we should store this...
        if (accessToken) {
          setToken("strava", accessToken);
        } else {
          console.log("Could not set access token...");
        }

        // Axios request to get users info
        // const user = await getUserData(userID, accessToken);
        // this.props.setUserActivities(user);

        // Once complete, go to display page
        // history.push(`/${redirectPageName}`);
      } catch (error) {
        throw error;
      }
    };
    authenticate();
  }, [setToken]);
};
