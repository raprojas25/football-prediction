// App.tsx
import React from 'react';

// Types for table data
interface AIModel {
  id: number;
  name: string;
  creator: string;
  downloads: string;
  rating: number;
}

const Dashboard: React.FC = () => {
  // Sample data for the table
  const aiModels: AIModel[] = [
    { id: 1, name: 'Llama 3 (8B)', creator: 'Meta', downloads: '2.3M+', rating: 4.8 },
    { id: 2, name: 'Mistral 7B', creator: 'Mistral AI', downloads: '1.9M+', rating: 4.7 },
    { id: 3, name: 'Falcon 180B', creator: 'TII', downloads: '890K+', rating: 4.6 },
    { id: 4, name: 'Phi-3 Mini', creator: 'Microsoft', downloads: '1.2M+', rating: 4.5 },
    { id: 5, name: 'Gemma 7B', creator: 'Google', downloads: '1.5M+', rating: 4.7 },
  ];

  // Company logos (using simple text placeholders; replace with actual images if needed)
  const companies = ['Google', 'Meta', 'Microsoft', 'Mistral AI', 'Stability AI'];

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              #FreeAI
            </h1>
            <p className="text-gray-400 mt-1">Powerful open models. Free for everyone.</p>
          </div>
          <button className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-sm font-medium transition">
            Read Docs
          </button>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gray-900/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-800">
            <p className="text-gray-400 text-sm uppercase tracking-wide">Free AI Models</p>
            <p className="text-4xl font-bold mt-2">1,250+</p>
            <p className="text-green-400 text-sm mt-2">↑ 23% this month</p>
          </div>
          <div className="bg-gray-900/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-800">
            <p className="text-gray-400 text-sm uppercase tracking-wide">Total Downloads</p>
            <p className="text-4xl font-bold mt-2">89.2M</p>
            <p className="text-green-400 text-sm mt-2">↑ 15% this week</p>
          </div>
          <div className="bg-gray-900/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-800">
            <p className="text-gray-400 text-sm uppercase tracking-wide">Avg. Response Time</p>
            <p className="text-4xl font-bold mt-2">0.24s</p>
            <p className="text-gray-400 text-sm mt-2">Fastest among free APIs</p>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden mb-12">
          <div className="px-6 py-4 border-b border-gray-800">
            <h2 className="text-xl font-semibold">Top Free AI Models</h2>
            <p className="text-gray-400 text-sm">Most downloaded open‑source models</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-800/50 text-gray-300 text-sm">
                <tr>
                  <th className="px-6 py-3">Model</th>
                  <th className="px-6 py-3">Creator</th>
                  <th className="px-6 py-3">Downloads</th>
                  <th className="px-6 py-3">Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {aiModels.map((model) => (
                  <tr key={model.id} className="hover:bg-gray-800/30 transition">
                    <td className="px-6 py-4 font-medium">{model.name}</td>
                    <td className="px-6 py-4 text-gray-300">{model.creator}</td>
                    <td className="px-6 py-4 text-gray-300">{model.downloads}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-400">★</span>
                        <span>{model.rating}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Building & Company Interactions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Building section */}
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
            <h2 className="text-2xl font-bold mb-2">🚀 Building</h2>
            <p className="text-gray-300 leading-relaxed">
              The open‑source AI ecosystem is growing rapidly. Developers and researchers
              worldwide are building innovative applications powered by free models.
              From chatbots to code assistants, the possibilities are endless.
            </p>
            <div className="mt-4 flex gap-3">
              <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-xs">
                #opensource
              </span>
              <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-xs">
                #llm
              </span>
              <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-xs">
                #developer
              </span>
            </div>
          </div>

          {/* Right: Interactions from companies */}
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
            <h2 className="text-2xl font-bold mb-2">🌍 Interactions from companies</h2>
            <p className="text-gray-400 text-sm mb-4">All around the world</p>
            <div className="flex flex-wrap gap-4 items-center">
              {companies.map((company, idx) => (
                <div
                  key={idx}
                  className="bg-gray-800/50 rounded-xl px-4 py-2 flex items-center gap-2 border border-gray-700"
                >
                  <div className="w-6 h-6 bg-gradient-to-br from-gray-500 to-gray-700 rounded-full" />
                  <span className="text-gray-200 text-sm font-medium">{company}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 text-sm text-gray-400">
              + 150 more companies building with free AI models
            </div>
          </div>
        </div>

        {/* Footer / additional stats (optional) */}
        <div className="mt-12 text-center text-gray-500 text-xs border-t border-gray-800 pt-6">
          <p>Data updated live. All metrics representative of Hugging Face + GitHub open models.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
