import { Router } from 'express';
import { db, schema } from '../db';
import { eq } from 'drizzle-orm';

const router = Router();

router.get('/team/:id', async (req, res) => {
  try {
    const stats = await db.select().from(schema.teamStats)
      .where(eq(schema.teamStats.teamId, Number(req.params.id)))
      .orderBy({ matchDate: 'desc' })
      .limit(10);
    res.json(stats);
  } catch (error) {
    console.error('Error fetching team stats:', error);
    res.status(500).json({ error: 'Failed to fetch team stats' });
  }
});

router.get('/compare/:homeId/:awayId', async (req, res) => {
  try {
    const homeStats = await db.select().from(schema.teamStats)
      .where(eq(schema.teamStats.teamId, Number(req.params.homeId)))
      .orderBy({ matchDate: 'desc' })
      .limit(5);
    
    const awayStats = await db.select().from(schema.teamStats)
      .where(eq(schema.teamStats.teamId, Number(req.params.awayId)))
      .orderBy({ matchDate: 'desc' })
      .limit(5);
    
    res.json({ homeStats, awayStats });
  } catch (error) {
    console.error('Error comparing teams:', error);
    res.status(500).json({ error: 'Failed to compare teams' });
  }
});

export default router;