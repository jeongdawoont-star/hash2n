import os
import json
import time
import subprocess
from selenium import webdriver
from selenium.webdriver.chrome.options import Options as ChromeOptions
from selenium.webdriver.common.by import By

# Base Config
VITE_URL = "http://localhost:5173/?fast=1"
OUTPUT_DIR = r"E:\OneDrive - 인천부평북초등학교\VIVE CODING\감자키우기\potato-remake\release\screenshots"

# Ensure dirs exist
os.makedirs(os.path.join(OUTPUT_DIR, "ko"), exist_ok=True)
os.path.join(OUTPUT_DIR, "ko")
os.makedirs(os.path.join(OUTPUT_DIR, "en"), exist_ok=True)

# Define resolutions (Landscape)
RESOLUTIONS = {
    "phone": (1920, 1080),
    "tablet_7in": (1280, 800),
    "tablet_10in": (1920, 1200)
}

# Base Game State Template
BASE_STATE = {
    "day": 1,
    "bonus": 13,
    "stats": { "gram": 181, "large": 179, "shape": 83, "nutri": 85, "regist": 55, "hard": 61 },
    "initialStats": { "gram": 181, "large": 179, "shape": 83, "nutri": 85, "regist": 55, "hard": 61 },
    "plan": { "morning": None, "afternoon": None, "evening": None },
    "planCursor": 0,
    "resolvingDay": False,
    "touchCombo": 0,
    "touchComboUpdatedAt": 0,
    "weekIndex": 1,
    "weekFocusStat": "gram",
    "seedSlot": { "results": ["gram", "large", "shape", "nutri", "regist"], "jackpot": False, "rerolls": 0, "rolled": True },
    "touchMood": "idle",
    "dragPower": 0,
    "actionPlayback": None,
    "currentMessage": "돌아온 감자 키우기",
    "messageLockedUntil": 0,
    "eventLog": [],
    "activeEvent": None,
    "eventSeen": {},
    "lastEventTurn": 0,
    "harvestFocus": None,
    "currentEnding": None,
    "unlockedEndingIds": ["E01", "E02", "E03", "E05", "E10", "E15", "E20", "E25", "E28", "E29", "E31", "E32", "E33"],
    "endingSeenCount": { "E01": 1, "E02": 1, "E03": 1, "E05": 1, "E10": 1, "E15": 1, "E20": 1, "E25": 1, "E28": 1, "E29": 1, "E31": 1, "E32": 1, "E33": 1 },
    "lastEndingId": "E01",
    "screen": "title",
    "collectionReturnScreen": "title",
    "runCount": 12,
    "careCount": 42,
    "potatoName": "귀여운 감자",
    "unlockedSlotsCount": 3,
    "toys": { "worm": True, "sweet": True, "landdog": True, "doraji": True },
    "recordSaved": False,
    "combo100Duration": 0,
    "combo100MaxDuration": 0,
    "combo100ReachedAt": None
}

# Records for Hall of Fame
DUMMY_RECORDS = [
    {
        "id": 1,
        "name": "KingPotato",
        "endingTitle": "세계에서 가장 큰 감자",
        "stats": { "gram": 1540, "large": 1490, "shape": 820, "nutri": 920, "regist": 780, "hard": 800 },
        "savedAt": int(time.time() * 1000) - 86400000
    },
    {
        "id": 2,
        "name": "도트러버",
        "endingTitle": "해시브라운",
        "stats": { "gram": 980, "large": 920, "shape": 580, "nutri": 620, "regist": 510, "hard": 560 },
        "savedAt": int(time.time() * 1000) - 172800000
    },
    {
        "id": 3,
        "name": "포테토칩",
        "endingTitle": "감자칩",
        "stats": { "gram": 780, "large": 710, "shape": 420, "nutri": 490, "regist": 350, "hard": 410 },
        "savedAt": int(time.time() * 1000) - 259200000
    },
    {
        "id": 4,
        "name": "식목일",
        "endingTitle": "재배용 씨감자",
        "stats": { "gram": 520, "large": 490, "shape": 280, "nutri": 310, "regist": 220, "hard": 250 },
        "savedAt": int(time.time() * 1000) - 345600000
    },
    {
        "id": 5,
        "name": "돼냥이",
        "endingTitle": "돼지 사료",
        "stats": { "gram": 410, "large": 380, "shape": 120, "nutri": 150, "regist": 80, "hard": 90 },
        "savedAt": int(time.time() * 1000) - 432000000
    }
]

# Setups for 8 specific screens
SCREENS_CONFIG = {
    "1_title": {
        "state_mod": {
            "screen": "title"
        }
    },
    "2_ingame_stage2": {
        "state_mod": {
            "screen": "game",
            "day": 15,
            "weekIndex": 2,
            "weekFocusStat": "large",
            "plan": { "morning": "feed", "afternoon": "water", "evening": "roll" },
            "planCursor": 0,
            "resolvingDay": True,
            "stats": { "gram": 280, "large": 230, "shape": 110, "nutri": 95, "regist": 65, "hard": 70 },
            "currentMessage": "아침 양분: 고소한 양분이 뿌리 끝까지 차곡차곡 쌓입니다.",
            "actionPlayback": {
                "kind": "eat",
                "frames": ["/assets/original/potato2_eat1.png", "/assets/original/potato2_eat2.png"],
                "frameIndex": 0,
                "loopCount": -999999
            }
        }
    },
    "3_ingame_stage5": {
        "state_mod": {
            "screen": "game",
            "day": 45,
            "weekIndex": 5,
            "weekFocusStat": "hard",
            "plan": { "morning": "feed", "afternoon": "power", "evening": "roll" },
            "planCursor": 1,
            "resolvingDay": True,
            "stats": { "gram": 510, "large": 480, "shape": 220, "nutri": 200, "regist": 180, "hard": 210 },
            "currentMessage": "점심 운동: 으라차차 움직이며 강한 감자 근성을 다집니다.",
            "actionPlayback": {
                "kind": "exercise",
                "frames": ["/assets/original/potato5_ex1.png", "/assets/original/potato5_ex2.png"],
                "frameIndex": 1,
                "loopCount": -999999
            }
        }
    },
    "4_ingame_stage8": {
        "state_mod": {
            "screen": "game",
            "day": 78,
            "weekIndex": 12,
            "weekFocusStat": "nutri",
            "plan": { "morning": "photo", "afternoon": "water", "evening": "dgdg" },
            "planCursor": 2,
            "resolvingDay": True,
            "stats": { "gram": 890, "large": 840, "shape": 450, "nutri": 480, "regist": 410, "hard": 430 },
            "currentMessage": "저녁 휴식: 쉬는 동안 남은 영양분이 알맞게 정리됩니다.",
            "actionPlayback": {
                "kind": "solar",
                "frames": ["/assets/original/potato8_solar1.png", "/assets/original/potato8_solar2.png"],
                "frameIndex": 0,
                "loopCount": -999999
            }
        }
    },
    "5_ending": {
        "state_mod": {
            "screen": "ending",
            "currentEnding": {
                "endingId": "E01",
                "imageIndex": 1,
                "title": "해시브라운",
                "hint": "⚖️ 무게  ·  📏 크기  ·  🍽️ 영양가  ·  🛡️ 면역력",
                "tier": 4,
                "statKeys": ["large", "shape", "nutri", "regist"],
                "score": 1250,
                "isNew": True,
                "story": "당신이 정성껏 키운 감자는 잘 자라서 해시브라운이 되었습니다. 해시브라운은 제작자의 캐릭터 이름입니다. 맛있지만 많이 먹으면 느끼할 수 있습니다. 혼자 먹는 것보다 햄버거, 콜라와 먹으면 더 좋아요. 당신의 감자는 꿈을 이루었네요. 축하드립니다."
            }
        }
    },
    "6_table": {
        "state_mod": {
            "screen": "collection",
            "collectionReturnScreen": "title"
        }
    },
    "7_hall_of_fame": {
        "state_mod": {
            "screen": "title"
        },
        "trigger_click": ".btn-ranking"
    },
    "8_achievements": {
        "state_mod": {
            "screen": "title"
        },
        "trigger_click": ".btn-achievements"
    }
}

def main():
    print("[script] Starting Selenium browser session...")
    options = ChromeOptions()
    options.add_argument("--headless=new")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-gpu")
    options.add_argument("--hide-scrollbars")
    options.add_argument("--mute-audio")
    
    driver = webdriver.Chrome(options=options)
    
    try:
        # Initial navigation to set local storage
        print("[script] Accessing local server to establish localStorage context...")
        driver.get(VITE_URL)
        time.sleep(2) # Allow Vite dev splash update checks to settle
        
        for lang in ["ko", "en"]:
            print(f"\n========================================\n[script] PROCESSING LANGUAGE: {lang.upper()}\n========================================")
            
            # 1. Update Lang preference
            driver.execute_script("localStorage.setItem('potato-lang', arguments[0]);", lang)
            # Mute just in case
            driver.execute_script("localStorage.setItem('potato-muted', 'true');")
            
            for screen_name, config in SCREENS_CONFIG.items():
                print(f"[script] Setting up screen: {screen_name}")
                
                # Combine BASE_STATE with specific mods
                full_state = dict(BASE_STATE)
                full_state.update(config["state_mod"])
                
                # Write state to localStorage
                driver.execute_script("localStorage.setItem('potato-remake-classic-v2', arguments[0]);", json.dumps(full_state))
                # Write dummy records
                driver.execute_script("localStorage.setItem('potato-remake-records-v1', arguments[0]);", json.dumps(DUMMY_RECORDS))
                
                # Reload to load the state
                driver.refresh()
                time.sleep(1.0) # Wait for state initialization & assets loading
                
                # Trigger click overlay if necessary
                if "trigger_click" in config:
                    click_selector = config["trigger_click"]
                    print(f"[script] Clicking overlay trigger: {click_selector}")
                    driver.execute_script(f"document.querySelector('{click_selector}').click();")
                    time.sleep(0.5) # Wait for animation/overlay transition
                
                # Capture in all resolutions
                for res_name, (w, h) in RESOLUTIONS.items():
                    filename = f"{res_name}_{screen_name}.png"
                    filepath = os.path.join(OUTPUT_DIR, lang, filename)
                    
                    print(f"  -> Viewport {w}x{h} for {filename}...")
                    driver.set_window_size(w, h)
                    time.sleep(0.4) # Wait for responsive CSS sizing and reflows
                    
                    driver.save_screenshot(filepath)
                    
        print("\n[script] All screenshots captured successfully!")
    except Exception as e:
        print(f"[script] Error: {e}")
    finally:
        driver.quit()

if __name__ == "__main__":
    main()
