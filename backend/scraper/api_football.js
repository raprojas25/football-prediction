const axios = require('axios');

const API_KEY = process.env.RAPIDAPI_KEY || '9fccfe96e075ba777c2b8876c4a6a7d2';
const RAPIDAPI_HOST = 'api-football-v1.p.rapidapi.com';

const HEADERS = {
  'X-RapidAPI-Key': API_KEY,
  'X-RapidAPI-Host': RAPIDAPI_HOST,
};

const LIGAS = {
  265: { nombre: 'Liga 1 Perú', pais: 'Perú', codigo: 'PE1' },
  262: { nombre: 'Liga MX', pais: 'México', codigo: 'MX1' },
  263: { nombre: 'Liga Colombia', pais: 'Colombia', codigo: 'CO1' },
  264: { nombre: 'Liga Chile', pais: 'Chile', codigo: 'CL1' },
  272: { nombre: 'Liga Argentina', pais: 'Argentina', codigo: 'AR1' },
  272: { nombre: 'Serie A Brasil', pais: 'Brasil', codigo: 'BR1' },
};

async function getFixtures(leagueId, season = 2024) {
  const url = 'https://api-football-v1.p.rapidapi.com/v3/fixtures';
  
  try {
    const resp = await axios.get(url, {
      headers: HEADERS,
      params: {
        league: leagueId,
        season: season,
        next: 15,
      }
    });
    
    return resp.data.response.map(m => ({
      id: m.fixture.id,
      homeTeam: m.teams.home.name,
      awayTeam: m.teams.away.name,
      date: m.fixture.date,
      competition: LIGAS[leagueId]?.codigo || 'UNK',
      matchday: m.league.round?.split('-').pop() || '1',
      status: m.fixture.status.short,
    }));
  } catch (err) {
    console.error(`Error league ${leagueId}:`, err.response?.status || err.message);
    return [];
  }
}

async function main() {
  console.log('⚽ API-Football Scraper\n');
  
  const allMatches = [];
  
  for (const [id, info] of Object.entries(LIGAS)) {
    console.log(`🔍 ${info.nombre}...`);
    const matches = await getFixtures(parseInt(id));
    console.log(`   ✅ ${matches.length} partidos`);
    allMatches.push(...matches);
  }
  
  console.log(`\n✅ Total: ${allMatches.length} partidos`);
  
  const fs = require('fs');
  fs.writeFileSync('partidos_api_football.json', JSON.stringify({
    generated_at: new Date().toISOString(),
    source: 'api-football-v1.p.rapidapi.com',
    count: allMatches.length,
    matches: allMatches,
  }, null, 2));
  
  console.log('\n💾 Guardado en partidos_api_football.json');
}

main().catch(console.error);
