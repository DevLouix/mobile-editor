// pages/api/github/repos.ts
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });

  if (!session || !session.accessToken) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const response = await fetch("https://api.github.com/user/repos", {
    headers: {
      Authorization: `token ${session.accessToken}`,
    },
  });

  const repos = await response.json();
  // console.log(repos);
  
  res.status(200).json(repos);
}
