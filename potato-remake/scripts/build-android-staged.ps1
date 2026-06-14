param(
    [string]$VersionCode = '105',
    [string]$VersionName = '1.3.2'
)

$ErrorActionPreference = 'Stop'

$projectRoot = Split-Path -Parent $PSScriptRoot
$repoRoot = Split-Path -Parent $projectRoot
$tempRoot = 'C:\Users\Public\Documents\ESTsoft\CreatorTemp'
$stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$stageRoot = Join-Path $tempRoot "potato-android-$stamp"
$releaseDir = Join-Path $projectRoot 'release'
$unsignedAab = Join-Path $stageRoot 'android\app\build\outputs\bundle\release\app-release.aab'
$signedAab = Join-Path $stageRoot "potato-$VersionName-$VersionCode-signed.aab"
$finalAab = Join-Path $releaseDir "potato-$VersionName-$VersionCode-signed.aab"
$keystore = Join-Path $repoRoot 'android.keystore'

function Resolve-JavaHome {
    $candidates = @(
        $env:JAVA_HOME,
        'C:\Program Files\Microsoft\jdk-17.0.19.10-hotspot',
        'C:\Program Files\Android\Android Studio\jbr'
    ) | Where-Object { $_ -and $_.Trim() -ne '' }

    foreach ($candidate in $candidates) {
        if (Test-Path (Join-Path $candidate 'bin\java.exe')) {
            return $candidate
        }
    }

    return $null
}

function Resolve-SdkRoot {
    $candidates = @(
        $env:ANDROID_SDK_ROOT,
        $env:ANDROID_HOME,
        (Join-Path $env:LOCALAPPDATA 'Android\Sdk')
    ) | Where-Object { $_ -and $_.Trim() -ne '' }

    foreach ($candidate in $candidates) {
        if (Test-Path $candidate) {
            return $candidate
        }
    }

    return $null
}

function Invoke-Checked {
    param(
        [scriptblock]$Command,
        [string]$Label
    )

    & $Command
    if ($LASTEXITCODE -ne 0) {
        throw "$Label failed with exit code $LASTEXITCODE."
    }
}

$javaHome = Resolve-JavaHome
if (-not $javaHome) {
    throw 'Java 17 was not found.'
}

$sdkRoot = Resolve-SdkRoot
if (-not $sdkRoot) {
    throw 'Android SDK was not found.'
}

if (-not (Test-Path $keystore)) {
    throw "Existing keystore was not found: $keystore"
}

New-Item -ItemType Directory -Force -Path $stageRoot | Out-Null

$excludeDirs = @('node_modules', 'dist', '.git', '.gradle', 'build', 'release')
$excludeFiles = @('local.properties', 'keystore.properties')
$robocopyArgs = @($projectRoot, $stageRoot, '/E', '/XD') + $excludeDirs + @('/XF') + $excludeFiles
& robocopy @robocopyArgs | Out-Host
if ($LASTEXITCODE -gt 7) {
    throw "robocopy failed with exit code $LASTEXITCODE."
}

$env:JAVA_HOME = $javaHome
$env:ANDROID_HOME = $sdkRoot
$env:ANDROID_SDK_ROOT = $sdkRoot
$env:ANDROID_VERSION_CODE = $VersionCode
$env:ANDROID_VERSION_NAME = $VersionName
$env:PATH = "$env:JAVA_HOME\bin;$env:ANDROID_SDK_ROOT\platform-tools;$env:PATH"

Set-Location $stageRoot
Invoke-Checked { npm.cmd ci } 'npm ci'
Invoke-Checked { npm.cmd run build } 'web build'
Invoke-Checked { npx.cmd cap sync android } 'capacitor sync'

$sdkDirEscaped = $sdkRoot.Replace('\', '\\')
"sdk.dir=$sdkDirEscaped" | Set-Content -Path (Join-Path $stageRoot 'android\local.properties') -Encoding ASCII

Set-Location (Join-Path $stageRoot 'android')
Invoke-Checked { .\gradlew.bat bundleRelease --no-daemon --console=plain } 'bundleRelease'

if (-not (Test-Path $unsignedAab)) {
    throw "Unsigned AAB was not created: $unsignedAab"
}

$jarsigner = Join-Path $javaHome 'bin\jarsigner.exe'
Invoke-Checked {
    & $jarsigner -keystore $keystore -storepass android -keypass android -signedjar $signedAab $unsignedAab android
} 'jarsigner'

Invoke-Checked {
    & $jarsigner -verify $signedAab
} 'jarsigner verify'

New-Item -ItemType Directory -Force -Path $releaseDir | Out-Null
Copy-Item -LiteralPath $signedAab -Destination $finalAab -Force

Write-Host '[build] signed AAB:'
Get-Item -LiteralPath $finalAab | Select-Object FullName, Length, LastWriteTime
