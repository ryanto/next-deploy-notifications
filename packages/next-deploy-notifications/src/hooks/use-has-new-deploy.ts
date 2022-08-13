import { useEffect, useRef, useState } from "react";
import { useInterval } from "interval-hooks";
import useWindowFocus from "use-window-focus";

const getCurrentVersion = async (endpoint: string) => {
  const response = await fetch(endpoint);
  if (response.status > 400) {
    console.error(
      "[next-deploy-notifications] Could not find current app version. Did you setup the API route?"
    );
    return { version: "unknown" };
  } else {
    const json = await response.json();
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

const useHasNewDeploy: UseHasNewDeploy = (options = {}) => {
  const debug = (message: string) => {
    if (options.debug) {
      console.log(...["[Deploy notifications] ", message]);
    }
  };

  const [hasNewDeploy, setHasNewDeploy] = useState<boolean>(false);
  const [currentVersion, setCurrentVersion] = useState<string>("unknown");
  const [lastFetched, setLastFetched] = useState<number>();

  const windowFocused = useWindowFocus();
  const interval = options.interval ?? 30_000;
  const endpoint = options.endpoint ?? "/api/has-new-deploy";
  const isUnknown = currentVersion === "unknown";

  const loopInterval = interval < 3_000 ? interval : 3_000;
  const loopOrNotInterval = !hasNewDeploy && windowFocused ? loopInterval : null;

  useInterval(async () => {
    debug("Looping...");

    const enoughTimeHasPassed =
      !lastFetched || Date.now() >= lastFetched + interval;

    if (enoughTimeHasPassed && !isUnknown) {
      debug("Fetching version");
      const { version } = await getCurrentVersion(endpoint);
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
    const fetchInitialVersion = async () => {
      debug("Fetching initial version");
      const { version } = await getCurrentVersion(endpoint);
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
