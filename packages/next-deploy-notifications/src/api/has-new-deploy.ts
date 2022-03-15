import { readFileSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { NextApiRequest, NextApiResponse } from "next";

type IsEnvironment = () => boolean | Promise<boolean>;
type GetVersion = () => string | Promise<string>;

let findGitRoot = (path = __dirname): string | false => {
  if (existsSync(join(path, ".git/HEAD"))) {
    return path;
  } else {
    let parent = resolve(path, "..");
    if (path === parent) {
      return false;
    } else {
      return findGitRoot(parent);
    }
  }
};

let isVercel: IsEnvironment = () => !!process.env.VERCEL;
let getVercelVersion: GetVersion = () => `${process.env.VERCEL_GIT_COMMIT_SHA}`;

let isGit: IsEnvironment = () => !!findGitRoot();
let getGitVersion: GetVersion = async () => {
  let root = findGitRoot();

  if (!root) {
    throw new Error("Cannot call getGitVersion from non git project.");
  }

  let rev = readFileSync(join(root, ".git/HEAD")).toString().trim();

  if (rev.indexOf(":") === -1) {
    return rev;
  } else {
    return readFileSync(join(root, ".git", rev.substring(5)))
      .toString()
      .trim();
  }
};

let getUnknownVersion: GetVersion = () => "unknown";

type NextRouteHandler = (
  req: NextApiRequest,
  res: NextApiResponse
) => Promise<void>;

type Options = {
  version?: () => string | Promise<string>;
};

type Configure = (options: Options) => Handler;
type Handler = NextRouteHandler & { configure: Configure };

let makeRouteHandler = (options: Options = {}): Handler => {
  let route: NextRouteHandler = async (req, res) => {
    let findVersion = options.version
      ? options.version()
      : isVercel()
      ? getVercelVersion()
      : isGit()
      ? getGitVersion()
      : getUnknownVersion();

    let version = await Promise.resolve(findVersion);

    res.status(200).json({ version });
  };

  let configure = (options: Options) => makeRouteHandler(options);

  return Object.assign(route, { configure });
};

let APIRoute = makeRouteHandler();

export { APIRoute };
