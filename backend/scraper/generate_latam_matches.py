import json
import random
from datetime import datetime, timedelta

LIGAS_LATAM = [
    {
        "codigo": "PE1",
        "nombre": "Liga 1 Perú",
        "pais": "Perú",
        "equipos": [
            "Universitario", "Alianza Lima", "Sporting Cristal", "Melgar", "Universidad San Martín",
            "César Vallejo", "ADT", "Carlos A. Mannucci", "Binacional", "Sport Huancayo",
            "Deportivo Municipal", "Utc", "Academia Cantolao", "Alianza Universidad"
        ]
    },
    {
        "codigo": "MX1",
        "nombre": "Liga MX",
        "pais": "México",
        "equipos": [
            "Club América", "Chivas Guadalajara", "Cruz Azul", "Pumas UNAM", "Tigres UANL",
            "Rayados Monterrey", "Club León", "Toluca", "Pachuca", "Santos Laguna",
            "Necaxa", "Atlas", "Tijuana", "Querétaro", "Puebla", "Juárez", "Mazatlán"
        ]
    },
    {
        "codigo": "CL1",
        "nombre": "Liga Chile",
        "pais": "Chile",
        "equipos": [
            "Colo-Colo", "Universidad Católica", "Universidad de Chile", "Audax Italiano",
            "La Serena", "Palestino", "Everton", "Unión Española", "Huachipato", "O'Higgins",
            "Antofagasta", "Cobreloa", "Deportes Iquique", "Santiago Wanderers"
        ]
    },
    {
        "codigo": "CO1",
        "nombre": "Liga Colombia",
        "pais": "Colombia",
        "equipos": [
            "Atlético Nacional", "Millonarios", "América de Cali", "Junior", "Santa Fe",
            "Equidad", "Deportivo Pasto", "Cortulua", "Once Caldas", "Medellín",
            "Rionegro", "La Equidad", "Jaguares", "Boyacá Chicó"
        ]
    },
    {
        "codigo": "AR1",
        "nombre": "Liga Argentina",
        "pais": "Argentina",
        "equipos": [
            "River Plate", "Boca Juniors", "Independiente", "Racing Club", "San Lorenzo",
            "Huracán", "Velez Sarsfield", "Estudiantes", "Gimnasia", "Platense",
            "Banfield", "Lanús", "Talleres", "Belgrano", "Instituto"
        ]
    },
    {
        "codigo": "BR1",
        "nombre": "Serie A Brasil",
        "pais": "Brasil",
        "equipos": [
            "Flamengo", "Palmeiras", "Fluminense", "Corinthians", "São Paulo",
            "Santos", "Grêmio", "Internacional", "Athletico Paranaense", "Cruzeiro",
            "Botafogo", "Vasco da Gama", "Bahía", "Coritiba", "Atlético Mineiro"
        ]
    },
    {
        "codigo": "EC1",
        "nombre": "Liga Pro Ecuador",
        "pais": "Ecuador",
        "equipos": [
            "Liga de Quito", "Barcelona SC", "Emelec", "Universidad Católica", "Independiente del Valle",
            "Delfín", "Aucas", "Cuenca", "Mushuc Runa", "El Nacional",
            "Orense", "Tecnológico"
        ]
    },
    {
        "codigo": "US1",
        "nombre": "MLS",
        "pais": "EE.UU",
        "equipos": [
            "LA Galaxy", "Inter Miami", "Atlanta United", "LAFC", "Seattle Sounders",
            "New York City FC", "Philadelphia Union", "Austin FC", "Dallas", "Portland Timbers",
            "Orlando City", "Nashville SC", "Minnesota United", "Colorado Rapids", "New York Red Bulls"
        ]
    },
]

def generar_partidos(liga, dias=14):
    partidos = []
    equipos = liga["equipos"]
    hoy = datetime.now()
    
    for d in range(1, dias + 1, 2):
        fecha = hoy + timedelta(days=d)
        fecha_str = fecha.strftime("%Y-%m-%dT%H:%M:%SZ")
        
        for i in range(0, len(equipos) - 1, 2):
            partido = {
                "id": int(fecha.timestamp() * 1000) + i + random.randint(0, 999),
                "homeTeam": equipos[i],
                "awayTeam": equipos[i + 1] if i + 1 < len(equipos) else equipos[0],
                "date": fecha_str,
                "competition": liga["codigo"],
                "matchday": d // 2 + 1,
                "status": "scheduled"
            }
            partidos.append(partido)
    
    return partidos

def main():
    print("📅 Generador de Partidos - Latam\n")
    
    all_matches = []
    
    for liga in LIGAS_LATAM:
        print(f"🔍 {liga['nombre']}...")
        partidos = generar_partidos(liga, 14)
        print(f"   ✅ {len(partidos)} partidos")
        all_matches.extend(partidos)
    
    print(f"\n✅ Total: {len(all_matches)} partidos")
    
    data = {
        "generated_at": datetime.now().isoformat(),
        "source": "generated",
        "count": len(all_matches),
        "matches": all_matches
    }
    
    with open("partidos_latam.json", "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    print("\n💾 Guardado en partidos_latam.json")
    
    summary = {}
    for m in all_matches:
        summary[m["competition"]] = summary.get(m["competition"], 0) + 1
    
    print("\n📊 Resumen:")
    for code, count in summary.items():
        liga = next((l for l in LIGAS_LATAM if l["codigo"] == code), None)
        print(f"  {liga['nombre'] if liga else code}: {count} partidos")

if __name__ == "__main__":
    main()