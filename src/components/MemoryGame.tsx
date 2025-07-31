import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { MemoryCard } from './MemoryCard';
import { GameStats } from './GameStats';

// Card symbols/emojis for the game
const cardSymbols = ['🎮', '🎯', '🎪', '🎨', '🎭', '🎲', '🎸', '🎺'];

interface GameCard {
  id: number;
  symbol: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export const MemoryGame = () => {
  const [cards, setCards] = useState<GameCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [isGameActive, setIsGameActive] = useState(false);
  const [isGameComplete, setIsGameComplete] = useState(false);
  const { toast } = useToast();

  // Initialize the game
  const initializeGame = () => {
    const gameCards: GameCard[] = [];
    let id = 0;

    // Create pairs of cards
    cardSymbols.forEach(symbol => {
      gameCards.push(
        { id: id++, symbol, isFlipped: false, isMatched: false },
        { id: id++, symbol, isFlipped: false, isMatched: false }
      );
    });

    // Shuffle the cards
    const shuffledCards = gameCards.sort(() => Math.random() - 0.5);
    
    setCards(shuffledCards);
    setFlippedCards([]);
    setMoves(0);
    setTime(0);
    setIsGameActive(true);
    setIsGameComplete(false);
  };

  // Start the game on component mount
  useEffect(() => {
    initializeGame();
  }, []);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isGameActive && !isGameComplete) {
      interval = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isGameActive, isGameComplete]);

  // Handle card click
  const handleCardClick = (cardId: number) => {
    if (!isGameActive || isGameComplete) return;
    
    const card = cards.find(c => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched || flippedCards.length >= 2) return;

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    // Update card state
    setCards(prevCards =>
      prevCards.map(c =>
        c.id === cardId ? { ...c, isFlipped: true } : c
      )
    );

    // Check for match when two cards are flipped
    if (newFlippedCards.length === 2) {
      setMoves(prevMoves => prevMoves + 1);
      
      const [firstCardId, secondCardId] = newFlippedCards;
      const firstCard = cards.find(c => c.id === firstCardId);
      const secondCard = cards.find(c => c.id === secondCardId);

      if (firstCard?.symbol === secondCard?.symbol) {
        // Match found!
        setTimeout(() => {
          setCards(prevCards =>
            prevCards.map(c =>
              c.id === firstCardId || c.id === secondCardId
                ? { ...c, isMatched: true }
                : c
            )
          );
          setFlippedCards([]);
          
          toast({
            title: "Match found! 🎉",
            description: "Great job!",
          });
        }, 500);
      } else {
        // No match - flip cards back
        setTimeout(() => {
          setCards(prevCards =>
            prevCards.map(c =>
              c.id === firstCardId || c.id === secondCardId
                ? { ...c, isFlipped: false }
                : c
            )
          );
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  // Check for game completion
  useEffect(() => {
    const allMatched = cards.length > 0 && cards.every(card => card.isMatched);
    if (allMatched && !isGameComplete) {
      setIsGameComplete(true);
      setIsGameActive(false);
      
      toast({
        title: "Congratulations! 🏆",
        description: `You completed the game in ${moves} moves and ${time} seconds!`,
      });
    }
  }, [cards, isGameComplete, moves, time, toast]);

  return (
    <div className="min-h-screen bg-gradient-bg p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4 animate-float">
            Memory Game
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground">
            Find all the matching pairs!
          </p>
        </div>

        {/* Game Stats */}
        <GameStats moves={moves} time={time} />

        {/* Game Board */}
        <Card className="p-6 mb-6 bg-gradient-card border-0 shadow-2xl">
          <div className="grid grid-cols-4 gap-3 md:gap-4 max-w-2xl mx-auto">
            {cards.map((card) => (
              <MemoryCard
                key={card.id}
                card={card}
                onClick={() => handleCardClick(card.id)}
              />
            ))}
          </div>
        </Card>

        {/* Game Controls */}
        <div className="text-center">
          <Button
            onClick={initializeGame}
            size="lg"
            className="bg-gradient-primary hover:opacity-90 text-white font-semibold px-8 py-3 rounded-xl shadow-lg transform transition-all hover:scale-105"
          >
            {isGameComplete ? 'Play Again' : 'New Game'}
          </Button>
        </div>

        {/* Game Complete Animation */}
        {isGameComplete && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <Card className="p-8 text-center bg-gradient-card border-0 shadow-2xl animate-match-bounce">
              <div className="text-6xl mb-4">🏆</div>
              <h2 className="text-3xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
                Congratulations!
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                You completed the game in <span className="font-bold text-primary">{moves}</span> moves
                and <span className="font-bold text-primary">{time}</span> seconds!
              </p>
              <Button
                onClick={initializeGame}
                className="bg-gradient-primary hover:opacity-90 text-white font-semibold px-6 py-2 rounded-lg"
              >
                Play Again
              </Button>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};