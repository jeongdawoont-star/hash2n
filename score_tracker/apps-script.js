// ============================================================
// Google Apps Script (minimal)
// 역할: tracker.html 이 보내는 scores payload를 scores 시트에 기록
// 주의: Firestore REST 호출을 제거해서 403 scope 오류를 원천 차단
// ============================================================

function doGet(e) {
  try {
    const mode = (typeof e !== 'undefined' && e && e.parameter && e.parameter.mode)
      ? String(e.parameter.mode).trim()
      : '';
    if (mode === 'sheetSnapshot') {
      const scores = buildScoresPayloadFromCurrentSheet_();
      const inspection = readInspectionMapFromScoresSheet_();
      return jsonResponse({ ok: true, scores: scores, inspection: inspection });
    }
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err && err.message ? err.message : err) });
  }
  return jsonResponse({ ok: true, message: 'tracker sheet writer is running' });
}

function doPost(e) {
  try {
    const raw = e && e.postData ? e.postData.contents : '{}';
    const payload = JSON.parse(raw);

    if (!payload || payload.type !== 'scores' || !payload.data || typeof payload.data !== 'object') {
      return jsonResponse({ ok: false, error: 'invalid payload' });
    }

    const inspection = payload && payload.inspection && typeof payload.inspection === 'object'
      ? payload.inspection
      : null;
    writeScoresToSheet(payload.data, inspection);
    return jsonResponse({ ok: true });
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err && err.message ? err.message : err) });
  }
}

function onEdit(e) {
  try {
    if (!e || !e.range) return;
    const sheet = e.range.getSheet();
    if (!sheet || sheet.getName() !== 'missions') return;

    const startCol = e.range.getColumn();
    const endCol = startCol + e.range.getNumColumns() - 1;
    const row = e.range.getRow();
    if (row < 2) return;
    // 미션 관리 영역(A~D) 편집만 반영
    if (endCol < 1 || startCol > 4) return;

    const isSingleCell = e.range.getNumRows() === 1 && e.range.getNumColumns() === 1;

    if (isSingleCell && startCol === 2) {
      // B열 미션명: 새로 입력(이전값 없음)이면 맨 위로 이동
      const newName = (e.range.getValue() || '').toString().trim();
      const oldName = (e.oldValue || '').toString().trim();
      if (newName && !oldName) {
        moveNewMissionToTop_(sheet, row);
      }
    }

    // 미션 영역 편집 시 scores 시트 즉시 재정렬
    const payload = buildScoresPayloadFromCurrentSheet_();
    const inspection = readInspectionMapFromScoresSheet_();
    writeScoresToSheet(payload, inspection);
  } catch (err) {
    Logger.log('onEdit error: ' + err);
  }
}

function readInspectionMapFromScoresSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const studentsSheet = ss.getSheetByName('students');
  const missionsSheet = ss.getSheetByName('missions');
  const scoresSheet = ss.getSheetByName('scores');
  const map = {};
  if (!studentsSheet || !missionsSheet || !scoresSheet) return map;

  function pickNameCell(row) {
    const cleaned = (row || [])
      .map(function(value) { return (value || '').toString().trim(); })
      .filter(Boolean);
    if (!cleaned.length) return '';
    if (cleaned.length >= 2 && /^\d+$/.test(cleaned[0])) return cleaned[1];
    return cleaned[0];
  }

  const sLast = studentsSheet.getLastRow();
  if (sLast < 1) return map;
  const sRows = studentsSheet
    .getRange(1, 1, sLast, Math.max(1, studentsSheet.getLastColumn()))
    .getValues();
  const firstS = (sRows[0] || []).map(function(v) { return (v || '').toString().trim().toLowerCase(); });
  const sHasHeader = firstS.some(function(cell) { return cell.indexOf('학생') > -1 || cell.indexOf('이름') > -1; });
  const studentRows = sHasHeader ? sRows.slice(1) : sRows;
  const studentNames = studentRows.map(pickNameCell).filter(Boolean);
  const studentNameToId = {};
  studentNames.forEach(function(name, i) { studentNameToId[name] = 's' + (i + 1); });

  const mLast = missionsSheet.getLastRow();
  if (mLast < 1) return map;
  const mRowsRaw = missionsSheet
    .getRange(1, 1, mLast, Math.max(1, missionsSheet.getLastColumn()))
    .getValues();
  const firstM = (mRowsRaw[0] || []).map(function(v) { return (v || '').toString().trim().toLowerCase(); });
  const mHasHeader = firstM.some(function(cell) {
    return cell.indexOf('미션') > -1 || cell.indexOf('과제') > -1 || cell.indexOf('완료') > -1 || cell.indexOf('체크') > -1;
  });
  const mRows = mHasHeader ? mRowsRaw.slice(1) : mRowsRaw;

  const usesCheckboxColumn = (mRows || []).some(function(row) {
    var col0 = (row[0] || '').toString().trim().toLowerCase();
    var col1 = (row[1] || '').toString().trim();
    return !!col1 || col0 === 'true' || col0 === 'false' || col0 === '1' || col0 === '0' || col0 === '완료' || col0 === 'x';
  });

  const missionData = mRows
    .map(function(row, idx) {
      const name = usesCheckboxColumn
        ? (row[1] || '').toString().trim()
        : (row[0] || '').toString().trim();
      if (!name) return null;
      const lower = name.toLowerCase();
      if (lower === 'true' || lower === 'false') return null;
      return { id: 'm' + (idx + 1), name: name };
    })
    .filter(Boolean);

  const lastRow = scoresSheet.getLastRow();
  const lastCol = scoresSheet.getLastColumn();
  if (lastRow < 2 || lastCol < 2) return map;

  const table = scoresSheet.getRange(1, 1, lastRow, lastCol).getValues();
  const bodyBgs = scoresSheet.getRange(2, 1, lastRow - 1, lastCol).getBackgrounds();
  const headers = (table[0] || []).map(function(v) { return (v || '').toString().trim(); });
  const reserved = { '학생이름': true, '합계': true, '마지막 업데이트': true };
  const missionNameToCol = {};
  headers.forEach(function(h, ci) {
    if (!h || reserved[h]) return;
    missionNameToCol[h] = ci;
  });

  function isOrange(bg) {
    const c = (bg || '').toString().trim().toLowerCase();
    return c === '#fb923c' || c === '#ea580c' || c === '#f59e0b' || c === '#ff6b35';
  }

  for (let ri = 1; ri < table.length; ri++) {
    const row = table[ri] || [];
    const studentName = (row[0] || '').toString().trim();
    const sid = studentNameToId[studentName];
    if (!sid) continue;

    const dst = {};
    missionData.forEach(function(m) {
      const ci = missionNameToCol[m.name];
      if (typeof ci === 'undefined') return;
      const score = Number(row[ci]) || 0;
      const bg = bodyBgs[ri - 1] ? bodyBgs[ri - 1][ci] : '';
      if (score > 0 && isOrange(bg)) dst[m.id] = true;
    });
    map[sid] = dst;
  }

  return map;
}

function findLastMissionDataRow_(sheet) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return 1;

  const names = sheet.getRange(2, 2, lastRow - 1, 1).getValues(); // B열(미션명)
  for (let i = names.length - 1; i >= 0; i--) {
    const name = (names[i][0] || '').toString().trim();
    if (name) return i + 2;
  }
  return 1;
}

function moveNewMissionToTop_(sheet, editedRow) {
  if (editedRow <= 2) return; // 이미 2행(맨 위 데이터행)

  const lastCol = Math.max(4, sheet.getLastColumn());
  // row2 ~ editedRow 를 한 번에 읽어 새 행을 맨 앞으로
  const range = sheet.getRange(2, 1, editedRow - 1, lastCol);
  const rows = range.getValues();
  if (rows.length < 2) return;

  const newRow = rows[rows.length - 1];
  const others = rows.slice(0, rows.length - 1);
  range.setValues([newRow].concat(others));

  // 이동된 행(row 2)에 체크박스 새로 적용
  const cbCell = sheet.getRange(2, 1);
  cbCell.clearDataValidations();
  cbCell.insertCheckboxes();
}

function moveCheckedMissionRowToBottom_(sheet, editedRow) {
  const lastDataRow = findLastMissionDataRow_(sheet);
  if (lastDataRow < 2 || editedRow >= lastDataRow) return;

  const lastCol = Math.max(4, sheet.getLastColumn());
  const range = sheet.getRange(editedRow, 1, lastDataRow - editedRow + 1, lastCol);
  const rows = range.getValues();
  if (rows.length <= 1) return;

  // 편집된 행을 마지막 데이터 행으로 내리고, 중간 행은 한 칸씩 당김
  const moved = rows[0];
  const shifted = rows.slice(1);
  shifted.push(moved);
  range.setValues(shifted);
}

function buildScoresPayloadFromCurrentSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const studentsSheet = ss.getSheetByName('students');
  const missionsSheet = ss.getSheetByName('missions');
  const scoresSheet = ss.getSheetByName('scores');

  if (!studentsSheet || !missionsSheet) return {};

  function pickNameCell(row) {
    const cleaned = (row || [])
      .map(function(value) { return (value || '').toString().trim(); })
      .filter(Boolean);
    if (!cleaned.length) return '';
    if (cleaned.length >= 2 && /^\d+$/.test(cleaned[0])) return cleaned[1];
    return cleaned[0];
  }

  const sLast = studentsSheet.getLastRow();
  if (sLast < 1) return {};
  const sRows = studentsSheet
    .getRange(1, 1, sLast, Math.max(1, studentsSheet.getLastColumn()))
    .getValues();

  const firstS = (sRows[0] || []).map(function(v) { return (v || '').toString().trim().toLowerCase(); });
  const sHasHeader = firstS.some(function(cell) {
    return cell.indexOf('학생') > -1 || cell.indexOf('이름') > -1;
  });
  const studentRows = sHasHeader ? sRows.slice(1) : sRows;
  const studentNames = studentRows.map(pickNameCell).filter(Boolean);

  const mLast = missionsSheet.getLastRow();
  if (mLast < 1) return {};
  const mRowsRaw = missionsSheet
    .getRange(1, 1, mLast, Math.max(1, missionsSheet.getLastColumn()))
    .getValues();
  const firstM = (mRowsRaw[0] || []).map(function(v) { return (v || '').toString().trim().toLowerCase(); });
  const mHasHeader = firstM.some(function(cell) {
    return cell.indexOf('미션') > -1 || cell.indexOf('과제') > -1 || cell.indexOf('완료') > -1 || cell.indexOf('체크') > -1;
  });
  const mRows = mHasHeader ? mRowsRaw.slice(1) : mRowsRaw;

  const usesCheckboxColumn = (mRows || []).some(function(row) {
    var col0 = (row[0] || '').toString().trim().toLowerCase();
    var col1 = (row[1] || '').toString().trim();
    return !!col1 || col0 === 'true' || col0 === 'false' || col0 === '1' || col0 === '0' || col0 === '완료' || col0 === 'x';
  });

  const missionData = mRows
    .map(function(row, idx) {
      const name = usesCheckboxColumn
        ? (row[1] || '').toString().trim()
        : (row[0] || '').toString().trim();
      if (!name) return null;
      const lower = name.toLowerCase();
      if (lower === 'true' || lower === 'false') return null;
      return { id: 'm' + (idx + 1), name: name };
    })
    .filter(Boolean);

  const payload = {};
  studentNames.forEach(function(_, i) {
    payload['s' + (i + 1)] = {};
  });
  if (!scoresSheet) return payload;

  const scoreLastRow = scoresSheet.getLastRow();
  const scoreLastCol = scoresSheet.getLastColumn();
  if (scoreLastRow < 2 || scoreLastCol < 2) return payload;

  const table = scoresSheet.getRange(1, 1, scoreLastRow, scoreLastCol).getValues();
  const headers = (table[0] || []).map(function(v) { return (v || '').toString().trim(); });
  const reserved = { '학생이름': true, '합계': true, '마지막 업데이트': true };
  const missionCols = [];
  headers.forEach(function(h, ci) {
    if (!h || reserved[h]) return;
    missionCols.push({ name: h, col: ci });
  });

  const scoreByStudentName = {};
  for (let ri = 1; ri < table.length; ri++) {
    const row = table[ri] || [];
    const studentName = (row[0] || '').toString().trim();
    if (!studentName) continue;
    const byMission = {};
    missionCols.forEach(function(mc) {
      byMission[mc.name] = Number(row[mc.col]) || 0;
    });
    scoreByStudentName[studentName] = byMission;
  }

  studentNames.forEach(function(studentName, si) {
    const sid = 's' + (si + 1);
    const byMission = scoreByStudentName[studentName] || {};
    const sc = {};
    missionData.forEach(function(m) {
      sc[m.id] = Number(byMission[m.name]) || 0;
    });
    payload[sid] = sc;
  });

  return payload;
}

function writeScoresToSheet(allScores, inspectionMap) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let scoresSheet = ss.getSheetByName('scores');
  if (!scoresSheet) scoresSheet = ss.insertSheet('scores');

  const studentsSheet = ss.getSheetByName('students');
  const missionsSheet = ss.getSheetByName('missions');
  if (!studentsSheet || !missionsSheet) return;

  const studentLast = studentsSheet.getLastRow();
  const missionLast = missionsSheet.getLastRow();
  if (studentLast < 1 || missionLast < 1) return;

  function pickNameCell(row) {
    const cleaned = (row || [])
      .map(function(value) { return (value || '').toString().trim(); })
      .filter(Boolean);
    if (!cleaned.length) return '';
    if (cleaned.length >= 2 && /^\d+$/.test(cleaned[0])) return cleaned[1];
    return cleaned[0];
  }

  function stripOptionalHeader(rows) {
    if (!rows || !rows.length) return [];
    const firstRow = rows[0].map(function(cell) {
      return (cell || '').toString().trim().toLowerCase();
    });
    const hasHeader = firstRow.some(function(cell) {
      return cell.indexOf('학생') > -1 || cell.indexOf('이름') > -1 ||
        cell.indexOf('미션') > -1 || cell.indexOf('과제') > -1 ||
        cell.indexOf('lock') > -1 || cell.indexOf('description') > -1 ||
        cell.indexOf('완료') > -1 || cell.indexOf('체크') > -1;
    });
    return hasHeader ? rows.slice(1) : rows;
  }

  const rawStudentRows = studentsSheet
    .getRange(1, 1, studentLast, Math.max(1, studentsSheet.getLastColumn()))
    .getValues();

  const rawMissionRows = missionsSheet
    .getRange(1, 1, missionLast, Math.max(1, missionsSheet.getLastColumn()))
    .getValues();

  const studentRows = stripOptionalHeader(rawStudentRows);
  const missionRows = stripOptionalHeader(rawMissionRows);

  const studentNames = studentRows
    .map(pickNameCell)
    .filter(Boolean);

  const persistedInspection = readInspectionMapFromScoresSheet_();
  const inspection = inspectionMap && typeof inspectionMap === 'object' ? inspectionMap : persistedInspection;

  const usesCheckboxColumn = (missionRows || []).some(function(row) {
    var col0 = (row[0] || '').toString().trim().toLowerCase();
    var col1 = (row[1] || '').toString().trim();
    return !!col1 || col0 === 'true' || col0 === 'false' || col0 === '1' || col0 === '0' || col0 === '완료' || col0 === 'x';
  });

  // 미션 데이터 파싱: 신형(A=완료,B=미션명)과 구형(A=미션명) 모두 지원
  const missionData = missionRows
    .map(function(row, rowIndex) {
      const col0 = (row[0] || '').toString().trim();
      const col1 = (row[1] || '').toString().trim();
      const name = usesCheckboxColumn ? col1 : col0;
      const isCompleted = usesCheckboxColumn && (
        row[0] === true || col0.toLowerCase() === 'true' || col0 === '1' || col0 === '완료' || col0.toLowerCase() === 'x'
      );
      return { id: 'm' + (rowIndex + 1), completed: isCompleted, name: name };
    })
    .filter(function(m) {
      if (!m.name) return false;
      var lower = (m.name || '').toString().trim().toLowerCase();
      return lower !== 'true' && lower !== 'false';
    });
  
  // 미션을 활성(체크 안 함)과 완료(체크됨)로 분류
  const activeMissions = missionData.filter(function(m) { return !m.completed; });
  const completedMissions = missionData.filter(function(m) { return m.completed; });
  
  const missionNames = activeMissions.map(function(m) { return m.name; });
  const completedMissionNames = completedMissions.map(function(m) { return m.name; });

  if (!studentNames.length || (!missionNames.length && !completedMissionNames.length)) return;

  // 헤더: 학생이름 | 활성미션들 | 완료미션들 | 합계 | 업데이트
  const headers = ['학생이름'].concat(missionNames, completedMissionNames, ['합계', '마지막 업데이트']);
  const rows = studentNames.map(function(name, si) {
    const sid = 's' + (si + 1);
    const sc = allScores[sid] || {};
    
    // 활성 미션 점수
    const activeCells = activeMissions.map(function(m) {
      return Number(sc[m.id]) || 0;
    });
    
    // 완료된 미션 점수
    const completedCells = completedMissions.map(function(m) {
      return Number(sc[m.id]) || 0;
    });
    
    const total = activeCells.concat(completedCells).reduce(function(sum, v) { return sum + v; }, 0);
    return [name].concat(activeCells, completedCells, [total, new Date().toLocaleString('ko-KR')]);
  });

  scoresSheet.clear();
  scoresSheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  scoresSheet.getRange(2, 1, rows.length, headers.length).setValues(rows);

  scoresSheet.getRange(1, 1, 1, headers.length)
    .setBackground('#FF6B35')
    .setFontColor('#FFFFFF')
    .setFontWeight('bold');

  scoresSheet.getRange(1, 1, rows.length + 1, headers.length)
    .setWrap(true)
    .setVerticalAlignment('middle')
    .setHorizontalAlignment('center');

  scoresSheet.getRange(2, 1, rows.length, 1).setHorizontalAlignment('left');

  rows.forEach(function(row, ri) {
    const sid = 's' + (ri + 1);
    const inspectedRow = inspection[sid] || {};

    // 활성 미션 열: 초록색(완료) 또는 흰색(미완료)
    const activeStartCol = 2;
    for (let ci = 0; ci < missionNames.length; ci++) {
      const cell = scoresSheet.getRange(ri + 2, activeStartCol + ci);
      const rowIdx = activeStartCol + ci - 1;
      const missionId = activeMissions[ci] ? activeMissions[ci].id : null;
      const inspected = missionId ? !!inspectedRow[missionId] : false;
      if (row[rowIdx] > 0) {
        if (inspected) {
          cell.setBackground('#FB923C').setFontColor('#FFFFFF').setFontStyle('normal');
        } else {
          cell.setBackground('#DCFCE7').setFontColor('#15803D').setFontStyle('normal');
        }
      } else {
        cell.setBackground('#FFFFFF').setFontColor('#6B7280').setFontStyle('normal');
      }
    }
    
    // 완료된 미션 열: 회색으로 표시
    const completedStartCol = activeStartCol + missionNames.length;
    for (let ci = 0; ci < completedMissionNames.length; ci++) {
      const cell = scoresSheet.getRange(ri + 2, completedStartCol + ci);
      const score = row[completedStartCol + ci - 1];
      const missionId = completedMissions[ci] ? completedMissions[ci].id : null;
      const inspected = missionId ? !!inspectedRow[missionId] : false;
      if (score > 0) {
        if (inspected) {
          cell.setBackground('#FB923C').setFontColor('#FFFFFF').setFontStyle('normal');
        } else {
          cell.setBackground('#E5E7EB').setFontColor('#6B7280').setFontStyle('italic');
        }
      } else {
        cell.setBackground('#F3F4F6').setFontColor('#9CA3AF').setFontStyle('italic');
      }
    }

    scoresSheet
      .getRange(ri + 2, completedStartCol + completedMissionNames.length)
      .setFontWeight('bold')
      .setFontColor('#FF6B35');
  });

  scoresSheet.setFrozenRows(1);
  scoresSheet.setFrozenColumns(1);

  // 과제 열이 너무 좁아지지 않도록 이름 길이에 맞춰 최소 폭을 보장
  function calcMissionWidth(missions) {
    var longestLen = missions.reduce(function(maxLen, name) {
      var len = (name || '').toString().trim().length;
      return Math.max(maxLen, len);
    }, 0);
    return Math.max(120, Math.min(200, 72 + longestLen * 10));
  }

  var activeMissionWidth = calcMissionWidth(missionNames);
  var completedMissionWidth = calcMissionWidth(completedMissionNames);

  scoresSheet.setColumnWidth(1, 150); // 학생이름
  if (missionNames.length) scoresSheet.setColumnWidths(2, missionNames.length, activeMissionWidth);
  var completedStartCol = 2 + missionNames.length;
  if (completedMissionNames.length) scoresSheet.setColumnWidths(completedStartCol, completedMissionNames.length, completedMissionWidth);
  var totalCol = completedStartCol + completedMissionNames.length;
  scoresSheet.setColumnWidth(totalCol, 85);  // 합계
  scoresSheet.setColumnWidth(totalCol + 1, 210); // 마지막 업데이트
  if (rows.length) scoresSheet.setRowHeights(2, rows.length, 36);
}

// 미션 시트에 체크박스 추가 (A열)
function setupMissionCheckboxes() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const missionsSheet = ss.getSheetByName('missions');
  if (!missionsSheet) return;
  
  const headerA = (missionsSheet.getRange('A1').getValue() || '').toString().trim();
  const headerB = (missionsSheet.getRange('B1').getValue() || '').toString().trim();
  const alreadyConverted = headerA === '완료' && (headerB === '미션명' || headerB === '과제명');

  // 아직 변환 전이면 A열을 하나 삽입해 기존 데이터를 오른쪽으로 밀어 데이터 유실을 막는다.
  if (!alreadyConverted) {
    missionsSheet.insertColumnBefore(1);
  }

  missionsSheet.getRange('A1').setValue('완료');
  if (!missionsSheet.getRange('B1').getValue()) missionsSheet.getRange('B1').setValue('미션명');
  if (!missionsSheet.getRange('C1').getValue()) missionsSheet.getRange('C1').setValue('잠금시간');
  if (!missionsSheet.getRange('D1').getValue()) missionsSheet.getRange('D1').setValue('설명');

  const missionLast = Math.max(2, missionsSheet.getLastRow());
  const applyUntil = Math.max(missionLast, 500);

  const range = missionsSheet.getRange(2, 1, applyUntil - 1, 1);
  range.clearDataValidations();
  range.insertCheckboxes();
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
