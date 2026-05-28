# Work Continuity Notes

## Goal
- Keep coding work resumable even after interruptions.
- Apply minimum hardening baseline for frontend code exposure reduction.

## Minimum Hardening Baseline (from now on)
1. Internal app links in records.js must use relative paths.
2. Before deployment, run B-level hardening at minimum.
3. Deploy sourcemaps must be disabled.
4. C-level obfuscation is optional, but enabled for safe standalone JS targets.

## What Was Set Up
1. B-level hardened build script
- Command: `npm run harden:b`
- Output folder: `.deploy-hardened`
- Behavior: copies site and minifies HTML/CSS/JS

2. C-level obfuscation with exclude list
- Command: `npm run harden:c`
- Config: `tools/hardening/hardening.config.json`
- Targets:
  - `js/main.js`
  - `vibe-apps/hotfix-client.js`
- Excluded risky apps:
  - `vibe-apps/Choong-Yeok-the-Loyalty-and-Traitor.html`
  - `vibe-apps/design-elements-slide.html`
  - `vibe-apps/조형요소 슬라이드.html`
  - `vibe-apps/dictation-studio.html`
  - `vibe-apps/받아쓰기 Studio.html`

3. Predeploy check command
- Command: `npm run predeploy:check`
- Checks:
  - required files exist in build output
  - no `.map` files in output
  - no legacy GitHub absolute links in `records.js`

## Standard Deployment Sequence
1. `npm install`
2. `npm run harden:all`
3. Deploy `.deploy-hardened` to hosting target (Vercel/GitHub Pages workflow)

## Resume Checklist After Interruption
1. Open this file first.
2. Verify latest changed files with `git status`.
3. Re-run: `npm run harden:all`.
4. If check fails, fix the listed item and rerun.
5. Deploy only after check passes.

## Notes
- Frontend code cannot be fully hidden. This baseline reduces exposure while preserving runtime stability.
- Sensitive logic and secret keys must stay server-side.

## ChungYeok Web/App Boundary
- Read `CHUNGYEOK_VERSION_BOUNDARY.md` before touching ChungYeok files.
- Do not overwrite `vibe-apps/Choong-Yeok-the-Loyalty-and-Traitor-web.html` from the Android app source.
- `Choong-Yeok-the-Loyalty-and-Traitor-web.html` is the web published version and must stay separate from the AAB source file.
