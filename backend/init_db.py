#!/usr/bin/env python3
"""
Script para inicializar la base de datos PostgreSQL
y cargar datos desde archivos JSON
"""
import os
import sys
import json

# Agregar el directorio padre al path
sys.path.insert(0, os.path.dirname(__file__))

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.config import settings
from app.models import League, Team, TeamStats
from datetime import datetime

# Crear engine
engine = create_engine(settings.DATABASE_URL)
Session = sessionmaker(bind=engine)


def create_tables():
    """Crea todas las tablas"""
    from app.db.database import Base
    Base.metadata.create_all(bind=engine)
    print("✅ Tablas creadas")


def load_json_data(league_name, json_file):
    """Carga datos desde archivo JSON a la base de datos"""
    session = Session()
    
    try:
        # Leer archivo JSON
        with open(json_file, 'r', encoding='utf-8') as f:
            teams_data = json.load(f)
        
        # Verificar si la liga ya existe
        league = session.query(League).filter_by(name=league_name.title()).first()
        if not league:
            # Crear la liga
            league = League(
                name=league_name.title(),
                country=get_country(league_name),
                continent=get_continent(league_name)
            )
            session.add(league)
            session.commit()
            print(f"   ✅ Liga '{league_name}' creada")
        else:
            print(f"   ℹ️ Liga '{league_name}' ya existe")
        
        # Cargar equipos
        team_count = 0
        for team_data in teams_data:
            # Verificar si el equipo ya existe
            existing_team = session.query(Team).filter_by(
                league_id=league.id,
                name=team_data['name']
            ).first()
            
            if existing_team:
                print(f"   ℹ️ {team_data['name']} ya existe, saltando...")
                continue
            
            # Crear equipo
            team = Team(
                league_id=league.id,
                name=team_data['name'],
                slug=team_data['name'].lower().replace(' ', '-').replace('.', '')
            )
            session.add(team)
            session.commit()
            team_count += 1
            
            # Crear estadísticas (usando datos home)
            if 'goals' in team_data and 'home' in team_data['goals']:
                home_stats = team_data['goals']['home']
                stats = TeamStats(
                    team_id=team.id,
                    match_date=datetime.now().strftime('%Y-%m-%d'),
                    is_home=True,
                    goals_scored=home_stats.get('goals_scored_per_game'),
                    goals_conceded=home_stats.get('goals_conceded_per_game'),
                    total_goals=home_stats.get('total_goal_per_game'),
                    over_1_5=home_stats.get('over_1_5'),
                    over_2_5=home_stats.get('over_2_5'),
                    over_3_5=home_stats.get('over_3_5'),
                    both_teams_scored=home_stats.get('both_teams_scored'),
                    win_rate=home_stats.get('win'),
                    draw_rate=home_stats.get('draw'),
                    defeat_rate=home_stats.get('defeats'),
                )
                session.add(stats)
        
        session.commit()
        print(f"   ✅ {team_count} equipos cargados para {league_name}")
        
    except Exception as e:
        session.rollback()
        print(f"   ❌ Error cargando {league_name}: {e}")
    finally:
        session.close()


def get_country(league_name):
    """Obtiene el país de la liga"""
    countries = {
        'alemania': 'Alemania',
        'inglaterra': 'Inglaterra',
        'espana': 'España',
        'italia': 'Italia',
        'francia': 'Francia',
        'holanda': 'Países Bajos',
        'belgica': 'Bélgica',
        'portugal': 'Portugal',
        'esclandia': 'Escocia',
        'turquia': 'Turquía',
        'grecia': 'Grecia',
        'rusia': 'Rusia',
    }
    return countries.get(league_name, 'Desconocido')


def get_continent(league_name):
    """Obtiene el continente de la liga"""
    europe = ['alemania', 'inglaterra', 'espana', 'italia', 'francia', 
               'holanda', 'belgica', 'portugal', 'esclandia', 'turquia', 
               'grecia', 'rusia']
    return 'Europa' if league_name in europe else 'Otro'


def main():
    print("🏆 INICIALIZADOR DE BASE DE DATOS")
    print("=" * 50)
    
    # Crear tablas
    create_tables()
    
    # Buscar archivos JSON
    data_dir = os.path.join(os.path.dirname(__file__), '..', 'frontend', 'public', 'data')
    
    if not os.path.exists(data_dir):
        print(f"\n❌ Directorio no encontrado: {data_dir}")
        return
    
    # Cargar cada archivo JSON
    json_files = [f for f in os.listdir(data_dir) if f.endswith('.json')]
    
    if not json_files:
        print("\n❌ No se encontraron archivos JSON")
        return
    
    print(f"\n📁 Archivos JSON encontrados: {len(json_files)}")
    
    for json_file in json_files:
        league_name = json_file.replace('.json', '')
        json_path = os.path.join(data_dir, json_file)
        print(f"\n🔄 Cargando: {league_name}")
        load_json_data(league_name, json_path)
    
    print("\n" + "=" * 50)
    print("🎉 CARGA COMPLETADA!")
    print("=" * 50)


if __name__ == "__main__":
    main()