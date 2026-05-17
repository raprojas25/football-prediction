const fs = require('fs');

const LIGAS_LATAM = [
  {
    codigo: 'PE1',
    nombre: 'Liga 1 Perú',
    pais: 'Perú',
    equipos: [
      'Universitario', 'Alianza Lima', 'Sporting Cristal', 'Melgar', 'Universidad San Martín',
      'César Vallejo', 'ADT', 'Carlos A. Mannucci', 'Binacional', 'Sport Huancayo',
      ' Deportivo Municipal', 'Utc', 'Academia Cantolao', 'Alianza Universidad', 'Pirata'
    ]
  },
  {
    codigo: 'MX1',
    nombre: 'Liga MX',
    pais: 'México',
    equipos: [
      'Club América', 'Chivas Guadalajara', 'Cruz Azul', 'Pumas UNAM', 'Tigres UANL',
      'Rayados Monterrey', 'Club León', 'Toluca', 'Pachuca', 'Santos Laguna',
      'Cañoneros', 'Necaxa', 'Atlas', 'Tijuana', 'Querétaro', 'Puebla', 'Juárez', 'Mazatlán'
    ]
  },
  {
    codigo: 'CL1',
    nombre: 'Liga Chile',
    pais: 'Chile',
    equipos: [
      'Colo-Colo', 'Universidad Católica', 'Universidad de Chile', 'Audax Italiano',
      'La Serena', 'Palestino', 'Everton', 'Unión Española', 'Huachipato', 'O\'Higgins',
      'Antofagasta', 'Cobreloa', 'Deportes Iquique', 'Santiago Wanderers', 'Copiapó'
    ]
  },
  {
    codigo: 'CO1',
    nombre: 'Liga Colombia',
    pais: 'Colombia',
    equipos: [
      'Atlético Nacional', 'Millonarios', 'América de Cali', 'Junior', 'Santa Fe',
      'Equidad', 'Deportivo Pasto', 'Cortulua', 'Once Caldas', 'Medellín',
      'Atlético Junior', 'Rionegro', 'La Equidad', 'Jaguares', 'Boyacá Chicó'
    ]
  },
  {
    codigo: 'AR1',
    nombre: 'Liga Argentina',
    pais: 'Argentina',
    equipos: [
      'River Plate', 'Boca Juniors', 'Independiente', 'Racing Club', 'San Lorenzo',
      'Huracán', 'Velez Sarsfield', 'Estudiantes', 'Gimnasia', 'Platense',
      'Banfield', 'Lanús', 'Talleres', 'Belgrano', 'Instituto'
    ]
  },
  {
    codigo: 'BR1',
    nombre: 'Serie A Brasil',
    pais: 'Brasil',
    equipos: [
      'Flamengo', 'Palmeiras', 'Fluminense', 'Corinthians', 'São Paulo',
      'Santos', 'Grêmio', 'Internacional', 'Athletico Paranaense', 'Cruzeiro',
      'Botafogo', 'Vasco da Gama', 'Bahía', 'Coritiba', 'Atlético Mineiro'
    ]
  },
  {
    codigo: 'EC1',
    nombre: 'Liga Pro Ecuador',
    pais: 'Ecuador',
    equipos: [
      'Liga de Quito', 'Barcelona SC', 'Emelec', 'Universidad Católica', 'Independiente del Valle',
      'Delfín', 'Aucas', 'Cuenca', 'Mushuc Runa', 'El Nacional',
      'Orense', 'Tecnológico', 'Cienciano', 'Deportivo Quito', 'Barcelona'
    ]
  },
];

function generarPartidos(liga, dias = 14) {
  const partidos = [];
  const hoy = new Date();
  const equipos = liga.equipos;

  for (let d = 1; d <= dias; d += 2) {
    const fecha = new Date(hoy);
    fecha.setDate(fecha.getDate() + d);

    for (let i = 0; i < equipos.length - 1; i += 2) {
      const partido = {
        id: Date.now() + Math.random() * 1000000,
        homeTeam: equipos[i],
        awayTeam: equipos[i + 1] || equipos[0],
        date: fecha.toISOString(),
        competition: liga.codigo,
        matchday: Math.floor(d / 2) + 1,
        status: 'scheduled',
      };
      partidos.push(partido);
    }
  }

  return partidos;
}

function main() {
  console.log('📅 Generador de Partidos - Ligasy Latinas\n');

  const allMatches = [];

  for (const liga of LIGAS_LATAM) {
    console.log(`🔍 ${liga.nombre}...`);
    const partidos = generarPartidos(liga, 14);
    console.log(`   ✅ ${partidos.length} partidos`);
    allMatches.push(...partidos);
  }

  console.log(`\n✅ Total: ${allMatches.length} partidos`);

  fs.writeFileSync('partidos_latam.json', JSON.stringify({
    generated_at: new Date().toISOString(),
    source: 'generated',
    count: allMatches.length,
    matches: allMatches,
  }, null, 2));

  console.log('\n💾 Guardado en partidos_latam.json');

  const summary = {};
  for (const m of allMatches) {
    summary[m.competition] = (summary[m.competition] || 0) + 1;
  }

  console.log('\n📊 Resumen:');
  for (const [code, count] of Object.entries(summary)) {
    const liga = LIGAS_LATAM.find(l => l.codigo === code);
    console.log(`  ${liga?.nombre || code}: ${count} partidos`);
  }
}

main();