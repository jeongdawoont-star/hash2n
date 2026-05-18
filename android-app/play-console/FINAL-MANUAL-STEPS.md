# Final Manual Steps (Owner Only)

Everything else is automated. Only these actions require your account access.

1. GitHub repository secrets setup
- Open GitHub repo settings for actions secrets.
- Add secrets from play-console/ci-secrets-guide.md.

2. Privacy policy publish check
- Confirm this URL is publicly reachable:
  - https://jeongdawoont-star.github.io/hash2n/policies/chungyeok/privacy-policy.html

3. Play Console input
- Use metadata from play-console/metadata-ko-KR.md.
- Upload AAB from release-package/<timestamp>/app-release.aab.
- Upload screenshots from play-console/screenshots/.

4. Compliance forms in Play Console
- Data safety form.
- Content rating questionnaire.
- App access declaration (if requested).

5. Release progression
- Internal testing first.
- Validate install and smoke test on real device.
- Promote to closed testing, then production.
