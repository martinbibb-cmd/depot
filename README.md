# Depot Workflow Demo (Prototype)

A runnable interactive web prototype for the requested Depot workflow refactor.

## GitHub Pages PWA publish

This repository uses a GitHub Actions workflow to publish the app to GitHub Pages from the `main` branch.

- Push updates to `main` (or `master`).
- Watch the `deploy-github-pages` workflow in Actions and the Pages build/deploy status on the repo.
- Open the published Pages URL to use the running app.

If a run is stuck in `waiting` before any job starts, check the GitHub Pages deployment and environment protection/approval state in GitHub, since that prevents the job from progressing.

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
