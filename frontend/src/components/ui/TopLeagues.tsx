import { ChevronUp, Home } from "lucide-react";

export const TopLeagues = () => {
  return (
    <div className="bg-betano-card px-2 py-3 rounded-md border border-betano-border space-y-2">
      <div className="flex justify-between items-center">
        <div className="space-x-3">
          <span className="text-gray-100 font-bold">Top Ligas</span>
          <span className="text-betano-muted">Mis ligas</span>
        </div>
        <ChevronUp size={18} />
      </div>
      <div className="flex gap-1 overflow-x-scroll">
        <div className="px-3 py-2 bg-betano-dark space-y-2 text-center rounded-sm">
          <Home size={45} className="text-red-500 stroke-1" />
          <span className="font-bold text-sm">Liga 1</span>
        </div>
        <div className="px-3 py-2 bg-betano-dark space-y-2 text-center">
          <Home size={45} className="text-blue-500 stroke-1" />
          <span className="font-bold text-sm">Liga 1</span>
        </div>
        <div className="px-3 py-2 bg-betano-dark space-y-2 text-center">
          <Home size={45} className="text-sky-500 stroke-1" />
          <span className="font-bold text-sm">Liga 1</span>
        </div>
        <div className="px-3 py-2 bg-betano-dark space-y-2 text-center rounded-sm">
          <Home size={45} className="text-red-500 stroke-1" />
          <span className="font-bold text-sm">Liga 1</span>
        </div>
        <div className="px-3 py-2 bg-betano-dark space-y-2 text-center">
          <Home size={45} className="text-blue-500 stroke-1" />
          <span className="font-bold text-sm">Liga 1</span>
        </div>
        <div className="px-3 py-2 bg-betano-dark space-y-2 text-center">
          <Home size={45} className="text-sky-500 stroke-1" />
          <span className="font-bold text-sm">Liga 1</span>
        </div>
      </div>
    </div>
  );
};
