import * as fs from 'fs';
import { NextApiRequest, NextApiResponse } from 'next';

type NextRouteHandler = (
  req: NextApiRequest,
  res: NextApiResponse
) => Promise<void>;

let getDevGitVersion = () => {
  let rev = fs.readFileSync('.git/HEAD').toString().trim();
  if (rev.indexOf(':') === -1) {
    return rev;
  } else {
    return fs
      .readFileSync('.git/' + rev.substring(5))
      .toString()
      .trim();
  }
};

let APIRoute: NextRouteHandler = async (_req, res) => {
  let sha = process.env.VERCEL
    ? process.env.VERCEL_GIT_COMMIT_SHA
    : getDevGitVersion();

  res.status(200).json({ version: sha });
};

export { APIRoute };
