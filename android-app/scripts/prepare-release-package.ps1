param(
  [string]$ProjectRoot = (Split-Path -Parent $PSScriptRoot),
  [string]$OutputDir = 'release-package'
)

$ErrorActionPreference = 'Stop'
Set-Location $ProjectRoot

$timestamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$packageDir = Join-Path $OutputDir $timestamp
New-Item -ItemType Directory -Path $packageDir -Force | Out-Null

$requiredFiles = @(
  'android/app/build/outputs/bundle/release/app-release.aab',
  'branding/icon-1024.png',
  'branding/feature-graphic-1024x500.png',
  'branding/promo-1920x1080.png',
  'branding/splash-1242x2688.png',
  'play-console/metadata-ko-KR.md',
  'play-console/submission-checklist.md',
  '..\\policies\\chungyeok\\privacy-policy.html',
  '..\\policies\\chungyeok\\privacy-policy.ko.html'
)

foreach ($file in $requiredFiles) {
  if (-not (Test-Path $file -PathType Leaf)) {
    throw "[package] required file missing: $file"
  }
}

Copy-Item 'android/app/build/outputs/bundle/release/app-release.aab' (Join-Path $packageDir 'app-release.aab') -Force
Copy-Item 'branding/icon-1024.png' (Join-Path $packageDir 'icon-1024.png') -Force
Copy-Item 'branding/feature-graphic-1024x500.png' (Join-Path $packageDir 'feature-graphic-1024x500.png') -Force
Copy-Item 'branding/promo-1920x1080.png' (Join-Path $packageDir 'promo-1920x1080.png') -Force
Copy-Item 'branding/splash-1242x2688.png' (Join-Path $packageDir 'splash-1242x2688.png') -Force
Copy-Item 'play-console/metadata-ko-KR.md' (Join-Path $packageDir 'metadata-ko-KR.md') -Force
Copy-Item 'play-console/submission-checklist.md' (Join-Path $packageDir 'submission-checklist.md') -Force
Copy-Item '..\\policies\\chungyeok\\privacy-policy.html' (Join-Path $packageDir 'privacy-policy.en.html') -Force
Copy-Item '..\\policies\\chungyeok\\privacy-policy.ko.html' (Join-Path $packageDir 'privacy-policy.ko.html') -Force

$hash = Get-FileHash (Join-Path $packageDir 'app-release.aab') -Algorithm SHA256
$hash.Hash | Set-Content -Path (Join-Path $packageDir 'app-release.aab.sha256') -Encoding ASCII

@"
Release package created: $packageDir

Manual actions left:
1) Upload app-release.aab to Play Console Internal testing.
2) Copy text from metadata-ko-KR.md into Store listing.
3) Set privacy policy URL: https://jeongdawoont-star.github.io/hash2n/policies/chungyeok/privacy-policy.ko.html
4) Complete Data safety and Content rating forms in Play Console.
5) Promote Internal -> Closed -> Production after test pass.
"@ | Set-Content -Path (Join-Path $packageDir 'NEXT-STEPS.txt') -Encoding ASCII

Write-Host "[package] created: $packageDir"
Get-ChildItem $packageDir | Select-Object Name, Length
