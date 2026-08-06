# Depot Workflow Demo (Prototype)

A runnable interactive web prototype for the requested Depot workflow refactor.

## GitHub Pages PWA publish

This repository is configured with a GitHub Actions workflow that publishes this demo directly to GitHub Pages.

1. Push updates to `main` (or `master`).
2. In GitHub, open **Settings → Pages** and set Source to **GitHub Actions**.
3. In the Actions tab, confirm workflow `deploy-github-pages` completed successfully.
4. Open the published Pages URL and use the app there (iPad Safari/Chrome recommended).

The app is served as a PWA with:
- `manifest.webmanifest`
- `service-worker.js` with offline fallback and caching
- install prompt support in supporting browsers

## Data model behavior

- Data is local-only (typed fixtures + user interaction state).
- App state is persisted in browser `localStorage` under `depot-demo-state`.

## Workflow to use in the demo

1. Open the published URL.
2. Pick an appointment from the diary (chronological order).
3. Follow tabs: **Property hub** → **Current area** → **Product/quote** → **Safety** → **Checks**.
4. Use Camera and markers, safety notes, package selection, controls, and completion checks.

## Notes

- This is a prototype for journey validation, not connected to production systems.
- Breeze integration is represented via a mock adapter boundary and local fixtures.
- Sync states are explicit: `local`, `pending`, `synced`, `conflict`.
