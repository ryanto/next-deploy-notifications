import { useHasNewDeploy } from "next-deploy-notifications";

export default function Page() {
  const { version } = useHasNewDeploy({
    endpoint: "/api/default-endpoint",
  });

  return (
    <>
      <div>
        The current git sha: <span data-test="current-version">{version}</span>
      </div>
    </>
  );
}
