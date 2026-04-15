import { RECORDS } from '../records.js';

// ────────────────────────────────────────────────────
// 전역 상태
// ────────────────────────────────────────────────────
let currentSearch = '';

// ────────────────────────────────────────────────────
// 유틸
// ────────────────────────────────────────────────────
function nl2br(text) {
  return (text || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br>');
}

function showLoadingOverlay() {
  document.getElementById('pageLoadingOverlay')?.classList.remove('hidden');
}

function hideLoadingOverlay() {
  document.getElementById('pageLoadingOverlay')?.classList.add('hidden');
}

function waitForImagesToLoad(container) {
  const images = Array.from(container.querySelectorAll('img'));
  if (images.length === 0) { hideLoadingOverlay(); return; }

  let done = 0;
  const onDone = () => { if (++done >= images.length) hideLoadingOverlay(); };
  images.forEach(img => {
    if (img.complete) { onDone(); }
    else {
      img.addEventListener('load',  onDone, { once: true });
      img.addEventListener('error', onDone, { once: true });
    }
  });
}

// ────────────────────────────────────────────────────
// 렌더링
// ────────────────────────────────────────────────────
function renderCards(container) {
  container.innerHTML = '';

  const filtered = currentSearch
    ? RECORDS.filter(r =>
        (r.title || '').toLowerCase().includes(currentSearch) ||
        (r.tags  || '').toLowerCase().includes(currentSearch) ||
        (r.desc  || '').toLowerCase().includes(currentSearch)
      )
    : RECORDS;

  if (RECORDS.length === 0) {
    container.innerHTML = `
      <div class="text-center py-12 label-font text-on-surface-variant">
        아직 등록된 기록이 없습니다.<br>
        <span class="text-xs mt-2 block text-[#b2b2ad]">records.js 파일에 기록을 추가해 주세요.</span>
      </div>`;
    hideLoadingOverlay();
    return;
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="text-center py-12 label-font text-on-surface-variant">
        "${currentSearch}"에 해당하는 기록이 없습니다.
      </div>`;
    hideLoadingOverlay();
    return;
  }

  filtered.forEach((item, idx) => {
    const title      = item.title || '제목 없는 기록';
    const desc       = item.desc  || '';
    const tags       = item.tags ? item.tags.split(',').map(t => t.trim()).filter(Boolean) : [];
    const displayNum = RECORDS.length - RECORDS.indexOf(item);

    const tagsHtml = tags.map(tag =>
      `<span class="bg-tertiary-fixed text-on-tertiary-fixed text-[10px] label-font px-2 py-0.5 rounded-full uppercase">${tag}</span>`
    ).join('');

    const card = `
      <div class="bg-surface-container-lowest rounded-3xl p-6 flex flex-col items-center gap-4 hover:bg-tertiary-container transition-all group border border-transparent hover:border-[#fcf7e1]">

        <div class="w-full flex justify-between items-center mb-2">
          <span class="label-font text-xl font-bold text-outline-variant">#${String(displayNum).padStart(3, '0')}</span>
        </div>

        <div class="w-full rounded-2xl overflow-hidden mb-2 bg-[#f0ece6] min-h-[160px] flex items-center justify-center">
          <img src="${item.image}"
            class="w-full h-auto object-contain"
            alt="${title}"
            loading="lazy"
            decoding="async"
            onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
          <div style="display:none" class="w-full min-h-[160px] flex flex-col items-center justify-center gap-2 text-[#b2b2ad]">
            <span class="material-symbols-outlined text-4xl">image</span>
            <span class="label-font text-xs">이미지 준비 중</span>
          </div>
        </div>

        <div class="w-full text-center flex flex-col items-center gap-2 px-2">
          <h3 class="font-bold text-2xl text-on-surface">${nl2br(title)}</h3>
          <p class="text-sm text-on-surface-variant leading-relaxed">${nl2br(desc)}</p>
          <div class="mt-2 flex flex-wrap justify-center gap-2">${tagsHtml}</div>
        </div>

        <a href="${item.link}" target="_blank" rel="noopener noreferrer" class="w-full mt-4">
          <button class="w-full bg-primary text-[#fff7f6] label-font px-6 py-4 rounded-2xl hover:shadow-[0_10px_20px_rgba(124,85,86,0.15)] transition-all active:scale-95 flex items-center justify-center gap-2">
            Go to Link
            <span class="material-symbols-outlined text-sm">arrow_outward</span>
          </button>
        </a>

      </div>`;
    container.innerHTML += card;
  });

  waitForImagesToLoad(container);
}

function render() {
  const container = document.getElementById('recordContainer');
  showLoadingOverlay();
  renderCards(container);
}

// ────────────────────────────────────────────────────
// 검색
// ────────────────────────────────────────────────────
window.openSearch = function() {
  document.getElementById('searchPanel').classList.remove('hidden');
  setTimeout(() => document.getElementById('searchInput').focus(), 50);
};

window.closeSearch = function() {
  document.getElementById('searchPanel').classList.add('hidden');
};

window.doSearch = function() {
  currentSearch = (document.getElementById('searchInput').value || '').trim().toLowerCase();
  document.getElementById('searchPanel').classList.add('hidden');
  render();
};

window.clearSearch = function() {
  currentSearch = '';
  document.getElementById('searchInput').value = '';
  document.getElementById('searchPanel').classList.add('hidden');
  render();
};

// ────────────────────────────────────────────────────
// 설정 (다크모드)
// ────────────────────────────────────────────────────
window.openSettings = function() {
  document.getElementById('settingsPanel').classList.remove('hidden');
};

window.closeSettings = function() {
  document.getElementById('settingsPanel').classList.add('hidden');
};

window.toggleDarkMode = function() {
  const isDark = document.documentElement.classList.toggle('dark');
  localStorage.setItem('darkMode', isDark ? '1' : '0');
  const toggle = document.getElementById('darkModeToggle');
  if (toggle) toggle.checked = isDark;
};

// ────────────────────────────────────────────────────
// 초기화
// ────────────────────────────────────────────────────
(function init() {
  if (localStorage.getItem('darkMode') === '1') {
    document.documentElement.classList.add('dark');
  }

  window.addEventListener('DOMContentLoaded', () => {
    const isDark = document.documentElement.classList.contains('dark');
    const toggle = document.getElementById('darkModeToggle');
    if (toggle) toggle.checked = isDark;

    render();
  });
})();
