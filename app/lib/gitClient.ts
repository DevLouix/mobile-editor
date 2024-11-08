// lib/gitClient.ts
import git from 'isomorphic-git';
import fs from 'fs';

git.plugins.set('fs', fs);

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

export async function createFile(dir: string, filepath: string, content: string) {
  await fs.promises.writeFile(`${dir}/${filepath}`, content, 'utf8');
}

export async function commitChanges(dir: string, message: string, author: { name: string, email: string }) {
  await git.add({ fs, dir, filepath: '.' });
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
    dir,
    remote,
    token,
  });
}
