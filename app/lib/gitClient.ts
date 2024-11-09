// lib/gitClient.ts
import FS from "@isomorphic-git/lightning-fs";
import git from "isomorphic-git";
import http from "isomorphic-git/http/web";
git
  .getRemoteInfo({
    http,
    url: "https://github.com/isomorphic-git/isomorphic-git",
  })
  .then(console.log);

const fs = new FS();

export async function cloneRepo(repoUrl: string, dir: string) {
  return await git.clone({
    fs,
    http,
    dir,
    url: repoUrl,
    singleBranch: true,
    depth: 1,
  });
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
