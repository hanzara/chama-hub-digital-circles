import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Zap, 
  Users, 
  Trophy, 
  Brain,
  Clock,
  Coins,
  Target,
  Flame,
  Crown,
  Swords,
  TrendingUp,
  Award
} from 'lucide-react';

interface GameMode {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  entryFee: number;
  maxPrize: number;
  duration: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert';
  players: string;
  features: string[];
  gradient: string;
  isLocked?: boolean;
}

interface GameModeSelectorProps {
  onSelectMode: (modeId: string) => void;
  userBalance: number;
}

const GameModeSelector: React.FC<GameModeSelectorProps> = ({ onSelectMode, userBalance }) => {
  const gameModes: GameMode[] = [
    {
      id: 'quick-play',
      name: 'Quick Play',
      description: 'Fast-paced 10 questions to test your knowledge',
      icon: <Zap className="h-6 w-6" />,
      entryFee: 20,
      maxPrize: 200,
      duration: '5 min',
      difficulty: 'Easy',
      players: 'Solo',
      features: ['10 Questions', 'No Time Pressure', 'Learn as you play'],
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'blitz-mode',
      name: 'Blitz Mode',
      description: 'Race against time! 30 seconds per question',
      icon: <Clock className="h-6 w-6" />,
      entryFee: 50,
      maxPrize: 500,
      duration: '10 min',
      difficulty: 'Medium',
      players: 'Solo',
      features: ['20 Questions', '30s Timer', 'Streak Multipliers', 'Power-ups'],
      gradient: 'from-orange-500 to-red-500'
    },
    {
      id: 'multiplayer',
      name: 'Multiplayer Arena',
      description: 'Compete against real players in real-time',
      icon: <Swords className="h-6 w-6" />,
      entryFee: 100,
      maxPrize: 2000,
      duration: '15 min',
      difficulty: 'Hard',
      players: '2-10',
      features: ['Real-time PvP', 'Live Leaderboard', 'Power-ups', 'Winner takes 70%'],
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      id: 'tournament',
      name: 'Daily Tournament',
      description: 'Compete for massive prizes in scheduled tournaments',
      icon: <Trophy className="h-6 w-6" />,
      entryFee: 200,
      maxPrize: 10000,
      duration: '30 min',
      difficulty: 'Expert',
      players: 'Up to 100',
      features: ['50 Questions', 'Top 10 Win', 'Power-ups', 'Achievement Badges'],
      gradient: 'from-yellow-500 to-amber-600'
    },
    {
      id: 'survival',
      name: 'Survival Mode',
      description: 'Last as long as you can! One mistake = Game Over',
      icon: <Flame className="h-6 w-6" />,
      entryFee: 50,
      maxPrize: 5000,
      duration: 'Until fail',
      difficulty: 'Hard',
      players: 'Solo',
      features: ['Unlimited Questions', 'No Second Chances', 'Growing Rewards', 'Cash Out Anytime'],
      gradient: 'from-red-500 to-rose-600'
    },
    {
      id: 'premium-challenge',
      name: 'Premium Challenge',
      description: 'Elite questions for premium members only',
      icon: <Crown className="h-6 w-6" />,
      entryFee: 500,
      maxPrize: 20000,
      duration: '45 min',
      difficulty: 'Expert',
      players: 'Premium Only',
      features: ['100 Questions', 'Expert Level', 'Triple Rewards', 'Exclusive Badges'],
      gradient: 'from-indigo-600 to-purple-700',
      isLocked: true
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Hard': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'Expert': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-2">
          <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Choose Your Challenge
          </span>
        </h2>
        <p className="text-slate-300 text-lg">Select a game mode and start earning!</p>
        <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-full border border-green-500/30">
          <Coins className="h-5 w-5 text-green-400" />
          <span className="text-green-300 font-bold">Balance: KES {userBalance.toLocaleString()}</span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {gameModes.map((mode) => (
          <Card 
            key={mode.id}
            className={`group border-0 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl shadow-2xl overflow-hidden relative hover-scale transition-all duration-300 ${
              mode.isLocked ? 'opacity-75' : ''
            }`}
          >
            {/* Gradient overlay */}
            <div className={`absolute inset-0 bg-gradient-to-r ${mode.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
            
            {/* Locked overlay */}
            {mode.isLocked && (
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-10 flex items-center justify-center">
                <div className="text-center">
                  <Crown className="h-12 w-12 text-yellow-400 mx-auto mb-2" />
                  <p className="text-white font-semibold">Premium Only</p>
                </div>
              </div>
            )}

            <CardHeader className="relative z-0">
              <div className="flex items-start justify-between mb-2">
                <div className={`p-3 rounded-xl bg-gradient-to-r ${mode.gradient} shadow-lg`}>
                  {mode.icon}
                </div>
                <Badge className={getDifficultyColor(mode.difficulty)}>
                  {mode.difficulty}
                </Badge>
              </div>
              
              <CardTitle className="text-xl font-bold text-white mt-3">
                {mode.name}
              </CardTitle>
              <CardDescription className="text-slate-300 mt-2">
                {mode.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="relative z-0 space-y-4">
              {/* Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/5 rounded-lg p-3 border border-slate-700/50">
                  <div className="text-xs text-slate-400 mb-1">Entry Fee</div>
                  <div className="flex items-center gap-1">
                    <Coins className="h-4 w-4 text-yellow-400" />
                    <span className="font-bold text-white">{mode.entryFee} KES</span>
                  </div>
                </div>
                <div className="bg-white/5 rounded-lg p-3 border border-slate-700/50">
                  <div className="text-xs text-slate-400 mb-1">Max Prize</div>
                  <div className="flex items-center gap-1">
                    <Trophy className="h-4 w-4 text-green-400" />
                    <span className="font-bold text-green-400">{mode.maxPrize} KES</span>
                  </div>
                </div>
              </div>

              {/* Info badges */}
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="bg-white/5 border-slate-600 text-slate-300">
                  <Clock className="h-3 w-3 mr-1" />
                  {mode.duration}
                </Badge>
                <Badge variant="outline" className="bg-white/5 border-slate-600 text-slate-300">
                  <Users className="h-3 w-3 mr-1" />
                  {mode.players}
                </Badge>
              </div>

              {/* Features */}
              <div className="space-y-1">
                {mode.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-slate-300">
                    <div className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-purple-400 to-pink-400"></div>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <Button
                onClick={() => !mode.isLocked && onSelectMode(mode.id)}
                disabled={mode.isLocked || userBalance < mode.entryFee}
                className={`w-full bg-gradient-to-r ${mode.gradient} hover:opacity-90 text-white font-bold py-3 shadow-lg transition-all duration-200 ${
                  mode.isLocked || userBalance < mode.entryFee ? 'opacity-50 cursor-not-allowed' : 'hover-scale'
                }`}
              >
                {mode.isLocked ? 'Locked' : userBalance < mode.entryFee ? 'Insufficient Balance' : 'Play Now'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Daily Challenges Section */}
      <Card className="border-0 bg-gradient-to-r from-indigo-600/10 to-purple-600/10 backdrop-blur-xl shadow-xl border border-indigo-500/30">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg">
                <Award className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Daily Challenge</h3>
                <p className="text-slate-300">Complete today's challenge for bonus rewards!</p>
              </div>
            </div>
            <Button className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-bold px-6">
              Start Challenge
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GameModeSelector;
