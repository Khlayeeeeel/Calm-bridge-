
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Star, Play, Pause } from "lucide-react";

interface BreathingGameProps {
  onComplete: (points: number) => void;
  onBack: () => void;
}

const BreathingGame = ({ onComplete, onBack }: BreathingGameProps) => {
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [cycles, setCycles] = useState(0);
  const [timeLeft, setTimeLeft] = useState(4);
  const [isCompleted, setIsCompleted] = useState(false);

  const phaseDurations = {
    inhale: 4,
    hold: 4,
    exhale: 6,
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && !isCompleted) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Move to next phase
            setCurrentPhase(current => {
              if (current === 'inhale') return 'hold';
              if (current === 'hold') return 'exhale';
              // If exhale, complete cycle and start over
              setCycles(prev => {
                const newCycles = prev + 1;
                if (newCycles >= 5) {
                  setIsCompleted(true);
                  setIsActive(false);
                  onComplete(30);
                }
                return newCycles;
              });
              return 'inhale';
            });
            return phaseDurations[currentPhase === 'inhale' ? 'hold' : currentPhase === 'hold' ? 'exhale' : 'inhale'];
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, currentPhase, isCompleted, onComplete]);

  const startBreathing = () => {
    setIsActive(true);
    setCurrentPhase('inhale');
    setTimeLeft(phaseDurations.inhale);
    setCycles(0);
    setIsCompleted(false);
  };

  const stopBreathing = () => {
    setIsActive(false);
  };

  const resetGame = () => {
    setIsActive(false);
    setCurrentPhase('inhale');
    setTimeLeft(4);
    setCycles(0);
    setIsCompleted(false);
  };

  const getCircleScale = () => {
    if (!isActive) return 'scale-100';
    if (currentPhase === 'inhale') return 'scale-150';
    if (currentPhase === 'hold') return 'scale-150';
    return 'scale-100';
  };

  const getPhaseColor = () => {
    switch (currentPhase) {
      case 'inhale': return 'from-blue-400 to-blue-600';
      case 'hold': return 'from-purple-400 to-purple-600';
      case 'exhale': return 'from-green-400 to-green-600';
    }
  };

  const getInstructions = () => {
    switch (currentPhase) {
      case 'inhale': return 'Breathe in slowly...';
      case 'hold': return 'Hold your breath...';
      case 'exhale': return 'Breathe out gently...';
    }
  };

  if (isCompleted) {
    return (
      <Card className="text-center">
        <CardContent className="p-8">
          <div className="text-6xl mb-4">🌟</div>
          <h2 className="text-3xl font-bold text-blue-600 mb-4">Perfect breathing!</h2>
          <p className="text-xl mb-4">You completed 5 breathing cycles!</p>
          <div className="flex items-center justify-center mb-6">
            <Star className="w-6 h-6 text-yellow-500 mr-2" />
            <span className="text-lg font-semibold">+30 points!</span>
          </div>
          <div className="space-x-4">
            <Button onClick={resetGame} className="bg-blue-500 hover:bg-blue-600">
              Breathe Again
            </Button>
            <Button onClick={onBack} variant="outline">
              Back to Games
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button onClick={onBack} variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div className="text-lg font-semibold">Cycles: {cycles}/5</div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-center text-2xl">Calm Breathing 🌬️</CardTitle>
          <p className="text-center text-gray-600">Follow the circle and breathe peacefully</p>
        </CardHeader>
        <CardContent className="p-8">
          <div className="flex flex-col items-center space-y-8">
            {/* Breathing circle */}
            <div className="relative flex items-center justify-center">
              <div 
                className={`w-48 h-48 rounded-full bg-gradient-to-br ${getPhaseColor()} transition-transform duration-1000 ease-in-out ${getCircleScale()} flex items-center justify-center`}
              >
                <div className="text-white text-center">
                  <div className="text-4xl font-bold">{timeLeft}</div>
                  <div className="text-sm">{isActive ? 'seconds' : 'ready'}</div>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="text-center">
              <p className="text-2xl font-semibold text-gray-700 mb-2">
                {isActive ? getInstructions() : 'Press start when ready'}
              </p>
              <p className="text-lg text-gray-500 capitalize">
                {isActive ? currentPhase : 'Get comfortable'}
              </p>
            </div>

            {/* Controls */}
            <div className="flex space-x-4">
              {!isActive ? (
                <Button 
                  onClick={startBreathing}
                  className="bg-blue-500 hover:bg-blue-600 text-lg px-8 py-3"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Start Breathing
                </Button>
              ) : (
                <Button 
                  onClick={stopBreathing}
                  variant="outline"
                  className="text-lg px-8 py-3"
                >
                  <Pause className="w-5 h-5 mr-2" />
                  Pause
                </Button>
              )}
            </div>

            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4 text-center">
                <p className="text-sm text-blue-700">
                  💡 <strong>Tip:</strong> Breathing exercises help you feel calm and relaxed. 
                  Take your time and breathe at your own pace.
                </p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BreathingGame;
