// lib/gitClient.ts
import FS from "@isomorphic-git/lightning-fs";
import axios from "axios";
import git from "isomorphic-git";
import http from "isomorphic-git/http/web";

let fs = new FS('fs');
const pfs = fs.promises

export async function cloneRepo(repoUrl: string, dir: string) {
  const res = await axios.post("api/github/clone",{repoUrl:repoUrl, dir: dir})
  console.log(res);
  return res
}

export async function createFile(
  dir: string,
  filepath: string,
  content: string
) {
  await fs.promises.writeFile(`${dir}/${filepath}`, content, "utf8");
}

export async function commitChanges(
  dir: string,
  message: string,
  author: { name: string; email: string }
) {
  await git.add({ fs, dir, filepath: "." });
  await git.commit({
    fs,
    dir,
    message,
    author,
  });
}

export async function pushChanges(dir: string, remote: string, token: string) {
  await git.push({
    fs,
    http,
    dir: dir,
    remote: remote,
    ref: "main",
    onAuth: () => ({ username: token  }),
  });
}
