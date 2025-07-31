import { Card } from '@/components/ui/card';
import { Timer, Target } from 'lucide-react';

interface GameStatsProps {
  moves: number;
  time: number;
}

export const GameStats = ({ moves, time }: GameStatsProps) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex justify-center gap-4 mb-6">
      <Card className="px-6 py-4 bg-gradient-card border-0 shadow-lg">
        <div className="flex items-center gap-3">
          <Timer className="w-6 h-6 text-primary" />
          <div>
            <div className="text-sm text-muted-foreground">Time</div>
            <div className="text-2xl font-bold text-primary">
              {formatTime(time)}
            </div>
          </div>
        </div>
      </Card>

      <Card className="px-6 py-4 bg-gradient-card border-0 shadow-lg">
        <div className="flex items-center gap-3">
          <Target className="w-6 h-6 text-secondary" />
          <div>
            <div className="text-sm text-muted-foreground">Moves</div>
            <div className="text-2xl font-bold text-secondary">
              {moves}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};