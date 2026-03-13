import { Play, Pause, RotateCcw, SkipForward, Shuffle } from "lucide-react";

interface VisualizerControlsProps {
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onStep: () => void;
  onRandomize?: () => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
  disabled?: boolean;
}

const VisualizerControls = ({
  isPlaying,
  onPlay,
  onPause,
  onReset,
  onStep,
  onRandomize,
  speed,
  onSpeedChange,
  disabled,
}: VisualizerControlsProps) => {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        onClick={isPlaying ? onPause : onPlay}
        disabled={disabled}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:brightness-110 transition-all disabled:opacity-50 neon-glow"
      >
        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        {isPlaying ? "Pause" : "Play"}
      </button>
      <button
        onClick={onStep}
        disabled={disabled || isPlaying}
        className="flex items-center gap-2 px-4 py-2 rounded-lg glass-card border-primary/30 text-primary font-medium text-sm hover:bg-primary/10 transition-all disabled:opacity-50"
      >
        <SkipForward className="w-4 h-4" /> Step
      </button>
      <button
        onClick={onReset}
        className="flex items-center gap-2 px-4 py-2 rounded-lg glass-card border-muted-foreground/30 text-muted-foreground font-medium text-sm hover:text-foreground hover:border-foreground/30 transition-all"
      >
        <RotateCcw className="w-4 h-4" /> Reset
      </button>
      {onRandomize && (
        <button
          onClick={onRandomize}
          className="flex items-center gap-2 px-4 py-2 rounded-lg glass-card border-secondary/30 text-secondary font-medium text-sm hover:bg-secondary/10 transition-all"
        >
          <Shuffle className="w-4 h-4" /> Random
        </button>
      )}
      <div className="flex items-center gap-2 ml-auto">
        <span className="text-xs text-muted-foreground">Speed:</span>
        <input
          type="range"
          min={50}
          max={2000}
          step={50}
          value={2050 - speed}
          onChange={(e) => onSpeedChange(2050 - Number(e.target.value))}
          className="w-24 accent-primary"
        />
        <span className="text-xs font-mono text-primary w-14">{speed}ms</span>
      </div>
    </div>
  );
};

export default VisualizerControls;
