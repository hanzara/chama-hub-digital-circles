import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Zap, 
  Clock, 
  Shield, 
  Target,
  Eye,
  Shuffle,
  Plus,
  Coins,
  ShoppingBag,
  Sparkles
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PowerUp {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  price: number;
  quantity: number;
  gradient: string;
  effect: string;
}

interface PowerUpShopProps {
  userBalance: number;
  ownedPowerUps: Record<string, number>;
  onPurchase: (powerUpId: string, quantity: number, cost: number) => void;
}

const PowerUpShop: React.FC<PowerUpShopProps> = ({ userBalance, ownedPowerUps, onPurchase }) => {
  const { toast } = useToast();
  const [selectedQuantities, setSelectedQuantities] = useState<Record<string, number>>({});

  const powerUps: PowerUp[] = [
    {
      id: '50-50',
      name: '50:50',
      description: 'Remove two incorrect answers',
      icon: <Shuffle className="h-5 w-5" />,
      price: 30,
      quantity: 1,
      gradient: 'from-blue-500 to-cyan-500',
      effect: 'Remove 2 wrong options'
    },
    {
      id: 'extra-time',
      name: 'Extra Time',
      description: 'Add 15 seconds to the timer',
      icon: <Clock className="h-5 w-5" />,
      price: 25,
      quantity: 1,
      gradient: 'from-purple-500 to-pink-500',
      effect: '+15 seconds'
    },
    {
      id: 'skip',
      name: 'Skip Question',
      description: 'Skip current question without penalty',
      icon: <Target className="h-5 w-5" />,
      price: 40,
      quantity: 1,
      gradient: 'from-orange-500 to-red-500',
      effect: 'No penalty skip'
    },
    {
      id: 'peek',
      name: 'Peek',
      description: 'See what most players chose',
      icon: <Eye className="h-5 w-5" />,
      price: 35,
      quantity: 1,
      gradient: 'from-green-500 to-emerald-500',
      effect: 'Audience help'
    },
    {
      id: 'shield',
      name: 'Safety Shield',
      description: 'Protect streak on wrong answer',
      icon: <Shield className="h-5 w-5" />,
      price: 50,
      quantity: 1,
      gradient: 'from-yellow-500 to-amber-500',
      effect: 'Save your streak'
    },
    {
      id: 'double-points',
      name: 'Double Points',
      description: 'Earn 2x points on next question',
      icon: <Sparkles className="h-5 w-5" />,
      price: 60,
      quantity: 1,
      gradient: 'from-indigo-500 to-purple-600',
      effect: '2x points boost'
    }
  ];

  const handleQuantityChange = (powerUpId: string, change: number) => {
    setSelectedQuantities(prev => ({
      ...prev,
      [powerUpId]: Math.max(1, (prev[powerUpId] || 1) + change)
    }));
  };

  const handlePurchase = (powerUp: PowerUp) => {
    const quantity = selectedQuantities[powerUp.id] || 1;
    const totalCost = powerUp.price * quantity;

    if (userBalance < totalCost) {
      toast({
        title: "Insufficient Balance",
        description: `You need KES ${totalCost} to purchase this power-up.`,
        variant: "destructive"
      });
      return;
    }

    onPurchase(powerUp.id, quantity, totalCost);
    toast({
      title: "Power-Up Purchased! 🎉",
      description: `You bought ${quantity}x ${powerUp.name}`,
    });
    setSelectedQuantities(prev => ({ ...prev, [powerUp.id]: 1 }));
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full border border-purple-500/30 mb-4">
          <ShoppingBag className="h-5 w-5 text-purple-400" />
          <span className="text-purple-300 font-medium">Power-Up Shop</span>
        </div>
        <h2 className="text-3xl font-bold mb-2">
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
            Boost Your Game
          </span>
        </h2>
        <p className="text-slate-300">Purchase power-ups to gain advantages in your games</p>
      </div>

      {/* Balance Display */}
      <Card className="border-0 bg-gradient-to-r from-green-600/10 to-emerald-600/10 backdrop-blur-xl border border-green-500/30">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/20 border border-green-500/30">
                <Coins className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <div className="text-sm text-slate-400">Available Balance</div>
                <div className="text-2xl font-bold text-green-400">KES {userBalance.toLocaleString()}</div>
              </div>
            </div>
            <Button variant="outline" className="bg-white/5 border-green-500/30 text-green-400 hover:bg-green-500/10">
              Add Funds
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Power-Ups Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {powerUps.map((powerUp) => {
          const quantity = selectedQuantities[powerUp.id] || 1;
          const totalCost = powerUp.price * quantity;
          const owned = ownedPowerUps[powerUp.id] || 0;

          return (
            <Card 
              key={powerUp.id}
              className="group border-0 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl shadow-xl overflow-hidden relative hover-scale transition-all duration-300"
            >
              {/* Gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-r ${powerUp.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
              
              <CardHeader className="relative z-0">
                <div className="flex items-start justify-between">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${powerUp.gradient} shadow-lg`}>
                    {powerUp.icon}
                  </div>
                  {owned > 0 && (
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                      Owned: {owned}
                    </Badge>
                  )}
                </div>
                
                <CardTitle className="text-lg font-bold text-white mt-3">
                  {powerUp.name}
                </CardTitle>
                <p className="text-sm text-slate-300 mt-1">
                  {powerUp.description}
                </p>
              </CardHeader>

              <CardContent className="relative z-0 space-y-4">
                {/* Effect badge */}
                <Badge variant="outline" className="bg-white/5 border-slate-600 text-slate-300">
                  <Zap className="h-3 w-3 mr-1" />
                  {powerUp.effect}
                </Badge>

                {/* Price */}
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-slate-700/50">
                  <span className="text-slate-400 text-sm">Price</span>
                  <div className="flex items-center gap-1">
                    <Coins className="h-4 w-4 text-yellow-400" />
                    <span className="font-bold text-white">{powerUp.price} KES</span>
                  </div>
                </div>

                {/* Quantity selector */}
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-slate-700/50">
                  <span className="text-slate-400 text-sm">Quantity</span>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleQuantityChange(powerUp.id, -1)}
                      disabled={quantity <= 1}
                      className="h-8 w-8 p-0 bg-white/5 border-slate-600"
                    >
                      -
                    </Button>
                    <span className="font-bold text-white min-w-[2rem] text-center">{quantity}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleQuantityChange(powerUp.id, 1)}
                      className="h-8 w-8 p-0 bg-white/5 border-slate-600"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Purchase button */}
                <Button
                  onClick={() => handlePurchase(powerUp)}
                  disabled={userBalance < totalCost}
                  className={`w-full bg-gradient-to-r ${powerUp.gradient} hover:opacity-90 text-white font-bold py-3 shadow-lg transition-all duration-200 ${
                    userBalance < totalCost ? 'opacity-50 cursor-not-allowed' : 'hover-scale'
                  }`}
                >
                  {userBalance < totalCost ? (
                    'Insufficient Balance'
                  ) : (
                    <>
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      Buy for {totalCost} KES
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Bundles Section */}
      <Card className="border-0 bg-gradient-to-r from-yellow-600/10 to-orange-600/10 backdrop-blur-xl border border-yellow-500/30">
        <CardContent className="p-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 shadow-lg">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Starter Bundle</h3>
                <p className="text-slate-300">Get 10 power-ups for the price of 7!</p>
              </div>
            </div>
            <Button className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold px-6">
              Buy Bundle - 210 KES
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PowerUpShop;
