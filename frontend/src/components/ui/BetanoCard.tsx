// Tipado de los datos (ajusta según tu API)
interface PredictionData {
  win: number;
  draw: number;
  loss: number;
  pgfl: number;   // promedio goles local
  pgfv: number;   // promedio goles visitante
  over_1_5: number;
  over_2_5: number;
  over_3_5: number;
  first_home: number;
  first_away: number;
  ht_home: number;
  ht_away: number;
  scoring_home: number;
  scoring_away: number;
  // Opcionales para under (si no existen se calculan)
  under_0_5?: number;
  under_1_5?: number;
  under_2_5?: number;
}

// Componente celda reutilizable (simula botón de cuota)
const StatCell = ({ label, value, suffix = '%' }: { label: string; value: number; suffix?: string }) => (
  <div className="flex justify-between items-center rounded-lg border border-betano-border p-2 bg-white/5 hover:border-betano-primary hover:shadow-glow transition-all duration-150 cursor-default">
    <span className="text-sm font-bold text-white">{label}</span>
    <span className="text-betano-green font-bold text-sm tabular-nums">
      {value.toFixed(0)}{suffix}
    </span>
  </div>
);

// Componente para 1X2
const MatchWinner = ({ win, draw, loss }: Pick<PredictionData, 'win' | 'draw' | 'loss'>) => (
  <div className="bg-betano-card p-3 rounded-lg border border-betano-border relative overflow-hidden">
    <h5 className="text-gray-300 text-sm font-semibold mb-2">Ganador del partido</h5>
    <div className="grid grid-cols-3 gap-2">
      <StatCell label="1" value={win} />
      <StatCell label="X" value={draw} />
      <StatCell label="2" value={loss} />
    </div>
  </div>
);

// Goles por equipo
const TeamGoals = ({ home, away }: { home: number; away: number }) => (
  <div className="bg-betano-card p-3 rounded-lg border border-betano-border space-y-2">
    <h5 className="text-gray-300 text-sm font-semibold">Goles por Equipo (promedio)</h5>
    <div className="grid grid-cols-2 gap-3">
      <StatCell label="Local" value={home} suffix="" />
      <StatCell label="Visitante" value={away} suffix="" />
    </div>
  </div>
);

// Más / Menos goles
const TotalGoalsOverUnder = ({
  over_1_5,
  over_2_5,
  over_3_5,
  under_0_5 = 0,
  under_1_5,
  under_2_5,
}: {
  over_1_5: number;
  over_2_5: number;
  over_3_5: number;
  under_0_5?: number;
  under_1_5?: number;
  under_2_5?: number;
}) => {
  // Calcular under si no vienen explícitos
  const under15 = under_1_5 ?? Math.max(0, 100 - over_1_5);
  const under25 = under_2_5 ?? Math.max(0, 100 - over_2_5);
  // Para under 0.5 usamos el valor proporcionado o un fallback (idealmente vendría de la API)
  const under05 = under_0_5 ?? 0;

  return (
    <div className="bg-betano-card p-3 rounded-lg border border-betano-border space-y-2">
      <h5 className="text-gray-300 text-sm font-semibold">Goles Totales Más / Menos</h5>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <StatCell label="Más 1.5" value={over_1_5} />
          <StatCell label="Más 2.5" value={over_2_5} />
          <StatCell label="Más 3.5" value={over_3_5} />
        </div>
        <div className="space-y-2">
          <StatCell label="Menos 0.5" value={under05} />
          <StatCell label="Menos 1.5" value={under15} />
          <StatCell label="Menos 2.5" value={under25} />
        </div>
      </div>
    </div>
  );
};

// Primer equipo en anotar
const FirstToScore = ({ home, away }: { home: number; away: number }) => (
  <div className="bg-betano-card p-3 rounded-lg border border-betano-border space-y-2">
    <h5 className="text-gray-300 text-sm font-semibold">Primer equipo en anotar</h5>
    <div className="grid grid-cols-2 gap-3">
      <StatCell label="Local" value={home} />
      <StatCell label="Visitante" value={away} />
    </div>
  </div>
);

// Anotará en el medio tiempo
const ScoreInHalf = ({ home, away }: { home: number; away: number }) => (
  <div className="bg-betano-card p-3 rounded-lg border border-betano-border space-y-2">
    <h5 className="text-gray-300 text-sm font-semibold">Anotará en el medio tiempo</h5>
    <div className="grid grid-cols-2 gap-3">
      <StatCell label="Local" value={home} />
      <StatCell label="Visitante" value={away} />
    </div>
  </div>
);

// Anotará en cualquier tiempo
const ScoreAnyTime = ({ home, away }: { home: number; away: number }) => (
  <div className="bg-betano-card p-3 rounded-lg border border-betano-border space-y-2">
    <h5 className="text-gray-300 text-sm font-semibold">Anotará en cualquier tiempo</h5>
    <div className="grid grid-cols-2 gap-3">
      <StatCell label="Local" value={home} />
      <StatCell label="Visitante" value={away} />
    </div>
  </div>
);

// Componente principal
export const BetanoCard = ({ prediction }: { prediction: PredictionData | null }) => {
  if (!prediction) {
    return (
      <div className="bg-betano-card p-4 rounded-lg border border-betano-border relative overflow-hidden">
        <div className="absolute top-0 right-0 bg-betano-primary text-black rounded-bl-lg px-3 py-1 text-xs font-bold">
          BB
        </div>
        <h5 className="text-gray-300 text-center">No hay datos disponibles</h5>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Badge general en el primer card? Mejor ponerlo en cada uno? 
          Según diseño original solo aparecía en el primero. 
          Lo dejamos en el primer bloque y añadimos un wrapper opcional.
          Para mantener la coherencia, envolvemos MatchWinner con el badge.
      */}
      <div className="relative overflow-hidden">
        <div className="absolute top-0 right-0 bg-betano-primary text-black rounded-bl-lg px-3 py-1 text-xs font-bold z-10">
          BB
        </div>
        <MatchWinner win={prediction.win} draw={prediction.draw} loss={prediction.loss} />
      </div>

      <TeamGoals home={prediction.pgfl} away={prediction.pgfv} />
      
      <TotalGoalsOverUnder
        over_1_5={prediction.over_1_5}
        over_2_5={prediction.over_2_5}
        over_3_5={prediction.over_3_5}
        // Si la API provee under_0_5, under_1_5, under_2_5 se pasan; si no, se calculan
        under_0_5={prediction.under_0_5}
        under_1_5={prediction.under_1_5}
        under_2_5={prediction.under_2_5}
      />

      <FirstToScore home={prediction.first_home} away={prediction.first_away} />
      <ScoreInHalf home={prediction.ht_home} away={prediction.ht_away} />
      <ScoreAnyTime home={prediction.scoring_home} away={prediction.scoring_away} />
    </div>
  );
};
