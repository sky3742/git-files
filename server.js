const { Git } = require('node-git-server');
const { join } = require('path');
const { execFile } = require('child_process');
const http = require('http');
const fs = require('fs');

const port = process.env.PORT || 7005;
const basePath = process.env.BASE_PATH || '/';
const repos = new Git(join(__dirname, 'repos'), { autoCreate: true });
const templates = join(__dirname, 'templates');
const bp = basePath === '/' ? '' : basePath;

// git

function git(repoDir, args) {
  return new Promise((resolve, reject) => {
    execFile('git', args, { cwd: repoDir }, (err, stdout) => {
      err ? reject(err) : resolve(stdout.trim());
    });
  });
}

function isValidRepoName(name) {
  return /^[a-zA-Z0-9._-]+$/.test(name);
}

async function repoInfo(name) {
  const dir = join(__dirname, 'repos', name.endsWith('.git') ? name : name + '.git');
  if (!fs.existsSync(dir)) return null;
  const countOut = await git(dir, ['count-objects', '-vH']).catch(() => '');
  const sizeMatch = countOut.match(/size-pack:\s*([\d.]+)\s*(B|KiB|MiB|GiB)/i);
  const size = sizeMatch ? sizeMatch[1] + sizeMatch[2].charAt(0).toLowerCase() : '0B';
  const branches = (await git(dir, ['for-each-ref', '--format=%(refname:short)', 'refs/heads/']).catch(() => '')).split('\n').filter(Boolean);
  return { name: name.replace('.git', ''), branches, size };
}

async function listRepos() {
  const repoList = await repos.list().catch(() => []);
  const results = await Promise.all(repoList.map(r => repoInfo(r.replace('.git', ''))));
  return results.filter(Boolean);
}

// render

function render(file, vars) {
  let html = fs.readFileSync(join(templates, file), 'utf-8');
  for (const [k, v] of Object.entries(vars)) {
    html = html.replaceAll(`{{${k}}}`, v);
  }
  return html;
}

// events

repos.on('push', (push) => {
  if (!isValidRepoName(push.repo)) {
    console.log(`rejected push to invalid repo name: ${push.repo}`);
    push.reject();
    return;
  }
  console.log(`push ${push.repo}/${push.commit} (${push.branch})`);
  push.accept();
});

repos.on('fetch', (fetch) => {
  if (!isValidRepoName(fetch.repo)) {
    console.log(`rejected fetch from invalid repo name: ${fetch.repo}`);
    fetch.reject();
    return;
  }
  console.log(`fetch ${fetch.repo}/${fetch.commit}`);
  fetch.accept();
});

// server

const server = http.createServer(async (req, res) => {
  let url = req.url;
  if (basePath !== '/' && url.startsWith(basePath)) {
    url = url.slice(basePath.length) || '/';
  }

  if (url === '/' || url === '') {
    res.writeHead(200, { 'content-type': 'text/html' });
    res.end(render('index.html', { basePath: bp, repos: JSON.stringify(await listRepos()) }));
    return;
  }

  req.url = url;
  repos.handle(req, res);
});

server.listen(port, () => {
  console.log(`node-git-server running at http://localhost:${port}${basePath}`);
});
