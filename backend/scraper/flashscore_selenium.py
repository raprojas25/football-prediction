#!/usr/bin/env python3
"""
Scraper de FlashScore usando Selenium
Requiere: pip install selenium webdriver-manager beautifulsoup4
Ejecutar: python flashscore_selenium.py
"""

import json
import time
import random
from datetime import datetime
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

try:
    from webdriver_manager.chrome import ChromeDriverManager
except ImportError:
    ChromeDriverManager = None

FLASHSCORE_URLS = {
    'peru': 'https://www.flashscore.com.mx/futbol/peru/liga-1/',
    'mexico': 'https://www.flashscore.com.mx/futbol/mexico/liga-mx/',
    'colombia': 'https://www.flashscore.com.mx/futbol/colombia/liga-colombia/',
    'chile': 'https://www.flashscore.com.mx/futbol/chile/primera-division/',
    'argentina': 'https://www.flashscore.com.mx/futbol/argentina/liga-profesional/',
    'brasil': 'https://www.flashscore.com.mx/futbol/brasil/serie-a/',
    'ecuador': 'https://www.flashscore.com.mx/futbol/ecuador/liga-pro/',
    'usa': 'https://www.flashscore.com.mx/futbol/usa/mls/',
}

LIGAS_MAP = {
    'peru': {'nombre': 'Liga 1 Perú', 'codigo': 'PE1'},
    'mexico': {'nombre': 'Liga MX', 'codigo': 'MX1'},
    'colombia': {'nombre': 'Liga Colombia', 'codigo': 'CO1'},
    'chile': {'nombre': 'Liga Chile', 'codigo': 'CL1'},
    'argentina': {'nombre': 'Liga Argentina', 'codigo': 'AR1'},
    'brasil': {'nombre': 'Serie A Brasil', 'codigo': 'BR1'},
    'ecuador': {'nombre': 'Liga Pro Ecuador', 'codigo': 'EC1'},
    'usa': {'nombre': 'MLS', 'codigo': 'US1'},
}

def create_driver():
    options = Options()
    options.add_argument('--headless')
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    options.add_argument('--disable-gpu')
    options.add_argument('--window-size=1920,1080')
    options.add_argument('--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')
    
    try:
        if ChromeDriverManager:
            service = Service(ChromeDriverManager().install())
            driver = webdriver.Chrome(service=service, options=options)
        else:
            driver = webdriver.Chrome(options=options)
    except Exception as e:
        print(f"Error creando driver: {e}")
        options.add_argument('--user-data-dir=/tmp/chrome-profile')
        driver = webdriver.Chrome(options=options)
    
    return driver

def scrape_league(driver, url, league_key):
    print(f"  🔍 {LIGAS_MAP[league_key]['nombre']}...")
    
    try:
        driver.get(url)
        time.sleep(3)
        
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, "[class*='event']"))
        )
        
        matches = []
        eventos = driver.find_elements(By.CSS_SELECTOR, "[class*='event']")
        
        for evento in eventos[:20]:
            try:
                home = evento.find_element(By.CSS_SELECTOR, "[class*='home'] [class*='name']").text
                away = evento.find_element(By.CSS_SELECTOR, "[class*='away'] [class*='name']").text
                time_elem = evento.find_elements(By.CSS_SELECTOR, "[class*='time']")
                hora = time_elem[0].text if time_elem else ""
                
                if home and away:
                    matches.append({
                        'homeTeam': home.strip(),
                        'awayTeam': away.strip(),
                        'time': hora.strip()
                    })
            except:
                continue
        
        print(f"    ✅ {len(matches)} partidos")
        return matches
        
    except Exception as e:
        print(f"    ❌ Error: {e}")
        return []

def main():
    print("🌐 FlashScore Scraper (Selenium)\n")
    
    driver = create_driver()
    all_matches = []
    
    for key, url in FLASHSCORE_URLS.items():
        matches = scrape_league(driver, url, key)
        
        for i, m in enumerate(matches):
            all_matches.append({
                'id': int(datetime.now().timestamp() * 1000) + i,
                'homeTeam': m['homeTeam'],
                'awayTeam': m['awayTeam'],
                'date': f"2026-05-{random.randint(10, 20):02d}T{m.get('time', '18:00')}:00Z",
                'competition': LIGAS_MAP[key]['codigo'],
                'matchday': (i // 10) + 1,
                'status': 'scheduled'
            })
        
        time.sleep(2)
    
    driver.quit()
    
    print(f"\n✅ Total: {len(all_matches)} partidos")
    
    data = {
        'generated_at': datetime.now().isoformat(),
        'source': 'flashscore.com.mx',
        'count': len(all_matches),
        'matches': all_matches
    }
    
    with open('partidos_flashscore.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    print("\n💾 Guardado en partidos_flashscore.json")

if __name__ == "__main__":
    main()