# Play Console Submission Checklist

Use this checklist in order.

1. Build and signing
- Set ANDROID_STORE_PASSWORD and optional signing env vars.
- Set ANDROID_VERSION_CODE and ANDROID_VERSION_NAME.
- Run npm run android:build:release.
- Confirm android/app/build/outputs/bundle/release/app-release.aab exists.

2. Brand assets
- Verify icon and feature graphic in branding/.
- Verify splash and promo images are final.
- Ensure no UI artifacts or watermark in assets.

3. Policy and legal
- Publish privacy policy page and copy URL.
- Complete Data safety form draft.
- Complete content rating questionnaire draft.

4. Store listing
- Fill play-console/metadata-template.md.
- Prepare Korean release notes.
- Prepare screenshot set for required device classes.

5. Final preflight
- Run npm run android:release:preflight.
- Resolve all FAIL items.
- Upload AAB to Internal testing track first.
- Install from Play internal track and run smoke tests.
