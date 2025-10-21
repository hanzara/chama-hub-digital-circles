import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  Star, 
  CheckCircle, 
  XCircle, 
  Trophy,
  Flame,
  Zap,
  Heart,
  Target,
  Award,
  Sparkles,
  TrendingUp
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  points: number;
}

interface GameState {
  score: number;
  streak: number;
  lives: number;
  questionIndex: number;
  timeLeft: number;
  powerUps: Record<string, number>;
  usedPowerUps: string[];
}

interface EnhancedGameplayProps {
  questions: Question[];
  mode: string;
  powerUps: Record<string, number>;
  onGameEnd: (finalScore: number, earnings: number) => void;
}

const EnhancedGameplay: React.FC<EnhancedGameplayProps> = ({ 
  questions, 
  mode, 
  powerUps,
  onGameEnd 
}) => {
  const { toast } = useToast();
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    streak: 0,
    lives: mode === 'survival' ? 1 : 3,
    questionIndex: 0,
    timeLeft: 30,
    powerUps: powerUps,
    usedPowerUps: []
  });
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [eliminatedOptions, setEliminatedOptions] = useState<number[]>([]);
  const [isShieldActive, setIsShieldActive] = useState(false);
  const [pointsMultiplier, setPointsMultiplier] = useState(1);

  const currentQuestion = questions[gameState.questionIndex];

  useEffect(() => {
    if (gameState.timeLeft > 0 && !isAnswered) {
      const timer = setTimeout(() => {
        setGameState(prev => ({ ...prev, timeLeft: prev.timeLeft - 1 }));
      }, 1000);
      return () => clearTimeout(timer);
    } else if (gameState.timeLeft === 0 && !isAnswered) {
      handleTimeUp();
    }
  }, [gameState.timeLeft, isAnswered]);

  const handleTimeUp = () => {
    setIsAnswered(true);
    setShowExplanation(true);
    
    if (!isShieldActive) {
      const newLives = gameState.lives - 1;
      setGameState(prev => ({ ...prev, lives: newLives, streak: 0 }));
      
      if (newLives === 0) {
        setTimeout(() => endGame(), 2000);
      }
    } else {
      setIsShieldActive(false);
      toast({
        title: "Shield Protected You! 🛡️",
        description: "Your shield saved you from losing a life!",
      });
    }
    
    toast({
      title: "Time's Up! ⏰",
      description: "Too slow! Moving to next question.",
      variant: "destructive"
    });

    setTimeout(nextQuestion, 3000);
  };

  const usePowerUp = (powerUpId: string) => {
    if (gameState.powerUps[powerUpId] <= 0 || gameState.usedPowerUps.includes(powerUpId)) {
      toast({
        title: "Power-Up Not Available",
        description: "You don't have this power-up or already used it.",
        variant: "destructive"
      });
      return;
    }

    setGameState(prev => ({
      ...prev,
      powerUps: { ...prev.powerUps, [powerUpId]: prev.powerUps[powerUpId] - 1 },
      usedPowerUps: [...prev.usedPowerUps, powerUpId]
    }));

    switch (powerUpId) {
      case '50-50':
        const correctAnswer = currentQuestion.correctAnswer;
        const wrongAnswers = currentQuestion.options
          .map((_, idx) => idx)
          .filter(idx => idx !== correctAnswer);
        const toEliminate = wrongAnswers.sort(() => 0.5 - Math.random()).slice(0, 2);
        setEliminatedOptions(toEliminate);
        toast({
          title: "50:50 Activated! 🎯",
          description: "Two wrong answers removed!",
        });
        break;

      case 'extra-time':
        setGameState(prev => ({ ...prev, timeLeft: prev.timeLeft + 15 }));
        toast({
          title: "Extra Time! ⏱️",
          description: "+15 seconds added to the clock!",
        });
        break;

      case 'skip':
        nextQuestion();
        toast({
          title: "Question Skipped! ⏭️",
          description: "No penalties applied!",
        });
        break;

      case 'shield':
        setIsShieldActive(true);
        toast({
          title: "Shield Activated! 🛡️",
          description: "Your next mistake won't count!",
        });
        break;

      case 'double-points':
        setPointsMultiplier(2);
        toast({
          title: "Double Points! ⚡",
          description: "Next question worth 2x points!",
        });
        break;
    }
  };

  const handleAnswer = (answerIndex: number) => {
    if (isAnswered || eliminatedOptions.includes(answerIndex)) return;

    setSelectedAnswer(answerIndex);
    setIsAnswered(true);
    setShowExplanation(true);

    const isCorrect = answerIndex === currentQuestion.correctAnswer;
    let pointsEarned = 0;

    if (isCorrect) {
      const streakBonus = Math.floor(gameState.streak / 3) * 50;
      pointsEarned = (currentQuestion.points + streakBonus) * pointsMultiplier;
      
      setGameState(prev => ({
        ...prev,
        score: prev.score + pointsEarned,
        streak: prev.streak + 1
      }));

      toast({
        title: `Correct! 🎉 ${pointsMultiplier > 1 ? 'DOUBLE POINTS!' : ''}`,
        description: `+${pointsEarned} points! Streak: ${gameState.streak + 1}`,
      });
    } else {
      if (!isShieldActive) {
        const newLives = gameState.lives - 1;
        setGameState(prev => ({ ...prev, lives: newLives, streak: 0 }));
        
        if (newLives === 0) {
          setTimeout(() => endGame(), 2000);
          return;
        }
      } else {
        setIsShieldActive(false);
        toast({
          title: "Shield Protected You! 🛡️",
          description: "Your shield saved you from losing a life!",
        });
      }

      toast({
        title: "Incorrect ❌",
        description: currentQuestion.explanation,
        variant: "destructive"
      });
    }

    setPointsMultiplier(1);
    setTimeout(nextQuestion, 3000);
  };

  const nextQuestion = () => {
    if (gameState.questionIndex + 1 >= questions.length) {
      endGame();
      return;
    }

    setGameState(prev => ({
      ...prev,
      questionIndex: prev.questionIndex + 1,
      timeLeft: 30,
      usedPowerUps: []
    }));
    setSelectedAnswer(null);
    setIsAnswered(false);
    setShowExplanation(false);
    setEliminatedOptions([]);
  };

  const endGame = () => {
    const earnings = Math.floor(gameState.score * 0.1);
    onGameEnd(gameState.score, earnings);
  };

  const getStreakBonus = () => {
    if (gameState.streak >= 10) return { text: "🔥 LEGENDARY", color: "text-purple-400" };
    if (gameState.streak >= 7) return { text: "👑 MASTER", color: "text-yellow-400" };
    if (gameState.streak >= 5) return { text: "⚡ ON FIRE", color: "text-orange-400" };
    if (gameState.streak >= 3) return { text: "🎯 HOT STREAK", color: "text-red-400" };
    return { text: "Building...", color: "text-slate-400" };
  };

  const streakInfo = getStreakBonus();
  const progress = ((gameState.questionIndex) / questions.length) * 100;

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Top Stats Bar */}
      <Card className="border-0 bg-gradient-to-r from-slate-800/80 to-slate-900/80 backdrop-blur-xl shadow-xl">
        <CardContent className="p-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            {/* Score */}
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-blue-500/20 border border-blue-500/30">
                <Star className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <div className="text-xs text-slate-400">Score</div>
                <div className="text-xl font-bold text-white">{gameState.score}</div>
              </div>
            </div>

            {/* Streak */}
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-lg ${gameState.streak >= 3 ? 'bg-orange-500/20 border border-orange-500/30' : 'bg-slate-700/50 border border-slate-600/30'}`}>
                <Flame className={`h-5 w-5 ${gameState.streak >= 3 ? 'text-orange-400' : 'text-slate-400'}`} />
              </div>
              <div>
                <div className="text-xs text-slate-400">Streak</div>
                <div className={`text-xl font-bold ${streakInfo.color}`}>{gameState.streak}x</div>
              </div>
            </div>

            {/* Lives */}
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Heart 
                    key={i} 
                    className={`h-6 w-6 ${i < gameState.lives ? 'text-red-500 fill-red-500' : 'text-slate-600'}`}
                  />
                ))}
              </div>
            </div>

            {/* Time */}
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-lg ${gameState.timeLeft <= 10 ? 'bg-red-500/20 border border-red-500/30 animate-pulse' : 'bg-purple-500/20 border border-purple-500/30'}`}>
                <Clock className={`h-5 w-5 ${gameState.timeLeft <= 10 ? 'text-red-400' : 'text-purple-400'}`} />
              </div>
              <div>
                <div className="text-xs text-slate-400">Time</div>
                <div className={`text-xl font-bold ${gameState.timeLeft <= 10 ? 'text-red-400' : 'text-white'}`}>{gameState.timeLeft}s</div>
              </div>
            </div>
          </div>

          <Progress value={progress} className="mt-4" />
          <div className="flex justify-between text-xs text-slate-400 mt-1">
            <span>Question {gameState.questionIndex + 1} of {questions.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
        </CardContent>
      </Card>

      {/* Power-Ups Bar */}
      <Card className="border-0 bg-gradient-to-r from-purple-800/30 to-pink-800/30 backdrop-blur-xl shadow-xl border border-purple-500/30">
        <CardContent className="p-3">
          <div className="flex items-center gap-2 overflow-x-auto">
            <Sparkles className="h-5 w-5 text-purple-400 flex-shrink-0" />
            <span className="text-sm text-slate-300 flex-shrink-0">Power-Ups:</span>
            {Object.entries(gameState.powerUps).map(([id, count]) => (
              count > 0 && (
                <Button
                  key={id}
                  size="sm"
                  onClick={() => usePowerUp(id)}
                  disabled={gameState.usedPowerUps.includes(id)}
                  className="bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs px-3 py-1 flex-shrink-0"
                >
                  {id.replace('-', ' ')} ({count})
                </Button>
              )
            ))}
            {isShieldActive && (
              <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 flex-shrink-0">
                🛡️ Shield Active
              </Badge>
            )}
            {pointsMultiplier > 1 && (
              <Badge className="bg-indigo-500/20 text-indigo-400 border-indigo-500/30 flex-shrink-0">
                ⚡ {pointsMultiplier}x Points
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Question Card */}
      <Card className="border-0 bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl shadow-2xl overflow-hidden">
        <CardHeader className="relative">
          <div className="absolute top-0 right-0 m-4">
            <Badge className={`${
              currentQuestion.difficulty === 'easy' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
              currentQuestion.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
              'bg-red-500/20 text-red-400 border-red-500/30'
            }`}>
              {currentQuestion.difficulty.toUpperCase()}
            </Badge>
          </div>
          
          <Badge variant="outline" className="bg-white/5 border-slate-600 text-slate-300 w-fit">
            {currentQuestion.category}
          </Badge>
          
          <CardTitle className="text-2xl font-bold text-white mt-4 leading-relaxed">
            {currentQuestion.question}
          </CardTitle>
          
          <p className="text-slate-400 mt-2">
            Worth {currentQuestion.points * pointsMultiplier} points
            {gameState.streak >= 3 && ` (+${Math.floor(gameState.streak / 3) * 50 * pointsMultiplier} streak bonus)`}
          </p>
        </CardHeader>

        <CardContent className="space-y-3">
          {currentQuestion.options.map((option, index) => {
            const isEliminated = eliminatedOptions.includes(index);
            const isSelected = selectedAnswer === index;
            const isCorrect = index === currentQuestion.correctAnswer;
            
            let buttonClasses = "w-full p-4 text-left border-2 transition-all duration-300 relative overflow-hidden group ";
            
            if (isEliminated) {
              buttonClasses += "opacity-30 line-through cursor-not-allowed border-slate-700 bg-slate-800/50";
            } else if (isAnswered) {
              if (isCorrect) {
                buttonClasses += "border-green-500 bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-white shadow-lg shadow-green-500/20";
              } else if (isSelected) {
                buttonClasses += "border-red-500 bg-gradient-to-r from-red-500/20 to-rose-500/20 text-white shadow-lg shadow-red-500/20";
              } else {
                buttonClasses += "border-slate-700 bg-slate-800/30 text-slate-500";
              }
            } else if (isSelected) {
              buttonClasses += "border-purple-500 bg-gradient-to-r from-purple-500/20 to-pink-500/20";
            } else {
              buttonClasses += "border-slate-700 hover:border-slate-600 hover:bg-slate-800/50 hover-scale";
            }

            return (
              <Button
                key={index}
                variant="outline"
                className={buttonClasses}
                onClick={() => handleAnswer(index)}
                disabled={isAnswered || isEliminated}
              >
                <div className="flex items-center justify-between w-full relative z-10">
                  <span className="text-base">{option}</span>
                  {isAnswered && (
                    <div>
                      {isCorrect && <CheckCircle className="h-6 w-6 text-green-400" />}
                      {isSelected && !isCorrect && <XCircle className="h-6 w-6 text-red-400" />}
                    </div>
                  )}
                </div>
                {!isEliminated && !isAnswered && (
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/10 to-pink-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                )}
              </Button>
            );
          })}

          {/* Explanation */}
          {showExplanation && (
            <div className={`mt-6 p-4 rounded-lg border-2 animate-fade-in ${
              selectedAnswer === currentQuestion.correctAnswer
                ? 'bg-gradient-to-r from-green-600/10 to-emerald-600/10 border-green-500/30'
                : 'bg-gradient-to-r from-red-600/10 to-rose-600/10 border-red-500/30'
            }`}>
              <div className="flex items-start gap-3">
                {selectedAnswer === currentQuestion.correctAnswer ? (
                  <CheckCircle className="h-6 w-6 text-green-400 flex-shrink-0 mt-1" />
                ) : (
                  <XCircle className="h-6 w-6 text-red-400 flex-shrink-0 mt-1" />
                )}
                <div>
                  <p className="font-semibold text-white mb-1">
                    {selectedAnswer === currentQuestion.correctAnswer ? 'Correct!' : 'Incorrect'}
                  </p>
                  <p className="text-slate-300 text-sm">{currentQuestion.explanation}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedGameplay;
