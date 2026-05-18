param(
  [string]$ProjectRoot = (Split-Path -Parent $PSScriptRoot)
)

$ErrorActionPreference = 'Stop'
Set-Location $ProjectRoot

$checks = @()

function Add-CheckResult {
  param(
    [string]$Name,
    [bool]$Passed,
    [string]$Detail
  )

  $script:checks += [PSCustomObject]@{
    Name = $Name
    Passed = $Passed
    Detail = $Detail
  }
}

function Test-File {
  param([string]$Path)
  return Test-Path $Path -PathType Leaf
}

function Resolve-JavaHome {
  if ($env:JAVA_HOME -and (Test-Path (Join-Path $env:JAVA_HOME 'bin\java.exe'))) {
    return $env:JAVA_HOME
  }

  $candidates = @(
    'C:\Program Files\Eclipse Adoptium\jdk-17.0.19.10-hotspot',
    'C:\Program Files\Microsoft\jdk-17.0.19.10-hotspot',
    'C:\Program Files\Microsoft\jdk-17.0.13.11-hotspot',
    'C:\Program Files\Android\Android Studio\jbr',
    'C:\Program Files\Android\Android Studio\jre'
  )

  foreach ($candidate in $candidates) {
    if (Test-Path (Join-Path $candidate 'bin\java.exe')) {
      return $candidate
    }
  }

  return $null
}

$requiredFiles = @(
  'branding/icon-1024.png',
  'branding/feature-graphic-1024x500.png',
  'branding/promo-1920x1080.png',
  'branding/splash-1242x2688.png',
  'android/app/build/outputs/bundle/release/app-release.aab',
  'android/keystore.properties',
  'play-console/metadata-template.md',
  'play-console/submission-checklist.md'
)

foreach ($file in $requiredFiles) {
  $exists = Test-File $file
  Add-CheckResult -Name "file:$file" -Passed $exists -Detail ($(if ($exists) { 'ok' } else { 'missing' }))
}

$versionCode = $env:ANDROID_VERSION_CODE
$versionName = $env:ANDROID_VERSION_NAME

Add-CheckResult -Name 'env:ANDROID_VERSION_CODE' -Passed (-not [string]::IsNullOrWhiteSpace($versionCode)) -Detail ($(if ([string]::IsNullOrWhiteSpace($versionCode)) { 'not set' } else { $versionCode }))
Add-CheckResult -Name 'env:ANDROID_VERSION_NAME' -Passed (-not [string]::IsNullOrWhiteSpace($versionName)) -Detail ($(if ([string]::IsNullOrWhiteSpace($versionName)) { 'not set' } else { $versionName }))
Add-CheckResult -Name 'env:ANDROID_STORE_PASSWORD' -Passed (-not [string]::IsNullOrWhiteSpace($env:ANDROID_STORE_PASSWORD)) -Detail ($(if ([string]::IsNullOrWhiteSpace($env:ANDROID_STORE_PASSWORD)) { 'not set' } else { 'set' }))

$javaHome = Resolve-JavaHome
$javaExe = $null
if ($javaHome) {
  $env:JAVA_HOME = $javaHome
  $env:PATH = "$env:JAVA_HOME\bin;$env:PATH"
  $javaExe = Join-Path $javaHome 'bin\\java.exe'
}

if (-not $javaExe) {
  $javaCmd = Get-Command java -ErrorAction SilentlyContinue
  if ($javaCmd) {
    $javaExe = $javaCmd.Source
  }
}

$javaLocation = ''
try {
  $javaLocation = (& where.exe java 2>$null | Select-Object -First 1)
} catch {
  $javaLocation = ''
}

if ([string]::IsNullOrWhiteSpace($javaLocation) -and $javaExe -and (Test-Path $javaExe)) {
  $javaLocation = $javaExe
}

Add-CheckResult -Name 'runtime:java' -Passed (-not [string]::IsNullOrWhiteSpace($javaLocation)) -Detail ($(if ([string]::IsNullOrWhiteSpace($javaLocation)) { 'java not found' } else { $javaLocation }))

$failed = $checks | Where-Object { -not $_.Passed }

Write-Host '[preflight] Release preflight summary'
$checks | ForEach-Object {
  $status = if ($_.Passed) { 'PASS' } else { 'FAIL' }
  Write-Host ("[{0}] {1} - {2}" -f $status, $_.Name, $_.Detail)
}

if ($failed.Count -gt 0) {
  Write-Host ''
  Write-Host ("[preflight] failed checks: {0}" -f $failed.Count)
  exit 1
}

Write-Host ''
Write-Host '[preflight] all checks passed'
