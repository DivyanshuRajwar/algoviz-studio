import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import VisualizerControls from "@/components/VisualizerControls";
import { ChevronDown } from "lucide-react";

type StepState = {
  array: number[];
  comparing: number[];
  swapping: number[];
  sorted: number[];
  description: string;
};

const algorithms = ["Bubble Sort", "Selection Sort", "Insertion Sort", "Quick Sort"] as const;
type Algorithm = (typeof algorithms)[number];

const theoryData: Record<Algorithm, { concept: string; time: string; space: string; stable: string }> = {
  "Bubble Sort": {
    concept: "Repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.",
    time: "O(n²) avg/worst, O(n) best",
    space: "O(1)",
    stable: "Yes",
  },
  "Selection Sort": {
    concept: "Finds the minimum element from the unsorted part and puts it at the beginning.",
    time: "O(n²) all cases",
    space: "O(1)",
    stable: "No",
  },
  "Insertion Sort": {
    concept: "Builds the sorted array one item at a time by inserting each element into its correct position.",
    time: "O(n²) avg/worst, O(n) best",
    space: "O(1)",
    stable: "Yes",
  },
  "Quick Sort": {
    concept: "Picks a pivot element and partitions the array around it, then recursively sorts the sub-arrays.",
    time: "O(n log n) avg, O(n²) worst",
    space: "O(log n)",
    stable: "No",
  },
};

function generateBubbleSortSteps(arr: number[]): StepState[] {
  const steps: StepState[] = [];
  const a = [...arr];
  const sorted: number[] = [];
  steps.push({ array: [...a], comparing: [], swapping: [], sorted: [], description: "Initial array" });

  for (let i = 0; i < a.length - 1; i++) {
    for (let j = 0; j < a.length - 1 - i; j++) {
      steps.push({ array: [...a], comparing: [j, j + 1], swapping: [], sorted: [...sorted], description: `Comparing ${a[j]} and ${a[j + 1]}` });
      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        steps.push({ array: [...a], comparing: [], swapping: [j, j + 1], sorted: [...sorted], description: `Swapped ${a[j + 1]} and ${a[j]}` });
      }
    }
    sorted.push(a.length - 1 - i);
    steps.push({ array: [...a], comparing: [], swapping: [], sorted: [...sorted], description: `Pass ${i + 1} complete` });
  }
  sorted.push(0);
  steps.push({ array: [...a], comparing: [], swapping: [], sorted: Array.from({ length: a.length }, (_, i) => i), description: "Array sorted!" });
  return steps;
}

function generateSelectionSortSteps(arr: number[]): StepState[] {
  const steps: StepState[] = [];
  const a = [...arr];
  const sorted: number[] = [];
  steps.push({ array: [...a], comparing: [], swapping: [], sorted: [], description: "Initial array" });

  for (let i = 0; i < a.length - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < a.length; j++) {
      steps.push({ array: [...a], comparing: [minIdx, j], swapping: [], sorted: [...sorted], description: `Comparing ${a[minIdx]} (min) with ${a[j]}` });
      if (a[j] < a[minIdx]) minIdx = j;
    }
    if (minIdx !== i) {
      [a[i], a[minIdx]] = [a[minIdx], a[i]];
      steps.push({ array: [...a], comparing: [], swapping: [i, minIdx], sorted: [...sorted], description: `Swapped ${a[minIdx]} and ${a[i]}` });
    }
    sorted.push(i);
  }
  sorted.push(a.length - 1);
  steps.push({ array: [...a], comparing: [], swapping: [], sorted: Array.from({ length: a.length }, (_, i) => i), description: "Array sorted!" });
  return steps;
}

function generateInsertionSortSteps(arr: number[]): StepState[] {
  const steps: StepState[] = [];
  const a = [...arr];
  steps.push({ array: [...a], comparing: [], swapping: [], sorted: [0], description: "Initial array (first element is sorted)" });

  for (let i = 1; i < a.length; i++) {
    let j = i;
    while (j > 0 && a[j - 1] > a[j]) {
      steps.push({ array: [...a], comparing: [j - 1, j], swapping: [], sorted: Array.from({ length: i }, (_, k) => k), description: `Comparing ${a[j - 1]} and ${a[j]}` });
      [a[j - 1], a[j]] = [a[j], a[j - 1]];
      steps.push({ array: [...a], comparing: [], swapping: [j - 1, j], sorted: Array.from({ length: i }, (_, k) => k), description: `Inserted ${a[j]} to correct position` });
      j--;
    }
    steps.push({ array: [...a], comparing: [], swapping: [], sorted: Array.from({ length: i + 1 }, (_, k) => k), description: `Element ${a[j]} placed correctly` });
  }
  steps.push({ array: [...a], comparing: [], swapping: [], sorted: Array.from({ length: a.length }, (_, i) => i), description: "Array sorted!" });
  return steps;
}

function generateQuickSortSteps(arr: number[]): StepState[] {
  const steps: StepState[] = [];
  const a = [...arr];
  const sorted: Set<number> = new Set();
  steps.push({ array: [...a], comparing: [], swapping: [], sorted: [], description: "Initial array" });

  function partition(low: number, high: number) {
    const pivot = a[high];
    steps.push({ array: [...a], comparing: [high], swapping: [], sorted: [...sorted], description: `Pivot: ${pivot}` });
    let i = low - 1;
    for (let j = low; j < high; j++) {
      steps.push({ array: [...a], comparing: [j, high], swapping: [], sorted: [...sorted], description: `Comparing ${a[j]} with pivot ${pivot}` });
      if (a[j] < pivot) {
        i++;
        if (i !== j) {
          [a[i], a[j]] = [a[j], a[i]];
          steps.push({ array: [...a], comparing: [], swapping: [i, j], sorted: [...sorted], description: `Swapped ${a[j]} and ${a[i]}` });
        }
      }
    }
    [a[i + 1], a[high]] = [a[high], a[i + 1]];
    if (i + 1 !== high) {
      steps.push({ array: [...a], comparing: [], swapping: [i + 1, high], sorted: [...sorted], description: `Placed pivot ${pivot} at position ${i + 1}` });
    }
    sorted.add(i + 1);
    return i + 1;
  }

  function quickSort(low: number, high: number) {
    if (low < high) {
      const pi = partition(low, high);
      quickSort(low, pi - 1);
      quickSort(pi + 1, high);
    } else if (low === high) {
      sorted.add(low);
    }
  }

  quickSort(0, a.length - 1);
  steps.push({ array: [...a], comparing: [], swapping: [], sorted: Array.from({ length: a.length }, (_, i) => i), description: "Array sorted!" });
  return steps;
}

const SortingPage = () => {
  const [showViz, setShowViz] = useState(false);
  const [selectedAlgo, setSelectedAlgo] = useState<Algorithm>("Bubble Sort");
  const [arraySize, setArraySize] = useState(8);
  const [inputArray, setInputArray] = useState<number[]>([]);
  const [steps, setSteps] = useState<StepState[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(500);
  const [history, setHistory] = useState<StepState[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const generateRandom = useCallback(() => {
    const arr = Array.from({ length: arraySize }, () => Math.floor(Math.random() * 99) + 1);
    setInputArray(arr);
    setSteps([]);
    setCurrentStep(0);
    setHistory([]);
    setIsPlaying(false);
  }, [arraySize]);

  useEffect(() => {
    generateRandom();
  }, [generateRandom]);

  const generateSteps = useCallback(() => {
    let s: StepState[];
    switch (selectedAlgo) {
      case "Bubble Sort": s = generateBubbleSortSteps(inputArray); break;
      case "Selection Sort": s = generateSelectionSortSteps(inputArray); break;
      case "Insertion Sort": s = generateInsertionSortSteps(inputArray); break;
      case "Quick Sort": s = generateQuickSortSteps(inputArray); break;
      default: s = [];
    }
    setSteps(s);
    setCurrentStep(0);
    setHistory([]);
  }, [selectedAlgo, inputArray]);

  useEffect(() => {
    if (inputArray.length > 0) generateSteps();
  }, [selectedAlgo, inputArray, generateSteps]);

  const step = useCallback(() => {
    if (currentStep < steps.length - 1) {
      setHistory((h) => [...h, steps[currentStep]]);
      setCurrentStep((s) => s + 1);
    } else {
      setIsPlaying(false);
    }
  }, [currentStep, steps]);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(step, speed);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isPlaying, step, speed]);

  const currentState = steps[currentStep];
  const maxVal = Math.max(...(inputArray.length ? inputArray : [1]));

  const getBoxClass = (idx: number) => {
    if (!currentState) return "viz-box-default";
    if (currentState.sorted.includes(idx)) return "viz-box-sorted";
    if (currentState.swapping.includes(idx)) return "viz-box-swap";
    if (currentState.comparing.includes(idx)) return "viz-box-compare";
    return "viz-box-default";
  };

  return (
    <div className="min-h-screen bg-background pt-20 pb-12">
      <div className="container mx-auto px-4">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-5xl font-heading font-bold mb-2 text-gradient-cyan"
        >
          Sorting Algorithms
        </motion.h1>
        <p className="text-muted-foreground mb-8">Watch sorting algorithms work step-by-step</p>

        {/* Theory Cards */}
        <AnimatePresence>
          {!showViz && (
            <motion.div
              initial={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
            >
              {algorithms.map((algo, i) => (
                <motion.div
                  key={algo}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card-hover p-6"
                >
                  <h3 className="font-heading font-semibold text-lg text-foreground mb-2">{algo}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{theoryData[algo].concept}</p>
                  <div className="flex flex-wrap gap-3 text-xs font-mono">
                    <span className="px-2 py-1 rounded bg-primary/10 text-primary">Time: {theoryData[algo].time}</span>
                    <span className="px-2 py-1 rounded bg-secondary/10 text-secondary">Space: {theoryData[algo].space}</span>
                    <span className="px-2 py-1 rounded bg-accent/10 text-accent">Stable: {theoryData[algo].stable}</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setShowViz(!showViz)}
          className="flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold mb-8 hover:brightness-110 transition-all neon-glow"
        >
          {showViz ? "Show Theory" : "Visualize"}
          <ChevronDown className={`w-4 h-4 transition-transform ${showViz ? "rotate-180" : ""}`} />
        </button>

        {/* Visualization */}
        <AnimatePresence>
          {showViz && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Config */}
              <div className="glass-card p-4 mb-6 flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-sm text-muted-foreground">Algorithm:</label>
                  <select
                    value={selectedAlgo}
                    onChange={(e) => setSelectedAlgo(e.target.value as Algorithm)}
                    className="px-3 py-1.5 rounded-lg bg-muted text-foreground text-sm border border-border focus:border-primary outline-none"
                  >
                    {algorithms.map((a) => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm text-muted-foreground">Size:</label>
                  <input
                    type="number"
                    min={3}
                    max={15}
                    value={arraySize}
                    onChange={(e) => setArraySize(Number(e.target.value))}
                    className="w-16 px-2 py-1.5 rounded-lg bg-muted text-foreground text-sm border border-border focus:border-primary outline-none font-mono"
                  />
                </div>
              </div>

              {/* Controls */}
              <div className="glass-card p-4 mb-6">
                <VisualizerControls
                  isPlaying={isPlaying}
                  onPlay={() => { if (currentStep >= steps.length - 1) { generateSteps(); } setIsPlaying(true); }}
                  onPause={() => setIsPlaying(false)}
                  onReset={() => { setCurrentStep(0); setHistory([]); setIsPlaying(false); }}
                  onStep={step}
                  onRandomize={generateRandom}
                  speed={speed}
                  onSpeedChange={setSpeed}
                  disabled={steps.length === 0}
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left - History */}
                <div className="glass-card p-4 lg:col-span-1 max-h-[500px] overflow-y-auto">
                  <h3 className="font-heading font-semibold text-sm text-muted-foreground mb-3 uppercase tracking-wider">History</h3>
                  <div className="space-y-2">
                    {history.map((h, i) => (
                      <div key={i} className="p-2 rounded-lg bg-muted/30 text-xs">
                        <div className="flex gap-1 mb-1">
                          {h.array.map((v, j) => (
                            <span
                              key={j}
                              className={`inline-flex items-center justify-center w-6 h-6 rounded text-[10px] font-mono ${
                                h.sorted.includes(j) ? "bg-sorted/20 text-sorted" :
                                h.swapping.includes(j) ? "bg-swap/20 text-swap" :
                                h.comparing.includes(j) ? "bg-compare/20 text-compare" :
                                "bg-primary/10 text-primary"
                              }`}
                            >
                              {v}
                            </span>
                          ))}
                        </div>
                        <p className="text-muted-foreground">{h.description}</p>
                      </div>
                    ))}
                    {history.length === 0 && <p className="text-xs text-muted-foreground">Steps will appear here...</p>}
                  </div>
                </div>

                {/* Right - Current State */}
                <div className="glass-card p-6 lg:col-span-2">
                  <h3 className="font-heading font-semibold text-sm text-muted-foreground mb-4 uppercase tracking-wider">Current State</h3>

                  {/* Bar visualization */}
                  <div className="flex items-end justify-center gap-2 mb-6 h-48">
                    {currentState?.array.map((val, idx) => (
                      <motion.div
                        key={idx}
                        layout
                        className={`rounded-t-md flex items-end justify-center pb-1 font-mono text-xs font-bold transition-colors duration-300 ${
                          currentState.sorted.includes(idx) ? "bg-sorted/80 text-sorted" :
                          currentState.swapping.includes(idx) ? "bg-swap/80 text-swap" :
                          currentState.comparing.includes(idx) ? "bg-compare/80 text-compare" :
                          "bg-primary/50 text-primary"
                        }`}
                        style={{
                          height: `${(val / maxVal) * 100}%`,
                          width: `${Math.max(100 / (arraySize * 2), 24)}px`,
                        }}
                        animate={{
                          y: currentState.comparing.includes(idx) ? -8 : 0,
                        }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      >
                        {val}
                      </motion.div>
                    ))}
                  </div>

                  {/* Box visualization */}
                  <div className="flex flex-wrap justify-center gap-2 mb-6">
                    {currentState?.array.map((val, idx) => (
                      <motion.div
                        key={idx}
                        className={getBoxClass(idx)}
                        animate={{
                          y: currentState.comparing.includes(idx) ? -10 : 0,
                          scale: currentState.swapping.includes(idx) ? 1.1 : 1,
                        }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      >
                        {val}
                      </motion.div>
                    ))}
                  </div>

                  {/* Description */}
                  <div className="text-center">
                    <p className="text-sm font-mono text-primary">{currentState?.description}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Step {currentStep + 1} / {steps.length}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SortingPage;
