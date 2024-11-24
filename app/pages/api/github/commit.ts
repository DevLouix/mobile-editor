import { NextApiRequest, NextApiResponse } from "next";
import * as git from "isomorphic-git";
import fs from "fs";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { dir, author, message } = req.body;

  if (!dir || !author || !author.name || !author.email || !message) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Make the commit
    const sha = await git.commit({
      fs,
      dir,
      author,
      message,
    });

    //console.log(`Commit SHA: ${sha}`);

    // Respond with the commit SHA
    res.status(200).json({ sha });
  } catch (error:any) {
    console.error("Error making commit:", error);
    res.status(500).json({ error: "Failed to make the commit", details: error.message });
  }
}
