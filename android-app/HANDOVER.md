# Android 패키징 인수인계 문서

작성일: 2026-05-17
대상 프로젝트: ChungYeok (웹앱 -> Android Capacitor 래퍼)

## 1) 현재 상태 요약

- 웹 게임 원본: ../vibe-apps/Choong-Yeok-the-Loyalty-and-Traitor.html
- 오디오 파일: ../vibe-apps/assets/audio/audio_00_welcome.mp3 ~ audio_21_fallback_error.mp3
- Android 래퍼 프로젝트: android-app
- Java 17 기반 빌드 환경 구성됨
- Debug APK 생성 완료
- Release AAB 생성 완료

### 생성 산출물

- Debug APK: android/app/build/outputs/apk/debug/app-debug.apk
- Release AAB: android/app/build/outputs/bundle/release/app-release.aab

## 2) 지금까지 반영된 핵심 작업

### A. 게임 음성 재생 구조

- 게임 HTML에서 사전 제작 mp3 우선 재생 + 실패 시 TTS 폴백 구조 적용
- 카운트다운 TTS는 "십/구/팔/칠/육/오/사/삼/이/일" 사용
- 오디오 파일명은 온라인 배포 안전한 ASCII 규칙으로 통일

### B. Android 래퍼 구성

- Capacitor v6 기반 android-app 생성
- 웹 자산 복사 자동화 스크립트 작성
- Android 빌드 스크립트 작성 (JAVA_HOME 탐지, SDK 준비, 자산 동기화, 빌드)
- SDK 패키지/라이선스 자동 준비 스크립트 추가

### C. 빌드 장애 해결 이력

- Java 8 환경 -> Java 17 전환
- 한글 경로 빌드 차단 -> gradle.properties에 android.overridePathCheck=true 설정
- SDK 라이선스 미동의 -> sdkmanager 라이선스 동의 처리
- Release signing 경로 오류 수정
- capacitor-cordova-android-plugins 변수 파일 누락 문제를 조건부 로드로 완화

## 3) 실제 변경 파일 목록

- android/package.json
- scripts/setup-android-sdk.ps1
- scripts/build-android.ps1
- android/gradle.properties
- android/local.properties
- android/keystore.properties
- android/app/build.gradle
- android/app/capacitor.build.gradle
- android/settings.gradle
- android/.gitignore

(참고) 게임 쪽 변경:
- ../vibe-apps/Choong-Yeok-the-Loyalty-and-Traitor.html
- ../vibe-apps/assets/audio/*

## 4) 빌드/실행 명령 (다른 PC에서 재현)

### 0. 사전 준비

- Node.js 20 이상
- Android Studio 설치
- Android SDK 설치 경로 기본값: C:\Users\<사용자>\AppData\Local\Android\Sdk
- SDK 구성요소: platforms;android-34, build-tools;34.0.0

### 1. 의존성 설치

```powershell
cd android-app
npm install
```

### 1-1. 배포 환경변수 설정 (PowerShell)

```powershell
$env:ANDROID_STORE_PASSWORD = '강력한_비밀번호'
$env:ANDROID_KEY_PASSWORD = '강력한_비밀번호'
$env:ANDROID_KEY_ALIAS = 'release_key'
$env:ANDROID_VERSION_CODE = '2'
$env:ANDROID_VERSION_NAME = '1.0.1'
```

### 2. 원클릭 빌드

```powershell
npm run android:build:all
```

이 명령이 수행하는 일:
1) JAVA_HOME 자동 탐지
2) SDK 패키지/라이선스 자동 준비 시도
3) release.keystore 없으면 자동 생성
4) keystore.properties 생성
5) 웹 자산 복사
6) cap copy
7) assembleDebug + bundleRelease 실행

### 2-2. 릴리스만 빠르게 빌드

```powershell
npm run android:build:release
```

### 2-3. Play 업로드 전 사전 점검

```powershell
npm run android:release:preflight
```

### 2-4. 업로드 패키지 생성

```powershell
npm run android:release:package
```

생성 위치:
- release-package/<timestamp>/
- 포함 파일: app-release.aab, SHA256, 메타데이터 초안, 제출 체크리스트, privacy-policy 사본

사전 점검 스크립트는 다음 항목을 확인한다:
- 릴리스 AAB 존재 여부
- 브랜딩 이미지 필수 파일 존재 여부
- 메타데이터 템플릿/체크리스트 파일 존재 여부
- 주요 환경변수 설정 여부

### 2-1. SDK만 먼저 준비하고 싶을 때

```powershell
npm run android:setup:sdk
```

주의:
- sdkmanager 버전에 따라 Java 8 또는 Java 17이 필요할 수 있어 스크립트에서 자동 선택함
- 일부 환경에서는 라이선스 화면이 길게 출력될 수 있음

### 3. Android Studio로 열기

```powershell
npm run android:open
```

## 5) 중요 설정/비밀값

배포 빌드 전 필수/권장 환경변수:

- ANDROID_STORE_PASSWORD (필수)
- ANDROID_KEY_PASSWORD (선택, 미입력 시 ANDROID_STORE_PASSWORD 사용)
- ANDROID_KEY_ALIAS (선택, 기본값 release_key)
- ANDROID_STORE_FILE (선택, 기본값 release.keystore)
- ANDROID_VERSION_CODE (선택, 기본값 1)
- ANDROID_VERSION_NAME (선택, 기본값 1.0.0)

주의:
- keystore.properties, keystore 파일은 안전 저장 필요
- 비밀번호를 스크립트/저장소에 하드코딩하지 말고 환경변수로 관리

## 6) 다음에 해야 할 일 (TODO)

### 우선순위 높음

1. Play Console 업로드 준비
- 앱 아이콘/스플래시 최종본 확인
- play-console/metadata-template.md 작성
- play-console/metadata-ko-KR.md 초안 기준으로 문구 확정
- play-console/submission-checklist.md 순서대로 점검
- policies/chungyeok/privacy-policy.ko.html 공개 URL을 Play Console에 입력

### 우선순위 중간

4. 빌드 경로 안정화
- 가능하면 프로젝트를 ASCII 경로(예: C:\work\github-page)로 이동
- 현재는 android.overridePathCheck=true로 우회 중

5. 스크립트 고도화
- sdkmanager 라이선스/패키지 설치 자동화 분리
- 실패 로그 파일 자동 보관

### 우선순위 낮음

6. CI/CD
- GitHub Actions 워크플로 추가 완료: ../.github/workflows/android-release.yml
- 저장소 Secrets 등록 필요:
	- ANDROID_KEYSTORE_BASE64
	- ANDROID_STORE_PASSWORD
	- ANDROID_KEY_PASSWORD (선택)
	- ANDROID_KEY_ALIAS (선택)

## 7) 자주 발생하는 오류와 해결

1. SDK location not found
- android/local.properties 확인
- ANDROID_HOME/ANDROID_SDK_ROOT 확인

2. License not accepted
- npm run android:setup:sdk 실행
- 그래도 안되면 sdkmanager --licenses 직접 실행 후 y 입력

3. JAVA_HOME invalid
- Java 17 설치 후 JAVA_HOME 재설정

4. PSReadLine 콘솔 오류
- PowerShell에서 Remove-Module PSReadLine 실행 후 재시도

## 8) 빠른 확인 체크리스트

- android/app/build/outputs/apk/debug/app-debug.apk 존재
- android/app/build/outputs/bundle/release/app-release.aab 존재
- android/app/src/main/assets/public/assets/audio 에 mp3 22개 존재
- 앱 실행 시 night phase에서 mp3 우선 재생되는지 확인

## 9) 추가 진행사항 (이번 업데이트)

1. 릴리스 서명 보안 강화
- scripts/build-android.ps1에서 하드코딩 비밀번호 제거
- ANDROID_STORE_PASSWORD / ANDROID_KEY_PASSWORD 환경변수 기반으로 동작

2. 버전 관리 자동화
- android/app/build.gradle이 ANDROID_VERSION_CODE / ANDROID_VERSION_NAME 환경변수 반영

3. SDK 자동화 강화
- scripts/setup-android-sdk.ps1 추가
- build-android.ps1에서 SDK 준비 선행 호출

4. npm 명령 확장
- android:setup:sdk 추가
- android:build:release 추가
- android:release:preflight 추가

5. 빌드 결과 재확인
- Debug APK 산출물 존재 확인
- Release AAB 산출물 존재 확인

6. 이미지 제작 기준 문서화
- BRANDING_IMAGE_GUIDE.md 추가
- 아이콘/배너/프로모/스플래시가 각각 전달해야 할 의미 기준 정리

7. Play Console 제출 준비물 추가
- play-console/metadata-template.md 추가
- play-console/submission-checklist.md 추가
- scripts/preflight-release.ps1 추가

8. 개인정보처리방침 페이지 추가
- ../policies/chungyeok/privacy-policy.html (영문) 생성
- ../policies/chungyeok/privacy-policy.ko.html (국문) 생성
- ../privacy-policy.html은 국문 페이지로 리다이렉트

9. CI/CD 워크플로 추가
- ../.github/workflows/android-release.yml 생성
- workflow_dispatch 또는 android-app 경로 push 시 Release AAB 빌드/아티팩트 업로드

10. 운영 가이드 문서 추가
- play-console/ci-secrets-guide.md 추가
- play-console/screenshots/README.md 추가
- play-console/screenshots/{phone,tablet-7,tablet-10} 폴더 생성

11. 최종 수동 단계 문서 추가
- play-console/FINAL-MANUAL-STEPS.md 추가
- scripts/prepare-release-package.ps1 추가
- npm run android:release:package 추가
