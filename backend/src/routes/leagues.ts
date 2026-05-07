import { Router } from 'express';
import { db, schema } from '../db';
import { eq, desc, count } from 'drizzle-orm';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const leagues = await db.select({
      id: schema.leagues.id,
      name: schema.leagues.name,
      country: schema.leagues.country,
      continent: schema.leagues.continent,
      logoUrl: schema.leagues.logoUrl,
    }).from(schema.leagues);
    res.json(leagues);
  } catch (error) {
    console.error('Error fetching leagues:', error);
    res.status(500).json({ error: 'Failed to fetch leagues' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const league = await db.query.leagues.findFirst({
      where: eq(schema.leagues.id, Number(req.params.id)),
      with: {
        teams: true,
      },
    });
    if (!league) {
      return res.status(404).json({ error: 'League not found' });
    }
    res.json(league);
  } catch (error) {
    console.error('Error fetching league:', error);
    res.status(500).json({ error: 'Failed to fetch league' });
  }
});

router.get('/:id/teams', async (req, res) => {
  try {
    const teams = await db.select().from(schema.teams).where(eq(schema.teams.leagueId, Number(req.params.id)));
    res.json(teams);
  } catch (error) {
    console.error('Error fetching teams:', error);
    res.status(500).json({ error: 'Failed to fetch teams' });
  }
});

export default router;