const express = require('express');
const cors = require('cors');
require('dotenv').config({ path: require('path').resolve(__dirname, '.env.dev') });

const { GITHUB_API } = require('./config');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const headers = {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    Accept: 'application/vnd.github.v3+json'
};

// Proxy for user profile
app.get('/api/profile', async (req, res) => {
    try {
        const response = await fetch(`${GITHUB_API}/users/pyhor`, {
            headers
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching profile:', error.message);
        res.status(500).json({ error: 'Failed to fetch GitHub profile' });
    }
});

// Proxy for user repositories
app.get('/api/repos', async (req, res) => {
    try {
        const response = await fetch(`${GITHUB_API}/users/pyhor/repos?sort=updated&per_page=6`, {
            headers
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching repos:', error.message);
        res.status(500).json({ error: 'Failed to fetch GitHub repositories' });
    }
});

// Proxy for repository languages
app.get('/api/languages', async (req, res) => {
    const { owner, repo } = req.query;
    if (!owner || !repo) {
        return res.status(400).json({ error: 'Owner and repo are required' });
    }
    try {
        const response = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/languages`, {
            headers
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching languages:', error.message);
        res.status(500).json({ error: 'Failed to fetch languages' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
