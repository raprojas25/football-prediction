#!/usr/bin/env python3
"""
Scraper alternatif untuk jadwal Bola
Gunakan API gratis: api-football.com (free tier)
Atau generate data berdasarkan liga yang dikenal
"""

import json
import requests
from datetime import datetime, timedelta

API_KEY = '0581031764294ddfaeb01bf29163f2e7'
BASE_URL = 'https://api.football-data.org/v4'

LIGAS_DISPONIBLES = {
    'PE1': 'https://api.football-data.org/v4/competitions/PE/matches',
    'MX1': 'https://api.football-data.org/v4/competitions/MEX/matches',
}

def get_matches_from_api():
    """Ambil dari Football-Data (sudah ada)"""
    print("📡 Obteniendo de Football-Data API...")
    
    headers = {'X-Auth-Token': API_KEY}
    
    all_matches = []
    today = datetime.now().strftime('%Y-%m-%d')
    future = (datetime.now() + timedelta(days=14)).strftime('%Y-%m-%d')
    
    try:
        # Hanya ambil dari kompetisi yang tersedia gratis
        resp = requests.get(f'{BASE_URL}/competitions/PL/matches', 
                           headers=headers,
                           params={'dateFrom': today, 'dateTo': future},
                           timeout=10)
        
        if resp.status_code == 200:
            data = resp.json()
            for m in data.get('matches', []):
                all_matches.append({
                    'id': m['id'],
                    'homeTeam': m['homeTeam']['name'],
                    'awayTeam': m['awayTeam']['name'],
                    'date': m['utcDate'],
                    'competition': 'PL',
                    'matchday': m.get('matchday', 1),
                })
            print(f"  ✅ Premier League: {len(all_matches)} partidos")
    except Exception as e:
        print(f"  ❌ Error: {e}")
    
    return all_matches

def generate_peru_matches():
    """Generate jadwal untuk Liga 1 Perú (karena tidak ada API)"""
    print("🎲 Generando partidos Perú...")
    
    equipos = [
        "Universitario", "Alianza Lima", "Sporting Cristal", "Melgar", 
        "Universidad San Martín", "César Vallejo", "ADT", "Carlos A. Mannucci",
        "Binacional", "Sport Huancayo", "Deportivo Municipal", "Utc"
    ]
    
    matches = []
    base_id = 10000
    
    for i in range(0, len(equipos) - 1, 2):
        day = 10 + (i // 2)
        matches.append({
            'id': base_id + i,
            'homeTeam': equipos[i],
            'awayTeam': equipos[i + 1],
            'date': f"2026-05-{day:02d}T18:00:00Z",
            'competition': 'PE1',
            'matchday': (i // 2) + 1,
            'status': 'scheduled'
        })
    
    print(f"  ✅ Liga 1 Perú: {len(matches)} partidos")
    return matches

def generate_mexico_matches():
    """Generate jadwal untuk Liga MX"""
    print("🎲 Generando partidos México...")
    
    equipos = [
        "Club América", "Chivas Guadalajara", "Cruz Azul", "Pumas UNAM", "Tigres UANL",
        "Rayados Monterrey", "Club León", "Toluca", "Pachuca", "Santos Laguna",
        "Necaxa", "Atlas", "Tijuana", "Querétaro"
    ]
    
    matches = []
    base_id = 20000
    
    for i in range(0, len(equipos) - 1, 2):
        day = 10 + (i // 2)
        matches.append({
            'id': base_id + i,
            'homeTeam': equipos[i],
            'awayTeam': equipos[i + 1],
            'date': f"2026-05-{day:02d}T21:00:00Z",
            'competition': 'MX1',
            'matchday': (i // 2) + 1,
            'status': 'scheduled'
        })
    
    print(f"  ✅ Liga MX: {len(matches)} partidos")
    return matches

def generate_latam_leagues():
    """Generate semua liga latin america"""
    print("\n🌎 Generando ligas latinoamericanas...\n")
    
    all_matches = []
    
    # Perú
    all_matches.extend(generate_peru_matches())
    
    # Mexico
    all_matches.extend(generate_mexico_matches())
    
    # Chile
    print("🎲 Generando partidos Chile...")
    equipos = ["Colo-Colo", "Universidad Católica", "Universidad de Chile", "Audax Italiano",
               "Palestino", "Everton", "Unión Española", "Huachipato"]
    for i in range(0, len(equipos)-1, 2):
        all_matches.append({
            'id': 30000 + i,
            'homeTeam': equipos[i], 'awayTeam': equipos[i+1],
            'date': f"2026-05-{10+i//2:02d}T18:30:00Z",
            'competition': 'CL1', 'matchday': i//2+1, 'status': 'scheduled'
        })
    print(f"  ✅ Liga Chile: {len(equipos)//2} partidos")
    
    # Colombia
    print("🎲 Generando partidos Colombia...")
    equipos = ["Atlético Nacional", "Millonarios", "América de Cali", "Junior",
               "Santa Fe", "Equidad", "Deportivo Pasto", "Once Caldas"]
    for i in range(0, len(equipos)-1, 2):
        all_matches.append({
            'id': 40000 + i,
            'homeTeam': equipos[i], 'awayTeam': equipos[i+1],
            'date': f"2026-05-{10+i//2:02d}T20:00:00Z",
            'competition': 'CO1', 'matchday': i//2+1, 'status': 'scheduled'
        })
    print(f"  ✅ Liga Colombia: {len(equipos)//2} partidos")
    
    # Argentina
    print("🎲 Generando partidos Argentina...")
    equipos = ["River Plate", "Boca Juniors", "Independiente", "Racing Club",
               "San Lorenzo", "Huracán", "Velez Sarsfield", "Estudiantes"]
    for i in range(0, len(equipos)-1, 2):
        all_matches.append({
            'id': 50000 + i,
            'homeTeam': equipos[i], 'awayTeam': equipos[i+1],
            'date': f"2026-05-{10+i//2:02d}T21:00:00Z",
            'competition': 'AR1', 'matchday': i//2+1, 'status': 'scheduled'
        })
    print(f"  ✅ Liga Argentina: {len(equipos)//2} partidos")
    
    # Brasil
    print("🎲 Generando partidos Brasil...")
    equipos = ["Flamengo", "Palmeiras", "Fluminense", "Corinthians", "São Paulo", "Santos"]
    for i in range(0, len(equipos)-1, 2):
        all_matches.append({
            'id': 60000 + i,
            'homeTeam': equipos[i], 'awayTeam': equipos[i+1],
            'date': f"2026-05-{10+i//2:02d}T21:00:00Z",
            'competition': 'BR1', 'matchday': i//2+1, 'status': 'scheduled'
        })
    print(f"  ✅ Serie A Brasil: {len(equipos)//2} partidos")
    
    return all_matches

def main():
    print("=" * 50)
    print("⚽ GENERADOR DE PARTIDOS LATAM")
    print("=" * 50)
    print()
    
    all_matches = []
    
    # Dari API ( Eropa )
    api_matches = get_matches_from_api()
    all_matches.extend(api_matches)
    
    # Generate untuk Latam
    latam_matches = generate_latam_leagues()
    all_matches.extend(latam_matches)
    
    print(f"\n✅ Total: {len(all_matches)} partidos")
    
    # Simpan
    data = {
        'generated_at': datetime.now().isoformat(),
        'source': 'generated+api',
        'count': len(all_matches),
        'matches': all_matches
    }
    
    with open('partidos_completos.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    print("\n💾 Guardado en partidos_completos.json")
    
    # Ringkasan per liga
    print("\n📊 Resumen:")
    stats = {}
    for m in all_matches:
        stats[m['competition']] = stats.get(m['competition'], 0) + 1
    
    for comp, count in sorted(stats.items()):
        print(f"  {comp}: {count} partidos")

if __name__ == "__main__":
    main()