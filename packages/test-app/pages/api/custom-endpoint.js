import { APIRoute } from "next-deploy-notifications/api";
import { readFileSync } from "fs";
import { join } from "path";

export default APIRoute.configure({
  version: () =>
    readFileSync(join(process.cwd(), "version.txt"), { encoding: "utf8" }),
});
