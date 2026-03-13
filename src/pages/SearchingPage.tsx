import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import VisualizerControls from "@/components/VisualizerControls";
import { ChevronDown, AlertTriangle } from "lucide-react";

type SearchStep = {
  array: number[];
  current: number;
  left?: number;
  right?: number;
  mid?: number;
  found: boolean;
  done: boolean;
  description: string;
  eliminated: number[];
};

const SearchingPage = () => {
  const [showViz, setShowViz] = useState(false);
  const [arraySize, setArraySize] = useState(8);
  const [inputArray, setInputArray] = useState<number[]>([]);
  const [target, setTarget] = useState(0);
  const [algorithm, setAlgorithm] = useState<"Linear Search" | "Binary Search">("Linear Search");
  const [steps, setSteps] = useState<SearchStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(500);
  const [showModal, setShowModal] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const generateRandom = useCallback(() => {
    const arr = Array.from({ length: arraySize }, () => Math.floor(Math.random() * 99) + 1);
    setInputArray(arr);
    setTarget(arr[Math.floor(Math.random() * arr.length)]);
    setSteps([]);
    setCurrentStep(0);
    setIsPlaying(false);
  }, [arraySize]);

  useEffect(() => { generateRandom(); }, [generateRandom]);

  const isSorted = (arr: number[]) => arr.every((v, i) => i === 0 || arr[i - 1] <= v);

  const generateLinearSteps = useCallback((arr: number[], t: number): SearchStep[] => {
    const steps: SearchStep[] = [];
    steps.push({ array: arr, current: -1, found: false, done: false, description: `Searching for ${t}`, eliminated: [] });
    for (let i = 0; i < arr.length; i++) {
      const isFound = arr[i] === t;
      steps.push({
        array: arr, current: i, found: isFound, done: isFound,
        description: isFound ? `Found ${t} at index ${i}!` : `Checking index ${i}: ${arr[i]} ≠ ${t}`,
        eliminated: [],
      });
      if (isFound) return steps;
    }
    steps.push({ array: arr, current: -1, found: false, done: true, description: `${t} not found in array`, eliminated: [] });
    return steps;
  }, []);

  const generateBinarySteps = useCallback((arr: number[], t: number): SearchStep[] => {
    const steps: SearchStep[] = [];
    const sorted = [...arr].sort((a, b) => a - b);
    let left = 0, right = sorted.length - 1;
    const eliminated: number[] = [];
    steps.push({ array: sorted, current: -1, left, right, found: false, done: false, description: `Binary search for ${t}`, eliminated: [] });

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      steps.push({ array: sorted, current: mid, left, right, mid, found: false, done: false, description: `Mid = ${mid}, value = ${sorted[mid]}`, eliminated: [...eliminated] });
      if (sorted[mid] === t) {
        steps.push({ array: sorted, current: mid, left, right, mid, found: true, done: true, description: `Found ${t} at index ${mid}!`, eliminated: [...eliminated] });
        return steps;
      }
      if (sorted[mid] < t) {
        for (let i = left; i <= mid; i++) eliminated.push(i);
        left = mid + 1;
        steps.push({ array: sorted, current: -1, left, right, found: false, done: false, description: `${sorted[mid]} < ${t}, search right half`, eliminated: [...eliminated] });
      } else {
        for (let i = mid; i <= right; i++) eliminated.push(i);
        right = mid - 1;
        steps.push({ array: sorted, current: -1, left, right, found: false, done: false, description: `${sorted[mid]} > ${t}, search left half`, eliminated: [...eliminated] });
      }
    }
    steps.push({ array: sorted, current: -1, found: false, done: true, description: `${t} not found`, eliminated: [...eliminated] });
    return steps;
  }, []);

  const startVisualization = useCallback(() => {
    if (algorithm === "Binary Search" && !isSorted(inputArray)) {
      setShowModal(true);
      return;
    }
    const s = algorithm === "Linear Search" ? generateLinearSteps(inputArray, target) : generateBinarySteps(inputArray, target);
    setSteps(s);
    setCurrentStep(0);
  }, [algorithm, inputArray, target, generateLinearSteps, generateBinarySteps]);

  useEffect(() => { startVisualization(); }, [startVisualization]);

  const stepForward = useCallback(() => {
    if (currentStep < steps.length - 1) setCurrentStep((s) => s + 1);
    else setIsPlaying(false);
  }, [currentStep, steps]);

  useEffect(() => {
    if (isPlaying) intervalRef.current = setInterval(stepForward, speed);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isPlaying, stepForward, speed]);

  const currentState = steps[currentStep];

  const getBoxClass = (idx: number) => {
    if (!currentState) return "viz-box-default";
    if (currentState.found && currentState.current === idx) return "viz-box-sorted";
    if (currentState.current === idx) return "viz-box-compare";
    if (currentState.eliminated.includes(idx)) return "viz-box border-muted-foreground/20 bg-muted/20 text-muted-foreground opacity-40";
    if (currentState.left !== undefined && currentState.right !== undefined && (idx < currentState.left || idx > currentState.right))
      return "viz-box border-muted-foreground/20 bg-muted/20 text-muted-foreground opacity-40";
    return "viz-box-default";
  };

  return (
    <div className="min-h-screen bg-background pt-20 pb-12">
      <div className="container mx-auto px-4">
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl md:text-5xl font-heading font-bold mb-2 text-gradient-cyan">
          Searching Algorithms
        </motion.h1>
        <p className="text-muted-foreground mb-8">Visualize how searching algorithms find elements</p>

        <AnimatePresence>
          {!showViz && (
            <motion.div initial={{ opacity: 1 }} exit={{ opacity: 0, height: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="glass-card-hover p-6">
                <h3 className="font-heading font-semibold text-lg mb-2">Linear Search</h3>
                <p className="text-sm text-muted-foreground mb-3">Sequentially checks each element until a match is found. Works on unsorted arrays.</p>
                <div className="flex gap-2 text-xs font-mono">
                  <span className="px-2 py-1 rounded bg-primary/10 text-primary">Time: O(n)</span>
                  <span className="px-2 py-1 rounded bg-secondary/10 text-secondary">Space: O(1)</span>
                </div>
              </div>
              <div className="glass-card-hover p-6">
                <h3 className="font-heading font-semibold text-lg mb-2">Binary Search</h3>
                <p className="text-sm text-muted-foreground mb-3">Divides the sorted array in half repeatedly to find the target element efficiently.</p>
                <div className="flex gap-2 text-xs font-mono">
                  <span className="px-2 py-1 rounded bg-primary/10 text-primary">Time: O(log n)</span>
                  <span className="px-2 py-1 rounded bg-secondary/10 text-secondary">Space: O(1)</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button onClick={() => setShowViz(!showViz)} className="flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold mb-8 hover:brightness-110 transition-all neon-glow">
          {showViz ? "Show Theory" : "Visualize"}
          <ChevronDown className={`w-4 h-4 transition-transform ${showViz ? "rotate-180" : ""}`} />
        </button>

        <AnimatePresence>
          {showViz && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="glass-card p-4 mb-6 flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-sm text-muted-foreground">Algorithm:</label>
                  <select value={algorithm} onChange={(e) => setAlgorithm(e.target.value as typeof algorithm)} className="px-3 py-1.5 rounded-lg bg-muted text-foreground text-sm border border-border focus:border-primary outline-none">
                    <option>Linear Search</option>
                    <option>Binary Search</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm text-muted-foreground">Target:</label>
                  <input type="number" value={target} onChange={(e) => setTarget(Number(e.target.value))} className="w-20 px-2 py-1.5 rounded-lg bg-muted text-foreground text-sm border border-border focus:border-primary outline-none font-mono" />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm text-muted-foreground">Size:</label>
                  <input type="number" min={3} max={15} value={arraySize} onChange={(e) => setArraySize(Number(e.target.value))} className="w-16 px-2 py-1.5 rounded-lg bg-muted text-foreground text-sm border border-border focus:border-primary outline-none font-mono" />
                </div>
              </div>

              <div className="glass-card p-4 mb-6">
                <VisualizerControls
                  isPlaying={isPlaying}
                  onPlay={() => { if (currentStep >= steps.length - 1) startVisualization(); setIsPlaying(true); }}
                  onPause={() => setIsPlaying(false)}
                  onReset={() => { setCurrentStep(0); setIsPlaying(false); }}
                  onStep={stepForward}
                  onRandomize={generateRandom}
                  speed={speed}
                  onSpeedChange={setSpeed}
                  disabled={steps.length === 0}
                />
              </div>

              <div className="glass-card p-6">
                <div className="flex flex-wrap justify-center gap-2 mb-6">
                  {currentState?.array.map((val, idx) => (
                    <motion.div
                      key={idx}
                      className={getBoxClass(idx)}
                      animate={{
                        y: currentState.current === idx ? -12 : 0,
                        scale: currentState.found && currentState.current === idx ? 1.2 : 1,
                      }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <div className="flex flex-col items-center">
                        <span className="text-[10px] text-muted-foreground mb-0.5">{idx}</span>
                        <span>{val}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="text-center">
                  <p className="text-sm font-mono text-primary">{currentState?.description}</p>
                  <p className="text-xs text-muted-foreground mt-2">Step {currentStep + 1} / {steps.length}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Binary Search Modal */}
        <AnimatePresence>
          {showModal && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
              <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="glass-card p-6 max-w-md mx-4 neon-border">
                <div className="flex items-center gap-2 text-neon-orange mb-4">
                  <AlertTriangle className="w-5 h-5" />
                  <h3 className="font-heading font-semibold">Array Not Sorted</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-6">Binary Search requires a sorted array. Choose an option:</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => { setInputArray([...inputArray].sort((a, b) => a - b)); setShowModal(false); }}
                    className="flex-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:brightness-110 neon-glow"
                  >Sort Array</button>
                  <button
                    onClick={() => { setAlgorithm("Linear Search"); setShowModal(false); }}
                    className="flex-1 px-4 py-2 rounded-lg glass-card border-secondary/30 text-secondary text-sm font-medium hover:bg-secondary/10"
                  >Use Linear</button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SearchingPage;
