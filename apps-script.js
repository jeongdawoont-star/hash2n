// ============================================================
// 📌 Google Apps Script (v2)
// 역할 1: Sheets → Firebase 동기화 (수동 or 트리거)
// 역할 2: 웹앱으로 배포 → 점수 역기록 받기 (POST /exec)
// ============================================================
// 설치:
// 1. Google Sheets > 확장 프로그램 > Apps Script
// 2. 아래 코드 전체 붙여넣기
// 3. FIREBASE_PROJECT_ID 수정
// 4. 배포 > 새 배포 > 유형: 웹앱 > 액세스: 모든 사용자 > 배포
// 5. 생성된 URL을 tracker 앱의 "Apps Script URL" 란에 붙여넣기
// ============================================================

const FIREBASE_PROJECT_ID = "YOUR_PROJECT_ID"; // 🔴 변경 필요
const FIRESTORE_BASE = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents`;

// ============================================================
// 웹앱 POST 핸들러 — 점수 역기록
// 웹앱이 POST로 점수 데이터를 보내면 scores 시트에 기록
// ============================================================
function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);

    if (payload.type === 'scores') {
      writeScoresToSheet(payload.data);
    }

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ============================================================
// 점수 → 시트에 기록
// ============================================================
function writeScoresToSheet(allScores) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName("scores");

  // scores 시트가 없으면 생성
  if (!sheet) {
    sheet = ss.insertSheet("scores");
  }

  // students, missions 시트에서 목록 읽기
  const studentsSheet = ss.getSheetByName("students");
  const missionsSheet = ss.getSheetByName("missions");
  if (!studentsSheet || !missionsSheet) return;

  const studentNames = studentsSheet.getRange(2, 1, studentsSheet.getLastRow() - 1, 1).getValues().map(r => r[0]).filter(Boolean);
  const missionNames = missionsSheet.getRange(2, 1, missionsSheet.getLastRow() - 1, 1).getValues().map(r => r[0]).filter(Boolean);

  if (!studentNames.length || !missionNames.length) return;

  // 헤더 행
  const headers = ['학생이름', ...missionNames, '합계', '마지막 업데이트'];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);

  // 스타일 헤더
  sheet.getRange(1, 1, 1, headers.length)
    .setBackground('#FF6B35')
    .setFontColor('#FFFFFF')
    .setFontWeight('bold');

  // 학생별 점수 행
  const rows = studentNames.map((name, si) => {
    const sid = `s${si + 1}`;
    const sc = allScores[sid] || {};
    const cells = missionNames.map((_, mi) => {
      const mid = `m${mi + 1}`;
      return Number(sc[mid]) || 0;
    });
    const total = cells.reduce((a, b) => a + b, 0);
    return [name, ...cells, total, new Date().toLocaleString('ko-KR')];
  });

  const dataRange = sheet.getRange(2, 1, rows.length, headers.length);
  dataRange.setValues(rows);

  // 완료된 셀 초록색 표시
  rows.forEach((row, ri) => {
    for (let ci = 1; ci <= missionNames.length; ci++) {
      const cell = sheet.getRange(ri + 2, ci + 1);
      if (row[ci] > 0) {
        cell.setBackground('#DCFCE7').setFontColor('#15803D');
      } else {
        cell.setBackground('#FFFFFF').setFontColor('#6B7280');
      }
    }
    // 합계 셀 강조
    sheet.getRange(ri + 2, missionNames.length + 2)
      .setFontWeight('bold').setFontColor('#FF6B35');
  });

  // 열 너비 자동 조정
  sheet.autoResizeColumns(1, headers.length);
}

// ============================================================
// 수동 동기화: Sheets → Firebase
// ============================================================
function syncToFirebase() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  syncMissions(ss);
  syncStudents(ss);
  SpreadsheetApp.getUi().alert("✅ Firebase 동기화 완료!");
}

function syncMissions(ss) {
  const sheet = ss.getSheetByName("missions");
  if (!sheet || sheet.getLastRow() < 2) return;

  const data = sheet.getRange(2, 1, sheet.getLastRow() - 1, 3).getValues();
  const list = data.map((r, i) => {
    const name = r[0] ? r[0].toString().trim() : '';
    if (!name) return null;
    let lockTime = null;
    if (r[1]) {
      const d = r[1] instanceof Date ? r[1] : new Date(r[1].toString());
      if (!isNaN(d)) lockTime = d.toISOString();
    }
    return { id: `m${i+1}`, name, lockTime, description: r[2]||'', order: i+1 };
  }).filter(Boolean);

  firestorePatch(`${FIRESTORE_BASE}/config/missions`, {
    fields: {
      list: { arrayValue: { values: list.map(m => ({
        mapValue: { fields: {
          id: { stringValue: m.id },
          name: { stringValue: m.name },
          lockTime: m.lockTime ? { stringValue: m.lockTime } : { nullValue: null },
          description: { stringValue: m.description },
          order: { integerValue: m.order.toString() }
        }}
      })) }},
      updatedAt: { stringValue: new Date().toISOString() }
    }
  });
  console.log(`미션 ${list.length}개 동기화`);
}

function syncStudents(ss) {
  const sheet = ss.getSheetByName("students");
  if (!sheet || sheet.getLastRow() < 2) return;

  const data = sheet.getRange(2, 1, sheet.getLastRow() - 1, 1).getValues();
  const list = data.map((r, i) => {
    const name = r[0] ? r[0].toString().trim() : '';
    if (!name) return null;
    return { id: `s${i+1}`, name, order: i+1 };
  }).filter(Boolean);

  firestorePatch(`${FIRESTORE_BASE}/config/students`, {
    fields: {
      list: { arrayValue: { values: list.map(s => ({
        mapValue: { fields: {
          id: { stringValue: s.id },
          name: { stringValue: s.name },
          order: { integerValue: s.order.toString() }
        }}
      })) }},
      updatedAt: { stringValue: new Date().toISOString() }
    }
  });
  console.log(`학생 ${list.length}명 동기화`);
}

function firestorePatch(url, body) {
  const res = UrlFetchApp.fetch(url, {
    method: 'PATCH', contentType: 'application/json',
    headers: { Authorization: `Bearer ${ScriptApp.getOAuthToken()}` },
    payload: JSON.stringify(body), muteHttpExceptions: true
  });
  if (res.getResponseCode() !== 200) {
    throw new Error(`Firestore 오류 (${res.getResponseCode()}): ${res.getContentText()}`);
  }
}

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('🎯 활동 트래커')
    .addItem('Firebase로 동기화', 'syncToFirebase')
    .addToUi();
}
