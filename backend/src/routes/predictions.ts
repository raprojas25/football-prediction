import { Router } from 'express';
import { db, schema } from '../db';
import { eq } from 'drizzle-orm';
import { calculatePrediction } from '../services/predictionEngine.js';

const router = Router();

router.post('/generate', async (req, res) => {
  try {
    const { homeTeamId, awayTeamId } = req.body;
    
    if (!homeTeamId || !awayTeamId) {
      return res.status(400).json({ error: 'homeTeamId and awayTeamId are required' });
    }

    const prediction = await calculatePrediction(db, Number(homeTeamId), Number(awayTeamId));
    res.json(prediction);
  } catch (error) {
    console.error('Prediction error:', error);
    res.status(500).json({ error: 'Failed to generate prediction' });
  }
});

router.get('/match/:id', async (req, res) => {
  try {
    const prediction = await db.query.predictions.findFirst({
      where: eq(schema.predictions.matchId, Number(req.params.id)),
      orderBy: (predictions, { desc }) => [desc(predictions.createdAt)],
    });
    res.json(prediction);
  } catch (error) {
    console.error('Error fetching prediction:', error);
    res.status(500).json({ error: 'Failed to fetch prediction' });
  }
});

router.get('/league/:id', async (req, res) => {
  try {
    const predictions = await db.query.predictions.findMany({
      where: eq(schema.predictions.matchId, Number(req.params.id)),
      orderBy: (predictions, { desc }) => [desc(predictions.createdAt)],
      limit: 50,
    });
    res.json(predictions);
  } catch (error) {
    console.error('Error fetching predictions:', error);
    res.status(500).json({ error: 'Failed to fetch predictions' });
  }
});

export default router;