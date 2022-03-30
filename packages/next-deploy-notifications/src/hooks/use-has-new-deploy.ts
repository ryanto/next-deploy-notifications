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
  debug?: boolean;
};

type HookValues = {
  hasNewDeploy: boolean;
  version: string;
};

type UseHasNewDeploy = (options?: HookOptions) => HookValues;

let useHasNewDeploy: UseHasNewDeploy = (options = {}) => {
  let debug = (message: string) => {
    if (options.debug) {
      console.log(...["[Deploy notifications] ", message]);
    }
  };

  let [hasNewDeploy, setHasNewDeploy] = useState<boolean>(false);
  let [currentVersion, setCurrentVersion] = useState<string>("unknown");
  let [lastFetched, setLastFetched] = useState<number>();

  let windowFocused = useWindowFocus();
  let interval = options.interval ?? 30_000;
  let endpoint = options.endpoint ?? "/api/has-new-deploy";
  let isUnknown = currentVersion === "unknown";

  let loopInterval = interval < 3_000 ? interval : 3_000;
  let loopOrNotInterval = !hasNewDeploy && windowFocused ? loopInterval : null;

  useInterval(async () => {
    debug("Looping...");

    let enoughTimeHasPassed =
      !lastFetched || Date.now() >= lastFetched + interval;

    if (enoughTimeHasPassed && !isUnknown) {
      debug("Fetching version");
      let { version } = await getCurrentVersion(endpoint);
      debug(`Version ${version}`);

      if (currentVersion !== version) {
        debug("Found new deploy");
        setHasNewDeploy(true);
      }

      setCurrentVersion(version);
      setLastFetched(Date.now());
    }
  }, loopOrNotInterval);

  useEffect(() => {
    let fetchInitialVersion = async () => {
      debug("Fetching initial version");
      let { version } = await getCurrentVersion(endpoint);
      if (version === "unknown") {
        console.warn(
          "[next-deploy-notifications] Could not find current app version."
        );
      } else {
        debug(`Version ${version}`);
        setCurrentVersion(version);
        setLastFetched(Date.now());
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
