
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Star } from "lucide-react";

interface MemoryGameProps {
  onComplete: (points: number) => void;
  onBack: () => void;
}

interface CardType {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const MemoryGame = ({ onComplete, onBack }: MemoryGameProps) => {
  const emojis = ['🌟', '🦋', '🌈', '🎈', '🧸', '🎨'];
  const [cards, setCards] = useState<CardType[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const gameCards: CardType[] = [];
    let id = 0;
    
    emojis.forEach(emoji => {
      for (let i = 0; i < 2; i++) {
        gameCards.push({
          id: id++,
          emoji,
          isFlipped: false,
          isMatched: false,
        });
      }
    });

    // Shuffle cards
    for (let i = gameCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [gameCards[i], gameCards[j]] = [gameCards[j], gameCards[i]];
    }

    setCards(gameCards);
    setFlippedCards([]);
    setMoves(0);
    setIsCompleted(false);
  };

  const handleCardClick = (cardId: number) => {
    if (flippedCards.length === 2) return;
    if (flippedCards.includes(cardId)) return;
    if (cards[cardId].isMatched) return;

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    setCards(prev => prev.map(card => 
      card.id === cardId ? { ...card, isFlipped: true } : card
    ));

    if (newFlippedCards.length === 2) {
      setMoves(prev => prev + 1);
      
      setTimeout(() => {
        const [firstCard, secondCard] = newFlippedCards;
        if (cards[firstCard].emoji === cards[secondCard].emoji) {
          // Match found
          setCards(prev => prev.map(card => 
            card.id === firstCard || card.id === secondCard 
              ? { ...card, isMatched: true }
              : card
          ));
        } else {
          // No match
          setCards(prev => prev.map(card => 
            card.id === firstCard || card.id === secondCard 
              ? { ...card, isFlipped: false }
              : card
          ));
        }
        setFlippedCards([]);
      }, 1000);
    }
  };

  useEffect(() => {
    const matchedCards = cards.filter(card => card.isMatched);
    if (matchedCards.length === cards.length && cards.length > 0) {
      setIsCompleted(true);
      const points = Math.max(50 - moves * 2, 10);
      setTimeout(() => onComplete(points), 1000);
    }
  }, [cards, moves, onComplete]);

  if (isCompleted) {
    return (
      <Card className="text-center">
        <CardContent className="p-8">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold text-green-600 mb-4">Wonderful job!</h2>
          <p className="text-xl mb-4">You completed the game in {moves} moves!</p>
          <div className="flex items-center justify-center mb-6">
            <Star className="w-6 h-6 text-yellow-500 mr-2" />
            <span className="text-lg font-semibold">+{Math.max(50 - moves * 2, 10)} points!</span>
          </div>
          <div className="space-x-4">
            <Button onClick={initializeGame} className="bg-blue-500 hover:bg-blue-600">
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button onClick={onBack} variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div className="text-lg font-semibold">Moves: {moves}</div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-center text-2xl">Memory Match Game 🧠</CardTitle>
          <p className="text-center text-gray-600">Find all the matching pairs!</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4 max-w-md mx-auto">
            {cards.map((card) => (
              <div
                key={card.id}
                className={`aspect-square flex items-center justify-center text-4xl cursor-pointer rounded-lg border-2 transition-all duration-300 ${
                  card.isFlipped || card.isMatched
                    ? 'bg-white border-blue-300'
                    : 'bg-blue-100 border-blue-200 hover:bg-blue-200'
                }`}
                onClick={() => handleCardClick(card.id)}
              >
                {card.isFlipped || card.isMatched ? card.emoji : '?'}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MemoryGame;
