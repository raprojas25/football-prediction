type Props = {};

import { motion } from "framer-motion";

export const Rates = ({ data }: any) => {
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
            <th className="text-center py-2 px-2">1° Gol</th>
            <th className="text-center py-2 px-2">H-T</th>
            <th className="text-center py-2 px-2">S-T</th>
            <th className="text-center py-2 px-2">B-H</th>
            <th className="text-center py-2 px-2">+0.5</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-betano-border">
          <tr className="hover:bg-betano-surface/50">
            <td className="py-2 px-2 font-medium">L</td>
            <td className="py-2 px-2 font-medium">{data.home.id}</td>
            <td className="py-2 px-2 text-center">
              {data.first_home.toFixed(0)}%
            </td>
            <td className="py-2 px-2 text-center">
              {data.ht_home.toFixed(0)}%
            </td>
            <td className="py-2 px-2 text-center">
              {data.st_home.toFixed(0)}%
            </td>
            <td className="py-2 px-2 text-center">
              {data.bt_home.toFixed(0)}%
            </td>
            <td className="py-2 px-2 text-center">
              {data.scoring_home.toFixed(1)}%
            </td>
          </tr>
          <tr className="hover:bg-gray-700/50">
            <td className="py-2 px-2 font-medium">V</td>
            <td className="py-2 px-2 font-medium">{data.away.id}</td>
            <td className="py-2 px-2 text-center">
              {data.first_away.toFixed(0)}%
            </td>
            <td className="py-2 px-2 text-center">
              {data.ht_away.toFixed(0)}%
            </td>
            <td className="py-2 px-2 text-center">
              {data.st_away.toFixed(0)}%
            </td>
            <td className="py-2 px-2 text-center">
              {data.bt_away.toFixed(0)}%
            </td>
            <td className="py-2 px-2 text-center">
              {data.scoring_away.toFixed(1)}%
            </td>
          </tr>
        </tbody>
      </table>
    </motion.div>
  );
};
