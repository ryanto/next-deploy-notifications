import { useEffect, useRef, useState } from "react";
import { useInterval } from "interval-hooks";
import useWindowFocus from "use-window-focus";

let getCurrentVersion = async (endpoint: string) => {
  let response = await fetch(endpoint);
  if (response.status > 400) {
    console.error(
      "[next-deploy-notifications] Could not find current app version. Did you setup the API route?"
    );
    return { version: "unknown" };
  } else {
    let json = await response.json();
    return json;
  }
};

type HookOptions = {
  interval?: number;
  endpoint?: string;
};

type HookValues = {
  hasNewDeploy: boolean;
  version: string;
};

type UseHasNewDeploy = (options?: HookOptions) => HookValues;

let useHasNewDeploy: UseHasNewDeploy = (options = {}) => {
  let [hasNewDeploy, setHasNewDeploy] = useState<boolean>(false);
  let [currentVersion, setCurrentVersion] = useState<string>("unknown");

  let windowFocused = useWindowFocus();
  let interval = options.interval ?? 30_000;
  let endpoint = options.endpoint ?? "/api/has-new-deploy";
  let isUnknown = currentVersion === "unknown";
  let pollingInterval = !hasNewDeploy && windowFocused ? interval : null;

  useInterval(async () => {
    let { version } = await getCurrentVersion(endpoint);

    if (!isUnknown && currentVersion !== version) {
      setHasNewDeploy(true);
    }

    setCurrentVersion(version);
  }, pollingInterval);

  useEffect(() => {
    let fetchInitialVersion = async () => {
      let { version } = await getCurrentVersion(endpoint);
      if (version === "unknown") {
        console.warn(
          "[next-deploy-notifications] Could not find current app version."
        );
      } else {
        setCurrentVersion(version);
      }
    };

    fetchInitialVersion();
  }, [endpoint]);

  return {
    hasNewDeploy,
    version: currentVersion,
  };
};

export { useHasNewDeploy };
