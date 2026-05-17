import { motion } from "framer-motion";

type Props = {};

export const Outcome = ({ data }: any) => {
  return (
    <motion.div
      key="goals"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="overflow-x-auto mt-2"
    >
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-betano-border text-betano-muted bg-white/5">
            <th className="text-left py-2 px-2"></th>
            <th className="text-left py-2 px-2">N°</th>
            <th className="text-center py-2 px-2">Win</th>
            <th className="text-center py-2 px-2">Draw</th>
            <th className="text-center py-2 px-2">Loss</th>
            <th className="text-center py-2 px-2">-</th>
            <th className="text-center py-2 px-2">H</th>
            <th className="text-center py-2 px-2">D</th>
            <th className="text-center py-2 px-2">A</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-betano-border">
          <tr className="hover:bg-betano-surface/50">
            <td className="py-2 px-2 font-medium">L</td>
            <td className="py-2 px-2 font-medium">{data.home.id}</td>
            <td className="py-2 px-2 text-center">
              {data.home.goals.home.win.toFixed(0)}%
            </td>
            <td className="py-2 px-2 text-center">
              {data.home.goals.home.draw.toFixed(0)}%
            </td>
            <td className="py-2 px-2 text-center">
              {data.home.goals.home.defeats.toFixed(0)}%
            </td>
            <td className="py-2 px-2 text-center">-</td>
            <td rowSpan={2} className="py-2 px-2 text-center">
              {data.win.toFixed(0)}%
            </td>
            <td rowSpan={2} className="py-2 px-2 text-center">
              {data.draw.toFixed(0)}%
            </td>
            <td rowSpan={2} className="py-2 px-2 text-center">
              {data.loss.toFixed(0)}%
            </td>
          </tr>
          <tr className="hover:bg-gray-700/50">
            <td className="py-2 px-2 font-medium">V</td>
            <td className="py-2 px-2 font-medium">{data.away.id}</td>
            <td className="py-2 px-2 text-center">
              {data.away.goals.away.win.toFixed(0)}%
            </td>
            <td className="py-2 px-2 text-center">
              {data.away.goals.away.draw.toFixed(0)}%
            </td>
            <td className="py-2 px-2 text-center">
              {data.away.goals.away.defeats.toFixed(0)}%
            </td>
            <td className="py-2 px-2 text-center">-</td>
          </tr>
        </tbody>
      </table>
    </motion.div>
  );
};
