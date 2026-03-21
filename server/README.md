# GitHub Proxy Backend (Choice 1 Deployment)

This backend proxies your GitHub API requests to keep your `GITHUB_TOKEN` secure.

## Deployment Steps

### 1. Choose a Hosting Provider
Recommended free options for Node.js:
- **Render** (e.g., `https://render.com`)
- **Railway** (e.g., `https://railway.app`)
- **Vercel** (requires minor config change for Serverless)

### 2. Connect to GitHub
- Create a new repository on GitHub.
- Push your project code (including the `server/` folder).

### 3. Configure the Service
Set up a new "Web Service" pointing to the `server/` directory.
- **Build Command**: `npm install`
- **Start Command**: `npm start`

### 4. Add Environment Variables
Add your secrets in the provider's dashboard:
- `GITHUB_TOKEN`: `ghp_...` (Your private token)
- `PORT`: `10000` (Optional, most providers handle this automatically)

### 5. Update your Frontend
Once you have the live URL (e.g., `https://your-api.onrender.com`):
- Open `.env.production` in your root folder.
- Update `VITE_API_URL` to your new live URL.
- Re-push to GitHub for the frontend to update on GitHub Pages.
