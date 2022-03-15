import { useHasNewDeploy } from "next-deploy-notifications";

export default function Page() {
  let { hasNewDeploy, version } = useHasNewDeploy({
    interval: 1_000,
    endpoint: "/api/custom-endpoint",
  });

  return (
    <>
      <div>
        The current version is:{" "}
        <span data-test="current-version">{version}</span>
      </div>
      {hasNewDeploy && <div>There is a new deploy!</div>}
    </>
  );
}
