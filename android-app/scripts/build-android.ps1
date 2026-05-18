param(
    [switch]$DebugOnly,
    [switch]$ReleaseOnly,
    [switch]$SkipSdkSetup
)

$ErrorActionPreference = 'Stop'

if ($DebugOnly -and $ReleaseOnly) {
    throw '[build] DebugOnly와 ReleaseOnly를 동시에 사용할 수 없습니다.'
}

$projectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $projectRoot

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

    $dynamic = Get-ChildItem 'C:\Program Files\Microsoft' -Directory -Filter 'jdk-17*' -ErrorAction SilentlyContinue |
        Sort-Object Name -Descending |
        Select-Object -First 1

    if ($dynamic -and (Test-Path (Join-Path $dynamic.FullName 'bin\java.exe'))) {
        return $dynamic.FullName
    }

    $dynamicTemurin = Get-ChildItem 'C:\Program Files\Eclipse Adoptium' -Directory -Filter 'jdk-17*' -ErrorAction SilentlyContinue |
        Sort-Object Name -Descending |
        Select-Object -First 1

    if ($dynamicTemurin -and (Test-Path (Join-Path $dynamicTemurin.FullName 'bin\java.exe'))) {
        return $dynamicTemurin.FullName
    }

    return $null
}

function Resolve-SdkRoot {
    $candidates = @(
        $env:ANDROID_SDK_ROOT,
        $env:ANDROID_HOME,
        (Join-Path $env:LOCALAPPDATA 'Android\Sdk')
    ) | Where-Object { $_ -and $_.Trim() -ne '' }

    foreach ($path in $candidates) {
        if (Test-Path $path) {
            return $path
        }
    }

    return $null
}

$javaHome = Resolve-JavaHome
if (-not $javaHome) {
    throw 'Java 17 경로를 찾지 못했습니다. 먼저 OpenJDK 17을 설치하세요.'
}

$env:JAVA_HOME = $javaHome
$env:PATH = "$env:JAVA_HOME\bin;$env:PATH"

$sdkRoot = Resolve-SdkRoot
if (-not $sdkRoot) {
    throw 'Android SDK 경로를 찾지 못했습니다. Android Studio SDK 설치를 먼저 진행하세요.'
}

$env:ANDROID_HOME = $sdkRoot
$env:ANDROID_SDK_ROOT = $sdkRoot

Write-Host "[build] JAVA_HOME=$env:JAVA_HOME"
Write-Host "[build] ANDROID_SDK_ROOT=$env:ANDROID_SDK_ROOT"
java -version

if (-not $SkipSdkSetup) {
    Write-Host '[build] SDK 라이선스/패키지 준비 시도...'
    try {
        & (Join-Path $PSScriptRoot 'setup-android-sdk.ps1') -NonInteractive
    } catch {
        Write-Warning "[build] SDK 자동 준비 실패: $($_.Exception.Message)"
        Write-Warning '[build] Android Studio SDK Manager 또는 sdkmanager --licenses 로 수동 처리 후 재시도하세요.'
    }
}

$releaseStoreFileEnv = $env:ANDROID_STORE_FILE
if ([string]::IsNullOrWhiteSpace($releaseStoreFileEnv)) {
    $releaseStoreFileEnv = 'release.keystore'
}

$keystoreFile = if ([System.IO.Path]::IsPathRooted($releaseStoreFileEnv)) {
    $releaseStoreFileEnv
} else {
    Join-Path $projectRoot (Join-Path 'android\app' $releaseStoreFileEnv)
}

$keystorePassword = $env:ANDROID_STORE_PASSWORD
if ([string]::IsNullOrWhiteSpace($keystorePassword)) {
    throw '[build] ANDROID_STORE_PASSWORD 환경변수가 필요합니다.'
}

$keyAlias = if ([string]::IsNullOrWhiteSpace($env:ANDROID_KEY_ALIAS)) { 'release_key' } else { $env:ANDROID_KEY_ALIAS }
$keyPassword = if ([string]::IsNullOrWhiteSpace($env:ANDROID_KEY_PASSWORD)) { $keystorePassword } else { $env:ANDROID_KEY_PASSWORD }

if (-not (Test-Path $keystoreFile)) {
    Write-Host '[build] release.keystore 생성 중...'
    & "$env:JAVA_HOME\bin\keytool.exe" -genkeypair -v `
        -keystore $keystoreFile `
        -alias $keyAlias `
        -keyalg RSA `
        -keysize 2048 `
        -validity 10000 `
        -storepass $keystorePassword `
        -keypass $keyPassword `
        -dname 'CN=Vive Coding, OU=School, O=ViveCoding, L=Incheon, ST=KR, C=KR'
}

if (-not (Test-Path $keystoreFile)) {
    throw "[build] keystore 파일을 찾을 수 없습니다: $keystoreFile"
}

@"
storeFile=$(Split-Path -Leaf $keystoreFile)
storePassword=$keystorePassword
keyAlias=$keyAlias
keyPassword=$keyPassword
"@ | Set-Content -Path (Join-Path $projectRoot 'android\keystore.properties') -Encoding ASCII

$sdkDirEscaped = $sdkRoot.Replace('\', '\\')
"sdk.dir=$sdkDirEscaped" | Set-Content -Path (Join-Path $projectRoot 'android\local.properties') -Encoding ASCII

Write-Host '[build] 웹 자산 동기화...'
npm run copy:web
if (Test-Path 'android/app/src/main/assets/public') {
    Remove-Item -Recurse -Force 'android/app/src/main/assets/public'
}
npx cap copy android

Set-Location (Join-Path $projectRoot 'android')
if (-not $ReleaseOnly) {
    Write-Host '[build] assembleDebug 시작...'
    .\gradlew.bat assembleDebug --no-daemon --console=plain
}

if (-not $DebugOnly) {
    Write-Host '[build] bundleRelease 시작...'
    .\gradlew.bat bundleRelease --no-daemon --console=plain
}

Write-Host '[build] 완료. 산출물 경로:'
if (Test-Path '.\app\build\outputs') {
    Get-ChildItem '.\app\build\outputs' -Recurse -Include *.apk,*.aab | Select-Object -ExpandProperty FullName
} else {
    Write-Host '[build] outputs 폴더가 아직 생성되지 않았습니다.'
}
