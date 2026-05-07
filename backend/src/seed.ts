import { db, schema } from './db';
import { eq, and, gte } from 'drizzle-orm';
import * as fs from 'fs';
import * as path from 'path';
import { PostgresJsDatabase } from 'drizzle-orm/node-postgres';

const dbInstance = db as PostgresJsDatabase;

interface TeamData {
  id: number;
  name: string;
  slug: string;
  goals: {
    home: { [key: string]: number };
    away: { [key: string]: number };
  };
  scored_conceded: {
    home: { [key: string]: number };
    away: { [key: string]: number };
  };
  rates: {
    home: { [key: string]: number };
    away: { [key: string]: number };
  };
  corners_for: {
    home: { [key: string]: number };
    away: { [key: string]: number };
  };
  corners_against: {
    home: { [key: string]: number };
    away: { [key: string]: number };
  };
  Total_corners: {
    home: { [key: string]: number };
    away: { [key: string]: number };
  };
}

interface LeagueData {
  league: { id: number; name: string; country: string };
  teams: TeamData[];
}

const leagues: Record<string, LeagueData> = {
  alemania: {
    league: { id: 1, name: 'Bundesliga', country: 'Germany' },
    teams: []
  },
  inglaterra: {
    league: { id: 2, name: 'Premier League', country: 'England' },
    teams: []
  },
  espana: {
    league: { id: 3, name: 'La Liga', country: 'Spain' },
    teams: []
  },
  italia: {
    league: { id: 4, name: 'Serie A', country: 'Italy' },
    teams: []
  },
  francia: {
    league: { id: 5, name: 'Ligue 1', country: 'France' },
    teams: []
  }
};

async function loadData() {
  const dataDir = path.join(__dirname, '../../frontend/public/data');
  
  for (const [key, league] of Object.entries(leagues)) {
    const filePath = path.join(dataDir, `${key}.json`);
    if (fs.existsSync(filePath)) {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      league.teams = data;
    }
  }
}

async function seed() {
  console.log('Starting seed...');
  
  await loadData();

  for (const [key, leagueData] of Object.entries(leagues)) {
    console.log(`Processing ${leagueData.league.name}...`);

    const existingLeague = await db.select().from(schema.leagues).where(eq(schema.leagues.id, leagueData.league.id));
    
    let leagueId: number;
    if (existingLeague.length > 0) {
      leagueId = existingLeague[0].id;
    } else {
      const result = await db.insert(schema.leagues).values({
        id: leagueData.league.id,
        name: leagueData.league.name,
        country: leagueData.league.country,
        continent: 'Europe'
      }).returning();
      leagueId = result[0].id;
    }

    for (const teamData of leagueData.teams) {
      const existingTeam = await db.select().from(schema.teams).where(eq(schema.teams.slug, teamData.slug));
      
      let teamId: number;
      if (existingTeam.length > 0) {
        teamId = existingTeam[0].id;
      } else {
        const result = await db.insert(schema.teams).values({
          leagueId: leagueId,
          name: teamData.name,
          slug: teamData.slug
        }).returning();
        teamId = result[0].id;
      }

      const today = new Date();
      for (let i = 0; i < 10; i++) {
        const matchDate = new Date(today);
        matchDate.setDate(matchDate.getDate() - i * 7);

        const homeStats = teamData.goals.home || {};
        const awayStats = teamData.goals.away || {};

        const existingHomeStats = await db.select().from(schema.teamStats)
          .where(and(
            eq(schema.teamStats.teamId, teamId),
            eq(schema.teamStats.matchDate, matchDate),
            eq(schema.teamStats.isHome, true)
          ));

        if (existingHomeStats.length === 0) {
          await db.insert(schema.teamStats).values({
            teamId: teamId,
            matchDate: matchDate,
            isHome: true,
            goalsScored: homeStats.goals_scored || 1.5,
            goalsConceded: homeStats.goals_conceded || 1.2,
            totalGoals: homeStats.total_goals || 2.7,
            over1_5: homeStats.over_1_5 || 0.7,
            over2_5: homeStats.over_2_5 || 0.5,
            over3_5: homeStats.over_3_5 || 0.25,
            bothTeamsScored: homeStats.both_teams_scored || 0.5,
            winRate: homeStats.win_rate || 0.4,
            drawRate: homeStats.draw_rate || 0.25,
            defeatRate: homeStats.defeat_rate || 0.35,
            scoredFirstRate: homeStats.scored_first_rate || 0.45,
            concededFirstRate: homeStats.conceded_first_rate || 0.35,
            cornersForAvg: teamData.corners_for?.home?.average || 5.5,
            cornersAgainstAvg: teamData.corners_against?.home?.average || 4.5,
            totalCornersAvg: teamData.Total_corners?.home?.average || 10,
            cornersOver2_5: teamData.corners_for?.home?.over_2_5 || 0.55,
            cornersOver3_5: teamData.corners_for?.home?.over_3_5 || 0.35,
            scoringRate: teamData.scored_conceded?.home?.scoring_rate || 0.7,
            scoringRate1stHalf: teamData.scored_conceded?.home?.scoring_rate_1st_half || 0.35,
            scoringRate2ndHalf: teamData.scored_conceded?.home?.scoring_rate_2nd_half || 0.45,
            concedingRate: teamData.scored_conceded?.home?.conceding_rate || 0.4
          });
        }

        const existingAwayStats = await db.select().from(schema.teamStats)
          .where(and(
            eq(schema.teamStats.teamId, teamId),
            eq(schema.teamStats.matchDate, matchDate),
            eq(schema.teamStats.isHome, false)
          ));

        if (existingAwayStats.length === 0) {
          await db.insert(schema.teamStats).values({
            teamId: teamId,
            matchDate: matchDate,
            isHome: false,
            goalsScored: awayStats.goals_scored || 1.3,
            goalsConceded: awayStats.goals_conceded || 1.4,
            totalGoals: awayStats.total_goals || 2.5,
            over1_5: awayStats.over_1_5 || 0.65,
            over2_5: awayStats.over_2_5 || 0.45,
            over3_5: awayStats.over_3_5 || 0.2,
            bothTeamsScored: awayStats.both_teams_scored || 0.45,
            winRate: awayStats.win_rate || 0.35,
            drawRate: awayStats.draw_rate || 0.28,
            defeatRate: awayStats.defeat_rate || 0.37,
            scoredFirstRate: awayStats.scored_first_rate || 0.4,
            concededFirstRate: awayStats.conceded_first_rate || 0.4,
            cornersForAvg: teamData.corners_for?.away?.average || 4.5,
            cornersAgainstAvg: teamData.corners_against?.away?.average || 5,
            totalCornersAvg: teamData.Total_corners?.away?.average || 9.5,
            cornersOver2_5: teamData.corners_for?.away?.over_2_5 || 0.5,
            cornersOver3_5: teamData.corners_for?.away?.over_3_5 || 0.3,
            scoringRate: teamData.scored_conceded?.away?.scoring_rate || 0.6,
            scoringRate1stHalf: teamData.scored_conceded?.away?.scoring_rate_1st_half || 0.3,
            scoringRate2ndHalf: teamData.scored_conceded?.away?.scoring_rate_2nd_half || 0.4,
            concedingRate: teamData.scored_conceded?.away?.conceding_rate || 0.45
          });
        }
      }

      console.log(`  - ${teamData.name}`);
    }
  }

  console.log('Seed completed!');
}

seed()
  .catch(console.error);