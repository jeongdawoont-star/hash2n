import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, serverTimestamp, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
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
  const input = prompt("관리자 비밀번호를 입력하세요.");
  if (input === PASSWORD) {
    document.getElementById("adminPanel").classList.remove("hidden");
  } else if (input !== null) {
    alert("비밀번호가 틀렸습니다.");
  }
};

window.closeAdmin = function() {
  document.getElementById("adminPanel").classList.add("hidden");
};

// 화면에 피드형 카드를 그리는 함수
window.render = async function() {
  const container = document.getElementById("recordContainer");
  showLoadingOverlay();

  try {
    const q = query(collection(db, "records"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    
    container.innerHTML = ""; 
    let index = querySnapshot.size;

    querySnapshot.forEach((documentSnapshot) => {
      const item = documentSnapshot.data();
      const docId = documentSnapshot.id;
      
      const title = item.title || "제목 없는 기록";
      const desc = item.desc || "설명이 생략된 코딩 로그입니다.";
      const tags = item.tags ? item.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [];
      
      let tagsHtml = '';
      tags.forEach(tag => {
        tagsHtml += `<span class="bg-tertiary-fixed text-on-tertiary-fixed text-[10px] label-font px-2 py-0.5 rounded-full uppercase">${tag}</span>`;
      });

      // 🔥 스크린샷과 동일한 세로형(인스타 피드) 레이아웃 적용 🔥
      const card = `
        <div class="bg-surface-container-lowest rounded-3xl p-6 flex flex-col items-center gap-4 hover:bg-tertiary-container transition-all group border border-transparent hover:border-[#fcf7e1]">
          
          <div class="w-full flex justify-between items-center mb-2">
            <span class="label-font text-xl font-bold text-outline-variant">#${String(index).padStart(3, '0')}</span>
            <button onclick="deleteRecord('${docId}', '${item.storagePath || ''}')" class="text-outline-variant hover:text-error transition-colors p-2 rounded-full hover:bg-primary-container" title="기록 삭제">
              <span class="material-symbols-outlined text-sm">delete</span>
            </button>
          </div>
          
          <div class="w-full rounded-2xl overflow-hidden mb-2">
            <img src="${item.imageUrl}" class="w-full h-auto object-contain" alt="thumbnail">
          </div>
          
          <div class="w-full text-center flex flex-col items-center gap-2 px-2">
            <h3 class="font-bold text-2xl text-on-surface">${title}</h3>
            <p class="text-sm text-on-surface-variant leading-relaxed">${desc}</p>
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
      index--;
    });

     if(container.innerHTML === "") {
       container.innerHTML = `<div class="text-center py-12 label-font text-on-surface-variant">아직 등록된 기록이 없습니다. 우측 하단의 Add 버튼을 눌러보세요!</div>`;
       hideLoadingOverlay();
     } else {
       waitForImagesToLoad(container);
    }

  } catch (error) {
    console.error("데이터 불러오기 에러:", error);
    container.innerHTML = `<div class="text-center py-12 text-error font-bold">데이터를 불러오는데 실패했습니다. (콘솔창 확인)</div>`;
     hideLoadingOverlay();
  }
};

window.addRecord = async function() {
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
  const input = prompt("삭제 권한 확인: 관리자 비밀번호를 입력하세요.");
  
  if (input === PASSWORD) {
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
  } else if (input !== null) {
    alert("비밀번호가 틀렸습니다.");
  }
};

window.render();