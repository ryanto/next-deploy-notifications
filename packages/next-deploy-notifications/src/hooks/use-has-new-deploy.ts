import { useInterval } from 'interval-hooks';
import { useRef, useState } from 'react';
import useWindowFocus from 'use-window-focus';

let getCurrentVersion = async () => {
  let response = await fetch('/api/has-new-deploy');
  let json = await response.json();
  return json;
};

export let useHasNewDeploy = () => {
  let [hasNewDeploy, setHasNewDeploy] = useState<boolean>(false);
  let versionRef = useRef();

  let windowFocused = useWindowFocus();
  let pollingInterval = !hasNewDeploy && windowFocused ? 30_000 : null;

  useInterval(async () => {
    let { version } = await getCurrentVersion();

    if (versionRef.current && versionRef.current !== version) {
      // there was a new deploy!
      setHasNewDeploy(true);
    }

    versionRef.current = version;
  }, pollingInterval);

  return hasNewDeploy;
};
