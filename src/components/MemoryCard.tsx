import { Card } from '@/components/ui/card';

interface GameCard {
  id: number;
  symbol: string;
  isFlipped: boolean;
  isMatched: boolean;
}

interface MemoryCardProps {
  card: GameCard;
  onClick: () => void;
}

export const MemoryCard = ({ card, onClick }: MemoryCardProps) => {
  const { symbol, isFlipped, isMatched } = card;

  return (
    <div
      className="relative aspect-square cursor-pointer transform transition-all duration-300 hover:scale-105"
      onClick={onClick}
      style={{ perspective: '1000px' }}
    >
      <div
        className={`
          relative w-full h-full transition-transform duration-500 transform-style-preserve-3d
          ${isFlipped || isMatched ? 'rotate-y-180' : ''}
        `}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Card Back */}
        <Card
          className={`
            absolute inset-0 w-full h-full flex items-center justify-center
            bg-gradient-primary border-0 shadow-lg cursor-pointer
            backface-hidden
            ${isMatched ? 'animate-pulse-success' : ''}
          `}
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="text-white text-4xl font-bold">?</div>
        </Card>

        {/* Card Front */}
        <Card
          className={`
            absolute inset-0 w-full h-full flex items-center justify-center
            bg-gradient-card border-2 shadow-lg
            backface-hidden rotate-y-180
            ${isMatched ? 'border-success animate-match-bounce' : 'border-border'}
          `}
          style={{ 
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          <div className="text-5xl md:text-6xl select-none">
            {symbol}
          </div>
        </Card>
      </div>
    </div>
  );
};