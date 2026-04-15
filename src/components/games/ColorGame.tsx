
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Star } from "lucide-react";

interface ColorGameProps {
  onComplete: (points: number) => void;
  onBack: () => void;
}

interface ColorChallenge {
  targetColor: string;
  colorName: string;
  options: string[];
}

const ColorGame = ({ onComplete, onBack }: ColorGameProps) => {
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  const colors = [
    { name: 'Red', value: '#EF4444' },
    { name: 'Blue', value: '#3B82F6' },
    { name: 'Green', value: '#10B981' },
    { name: 'Yellow', value: '#F59E0B' },
    { name: 'Purple', value: '#8B5CF6' },
    { name: 'Pink', value: '#EC4899' },
    { name: 'Orange', value: '#F97316' },
    { name: 'Teal', value: '#14B8A6' },
  ];

  const [currentChallenge, setCurrentChallenge] = useState<ColorChallenge | null>(null);

  useEffect(() => {
    generateNewChallenge();
  }, []);

  const generateNewChallenge = () => {
    const targetColor = colors[Math.floor(Math.random() * colors.length)];
    const wrongColors = colors.filter(c => c.name !== targetColor.name);
    const shuffledWrong = wrongColors.sort(() => 0.5 - Math.random()).slice(0, 2);
    const allOptions = [targetColor.name, ...shuffledWrong.map(c => c.name)];
    
    // Shuffle the options
    const shuffledOptions = allOptions.sort(() => 0.5 - Math.random());

    setCurrentChallenge({
      targetColor: targetColor.value,
      colorName: targetColor.name,
      options: shuffledOptions,
    });
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const handleAnswerSelect = (answer: string) => {
    if (selectedAnswer || showResult) return;
    
    setSelectedAnswer(answer);
    setShowResult(true);

    const isCorrect = answer === currentChallenge?.colorName;
    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    setTimeout(() => {
      if (currentRound >= 4) {
        setIsCompleted(true);
        onComplete(score * 10 + (isCorrect ? 10 : 0));
      } else {
        setCurrentRound(prev => prev + 1);
        generateNewChallenge();
      }
    }, 1500);
  };

  const resetGame = () => {
    setCurrentRound(0);
    setScore(0);
    setIsCompleted(false);
    generateNewChallenge();
  };

  if (isCompleted) {
    return (
      <Card className="text-center">
        <CardContent className="p-8">
          <div className="text-6xl mb-4">🎨</div>
          <h2 className="text-3xl font-bold text-purple-600 mb-4">Colorful success!</h2>
          <p className="text-xl mb-4">You got {score} out of 5 colors right!</p>
          <div className="flex items-center justify-center mb-6">
            <Star className="w-6 h-6 text-yellow-500 mr-2" />
            <span className="text-lg font-semibold">+{score * 10} points!</span>
          </div>
          <div className="space-x-4">
            <Button onClick={resetGame} className="bg-purple-500 hover:bg-purple-600">
              Play Again
            </Button>
            <Button onClick={onBack} variant="outline">
              Back to Games
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!currentChallenge) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button onClick={onBack} variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div className="text-lg font-semibold">Round {currentRound + 1}/5 | Score: {score}</div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-center text-2xl">Color Fun Game 🎨</CardTitle>
          <p className="text-center text-gray-600">What color is this?</p>
        </CardHeader>
        <CardContent className="p-8">
          <div className="flex flex-col items-center space-y-8">
            {/* Color display */}
            <div 
              className="w-48 h-48 rounded-3xl shadow-lg border-4 border-white"
              style={{ backgroundColor: currentChallenge.targetColor }}
            ></div>

            {/* Question */}
            <h3 className="text-2xl font-semibold text-gray-700">
              What color is this?
            </h3>

            {/* Answer options */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-md">
              {currentChallenge.options.map((option) => {
                let buttonClass = "text-lg py-4 px-6 h-auto";
                
                if (showResult && selectedAnswer) {
                  if (option === currentChallenge.colorName) {
                    buttonClass += " bg-green-500 hover:bg-green-500 text-white";
                  } else if (option === selectedAnswer && option !== currentChallenge.colorName) {
                    buttonClass += " bg-red-500 hover:bg-red-500 text-white";
                  } else {
                    buttonClass += " opacity-50";
                  }
                }

                return (
                  <Button
                    key={option}
                    onClick={() => handleAnswerSelect(option)}
                    disabled={showResult}
                    className={buttonClass}
                    variant={showResult ? "default" : "outline"}
                  >
                    {option}
                  </Button>
                );
              })}
            </div>

            {showResult && (
              <div className="text-center">
                {selectedAnswer === currentChallenge.colorName ? (
                  <p className="text-2xl text-green-600 font-semibold">🎉 Correct!</p>
                ) : (
                  <p className="text-2xl text-orange-600 font-semibold">
                    Good try! It was {currentChallenge.colorName}
                  </p>
                )}
              </div>
            )}

            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="p-4 text-center">
                <p className="text-sm text-purple-700">
                  🌈 <strong>Fun fact:</strong> Colors can help us express our feelings and make art beautiful!
                </p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ColorGame;
