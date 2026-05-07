export const Info = ({ prediction }: any) => {
  console.log(prediction);
  if(!prediction) 
    return(
      <div className="bg-betano-card p-2 rounded-md border border-betano-border space-y-3 relative overflow-hidden">
        <div className="absolute top-0 right-0 bg-betano-primary text-white rounded-bl-lg px-2 text-[10px] font-bold">
          BB
        </div>
        <h5 className="text-gray-300">No hay datos</h5>

      </div>
    )
  return (
    <>
      <div className="bg-betano-card p-2 rounded-md border border-betano-border  relative overflow-hidden">
        <div className="absolute top-0 right-0 bg-betano-primary text-white rounded-bl-lg px-2 text-[10px] font-bold">
          BB
        </div>
        <h5 className="text-gray-300 mb-2">Ganador del partido</h5>
        <div className="grid grid-cols-3 items-center gap-2">
          <div className="flex justify-between items-center rounded-lg border border-betano-border p-2 bg-white/5">
            <span className="text-sm font-bold">1</span>
            <span className="text-betano-green text-sm">
              {Number(prediction.win).toFixed(0)} %
            </span>
          </div>
          <div className="flex justify-between items-center rounded-lg border border-betano-border p-2 bg-white/5">
            <span className="text-sm font-bold">X</span>
            <span className="text-betano-green text-sm">
              {Number(prediction.draw).toFixed(0)} %
            </span>
          </div>
          <div className="flex justify-between items-center rounded-lg border border-betano-border p-2 bg-white/5">
            <span className="text-sm font-bold">2</span>
            <span className="text-betano-green text-sm">
              {Number(prediction.loss).toFixed(0)} %
            </span>
          </div>
        </div>
      </div>

      <div className="bg-betano-card p-2 rounded-md border border-betano-border space-y-2 mt-4">
        <h5 className="text-gray-300">Goles por Equipo</h5>
        <div className="grid grid-cols-2 items-center gap-3">
          <div className="flex justify-between items-center rounded-lg border border-betano-border p-2 bg-white/5">
            <span className="text-sm font-bold">1</span>
            <span className="text-betano-green text-sm">
              {Number(prediction.pgfl).toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between items-center rounded-lg border border-betano-border p-2 bg-white/5">
            <span className="text-sm font-bold">2</span>
            <span className="text-betano-green text-sm">
              {Number(prediction.pgfv).toFixed(2)}
            </span>
          </div>
        </div>
      </div>
      <div className="bg-betano-card p-2 rounded-md border border-betano-border space-y-2 mt-4">
        <h5 className="text-gray-300">Goles Totales Mas/Menos</h5>
        <div className="grid grid-cols-2 items-center gap-3">
          <div className="space-y-1">

            <div className="flex justify-between items-center rounded-lg border border-betano-border p-2 bg-white/5">
              <span className="text-sm">Mas 1.5</span>
              <span className="text-betano-green text-sm">
                {Number(prediction.over_1_5).toFixed(0)} %
              </span>
            </div>
            <div className="flex justify-between items-center rounded-lg border border-betano-border p-2 bg-white/5">
              <span className="text-sm">Mas 2.5</span>
              <span className="text-betano-green text-sm">
                {Number(prediction.over_2_5).toFixed(0)} %
              </span>
            </div>
            <div className="flex justify-between items-center rounded-lg border border-betano-border p-2 bg-white/5">
              <span className="text-sm">Mas 3.5</span>
              <span className="text-betano-green text-sm">
                {Number(prediction.over_3_5).toFixed(0)} %
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center rounded-lg border border-betano-border p-2 bg-white/5">
              <span className="text-sm">Menos 0.5</span>
              <span className="text-betano-green text-sm">
                {Number(prediction.loss).toFixed(0)} %
              </span>
            </div>
            <div className="flex justify-between items-center rounded-lg border border-betano-border p-2 bg-white/5">
              <span className="text-sm">Menos 1.5</span>
              <span className="text-betano-green text-sm">
                {Number(prediction.loss).toFixed(0)} %
              </span>
            </div>
            <div className="flex justify-between items-center rounded-lg border border-betano-border p-2 bg-white/5">
              <span className="text-sm">Menos 2.5</span>
              <span className="text-betano-green text-sm">
                {Number(prediction.loss).toFixed(0)} %
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-betano-card p-2 rounded-md border border-betano-border space-y-2 mt-4">
        <h5 className="text-gray-300">Primer Equipo en anotar</h5>
        <div className="grid grid-cols-2 items-center gap-3">
          <div className="flex justify-between items-center rounded-lg border border-betano-border p-2 bg-white/5">
            <span className="text-sm font-bold">1</span>
            <span className="text-betano-green text-sm">
              {Number(prediction.first_home).toFixed(0)} %
            </span>
          </div>
          <div className="flex justify-between items-center rounded-lg border border-betano-border p-2 bg-white/5">
            <span className="text-sm font-bold">2</span>
            <span className="text-betano-green text-sm">
              {Number(prediction.first_away).toFixed(0)} %
            </span>
          </div>
        </div>
      </div>

      <div className="bg-betano-card p-2 rounded-md border border-betano-border space-y-2 mt-4">
        <h5 className="text-gray-300">Anotara en el Medio Tiempo</h5>
        <div className="grid grid-cols-2 items-center gap-3">
          <div className="flex justify-between items-center rounded-lg border border-betano-border p-2 bg-white/5">
            <span className="text-sm font-bold">1</span>
            <span className="text-betano-green text-sm">
              {Number(prediction.ht_home).toFixed(0)} %
            </span>
          </div>
          <div className="flex justify-between items-center rounded-lg border border-betano-border p-2 bg-white/5">
            <span className="text-sm font-bold">2</span>
            <span className="text-betano-green text-sm">
              {Number(prediction.ht_away).toFixed(0)} %
            </span>
          </div>
        </div>
      </div>

      <div className="bg-betano-card p-2 rounded-md border border-betano-border space-y-2 mt-4">
        <h5 className="text-gray-300">Anotara cualquier tiempo</h5>
        <div className="grid grid-cols-2 items-center gap-3">
          <div className="flex justify-between items-center rounded-lg border border-betano-border p-2 bg-white/5">
            <span className="text-sm font-bold">1</span>
            <span className="text-betano-green text-sm">
              {Number(prediction.scoring_home).toFixed(0)} %
            </span>
          </div>
          <div className="flex justify-between items-center rounded-lg border border-betano-border p-2 bg-white/[0.03]">
            <span className="text-sm font-bold">2</span>
            <span className="text-betano-green text-sm">
              {Number(prediction.scoring_away).toFixed(0)} %
            </span>
          </div>
        </div>
      </div>
    </>
  );
};
