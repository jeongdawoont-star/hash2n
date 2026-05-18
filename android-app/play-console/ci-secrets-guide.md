# CI Secrets Setup Guide

This project uses .github/workflows/android-release.yml.
Set these repository secrets before running the workflow.

## Required secrets

- ANDROID_KEYSTORE_BASE64
- ANDROID_STORE_PASSWORD

## Optional secrets

- ANDROID_KEY_PASSWORD (defaults to ANDROID_STORE_PASSWORD)
- ANDROID_KEY_ALIAS (defaults to release_key)

## How to create ANDROID_KEYSTORE_BASE64 (PowerShell)

Run this in android-app root.

```powershell
$bytes = [System.IO.File]::ReadAllBytes('.\\android\\app\\release.keystore')
[System.Convert]::ToBase64String($bytes) | Set-Clipboard
```

Then paste clipboard content into GitHub secret ANDROID_KEYSTORE_BASE64.

## Sanity checks

- keystore alias should match ANDROID_KEY_ALIAS.
- password pair should match the keystore used for production signing.
- never commit plaintext passwords to files.
