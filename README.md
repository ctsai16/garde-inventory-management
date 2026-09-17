# Table

Mobile-first AI restaurant inventory app.

## Develop

```bash
npm install
npm run dev
```

## Deploy to GitHub Pages

1. Create a GitHub repo named `garde-inventory-management` (or update `base` in `vite.config.js` and the repo name below to match whatever you actually name it).
2. Push this project to the `main` branch.
3. In the repo's Settings → Pages, set "Source" to **GitHub Actions**.
4. Every push to `main` runs `.github/workflows/deploy.yml`, which builds the app and publishes `dist/` to Pages.

The app uses `HashRouter` (URLs look like `#/inventory`) so client-side routing works on GitHub Pages without extra server config.
