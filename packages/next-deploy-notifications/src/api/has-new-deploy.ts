import { readFileSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { NextApiRequest, NextApiResponse } from "next";

type IsEnvironment = () => boolean | Promise<boolean>;
type GetVersion = () => string | Promise<string>;

const findGitRoot = (path = __dirname): string | false => {
  if (existsSync(join(path, ".git/HEAD"))) {
    return path;
  } else {
    const parent = resolve(path, "..");
    if (path === parent) {
      return false;
    } else {
      return findGitRoot(parent);
    }
  }
};

const isVercel: IsEnvironment = () => !!process.env.VERCEL;
const getVercelVersion: GetVersion = () => `${process.env.VERCEL_GIT_COMMIT_SHA}`;

const isRender: IsEnvironment = () => !!process.env.RENDER;
const getRenderVersion: GetVersion = () => `${process.env.RENDER_GIT_COMMIT}`;

const isGit: IsEnvironment = () => !!findGitRoot();
const getGitVersion: GetVersion = async () => {
  const root = findGitRoot();

  if (!root) {
    throw new Error("Cannot call getGitVersion from non git project.");
  }

  const rev = readFileSync(join(root, ".git/HEAD")).toString().trim();

  if (rev.indexOf(":") === -1) {
    return rev;
  } else {
    return readFileSync(join(root, ".git", rev.substring(5)))
      .toString()
      .trim();
  }
};

const getUnknownVersion: GetVersion = () => "unknown";

type NextRouteHandler = (
  req: NextApiRequest,
  res: NextApiResponse
) => Promise<void>;

type Options = {
  version?: () => string | Promise<string>;
};

type Configure = (options: Options) => Handler;
type Handler = NextRouteHandler & { configure: Configure };

const makeRouteHandler = (options: Options = {}): Handler => {
  const route: NextRouteHandler = async (req, res) => {
    const findVersion = options.version
      ? options.version()
      : isVercel()
      ? getVercelVersion()
      : isRender()
      ? getRenderVersion()
      : isGit()
      ? getGitVersion()
      : getUnknownVersion();

    const version = await Promise.resolve(findVersion);

    res.status(200).json({ version });
  };

  const configure = (options: Options) => makeRouteHandler(options);

  return Object.assign(route, { configure });
};

const APIRoute = makeRouteHandler();

export { APIRoute };
