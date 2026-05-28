# ChungYeok Web/App Boundary

This note is for any future AI or developer working on ChungYeok.

## Do Not Cross-Edit

- Web published version:
  - `vibe-apps/Choong-Yeok-the-Loyalty-and-Traitor-web.html`
  - Public link target from `records.js`
  - Has a fullscreen button.
  - Does not load `hotfix-client.js`.
  - Must not be overwritten by Android app build changes.

- Android app source version:
  - `vibe-apps/Choong-Yeok-the-Loyalty-and-Traitor.html`
  - Copied into `충역 안드로이드/www/index.html` by the Android build script.
  - Uses app hotfix config and `hotfix-client.js`.
  - Used for Play Console AAB builds.

## Rule

When changing the Android app, edit only the app source file unless the user explicitly asks for web changes.

When changing the web published version, edit only `Choong-Yeok-the-Loyalty-and-Traitor-web.html` unless the user explicitly asks for Android app changes.

Never run a bulk sync that makes the web version identical to the app version.
