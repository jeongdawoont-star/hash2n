# push-to-github.ps1
# 사용법: 커밋 메시지를 인수로 전달
#   .\scripts\push-to-github.ps1 "fix: 엔딩 광고 버그 수정"
# 인수 없으면 자동 메시지 사용

param(
  [string]$Message = "update: potato-remake $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
)

$SRC  = Split-Path -Parent $PSScriptRoot
$TMP  = "$env:TEMP\hash2n-work-$(Get-Random)"
$REPO = "https://github.com/jeongdawoont-star/hash2n.git"
$ORIGINAL_LOCATION = Get-Location

Write-Host "[push] Cloning hash2n..." -ForegroundColor Cyan
git clone $REPO $TMP --depth 1 2>&1 | Where-Object { $_ -notmatch "^Cloning" } | Out-Null

Write-Host "[push] Copying potato-remake files..." -ForegroundColor Cyan
robocopy $SRC "$TMP\potato-remake" /E /MIR `
  /XD "node_modules" "dist" "dist-ssr" ".git" "android\.gradle" "android\app\build" `
  /XF "*.aab" "*.apk" "*.keystore" "local.properties" "keystore.properties" `
  /NFL /NDL /NJH /NJS | Out-Null
if ($LASTEXITCODE -gt 7) {
  throw "robocopy failed with exit code $LASTEXITCODE"
}

Set-Location $TMP
git config user.email "vibe1@kshcm.net"
git config user.name "jeongdawoont-star"

$changed = (git status --short).Count
if ($changed -eq 0) {
  Write-Host "[push] No changes - push skipped" -ForegroundColor Green
  Set-Location $ORIGINAL_LOCATION
  Remove-Item $TMP -Recurse -Force
  exit 0
}

Write-Host "[push] Committing $changed changes..." -ForegroundColor Cyan
git add potato-remake/
git commit -m $Message | Out-Null

Write-Host "[push] Pushing to GitHub..." -ForegroundColor Cyan
git pull --rebase origin main 2>&1 | Out-Null
git push origin main 2>&1

Set-Location $ORIGINAL_LOCATION
Remove-Item $TMP -Recurse -Force
Write-Host "[push] Done: https://github.com/jeongdawoont-star/hash2n/tree/main/potato-remake" -ForegroundColor Green
