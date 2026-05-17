import { Router } from 'express';
import { db, schema } from '../db';
import { eq } from 'drizzle-orm';
import { calculatePrediction } from '../services/predictionEngine.js';

const router = Router();

router.post('/generate', async (req, res) => {
  try {
    const { homeTeamId, awayTeamId, matchId } = req.body;
    
    if (!homeTeamId || !awayTeamId) {
      return res.status(400).json({ error: 'homeTeamId and awayTeamId are required' });
    }

    const prediction = await calculatePrediction(db, Number(homeTeamId), Number(awayTeamId));

    let savedPrediction = null;
    if (matchId) {
      const [saved] = await db.insert(schema.predictions).values({
        matchId: Number(matchId),
        homeTeamId: Number(homeTeamId),
        awayTeamId: Number(awayTeamId),
        predictedWinner: prediction.predictedWinner,
        predictedGoalsHome: prediction.predictedGoalsHome,
        predictedGoalsAway: prediction.predictedGoalsAway,
        over1_5Probability: prediction.over1_5Probability,
        over2_5Probability: prediction.over2_5Probability,
        over3_5Probability: prediction.over3_5Probability,
        bttsProbability: prediction.bttsProbability,
        cornersOver9_5Probability: prediction.cornersOver9_5Probability,
        totalCornersPredicted: prediction.totalCorners,
        confidenceLevel: prediction.confidenceLevel,
      }).returning();
      savedPrediction = saved;
    }

    res.json({
      ...prediction,
      saved: !!savedPrediction,
      predictionId: savedPrediction?.id || null
    });
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

router.get('/', async (req, res) => {
  try {
    const predictions = await db.query.predictions.findMany({
      orderBy: (predictions, { desc }) => [desc(predictions.createdAt)],
      limit: 100,
    });
    res.json(predictions);
  } catch (error) {
    console.error('Error fetching all predictions:', error);
    res.status(500).json({ error: 'Failed to fetch predictions' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await db.delete(schema.predictions).where(eq(schema.predictions.id, Number(req.params.id)));
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting prediction:', error);
    res.status(500).json({ error: 'Failed to delete prediction' });
  }
});

export default router;