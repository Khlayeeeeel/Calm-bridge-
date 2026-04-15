
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Star, Trophy, Heart } from "lucide-react";
import MemoryGame from "@/components/games/MemoryGame";
import BreathingGame from "@/components/games/BreathingGame";
import ColorGame from "@/components/games/ColorGame";

type GameType = 'menu' | 'memory' | 'breathing' | 'colors';

const MiniGames = () => {
  const [currentGame, setCurrentGame] = useState<GameType>('menu');
  const [points, setPoints] = useState(150);

  const games = [
    {
      id: 'memory' as GameType,
      title: 'Memory Match',
      description: 'Find matching pairs of cards',
      icon: Brain,
      color: 'bg-gradient-to-br from-purple-400 to-purple-600',
      difficulty: 'Easy',
    },
    {
      id: 'breathing' as GameType,
      title: 'Calm Breathing',
      description: 'Follow the circle to breathe calmly',
      icon: Heart,
      color: 'bg-gradient-to-br from-blue-400 to-blue-600',
      difficulty: 'Relaxing',
    },
    {
      id: 'colors' as GameType,
      title: 'Color Fun',
      description: 'Match colors and learn new ones',
      icon: Star,
      color: 'bg-gradient-to-br from-pink-400 to-pink-600',
      difficulty: 'Fun',
    },
  ];

  const renderGame = () => {
    switch (currentGame) {
      case 'memory':
        return <MemoryGame onComplete={(earnedPoints) => setPoints(prev => prev + earnedPoints)} onBack={() => setCurrentGame('menu')} />;
      case 'breathing':
        return <BreathingGame onComplete={(earnedPoints) => setPoints(prev => prev + earnedPoints)} onBack={() => setCurrentGame('menu')} />;
      case 'colors':
        return <ColorGame onComplete={(earnedPoints) => setPoints(prev => prev + earnedPoints)} onBack={() => setCurrentGame('menu')} />;
      default:
        return (
          <div className="space-y-6">
            {/* Points display */}
            <Card className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white">
              <CardContent className="p-4 flex items-center justify-center">
                <Trophy className="w-8 h-8 mr-3" />
                <div className="text-center">
                  <p className="text-lg font-semibold">Your Points</p>
                  <p className="text-3xl font-bold">{points}</p>
                </div>
              </CardContent>
            </Card>

            <div className="text-center">
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-2">
                Fun Games! 🎮
              </h2>
              <p className="text-xl text-gray-600">Choose a game to play and earn points!</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {games.map((game) => {
                const IconComponent = game.icon;
                return (
                  <Card 
                    key={game.id}
                    className="cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl"
                    onClick={() => setCurrentGame(game.id)}
                  >
                    <CardContent className="p-6 text-center">
                      <div className={`w-20 h-20 rounded-full ${game.color} flex items-center justify-center mx-auto mb-4`}>
                        <IconComponent className="w-10 h-10 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{game.title}</h3>
                      <p className="text-gray-600 mb-3">{game.description}</p>
                      <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                        {game.difficulty}
                      </span>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <Card className="bg-gradient-to-r from-green-100 to-blue-100">
              <CardContent className="p-4 text-center">
                <h3 className="text-lg font-semibold mb-2">Great job playing games! 🌟</h3>
                <p className="text-gray-600">Remember: It's okay to take breaks whenever you need them.</p>
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {renderGame()}
    </div>
  );
};

export default MiniGames;
