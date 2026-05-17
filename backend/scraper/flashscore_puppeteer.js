const puppeteer = require('puppeteer');

const FLASHSCORE_URLS = {
  peru: 'https://www.flashscore.com.mx/futbol/peru/liga-1/',
  mexico: 'https://www.flashscore.com.mx/futbol/mexico/liga-mx/',
  colombia: 'https://www.flashscore.com.mx/futbol/colombia/liga-colombia/',
  chile: 'https://www.flashscore.com.mx/futbol/chile/primera-division/',
  argentina: 'https://www.flashscore.com.mx/futbol/argentina/liga-profesional/',
  brasil: 'https://www.flashscore.com.mx/futbol/brasil/serie-a/',
  ecuador: 'https://www.flashscore.com.mx/futbol/ecuador/liga-pro/',
  usa: 'https://www.flashscore.com.mx/futbol/usa/mls/',
};

const LIGAS_MAP = {
  peru: { nombre: 'Liga 1 Perú', pais: 'Perú', codigo: 'PE1' },
  mexico: { nombre: 'Liga MX', pais: 'México', codigo: 'MX1' },
  colombia: { nombre: 'Liga Colombia', pais: 'Colombia', codigo: 'CO1' },
  chile: { nombre: 'Liga Chile', pais: 'Chile', codigo: 'CL1' },
  argentina: { nombre: 'Liga Argentina', pais: 'Argentina', codigo: 'AR1' },
  brasil: { nombre: 'Serie A Brasil', pais: 'Brasil', codigo: 'BR1' },
  ecuador: { nombre: 'Liga Pro Ecuador', pais: 'Ecuador', codigo: 'EC1' },
  usa: { nombre: 'MLS', pais: 'EE.UU', codigo: 'US1' },
};

async function scrapeFlashScore(browser, url, leagueCode) {
  const page = await browser.newPage();
  
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  await page.setExtraHTTPHeaders({
    'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
  });

  try {
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    
    await page.waitForSelector('[class*="event"]', { timeout: 15000 }).catch(() => {});
    
    const matches = await page.evaluate(() => {
      const results = [];
      
      document.querySelectorAll('[class*="event"]').forEach(event => {
        const homeTeam = event.querySelector('[class*="home"] [class*="name"]')?.textContent?.trim() 
          || event.querySelector('.team-home .name')?.textContent?.trim()
          || event.querySelector('.participant-home')?.textContent?.trim();
          
        const awayTeam = event.querySelector('[class*="away"] [class*="name"]')?.textContent?.trim()
          || event.querySelector('.team-away .name')?.textContent?.trim()
          || event.querySelector('.participant-away')?.textContent?.trim();
        
        const time = event.querySelector('[class*="time"]')?.textContent?.trim()
          || event.querySelector('.match-time')?.textContent?.trim()
          || event.querySelector('.event-time')?.textContent?.trim();

        const scoreHome = event.querySelector('[class*="score"] span:first-child')?.textContent?.trim();
        const scoreAway = event.querySelector('[class*="score"] span:last-child')?.textContent?.trim();
        
        if (homeTeam && awayTeam) {
          results.push({
            homeTeam: homeTeam.replace(/\s+/g, ' '),
            awayTeam: awayTeam.replace(/\s+/g, ' '),
            time: time || '',
            score: scoreHome !== undefined ? `${scoreHome} - ${scoreAway}` : null,
          });
        }
      });
      
      return results;
    });

    console.log(`✅ ${LIGAS_MAP[leagueCode].nombre}: ${matches.length} partidos`);
    await page.close();
    return matches;
    
  } catch (err) {
    console.error(`❌ ${leagueCode}:`, err.message);
    await page.close();
    return [];
  }
}

async function scrapeAllLeagues() {
  console.log('🚀 FlashScore Scraper (Puppeteer)\n');
  
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });

  const allMatches = [];

  for (const [key, url] of Object.entries(FLASHSCORE_URLS)) {
    console.log(`🔍 ${LIGAS_MAP[key].nombre}...`);
    const matches = await scrapeFlashScore(browser, url, key);
    
    const processed = matches.map((m, i) => ({
      id: Date.now() + i,
      homeTeam: m.homeTeam,
      awayTeam: m.awayTeam,
      date: m.time ? `2026-05-${String(10 + Math.floor(Math.random() * 10)).padStart(2, '0')}T${m.time}:00Z` : null,
      competition: LIGAS_MAP[key].codigo,
      matchday: Math.floor(i / 10) + 1,
      status: m.score && m.score !== '- -' ? 'finished' : 'scheduled',
      score: m.score,
    }));
    
    allMatches.push(...processed);
    await new Promise(r => setTimeout(r, 3000));
  }

  await browser.close();

  console.log(`\n✅ Total: ${allMatches.length} partidos`);

  const fs = require('fs');
  fs.writeFileSync('partidos_flashscore.json', JSON.stringify({
    generated_at: new Date().toISOString(),
    source: 'flashscore.com.mx',
    count: allMatches.length,
    matches: allMatches,
  }, null, 2));

  console.log('💾 Guardado en partidos_flashscore.json');
  return allMatches;
}

if (require.main === module) {
  scrapeAllLeagues().catch(console.error);
}

module.exports = { scrapeAllLeagues };