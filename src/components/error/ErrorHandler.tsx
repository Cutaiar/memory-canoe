import { FallbackProps } from "react-error-boundary";

import { Button, Text } from "@fluentui/react-components";

/** An error fallback component based on the one from morris'
 * TODO: Fix scroll at bottom
 */
export const ErrorFallback = (props: FallbackProps) => {
  const { error, resetErrorBoundary } = props;
  return (
    <div
      role="alert"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        width: "100vw",
        height: "100vh",
        backgroundColor: "pink",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "start",
          justifyContent: "center",
          flexDirection: "column",
          // backgroundColor: "pink",
        }}
      >
        <Text>
          <b>An error occurred:</b>
          <pre>{error.message}</pre>
        </Text>
        <Button onClick={resetErrorBoundary}>Refresh</Button>
      </div>
    </div>
  );
};
