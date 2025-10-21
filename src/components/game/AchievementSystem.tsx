import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Trophy, 
  Star, 
  Crown, 
  Flame, 
  Target,
  Zap,
  Award,
  TrendingUp,
  Users,
  Lock
} from 'lucide-react';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  progress: number;
  target: number;
  reward: number;
  isUnlocked: boolean;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface AchievementSystemProps {
  userAchievements: Achievement[];
}

const AchievementSystem: React.FC<AchievementSystemProps> = ({ userAchievements }) => {
  const achievements: Achievement[] = [
    {
      id: 'first-win',
      name: 'First Victory',
      description: 'Win your first game',
      icon: <Trophy className="h-6 w-6" />,
      progress: 1,
      target: 1,
      reward: 50,
      isUnlocked: true,
      rarity: 'common'
    },
    {
      id: 'streak-master',
      name: 'Streak Master',
      description: 'Achieve a 10x streak',
      icon: <Flame className="h-6 w-6" />,
      progress: 7,
      target: 10,
      reward: 200,
      isUnlocked: false,
      rarity: 'rare'
    },
    {
      id: 'perfectionist',
      name: 'Perfectionist',
      description: 'Get 100% on a game',
      icon: <Star className="h-6 w-6" />,
      progress: 0,
      target: 1,
      reward: 500,
      isUnlocked: false,
      rarity: 'epic'
    },
    {
      id: 'speed-demon',
      name: 'Speed Demon',
      description: 'Answer 10 questions in under 5 seconds each',
      icon: <Zap className="h-6 w-6" />,
      progress: 3,
      target: 10,
      reward: 300,
      isUnlocked: false,
      rarity: 'rare'
    },
    {
      id: 'millionaire',
      name: 'Millionaire',
      description: 'Earn a total of 1,000,000 KES',
      icon: <Crown className="h-6 w-6" />,
      progress: 45000,
      target: 1000000,
      reward: 10000,
      isUnlocked: false,
      rarity: 'legendary'
    },
    {
      id: 'tournament-champion',
      name: 'Tournament Champion',
      description: 'Win 3 tournaments',
      icon: <Award className="h-6 w-6" />,
      progress: 1,
      target: 3,
      reward: 1000,
      isUnlocked: false,
      rarity: 'epic'
    },
    {
      id: 'social-butterfly',
      name: 'Social Butterfly',
      description: 'Play 50 multiplayer games',
      icon: <Users className="h-6 w-6" />,
      progress: 23,
      target: 50,
      reward: 400,
      isUnlocked: false,
      rarity: 'rare'
    },
    {
      id: 'unstoppable',
      name: 'Unstoppable',
      description: 'Win 10 games in a row',
      icon: <TrendingUp className="h-6 w-6" />,
      progress: 0,
      target: 10,
      reward: 1500,
      isUnlocked: false,
      rarity: 'legendary'
    }
  ];

  const getRarityConfig = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return { 
          gradient: 'from-gray-500 to-slate-500', 
          border: 'border-gray-500/30',
          bg: 'bg-gray-500/10',
          text: 'text-gray-400'
        };
      case 'rare':
        return { 
          gradient: 'from-blue-500 to-cyan-500', 
          border: 'border-blue-500/30',
          bg: 'bg-blue-500/10',
          text: 'text-blue-400'
        };
      case 'epic':
        return { 
          gradient: 'from-purple-500 to-pink-500', 
          border: 'border-purple-500/30',
          bg: 'bg-purple-500/10',
          text: 'text-purple-400'
        };
      case 'legendary':
        return { 
          gradient: 'from-yellow-500 to-orange-500', 
          border: 'border-yellow-500/30',
          bg: 'bg-yellow-500/10',
          text: 'text-yellow-400'
        };
      default:
        return { 
          gradient: 'from-gray-500 to-slate-500', 
          border: 'border-gray-500/30',
          bg: 'bg-gray-500/10',
          text: 'text-gray-400'
        };
    }
  };

  const unlockedCount = achievements.filter(a => a.isUnlocked).length;
  const totalRewardsEarned = achievements
    .filter(a => a.isUnlocked)
    .reduce((sum, a) => sum + a.reward, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-600/20 to-orange-600/20 rounded-full border border-yellow-500/30 mb-4">
          <Award className="h-5 w-5 text-yellow-400" />
          <span className="text-yellow-300 font-medium">Achievement Center</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold mb-2">
          <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
            Your Achievements
          </span>
        </h2>
        <p className="text-slate-300 text-lg">Complete challenges to earn exclusive rewards!</p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-0 bg-gradient-to-br from-blue-600/10 to-cyan-600/10 backdrop-blur-xl border border-blue-500/30">
          <CardContent className="p-6 text-center">
            <Trophy className="h-8 w-8 text-blue-400 mx-auto mb-2" />
            <div className="text-3xl font-bold text-white">{unlockedCount}/{achievements.length}</div>
            <div className="text-sm text-slate-300 mt-1">Achievements Unlocked</div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-purple-600/10 to-pink-600/10 backdrop-blur-xl border border-purple-500/30">
          <CardContent className="p-6 text-center">
            <Star className="h-8 w-8 text-purple-400 mx-auto mb-2" />
            <div className="text-3xl font-bold text-white">
              {Math.round((unlockedCount / achievements.length) * 100)}%
            </div>
            <div className="text-sm text-slate-300 mt-1">Completion Rate</div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-green-600/10 to-emerald-600/10 backdrop-blur-xl border border-green-500/30">
          <CardContent className="p-6 text-center">
            <Award className="h-8 w-8 text-green-400 mx-auto mb-2" />
            <div className="text-3xl font-bold text-white">{totalRewardsEarned} KES</div>
            <div className="text-sm text-slate-300 mt-1">Total Rewards Earned</div>
          </CardContent>
        </Card>
      </div>

      {/* Achievement Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {achievements.map((achievement) => {
          const rarityConfig = getRarityConfig(achievement.rarity);
          const progressPercentage = (achievement.progress / achievement.target) * 100;

          return (
            <Card 
              key={achievement.id}
              className={`group border-0 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl shadow-xl overflow-hidden relative hover-scale transition-all duration-300 ${
                achievement.isUnlocked ? '' : 'opacity-75'
              }`}
            >
              {/* Gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-r ${rarityConfig.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
              
              {/* Locked overlay */}
              {!achievement.isUnlocked && progressPercentage < 100 && (
                <div className="absolute top-2 right-2 z-10">
                  <div className="p-2 rounded-lg bg-black/50 backdrop-blur-sm">
                    <Lock className="h-4 w-4 text-slate-400" />
                  </div>
                </div>
              )}

              <CardHeader className="relative z-0">
                <div className="flex items-start justify-between">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${rarityConfig.gradient} shadow-lg ${
                    !achievement.isUnlocked && progressPercentage < 100 ? 'grayscale' : ''
                  }`}>
                    {achievement.icon}
                  </div>
                  <Badge className={`${rarityConfig.bg} ${rarityConfig.text} ${rarityConfig.border}`}>
                    {achievement.rarity.toUpperCase()}
                  </Badge>
                </div>
                
                <CardTitle className="text-lg font-bold text-white mt-3">
                  {achievement.name}
                  {achievement.isUnlocked && (
                    <Badge className="ml-2 bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                      ✓ Unlocked
                    </Badge>
                  )}
                </CardTitle>
                <p className="text-sm text-slate-300 mt-1">
                  {achievement.description}
                </p>
              </CardHeader>

              <CardContent className="relative z-0 space-y-3">
                {/* Progress */}
                {!achievement.isUnlocked && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Progress</span>
                      <span className="text-white font-semibold">
                        {achievement.progress}/{achievement.target}
                      </span>
                    </div>
                    <Progress value={progressPercentage} className="h-2" />
                  </div>
                )}

                {/* Reward */}
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-slate-700/50">
                  <span className="text-slate-400 text-sm">Reward</span>
                  <div className="flex items-center gap-1">
                    <Award className="h-4 w-4 text-yellow-400" />
                    <span className="font-bold text-yellow-400">{achievement.reward} KES</span>
                  </div>
                </div>

                {/* Status badge */}
                {progressPercentage >= 100 && !achievement.isUnlocked && (
                  <Badge className="w-full justify-center bg-yellow-500/20 text-yellow-400 border-yellow-500/30 py-2">
                    🎉 Ready to Claim!
                  </Badge>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Daily Challenges */}
      <Card className="border-0 bg-gradient-to-r from-orange-600/10 to-red-600/10 backdrop-blur-xl border border-orange-500/30">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 shadow-lg">
              <Target className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl text-white">Daily Challenges</CardTitle>
              <p className="text-slate-300 text-sm">Complete these for bonus rewards!</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-4 bg-white/5 rounded-lg border border-slate-700/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white font-semibold">Play 3 Games</span>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">+100 KES</Badge>
            </div>
            <Progress value={66} className="h-2" />
            <div className="text-xs text-slate-400 mt-1">2/3 completed</div>
          </div>

          <div className="p-4 bg-white/5 rounded-lg border border-slate-700/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white font-semibold">Win 5 Questions in a Row</span>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">+200 KES</Badge>
            </div>
            <Progress value={40} className="h-2" />
            <div className="text-xs text-slate-400 mt-1">2/5 completed</div>
          </div>

          <div className="p-4 bg-white/5 rounded-lg border border-slate-700/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white font-semibold">Use 3 Power-Ups</span>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">+150 KES</Badge>
            </div>
            <Progress value={0} className="h-2" />
            <div className="text-xs text-slate-400 mt-1">0/3 completed</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AchievementSystem;
