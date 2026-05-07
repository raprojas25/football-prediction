from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class LeagueBase(BaseModel):
    name: str
    country: str
    continent: str
    logo_url: Optional[str] = None


class LeagueCreate(LeagueBase):
    pass


class League(LeagueBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class TeamBase(BaseModel):
    name: str
    slug: str
    logo_url: Optional[str] = None


class TeamCreate(TeamBase):
    league_id: int


class Team(TeamBase):
    id: int
    league_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class TeamStatsBase(BaseModel):
    team_id: int
    match_date: str
    is_home: bool


class TeamStatsCreate(TeamStatsBase):
    goals_scored: Optional[float] = None
    goals_conceded: Optional[float] = None
    total_goals: Optional[float] = None
    over_1_5: Optional[float] = None
    over_2_5: Optional[float] = None
    over_3_5: Optional[float] = None
    both_teams_scored: Optional[float] = None
    win_rate: Optional[float] = None
    draw_rate: Optional[float] = None
    defeat_rate: Optional[float] = None
    scored_first_rate: Optional[float] = None
    conceded_first_rate: Optional[float] = None
    corners_for_avg: Optional[float] = None
    corners_against_avg: Optional[float] = None
    total_corners_avg: Optional[float] = None
    corners_over_2_5: Optional[float] = None
    corners_over_3_5: Optional[float] = None
    scoring_rate: Optional[float] = None
    scoring_rate_1st_half: Optional[float] = None
    scoring_rate_2nd_half: Optional[float] = None
    conceding_rate: Optional[float] = None


class TeamStats(TeamStatsBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class MatchBase(BaseModel):
    league_id: int
    home_team_id: int
    away_team_id: int
    match_date: str


class MatchCreate(MatchBase):
    pass


class Match(MatchBase):
    id: int
    status: str
    home_goals: Optional[int] = None
    away_goals: Optional[int] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class PredictionBase(BaseModel):
    match_id: int


class PredictionCreate(PredictionBase):
    predicted_winner: Optional[str] = None
    over_1_5_probability: Optional[float] = None
    over_2_5_probability: Optional[float] = None
    over_3_5_probability: Optional[float] = None
    btts_probability: Optional[float] = None
    corners_over_9_5_probability: Optional[float] = None
    confidence_level: Optional[str] = None


class Prediction(PredictionBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


# Schemas para importar datos desde JSON
class TeamStatsJSON(BaseModel):
    id: int
    name: str
    goals: dict
    scored_conceded: dict
    rates: dict
    corners_for: dict
    corners_against: dict
    Total_corners: dict


class LeagueWithTeams(League):
    teams: List[Team] = []