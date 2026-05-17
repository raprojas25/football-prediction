const axios = require('axios');
const cheerio = require('cheerio');

const FLASHSCORE_URLS = {
  peru: 'https://www.flashscore.com.mx/futbol/peru/liga-1/',
  mexico: 'https://www.flashscore.com.mx/futbol/mexico/liga-mx/',
  colombia: 'https://www.flashscore.com.mx/futbol/colombia/liga-colombia/',
  chile: 'https://www.flashscore.com.mx/futbol/chile/liga-mx-chile/',
  argentina: 'https://www.flashscore.com.mx/futbol/argentina/liga-profesional/',
  brasil: 'https://www.flashscore.com.mx/futbol/brasil/serie-a/',
  ecuador: 'https://www.flashscore.com.mx/futbol/ecuador/liga-pro/',
  venezuela: 'https://www.flashscore.com.mx/futbol/venezuela/ligavenezuela/',
  usa: 'https://www.flashscore.com.mx/futbol/usa/mls/',
};

const LIGAS_NOMBRE = {
  peru: { nombre: 'Liga 1 Perú', pais: 'Perú', codigo: 'PE1' },
  mexico: { nombre: 'Liga MX', pais: 'México', codigo: 'MX1' },
  colombia: { nombre: 'Liga Colombia', pais: 'Colombia', codigo: 'CO1' },
  chile: { nombre: 'Liga Chile', pais: 'Chile', codigo: 'CL1' },
  argentina: { nombre: 'Liga Argentina', pais: 'Argentina', codigo: 'AR1' },
  brasil: { nombre: 'Serie A Brasil', pais: 'Brasil', codigo: 'BR1' },
  ecuador: { nombre: 'Liga Pro Ecuador', pais: 'Ecuador', codigo: 'EC1' },
  venezuela: { nombre: 'Liga Venezuela', pais: 'Venezuela', codigo: 'VE1' },
  usa: { nombre: 'MLS', pais: 'EEUU', codigo: 'US1' },
};

async function scrapeFlashScore(url, leagueCode) {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept-Language': 'es-ES,es;q=0.9',
      },
      timeout: 10000,
    });

    const $ = cheerio.load(response.data);
    const matches = [];

    $('.sport-fixture').each((i, el) => {
      const homeTeam = $(el).find('.team-home .team-name').text().trim();
      const awayTeam = $(el).find('.team-away .team-name').text().trim();
      const time = $(el).find('.match-time').text().trim();
      const date = $(el).find('.match-date').text().trim();

      if (homeTeam && awayTeam) {
        matches.push({
          homeTeam: homeTeam.replace(/\s+/g, ' '),
          awayTeam: awayTeam.replace(/\s+/g, ' '),
          time: time || '',
          date: date || '',
          league: leagueCode,
        });
      }
    });

    console.log(`✅ ${LIGAS_NOMBRE[leagueCode]?.nombre}: ${matches.length} partidos`);
    return matches;
  } catch (err) {
    console.error(`❌ Error ${leagueCode}:`, err.message);
    return [];
  }
}

async function scrapeAllLeagues() {
  console.log('🌐 Scraper FlashScore - Partidos Latinoamericanos\n');

  const allMatches = [];

  for (const [key, url] of Object.entries(FLASHSCORE_URLS)) {
    console.log(`🔍 ${LIGAS_NOMBRE[key].nombre}...`);
    const matches = await scrapeFlashScore(url, LIGAS_NOMBRE[key].codigo);
    allMatches.push(...matches);
    await new Promise(r => setTimeout(r, 2000));
  }

  console.log(`\n✅ Total: ${allMatches.length} partidos`);

  const fs = require('fs');
  fs.writeFileSync('partidos_latam.json', JSON.stringify({
    generated_at: new Date().toISOString(),
    source: 'flashscore.com.mx',
    count: allMatches.length,
    matches: allMatches,
  }, null, 2));

  console.log('\n💾 Guardado en partidos_latam.json');
  return allMatches;
}

if (require.main === module) {
  scrapeAllLeagues();
}

module.exports = { scrapeAllLeagues, scrapeFlashScore };