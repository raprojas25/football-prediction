import { Link } from 'react-router-dom'
import { Trophy, Settings, Info, Calendar } from 'lucide-react'

export default function Navbar() {
  return (
    <nav className="bg-gradient-to-b from-betano-primary to-betano-secondary opacity-90 border-b border-betano-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <Trophy className="w-8 h-8 text-white" />
            <span className="text-xl font-bold text-white">
              Sports Predictions
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <Link 
              to="/partidos" 
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/20 transition-colors text-sm"
            >
              <Calendar className="w-4 h-4" />
              Partidos
            </Link>
            <button className="p-2 hover:bg-white/50 rounded-lg transition-colors">
              <Info className="w-5 h-5 text-betano-text" />
            </button>
            <button className="p-2 hover:bg-white/50 rounded-lg transition-colors">
              <Settings className="w-5 h-5 text-betano-text" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
