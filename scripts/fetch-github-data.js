import fs from 'fs';
import path from 'path';

const publicApiDir = path.resolve('public', 'api');
const languagesApiDir = path.resolve(publicApiDir, 'languages');

// Create directories if they don't exist
if (!fs.existsSync(publicApiDir)) fs.mkdirSync(publicApiDir, { recursive: true });
if (!fs.existsSync(languagesApiDir)) fs.mkdirSync(languagesApiDir, { recursive: true });

// Read token from server/.env if available
let token = process.env.GITHUB_TOKEN;
try {
  const envFile = fs.readFileSync(path.resolve('server', '.env'), 'utf-8');
  const tokenMatch = envFile.match(/GITHUB_TOKEN=(.*)/);
  if (tokenMatch) {
    token = tokenMatch[1].trim();
  }
} catch (e) {
  console.log('No server/.env file found, relying on environment variables.');
}

if (!token) {
  console.error('Error: GITHUB_TOKEN is not defined. Please set it in server/.env or as an environment variable.');
  process.exit(1);
}

const headers = {
  Authorization: `Bearer ${token}`,
  Accept: 'application/vnd.github.v3+json'
};

const GITHUB_API = 'https://api.github.com';

async function fetchAndSave(url, destPath) {
  console.log(`Fetching ${url}...`);
  const res = await fetch(url, { headers });
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  const data = await res.json();
  fs.writeFileSync(destPath, JSON.stringify(data, null, 2));
  console.log(`Saved to ${destPath}`);
  return data;
}

async function run() {
  try {
    // 1. Fetch Profile
    await fetchAndSave(`${GITHUB_API}/users/pyhor`, path.join(publicApiDir, 'profile.json'));

    // 2. Fetch Repos
    const repos = await fetchAndSave(`${GITHUB_API}/users/pyhor/repos?sort=updated&per_page=6`, path.join(publicApiDir, 'repos.json'));

    // 3. Fetch Languages for each repo
    for (const repo of repos) {
      const repoName = repo.name;
      const langUrl = `${GITHUB_API}/repos/pyhor/${repoName}/languages`;
      await fetchAndSave(langUrl, path.join(languagesApiDir, `${repoName}.json`));
    }
    
    console.log('GitHub data fetching complete!');
  } catch (err) {
    console.error('Failed to fetch GitHub data:', err);
    process.exit(1);
  }
}

run();
