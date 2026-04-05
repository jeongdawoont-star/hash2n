import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, serverTimestamp, deleteDoc, doc, updateDoc, writeBatch } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-storage.js";

// ⭐️ 여기에 선생님의 파이어베이스 설정 코드를 붙여넣으세요! ⭐️
const firebaseConfig = {
  apiKey: "AIzaSyBdIkJqu6xIGpnTTit_THGRoGmXaz9sdTY",
  authDomain: "git-page-eda67.firebaseapp.com",
  projectId: "git-page-eda67",
  storageBucket: "git-page-eda67.firebasestorage.app",
  messagingSenderId: "416521816192",
  appId: "1:416521816192:web:e76fcbff3d858975533e65"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

const PASSWORD = "3393";
let isAdminMode = false;

function showLoadingOverlay() {
  const overlay = document.getElementById("pageLoadingOverlay");
  if (overlay) {
    overlay.classList.remove("hidden");
  }
}

function hideLoadingOverlay() {
  const overlay = document.getElementById("pageLoadingOverlay");
  if (overlay) {
    overlay.classList.add("hidden");
  }
}

function waitForImagesToLoad(container) {
  const images = Array.from(container.querySelectorAll("img"));
  if (images.length === 0) {
    hideLoadingOverlay();
    return;
  }

  let finishedCount = 0;
  const onDone = () => {
    finishedCount += 1;
    if (finishedCount >= images.length) {
      hideLoadingOverlay();
    }
  };

  images.forEach((img) => {
    if (img.complete) {
      onDone();
    } else {
      img.addEventListener("load", onDone, { once: true });
      img.addEventListener("error", onDone, { once: true });
    }
  });
}

window.openAdmin = function() {
  if (!isAdminMode) {
    alert("설정에서 관리자 모드를 먼저 켜주세요.");
    openSettings();
    return;
  }
  document.getElementById("adminPanel").classList.remove("hidden");
};

window.closeAdmin = function() {
  document.getElementById("adminPanel").classList.add("hidden");
};

// 전체 레코드 목록 (순서 변경을 위해 메모리에 유지)
let allRecords = [];

function updateAdminUi() {
  const modeText = document.getElementById("adminModeStatus");
  const modeBtn = document.getElementById("adminModeBtn");
  const quickAddWrap = document.getElementById("settingsAddWrap");
  const addButtons = Array.from(document.querySelectorAll(".add-entry-btn"));

  if (modeText) {
    modeText.textContent = isAdminMode ? "ON" : "OFF";
    modeText.className = isAdminMode
      ? "label-font text-xs font-bold text-emerald-600"
      : "label-font text-xs font-bold text-[#b2b2ad]";
  }

  if (modeBtn) {
    modeBtn.textContent = isAdminMode ? "끄기" : "켜기";
    modeBtn.className = isAdminMode
      ? "bg-primary-container text-on-secondary-container label-font font-bold text-xs px-4 py-2 rounded-xl active:scale-95 transition-all"
      : "bg-secondary-container text-on-secondary-container label-font font-bold text-xs px-4 py-2 rounded-xl active:scale-95 transition-all";
  }

  if (quickAddWrap) {
    quickAddWrap.classList.toggle("hidden", !isAdminMode);
  }

  addButtons.forEach((btn) => {
    btn.classList.toggle("opacity-50", !isAdminMode);
  });
}

window.toggleAdminMode = function() {
  if (isAdminMode) {
    isAdminMode = false;
    updateAdminUi();
    renderCards(document.getElementById("recordContainer"));
    return;
  }

  const input = prompt("관리자 모드 비밀번호를 입력하세요.");
  if (input === PASSWORD) {
    isAdminMode = true;
    updateAdminUi();
    renderCards(document.getElementById("recordContainer"));
    alert("관리자 모드가 켜졌습니다.");
  } else if (input !== null) {
    alert("비밀번호가 틀렸습니다.");
  }
};

// 텍스트에서 줄바꿈(\n)을 <br>로 변환
function nl2br(text) {
  return (text || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br>");
}

// 화면에 피드형 카드를 그리는 함수
window.render = async function() {
  const container = document.getElementById("recordContainer");
  showLoadingOverlay();

  try {
    const querySnapshot = await getDocs(collection(db, "records"));
    
    allRecords = [];
    querySnapshot.forEach((documentSnapshot) => {
      allRecords.push({ id: documentSnapshot.id, ...documentSnapshot.data() });
    });

    const hasMissingOrder = allRecords.some(r => r.order === undefined || r.order === null);

    // 정렬 기준: order가 있으면 order 우선, 없으면 createdAt(최신순) 사용
    allRecords.sort((a, b) => {
      const aHasOrder = a.order !== undefined && a.order !== null;
      const bHasOrder = b.order !== undefined && b.order !== null;

      if (aHasOrder && bHasOrder) {
        return a.order - b.order;
      }

      if (aHasOrder && !bHasOrder) {
        return -1;
      }

      if (!aHasOrder && bHasOrder) {
        return 1;
      }

      const aTime = a.createdAt ? a.createdAt.toMillis() : 0;
      const bTime = b.createdAt ? b.createdAt.toMillis() : 0;
      return bTime - aTime;
    });

    // order가 비어있는 기존 문서가 있으면 현재 정렬 순서대로 order를 일괄 부여
    if (hasMissingOrder) {
      const batch = writeBatch(db);
      allRecords.forEach((record, i) => {
        const docRef = doc(db, "records", record.id);
        batch.update(docRef, { order: i });
        record.order = i;
      });
      await batch.commit();
    }

    renderCards(container);

  } catch (error) {
    console.error("데이터 불러오기 에러:", error);
    container.innerHTML = `<div class="text-center py-12 text-error font-bold">데이터를 불러오는데 실패했습니다. (콘솔창 확인)</div>`;
    hideLoadingOverlay();
  }
};

function renderCards(container) {
  container.innerHTML = "";

  if (allRecords.length === 0) {
    container.innerHTML = `<div class="text-center py-12 label-font text-on-surface-variant">아직 등록된 기록이 없습니다. 우측 하단의 Add 버튼을 눌러보세요!</div>`;
    hideLoadingOverlay();
    return;
  }

  const currentSearch = document.getElementById("searchInput") ? document.getElementById("searchInput").value.trim().toLowerCase() : "";

  const filtered = currentSearch
    ? allRecords.filter(r =>
        (r.title || "").toLowerCase().includes(currentSearch) ||
        (r.tags || "").toLowerCase().includes(currentSearch) ||
        (r.desc || "").toLowerCase().includes(currentSearch)
      )
    : allRecords;

  if (filtered.length === 0) {
    container.innerHTML = `<div class="text-center py-12 label-font text-on-surface-variant">"${currentSearch}"에 해당하는 기록이 없습니다.</div>`;
    hideLoadingOverlay();
    return;
  }

  filtered.forEach((item) => {
    const docId = item.id;
    const title = item.title || "제목 없는 기록";
    const desc = item.desc || "설명이 생략된 코딩 로그입니다.";
    const tags = item.tags ? item.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [];
    const displayNum = allRecords.findIndex(r => r.id === docId) + 1;

    let tagsHtml = '';
    tags.forEach(tag => {
      tagsHtml += `<span class="bg-tertiary-fixed text-on-tertiary-fixed text-[10px] label-font px-2 py-0.5 rounded-full uppercase">${tag}</span>`;
    });

    const realIndex = allRecords.findIndex(r => r.id === docId);
    const upDisabled = realIndex <= 0 ? "opacity-30 pointer-events-none" : "";
    const downDisabled = realIndex >= allRecords.length - 1 ? "opacity-30 pointer-events-none" : "";
    const adminActions = isAdminMode ? `
      <div class="flex items-center gap-1">
        <span class="text-[10px] label-font text-emerald-600 font-bold mr-1">ADMIN</span>
        <button onclick="moveRecord('${docId}', -1)" class="p-1 rounded-full hover:bg-secondary-container transition-colors ${upDisabled}" title="위로 이동">
          <span class="material-symbols-outlined text-base text-secondary">arrow_upward</span>
        </button>
        <button onclick="moveRecord('${docId}', 1)" class="p-1 rounded-full hover:bg-secondary-container transition-colors ${downDisabled}" title="아래로 이동">
          <span class="material-symbols-outlined text-base text-secondary">arrow_downward</span>
        </button>
      </div>
      <div class="flex items-center gap-1">
        <button onclick="openEdit('${docId}')" class="text-outline-variant hover:text-secondary transition-colors p-2 rounded-full hover:bg-secondary-container" title="기록 수정">
          <span class="material-symbols-outlined text-sm">edit</span>
        </button>
        <button onclick="deleteRecord('${docId}', '${item.storagePath || ''}')" class="text-outline-variant hover:text-error transition-colors p-2 rounded-full hover:bg-primary-container" title="기록 삭제">
          <span class="material-symbols-outlined text-sm">delete</span>
        </button>
      </div>
    ` : `<span class="text-[10px] label-font text-[#b2b2ad]">보기 모드</span>`;

    const card = `
      <div id="card-${docId}" class="bg-surface-container-lowest rounded-3xl p-6 flex flex-col items-center gap-4 hover:bg-tertiary-container transition-all group border border-transparent hover:border-[#fcf7e1]">
        
        <div class="w-full flex justify-between items-center mb-2">
          <div class="flex items-center gap-1">
            <span class="label-font text-xl font-bold text-outline-variant">#${String(displayNum).padStart(3, '0')}</span>
          </div>
          <div class="flex items-center gap-1">
            ${adminActions}
          </div>
        </div>
        
        <div class="w-full rounded-2xl overflow-hidden mb-2">
          <img src="${item.imageUrl}" class="w-full h-auto object-contain" alt="thumbnail">
        </div>
        
        <div class="w-full text-center flex flex-col items-center gap-2 px-2">
          <h3 class="font-bold text-2xl text-on-surface">${nl2br(title)}</h3>
          <p class="text-sm text-on-surface-variant leading-relaxed">${nl2br(desc)}</p>
          <div class="mt-2 flex flex-wrap justify-center gap-2">
            ${tagsHtml}
          </div>
        </div>
        
        <a href="${item.link}" target="_blank" class="w-full mt-4">
          <button class="w-full bg-primary text-[#fff7f6] label-font px-6 py-4 rounded-2xl hover:shadow-[0_10px_20px_rgba(124,85,86,0.15)] transition-all active:scale-95 flex items-center justify-center gap-2">
            Go to Link
            <span class="material-symbols-outlined text-sm">arrow_outward</span>
          </button>
        </a>
        
      </div>
    `;
    container.innerHTML += card;
  });

  waitForImagesToLoad(container);
}

// 순서 변경
window.moveRecord = async function(docId, direction) {
  if (!isAdminMode) {
    alert("관리자 모드에서만 순서를 변경할 수 있습니다.");
    return;
  }

  const idx = allRecords.findIndex(r => r.id === docId);
  const targetIdx = idx + direction;
  if (targetIdx < 0 || targetIdx >= allRecords.length) return;

  // 두 항목의 order 값 교환
  const batch = writeBatch(db);
  const aRef = doc(db, "records", allRecords[idx].id);
  const bRef = doc(db, "records", allRecords[targetIdx].id);
  const aOrder = allRecords[idx].order;
  const bOrder = allRecords[targetIdx].order;
  batch.update(aRef, { order: bOrder });
  batch.update(bRef, { order: aOrder });
  await batch.commit();

  // 메모리 배열도 교환
  [allRecords[idx].order, allRecords[targetIdx].order] = [bOrder, aOrder];
  [allRecords[idx], allRecords[targetIdx]] = [allRecords[targetIdx], allRecords[idx]];

  renderCards(document.getElementById("recordContainer"));
};

// 수정 패널 열기
window.openEdit = function(docId) {
  if (!isAdminMode) {
    alert("관리자 모드에서만 수정할 수 있습니다.");
    return;
  }

  const record = allRecords.find(r => r.id === docId);
  if (!record) return;

  document.getElementById("editDocId").value = docId;
  document.getElementById("editTitleInput").value = record.title || "";
  document.getElementById("editDescInput").value = record.desc || "";
  document.getElementById("editTagsInput").value = record.tags || "";
  document.getElementById("editLinkInput").value = record.link || "";
  document.getElementById("editPanel").classList.remove("hidden");
};

window.closeEdit = function() {
  document.getElementById("editPanel").classList.add("hidden");
};

window.saveEdit = async function() {
  if (!isAdminMode) {
    alert("관리자 모드에서만 저장할 수 있습니다.");
    return;
  }

  const docId = document.getElementById("editDocId").value;
  const title = document.getElementById("editTitleInput").value;
  const desc = document.getElementById("editDescInput").value;
  const tags = document.getElementById("editTagsInput").value;
  const link = document.getElementById("editLinkInput").value;

  const saveBtn = document.getElementById("editSaveBtn");
  saveBtn.innerText = "저장 중...";
  saveBtn.disabled = true;

  try {
    await updateDoc(doc(db, "records", docId), { title, desc, tags, link });
    const record = allRecords.find(r => r.id === docId);
    if (record) Object.assign(record, { title, desc, tags, link });
    closeEdit();
    renderCards(document.getElementById("recordContainer"));
  } catch (error) {
    console.error("수정 에러:", error);
    alert("수정 중 오류가 발생했습니다.");
  } finally {
    saveBtn.innerText = "수정 저장";
    saveBtn.disabled = false;
  }
};

// 검색
window.doSearch = function() {
  renderCards(document.getElementById("recordContainer"));
};

window.clearSearch = function() {
  document.getElementById("searchInput").value = "";
  document.getElementById("searchPanel").classList.add("hidden");
  renderCards(document.getElementById("recordContainer"));
};

window.openSearch = function() {
  document.getElementById("searchPanel").classList.remove("hidden");
  setTimeout(() => document.getElementById("searchInput").focus(), 50);
};

window.closeSearch = function() {
  clearSearch();
};

// Settings
window.openSettings = function() {
  document.getElementById("settingsPanel").classList.remove("hidden");
};

window.closeSettings = function() {
  document.getElementById("settingsPanel").classList.add("hidden");
};

window.toggleDarkMode = function() {
  document.documentElement.classList.toggle("dark");
  const isDark = document.documentElement.classList.contains("dark");
  localStorage.setItem("darkMode", isDark ? "1" : "0");
  const darkToggle = document.getElementById("darkModeToggle");
  if (darkToggle) darkToggle.checked = isDark;
};

// 다크모드 초기화
(function() {
  if (localStorage.getItem("darkMode") === "1") {
    document.documentElement.classList.add("dark");
  }

  window.addEventListener("DOMContentLoaded", () => {
    const isDark = document.documentElement.classList.contains("dark");
    const darkToggle = document.getElementById("darkModeToggle");
    if (darkToggle) darkToggle.checked = isDark;
    updateAdminUi();
  });
})();

window.addRecord = async function() {
  if (!isAdminMode) {
    alert("관리자 모드에서만 기록을 추가할 수 있습니다.");
    return;
  }

  const fileInput = document.getElementById("imageInput");
  const link = document.getElementById("linkInput").value;
  const title = document.getElementById("titleInput").value;
  const desc = document.getElementById("descInput").value;
  const tags = document.getElementById("tagsInput").value;
  const file = fileInput.files[0];

  if (!file || !link) {
    alert("이미지와 링크는 필수입니다.");
    return;
  }

  const submitBtn = document.querySelector("#adminPanel button[onclick='addRecord()']");
  submitBtn.innerText = "업로드 중...";
  submitBtn.disabled = true;

  try {
    const filePath = `thumbnails/${Date.now()}_${file.name}`;
    const imageRef = ref(storage, filePath);
    await uploadBytes(imageRef, file);
    const imageUrl = await getDownloadURL(imageRef);

    await addDoc(collection(db, "records"), {
      imageUrl: imageUrl,
      storagePath: filePath,
      link: link,
      title: title,
      desc: desc,
      tags: tags,
      order: allRecords.length,
      createdAt: serverTimestamp()
    });

    fileInput.value = "";
    document.getElementById("linkInput").value = "";
    document.getElementById("titleInput").value = "";
    document.getElementById("descInput").value = "";
    document.getElementById("tagsInput").value = "";
    
    closeAdmin();
    window.render();

  } catch (error) {
    console.error("업로드 에러:", error);
    alert("저장 중 오류가 발생했습니다.");
  } finally {
    submitBtn.innerText = "아카이브에 저장";
    submitBtn.disabled = false;
  }
};

window.deleteRecord = async function(docId, storagePath) {
  if (!isAdminMode) {
    alert("관리자 모드에서만 삭제할 수 있습니다.");
    return;
  }

  if(confirm("정말로 이 기록을 영구 삭제하시겠습니까?")) {
    try {
      await deleteDoc(doc(db, "records", docId));
      if (storagePath) {
        const imageRef = ref(storage, storagePath);
        await deleteObject(imageRef);
      }
      alert("기록이 삭제되었습니다.");
      window.render(); 
    } catch (error) {
      console.error("삭제 중 오류:", error);
      alert("삭제 중 오류가 발생했습니다.");
    }
  }
};

window.render();