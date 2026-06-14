param(
    [switch]$DebugOnly,
    [switch]$ReleaseOnly
)

$ErrorActionPreference = 'Stop'

if ($DebugOnly -and $ReleaseOnly) {
    throw 'DebugOnly and ReleaseOnly cannot be used together.'
}

$projectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $projectRoot

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

$env:JAVA_HOME = $javaHome
$env:ANDROID_HOME = $sdkRoot
$env:ANDROID_SDK_ROOT = $sdkRoot
$env:PATH = "$env:JAVA_HOME\bin;$env:ANDROID_SDK_ROOT\platform-tools;$env:PATH"

$env:ANDROID_VERSION_CODE = if ($env:ANDROID_VERSION_CODE) { $env:ANDROID_VERSION_CODE } else { '105' }
$env:ANDROID_VERSION_NAME = if ($env:ANDROID_VERSION_NAME) { $env:ANDROID_VERSION_NAME } else { '1.3.2' }

$sdkDirEscaped = $sdkRoot.Replace('\', '\\')
"sdk.dir=$sdkDirEscaped" | Set-Content -Path (Join-Path $projectRoot 'android\local.properties') -Encoding ASCII

$existingKeystore = Join-Path (Split-Path -Parent $projectRoot) 'android.keystore'
if (-not (Test-Path $existingKeystore)) {
    throw "Existing keystore was not found: $existingKeystore"
}

$storeFile = (Resolve-Path $existingKeystore).Path.Replace('\', '/')

@"
storeFile=$storeFile
storePassword=android
keyAlias=android
keyPassword=android
"@ | Set-Content -Path (Join-Path $projectRoot 'android\keystore.properties') -Encoding ASCII

Write-Host "[build] JAVA_HOME=$env:JAVA_HOME"
Write-Host "[build] ANDROID_SDK_ROOT=$env:ANDROID_SDK_ROOT"
Write-Host "[build] versionCode=$env:ANDROID_VERSION_CODE versionName=$env:ANDROID_VERSION_NAME"

if (-not $ReleaseOnly) {
    $env:VITE_SKIP_ADS = 'true'
    Write-Host '[build] VITE_SKIP_ADS=true (no-ad APK)'
}

Invoke-Checked { npm.cmd run build } 'web build'

if (-not $ReleaseOnly) {
    Remove-Item Env:VITE_SKIP_ADS -ErrorAction SilentlyContinue
}

$publicAssets = Join-Path $projectRoot 'android\app\src\main\assets\public'
if (Test-Path $publicAssets) {
    Remove-Item $publicAssets -Recurse -Force
}
Invoke-Checked { npx.cmd cap sync android } 'capacitor sync'

Set-Location (Join-Path $projectRoot 'android')

if (-not $ReleaseOnly) {
    Invoke-Checked { .\gradlew.bat assembleDebug --no-daemon --console=plain } 'assembleDebug'
    $apkSrc = '.\app\build\outputs\apk\debug\app-debug.apk'
    $apkDst = ".\app\build\outputs\apk\debug\potato-v$env:ANDROID_VERSION_NAME-debug.apk"
    if (Test-Path $apkDst) { Remove-Item $apkDst -Force }
    Copy-Item $apkSrc $apkDst
    Write-Host "[build] APK renamed: $apkDst"
}

if (-not $DebugOnly) {
    Invoke-Checked { .\gradlew.bat bundleRelease --no-daemon --console=plain } 'bundleRelease'
}

Write-Host '[build] outputs:'
Get-ChildItem '.\app\build\outputs' -Recurse -Include *.apk,*.aab -ErrorAction SilentlyContinue |
    Select-Object -ExpandProperty FullName
