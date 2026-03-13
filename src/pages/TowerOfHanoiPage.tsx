import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";

type Move = { from: number; to: number; disk: number };

function generateMoves(n: number, from: number, to: number, aux: number): Move[] {
  if (n === 0) return [];
  return [
    ...generateMoves(n - 1, from, aux, to),
    { from, to, disk: n },
    ...generateMoves(n - 1, aux, to, from),
  ];
}

const rodColors = ["hsl(175, 80%, 50%)", "hsl(260, 60%, 55%)", "hsl(320, 70%, 55%)"];
const diskColors = [
  "hsl(175, 80%, 45%)", "hsl(200, 70%, 50%)", "hsl(260, 60%, 50%)",
  "hsl(320, 70%, 50%)", "hsl(30, 90%, 50%)", "hsl(145, 70%, 45%)",
  "hsl(50, 90%, 50%)", "hsl(0, 70%, 55%)",
];

const TowerOfHanoiPage = () => {
  const [numDisks, setNumDisks] = useState(3);
  const [rods, setRods] = useState<number[][]>([[], [], []]);
  const [moves, setMoves] = useState<Move[]>([]);
  const [currentMove, setCurrentMove] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(500);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const reset = useCallback(() => {
    const initial = Array.from({ length: numDisks }, (_, i) => numDisks - i);
    setRods([initial, [], []]);
    setMoves(generateMoves(numDisks, 0, 2, 1));
    setCurrentMove(0);
    setIsPlaying(false);
  }, [numDisks]);

  useEffect(() => { reset(); }, [reset]);

  const stepForward = useCallback(() => {
    if (currentMove >= moves.length) { setIsPlaying(false); return; }
    const move = moves[currentMove];
    setRods((prev) => {
      const newRods = prev.map((r) => [...r]);
      const disk = newRods[move.from].pop()!;
      newRods[move.to].push(disk);
      return newRods;
    });
    setCurrentMove((s) => s + 1);
  }, [currentMove, moves]);

  useEffect(() => {
    if (isPlaying) intervalRef.current = setInterval(stepForward, speed);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isPlaying, stepForward, speed]);

  const maxWidth = 160;

  return (
    <div className="min-h-screen bg-background pt-20 pb-12">
      <div className="container mx-auto px-4">
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl md:text-5xl font-heading font-bold mb-2 text-gradient-cyan">
          Tower of Hanoi
        </motion.h1>
        <p className="text-muted-foreground mb-8">Classic recursive algorithm — move all disks from rod A to rod C</p>

        <div className="glass-card p-4 mb-6 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm text-muted-foreground">Disks:</label>
            <input type="number" min={1} max={8} value={numDisks} onChange={(e) => setNumDisks(Math.min(8, Math.max(1, Number(e.target.value))))} className="w-16 px-2 py-1.5 rounded-lg bg-muted text-foreground text-sm border border-border focus:border-primary outline-none font-mono" />
          </div>
          <button onClick={() => { if (currentMove >= moves.length) reset(); setIsPlaying(!isPlaying); }} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:brightness-110 neon-glow">
            {isPlaying ? "Pause" : "Play"}
          </button>
          <button onClick={stepForward} disabled={isPlaying || currentMove >= moves.length} className="px-4 py-2 rounded-lg glass-card border-primary/30 text-primary text-sm font-medium hover:bg-primary/10 disabled:opacity-50">Step</button>
          <button onClick={reset} className="px-4 py-2 rounded-lg glass-card border-muted-foreground/30 text-muted-foreground text-sm font-medium hover:text-foreground">Reset</button>
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-xs text-muted-foreground">Speed:</span>
            <input type="range" min={100} max={2000} step={50} value={2100 - speed} onChange={(e) => setSpeed(2100 - Number(e.target.value))} className="w-24 accent-primary" />
          </div>
        </div>

        <div className="glass-card p-8">
          <div className="flex justify-center gap-8 md:gap-16">
            {rods.map((rod, rodIdx) => (
              <div key={rodIdx} className="flex flex-col items-center">
                <span className="text-xs font-mono text-muted-foreground mb-2">{["A", "B", "C"][rodIdx]}</span>
                <div className="relative flex flex-col-reverse items-center" style={{ minHeight: `${numDisks * 28 + 20}px`, width: `${maxWidth + 20}px` }}>
                  {/* Rod */}
                  <div className="absolute bottom-0 w-1 rounded-t-full" style={{ height: `${numDisks * 28 + 16}px`, backgroundColor: `${rodColors[rodIdx]}40` }} />
                  {/* Base */}
                  <div className="absolute bottom-0 w-full h-1 rounded" style={{ backgroundColor: `${rodColors[rodIdx]}40` }} />
                  {/* Disks */}
                  {rod.map((disk, diskIdx) => {
                    const width = (disk / numDisks) * maxWidth;
                    return (
                      <motion.div
                        key={disk}
                        layout
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="rounded-md flex items-center justify-center text-xs font-mono font-bold relative z-10"
                        style={{
                          width: `${width}px`,
                          height: "24px",
                          backgroundColor: diskColors[(disk - 1) % diskColors.length],
                          color: "hsl(225, 25%, 6%)",
                          marginBottom: "2px",
                        }}
                      >
                        {disk}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-6">
            <p className="text-sm font-mono text-primary">
              Move {currentMove} / {moves.length}
              {currentMove > 0 && currentMove <= moves.length && ` — Moved disk ${moves[currentMove - 1].disk} from ${["A", "B", "C"][moves[currentMove - 1].from]} to ${["A", "B", "C"][moves[currentMove - 1].to]}`}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Minimum moves: 2^{numDisks} - 1 = {Math.pow(2, numDisks) - 1}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TowerOfHanoiPage;
