#!/usr/bin/env python3
"""
Scraper simplificado para SoccerSTATS
Ejecutar: python run_scraper.py
"""
import json
import time
import sys

try:
    import requests
    from bs4 import BeautifulSoup
except ImportError:
    print("Error: Necesitas instalar las dependencias:")
    print("  pip install requests beautifulsoup4 lxml")
    sys.exit(1)


BUNDESLIGA_URLS = [
    ("Bayern Munich", "https://www.soccerstats.com/teamstats.asp?league=germany&stats=u1392-bayern-munich"),
    ("Dortmund", "https://www.soccerstats.com/teamstats.asp?league=germany&stats=u1404-dortmund"),
    ("Stuttgart", "https://www.soccerstats.com/teamstats.asp?league=germany&stats=u1402-stuttgart"),
    ("RB Leipzig", "https://www.soccerstats.com/teamstats.asp?league=germany&stats=u1406-rb-leipzig"),
    ("Leverkusen", "https://www.soccerstats.com/teamstats.asp?league=germany&stats=u1409-leverkusen"),
    ("Hoffenheim", "https://www.soccerstats.com/teamstats.asp?league=germany&stats=u1399-hoffenheim"),
    ("E. Frankfurt", "https://www.soccerstats.com/teamstats.asp?league=germany&stats=u1394-e.-frankfurt"),
    ("Freiburg", "https://www.soccerstats.com/teamstats.asp?league=germany&stats=u1403-freiburg"),
    ("FSV Mainz", "https://www.soccerstats.com/teamstats.asp?league=germany&stats=u1407-fsv-mainz"),
    ("FC Augsburg", "https://www.soccerstats.com/teamstats.asp?league=germany&stats=u1397-fc-augsburg"),
    ("Union Berlin", "https://www.soccerstats.com/teamstats.asp?league=germany&stats=u1396-union-berlin"),
    ("FC Koln", "https://www.soccerstats.com/teamstats.asp?league=germany&stats=u1398-fc-koln"),
    ("Hamburger SV", "https://www.soccerstats.com/teamstats.asp?league=germany&stats=u1410-hamburger-sv"),
    ("M'gladbach", "https://www.soccerstats.com/teamstats.asp?league=germany&stats=u1405-monchengladbach"),
    ("Werder Bremen", "https://www.soccerstats.com/teamstats.asp?league=germany&stats=u1400-werder-bremen"),
    ("St. Pauli", "https://www.soccerstats.com/teamstats.asp?league=germany&stats=u1427-sankt-pauli"),
    ("Wolfsburg", "https://www.soccerstats.com/teamstats.asp?league=germany&stats=u1408-wolfsburg"),
    ("Heidenheim", "https://www.soccerstats.com/teamstats.asp?league=germany&stats=u1420-heidenheim"),
]

HOME_FILAS = [58, 60, 62, 64, 66, 76, 78, 98, 100, 102, 104, 106]
AWAY_FILAS = [111, 113, 115, 117, 119, 129, 131, 151, 153, 155, 157, 159]

HEADERS = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}


def get_team_data(url, team_id):
    """Extrae datos de un equipo"""
    time.sleep(2)  # Rate limiting
    
    try:
        resp = requests.get(url, headers=HEADERS, timeout=30)
        soup = BeautifulSoup(resp.text, "lxml")
        
        # Nombre del equipo
        h2 = soup.find("h2", string=lambda t: t and "Comparison with league average" in t)
        nombre = BUNDESLIGA_URLS[team_id - 1][0]
        if h2:
            try:
                tabla = h2.find_next("table")
                nombre = tabla.find_all("tr")[1].find_all("td")[1].text.strip()
            except:
                pass
        
        data = {
            "id": team_id,
            "name": nombre,
            "goals": {"home": {}, "away": {}},
            "scored_conceded": extract_scored_conceded(soup),
            "rates": extract_rates(soup),
            "corners_for": {"home": {}, "away": {}},
            "corners_against": {"home": {}, "away": {}},
            "Total_corners": {"home": {}, "away": {}}
        }
        
        # Goals
        if h2:
            tabla = h2.find_next("table")
            filas = tabla.find_all("tr")
            process_filas(HOME_FILAS, filas, "home", data["goals"])
            process_filas(AWAY_FILAS, filas, "away", data["goals"])
        
        # Corners
        process_corners(soup, "Corners For", "corners_for", data)
        process_corners(soup, "Corners Against", "corners_against", data)
        process_corners(soup, "Total corners", "Total_corners", data, True)
        
        print(f"✓ {nombre}")
        return data
        
    except Exception as e:
        print(f"✗ Error: {e}")
        return None


def process_filas(filas_objetivo, filas, seccion, data):
    mapping = ["win", "draw", "defeats", "goals_scored_per_game", 
               "goals_conceded_per_game", "team_scored_first", 
               "opponent_scored_first", "total_goal_per_game",
               "over_1_5", "over_2_5", "over_3_5", "both_teams_scored"]
    idx = 0
    for fila_idx in filas_objetivo:
        try:
            fila = filas[fila_idx]
            cols = fila.find_all(["td", "th"])
            if len(cols) >= 3:
                val = cols[2].text.strip().replace("%", "").replace(",", ".")
                if val:
                    data[seccion][mapping[idx]] = float(val)
                    idx += 1
        except:
            pass


def extract_scored_conceded(soup):
    data = {"home": {}, "away": {}}
    try:
        h2 = soup.find("h2", string=lambda t: t and "Goals scored / Goals conceded" in t)
        if not h2:
            return data
        table = h2.find_next("table")
        rows = table.find_all("tr")[1:]
        for row in rows:
            cols = row.find_all("td")
            if len(cols) >= 3:
                key = cols[0].text.strip().lower().replace(" ", "_").replace("+", "plus").replace("/", "_").replace(">", "over")
                for i, side in enumerate(["home", "away"]):
                    val = cols[i+1].text.strip().replace("%", "")
                    try:
                        data[side][key] = int(val)
                    except:
                        data[side][key] = 0
    except:
        pass
    return data


def extract_rates(soup):
    data = {"home": {}, "away": {}}
    try:
        h2 = soup.find("h2", string=lambda t: t and "Scoring & Conceding rates" in t)
        if not h2:
            return data
        table = h2.find_next("table")
        rows = table.find_all("tr")[1:]
        for row in rows:
            cols = row.find_all("td")
            if len(cols) >= 3:
                key = cols[0].text.strip().lower().replace(" ", "_").replace("+", "plus").replace("/", "_").replace(">", "over").replace("-", "_")
                for i, side in enumerate(["home", "away"]):
                    val = cols[i+1].text.strip().replace("%", "")
                    try:
                        data[side][key] = int(val)
                    except:
                        data[side][key] = 0
    except:
        pass
    return data


def process_corners(soup, h2_text, key_name, data, is_total=False):
    try:
        h2 = soup.find("h2", string=lambda t: t and h2_text in t)
        if not h2:
            return
        tabla = h2.find_next("table")
        filas = tabla.find_all("tr")
        
        headers = []
        for col in filas[0].find_all(["td", "th"])[1:7]:
            txt = col.text.strip().lower()
            if "avg" in txt:
                headers.append("avg")
            elif "2.5" in txt or "2_5" in txt:
                headers.append("over_2_5")
            elif "3.5" in txt or "3_5" in txt:
                headers.append("over_3_5")
            elif "4.5" in txt or "4_5" in txt:
                headers.append("over_4_5")
            elif "5.5" in txt or "5_5" in txt:
                headers.append("over_5_5")
            elif "6.5" in txt or "6_5" in txt:
                headers.append("over_6_5")
            elif "9.5" in txt or "9_5" in txt:
                headers.append("over_9_5")
            elif "10.5" in txt or "10_5" in txt:
                headers.append("over_10_5")
            elif "11.5" in txt or "11_5" in txt:
                headers.append("over_11_5")
            elif "12.5" in txt or "12_5" in txt:
                headers.append("over_12_5")
            elif "13.5" in txt or "13_5" in txt:
                headers.append("over_13_5")
            else:
                headers.append("avg")
        
        home_vals = [c.text.strip().replace("%", "").replace(",", ".") for c in filas[1].find_all(["td", "th"])[1:7]]
        away_vals = [c.text.strip().replace("%", "").replace(",", ".") for c in filas[2].find_all(["td", "th"])[1:7]]
        
        data[key_name]["home"] = {}
        data[key_name]["away"] = {}
        
        for i, key in enumerate(headers):
            try:
                data[key_name]["home"][key] = float(home_vals[i])
                data[key_name]["away"][key] = float(away_vals[i])
            except:
                pass
    except:
        pass


def main():
    print("🏆 Scraping Bundesliga - SoccerSTATS")
    print("=" * 40)
    
    equipos = []
    for idx, (nombre, url) in enumerate(BUNDESLIGA_URLS, 1):
        data = get_team_data(url, idx)
        if data:
            equipos.append(data)
    
    # Guardar - crear directorio si no existe
    import os
    output_dir = os.path.join(os.path.dirname(__file__), "..", "frontend", "public", "data")
    os.makedirs(output_dir, exist_ok=True)
    output_file = os.path.join(output_dir, "alemania.json")
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(equipos, f, indent=2, ensure_ascii=False)
    
    print("=" * 40)
    print(f"✓ Completado! {len(equipos)} equipos guardados en {output_file}")


if __name__ == "__main__":
    main()