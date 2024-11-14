// pages/api/github/getRepo.ts
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

  const { owner, repo } = req.query;
  const url = `https://api.github.com/repos/${owner}/${repo}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `token ${session.accessToken}`,
    },
  });

  if (!response.ok) {
    return res
      .status(response.status)
      .json({ error: "Failed to fetch repository" });
  }

  const repoData = await response.json();
  res.status(200).json({ html_url: repoData.html_url });
}
