const express = require('express');
const cors = require('cors');
require('dotenv').config({ path: require('path').resolve(__dirname, '.env.dev') });
require('dotenv').config({ path: require('path').resolve(__dirname, '.env') });

const { GITHUB_API } = require('./config');
const { createContactHandler, sendContactResult } = require('./contact.cjs');

const app = express();
const PORT = process.env.PORT || 3001;

const handleContact = createContactHandler();
// Keep contact CORS separate from the read-only GitHub proxy's public CORS.
app.all('/api/contact', express.json({ limit: '20kb' }), async (req, res) => {
    sendContactResult(res, await handleContact({
        method: req.method, origin: req.get('origin') || '',
        contentType: req.get('content-type') || '',
        ip: req.socket.remoteAddress,
        body: req.body,
    }));
});
app.use('/api/contact', (error, req, res, next) => {
    if (!error) return next();
    res.status(error.type === 'entity.too.large' ? 413 : 400).json({ ok: false, code: error.type === 'entity.too.large' ? 'payload_too_large' : 'validation_error' });
});
app.use(cors());

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
