#!/usr/bin/env python3
"""
Scraper de Partidos usando API Football-Data.org
Obtiene partidos de múltiples ligas
"""
import requests
import json
import os
from datetime import datetime, timedelta

API_KEY = "0581031764294ddfaeb01bf29163f2e8"
HEADERS = {"X-Auth-Token": API_KEY}
BASE_URL = "https://api.football-data.org/v4"

LIGAS = {
    "BL1": {"name": "Bundesliga", "country": "Alemania"},
    "PL": {"name": "Premier League", "country": "Inglaterra"},
    "PD": {"name": "La Liga", "country": "España"},
    "SA": {"name": "Serie A", "country": "Italia"},
    "FL1": {"name": "Ligue 1", "country": "Francia"},
    "BL": {"name": "Eredivisie", "country": "Holanda"},
    "BE1": {"name": "Pro League", "country": "Bélgica"},
    "PO": {"name": "Primeira Liga", "country": "Portugal"},
}


def get_competitions():
    """Obtiene lista de competencias disponibles"""
    url = f"{BASE_URL}/competitions"
    resp = requests.get(url, headers=HEADERS)
    if resp.status_code == 200:
        data = resp.json()
        for comp in data.get("competitions", []):
            print(f"  {comp.get('code')}: {comp.get('name')} ({comp.get('plan')})")
    else:
        print(f"Error: {resp.status_code} - {resp.text}")


def get_matches(competition_code, days_ahead=14):
    """Obtiene partidos de una competencia"""
    today = datetime.now().strftime("%Y-%m-%d")
    end_date = (datetime.now() + timedelta(days=days_ahead)).strftime("%Y-%m-%d")
    
    url = f"{BASE_URL}/competitions/{competition_code}/matches"
    params = {
        "dateFrom": today,
        "dateTo": end_date,
        "status": "SCHEDULED"
    }
    
    resp = requests.get(url, headers=HEADERS, params=params)
    
    if resp.status_code == 200:
        data = resp.json()
        matches = []
        for m in data.get("matches", []):
            matches.append({
                "id": m.get("id"),
                "homeTeam": m.get("homeTeam", {}).get("name"),
                "awayTeam": m.get("awayTeam", {}).get("name"),
                "date": m.get("utcDate"),
                "competition": competition_code,
                "matchday": m.get("matchday"),
            })
        return matches
    else:
        print(f"Error {competition_code}: {resp.status_code}")
        return []


def get_all_matches(days_ahead=14):
    """Obtiene partidos de todas las ligas configuradas"""
    all_matches = []
    
    for code, info in LIGAS.items():
        print(f"🔍 Obteniendo partidos de {info['name']}...")
        matches = get_matches(code, days_ahead)
        print(f"   ✅ {len(matches)} partidos encontrados")
        all_matches.extend(matches)
    
    return all_matches


def save_matches(matches, filename="partidos.json"):
    """Guarda los partidos en un archivo JSON"""
    output = {
        "generated_at": datetime.now().isoformat(),
        "count": len(matches),
        "matches": matches
    }
    
    with open(filename, "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, indent=2)
    
    print(f"💾 Partidos guardados en {filename}")
    return output


def main():
    print("=" * 50)
    print("📅 Scraper de Partidos - Football-Data.org")
    print("=" * 50)
    
    print("\n📋 Competencias disponibles:")
    get_competitions()
    
    print("\n📅 Obteniendo partidos de las próximas 2 semanas...")
    matches = get_all_matches(days_ahead=14)
    
    print(f"\n✅ Total: {len(matches)} partidos")
    
    if matches:
        save_matches(matches, "partidos.json")
        
        print("\n📊 Resumen por liga:")
        summary = {}
        for m in matches:
            comp = m.get("competition", "Unknown")
            summary[comp] = summary.get(comp, 0) + 1
        
        for comp, count in summary.items():
            liga_info = LIGAS.get(comp, {"name": comp})
            print(f"  {liga_info.get('name', comp)}: {count} partidos")


if __name__ == "__main__":
    main()