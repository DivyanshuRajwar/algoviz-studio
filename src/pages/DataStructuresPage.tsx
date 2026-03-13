import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, Eye, ArrowRight } from "lucide-react";

const DataStructuresPage = () => {
  const [activeDS, setActiveDS] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background pt-20 pb-12">
      <div className="container mx-auto px-4">
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl md:text-5xl font-heading font-bold mb-2 text-gradient-cyan">
          Data Structures
        </motion.h1>
        <p className="text-muted-foreground mb-8">Interactive visualization of fundamental data structures</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {["Array", "Stack", "Queue", "Linked List", "Binary Tree", "Hash Map"].map((ds, i) => (
            <motion.button
              key={ds}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setActiveDS(activeDS === ds ? null : ds)}
              className={`glass-card-hover p-6 text-left transition-all ${activeDS === ds ? "neon-border" : ""}`}
            >
              <h3 className="font-heading font-semibold text-foreground mb-1">{ds}</h3>
              <p className="text-xs text-muted-foreground">Click to visualize</p>
            </motion.button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeDS === "Array" && <ArrayViz key="array" />}
          {activeDS === "Stack" && <StackViz key="stack" />}
          {activeDS === "Queue" && <QueueViz key="queue" />}
          {activeDS === "Linked List" && <LinkedListViz key="ll" />}
          {activeDS === "Binary Tree" && <BSTViz key="bst" />}
          {activeDS === "Hash Map" && <HashMapViz key="hm" />}
        </AnimatePresence>
      </div>
    </div>
  );
};

function ArrayViz() {
  const [arr, setArr] = useState<number[]>([10, 20, 30, 40, 50]);
  const [input, setInput] = useState("");

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="glass-card p-6">
      <h3 className="font-heading font-semibold mb-4">Array Visualization</h3>
      <div className="flex flex-wrap gap-2 mb-4">
        {arr.map((val, i) => (
          <motion.div key={i} layout initial={{ scale: 0 }} animate={{ scale: 1 }} className="viz-box-default flex flex-col">
            <span className="text-[10px] text-muted-foreground">[{i}]</span>
            <span>{val}</span>
          </motion.div>
        ))}
      </div>
      <div className="flex gap-2">
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Value" className="w-20 px-2 py-1.5 rounded-lg bg-muted text-foreground text-sm border border-border focus:border-primary outline-none font-mono" />
        <button onClick={() => { if (input) { setArr([...arr, Number(input)]); setInput(""); } }} className="px-3 py-1.5 rounded-lg bg-primary/20 text-primary text-sm font-medium hover:bg-primary/30 transition-colors"><Plus className="w-4 h-4" /></button>
        <button onClick={() => setArr(arr.slice(0, -1))} className="px-3 py-1.5 rounded-lg bg-destructive/20 text-destructive text-sm font-medium hover:bg-destructive/30 transition-colors"><Minus className="w-4 h-4" /></button>
      </div>
    </motion.div>
  );
}

function StackViz() {
  const [stack, setStack] = useState<number[]>([30, 20, 10]);
  const [input, setInput] = useState("");
  const [message, setMessage] = useState("");

  const push = () => { if (input) { setStack([Number(input), ...stack]); setInput(""); setMessage(`Pushed ${input}`); } };
  const pop = () => { if (stack.length) { setMessage(`Popped ${stack[0]}`); setStack(stack.slice(1)); } };
  const peek = () => { if (stack.length) setMessage(`Top: ${stack[0]}`); };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="glass-card p-6">
      <h3 className="font-heading font-semibold mb-4">Stack (LIFO)</h3>
      <div className="flex gap-8">
        <div className="flex flex-col items-center gap-1 min-w-[80px]">
          <span className="text-xs text-muted-foreground mb-1">← TOP</span>
          {stack.map((val, i) => (
            <motion.div key={`${val}-${i}`} layout initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 30, opacity: 0 }} className={`viz-box w-20 ${i === 0 ? "viz-box-active" : "viz-box-default"}`}>
              {val}
            </motion.div>
          ))}
          {stack.length === 0 && <p className="text-xs text-muted-foreground">Empty</p>}
        </div>
        <div className="flex flex-col gap-2">
          <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Value" className="w-20 px-2 py-1.5 rounded-lg bg-muted text-foreground text-sm border border-border focus:border-primary outline-none font-mono" />
          <button onClick={push} className="px-3 py-1.5 rounded-lg bg-primary/20 text-primary text-sm font-medium hover:bg-primary/30">Push</button>
          <button onClick={pop} className="px-3 py-1.5 rounded-lg bg-swap/20 text-swap text-sm font-medium hover:bg-swap/30">Pop</button>
          <button onClick={peek} className="px-3 py-1.5 rounded-lg bg-compare/20 text-compare text-sm font-medium hover:bg-compare/30"><Eye className="w-4 h-4 inline mr-1" />Peek</button>
          {message && <p className="text-xs font-mono text-primary mt-2">{message}</p>}
        </div>
      </div>
    </motion.div>
  );
}

function QueueViz() {
  const [queue, setQueue] = useState<number[]>([10, 20, 30]);
  const [input, setInput] = useState("");
  const [message, setMessage] = useState("");

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="glass-card p-6">
      <h3 className="font-heading font-semibold mb-4">Queue (FIFO)</h3>
      <div className="flex flex-wrap items-center gap-1 mb-4">
        <span className="text-xs text-muted-foreground mr-2">Front →</span>
        {queue.map((val, i) => (
          <motion.div key={`${val}-${i}`} layout initial={{ scale: 0 }} animate={{ scale: 1 }} className={`viz-box ${i === 0 ? "viz-box-active" : "viz-box-default"}`}>
            {val}
          </motion.div>
        ))}
        <span className="text-xs text-muted-foreground ml-2">← Rear</span>
      </div>
      <div className="flex gap-2">
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Value" className="w-20 px-2 py-1.5 rounded-lg bg-muted text-foreground text-sm border border-border focus:border-primary outline-none font-mono" />
        <button onClick={() => { if (input) { setQueue([...queue, Number(input)]); setInput(""); setMessage(`Enqueued ${input}`); } }} className="px-3 py-1.5 rounded-lg bg-primary/20 text-primary text-sm font-medium hover:bg-primary/30">Enqueue</button>
        <button onClick={() => { if (queue.length) { setMessage(`Dequeued ${queue[0]}`); setQueue(queue.slice(1)); } }} className="px-3 py-1.5 rounded-lg bg-swap/20 text-swap text-sm font-medium hover:bg-swap/30">Dequeue</button>
        <button onClick={() => { if (queue.length) setMessage(`Front: ${queue[0]}`); }} className="px-3 py-1.5 rounded-lg bg-compare/20 text-compare text-sm font-medium hover:bg-compare/30">Front</button>
      </div>
      {message && <p className="text-xs font-mono text-primary mt-3">{message}</p>}
    </motion.div>
  );
}

function LinkedListViz() {
  const [nodes, setNodes] = useState<number[]>([10, 20, 30, 40]);
  const [input, setInput] = useState("");

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="glass-card p-6">
      <h3 className="font-heading font-semibold mb-4">Linked List</h3>
      <div className="flex flex-wrap items-center gap-1 mb-4 overflow-x-auto">
        <span className="text-xs text-muted-foreground mr-1">HEAD</span>
        <ArrowRight className="w-3 h-3 text-primary" />
        {nodes.map((val, i) => (
          <div key={i} className="flex items-center gap-1">
            <motion.div layout initial={{ scale: 0 }} animate={{ scale: 1 }} className="viz-box-default flex gap-0 p-0 overflow-hidden">
              <div className="px-3 py-2 border-r border-primary/30">{val}</div>
              <div className="px-2 py-2 text-[10px] text-muted-foreground">{i < nodes.length - 1 ? `→` : "∅"}</div>
            </motion.div>
            {i < nodes.length - 1 && <ArrowRight className="w-3 h-3 text-primary" />}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Value" className="w-20 px-2 py-1.5 rounded-lg bg-muted text-foreground text-sm border border-border focus:border-primary outline-none font-mono" />
        <button onClick={() => { if (input) { setNodes([...nodes, Number(input)]); setInput(""); } }} className="px-3 py-1.5 rounded-lg bg-primary/20 text-primary text-sm font-medium hover:bg-primary/30">Append</button>
        <button onClick={() => { if (input) { setNodes([Number(input), ...nodes]); setInput(""); } }} className="px-3 py-1.5 rounded-lg bg-secondary/20 text-secondary text-sm font-medium hover:bg-secondary/30">Prepend</button>
        <button onClick={() => setNodes(nodes.slice(0, -1))} className="px-3 py-1.5 rounded-lg bg-destructive/20 text-destructive text-sm font-medium hover:bg-destructive/30">Remove Last</button>
      </div>
    </motion.div>
  );
}

function BSTViz() {
  type TreeNode = { val: number; left: TreeNode | null; right: TreeNode | null };

  const [root, setRoot] = useState<TreeNode | null>(null);
  const [input, setInput] = useState("");

  const insert = (node: TreeNode | null, val: number): TreeNode => {
    if (!node) return { val, left: null, right: null };
    if (val < node.val) return { ...node, left: insert(node.left, val) };
    if (val > node.val) return { ...node, right: insert(node.right, val) };
    return node;
  };

  const addNode = () => {
    if (input) {
      setRoot(insert(root, Number(input)));
      setInput("");
    }
  };

  const renderTree = (node: TreeNode | null, depth: number = 0): React.ReactNode => {
    if (!node) return null;
    return (
      <div className="flex flex-col items-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="viz-box-active w-10 h-10 rounded-full text-xs">
          {node.val}
        </motion.div>
        {(node.left || node.right) && (
          <div className="flex gap-4 mt-1">
            <div className="flex flex-col items-center">
              {node.left && <div className="w-px h-4 bg-primary/40" />}
              {renderTree(node.left, depth + 1)}
            </div>
            <div className="flex flex-col items-center">
              {node.right && <div className="w-px h-4 bg-primary/40" />}
              {renderTree(node.right, depth + 1)}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="glass-card p-6">
      <h3 className="font-heading font-semibold mb-4">Binary Search Tree</h3>
      <div className="flex justify-center mb-4 min-h-[120px]">
        {root ? renderTree(root) : <p className="text-xs text-muted-foreground self-center">Insert a node to start</p>}
      </div>
      <div className="flex gap-2">
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Value" className="w-20 px-2 py-1.5 rounded-lg bg-muted text-foreground text-sm border border-border focus:border-primary outline-none font-mono" />
        <button onClick={addNode} className="px-3 py-1.5 rounded-lg bg-primary/20 text-primary text-sm font-medium hover:bg-primary/30">Insert</button>
        <button onClick={() => setRoot(null)} className="px-3 py-1.5 rounded-lg bg-destructive/20 text-destructive text-sm font-medium hover:bg-destructive/30">Clear</button>
      </div>
    </motion.div>
  );
}

function HashMapViz() {
  const [buckets, setBuckets] = useState<Array<Array<{ key: string; value: string }>>>(Array.from({ length: 8 }, () => []));
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");

  const hash = (k: string) => {
    let h = 0;
    for (let i = 0; i < k.length; i++) h = (h + k.charCodeAt(i)) % buckets.length;
    return h;
  };

  const put = () => {
    if (!key || !value) return;
    const idx = hash(key);
    const newBuckets = [...buckets];
    const existing = newBuckets[idx].findIndex((e) => e.key === key);
    if (existing >= 0) newBuckets[idx][existing] = { key, value };
    else newBuckets[idx] = [...newBuckets[idx], { key, value }];
    setBuckets(newBuckets);
    setKey("");
    setValue("");
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="glass-card p-6">
      <h3 className="font-heading font-semibold mb-4">Hash Map</h3>
      <div className="space-y-1 mb-4">
        {buckets.map((bucket, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="text-xs font-mono text-muted-foreground w-6">[{i}]</span>
            <div className="flex-1 flex items-center gap-1 min-h-[32px] p-1 rounded bg-muted/20 border border-border/50">
              {bucket.length === 0 && <span className="text-xs text-muted-foreground/40 px-2">empty</span>}
              {bucket.map((entry, j) => (
                <motion.span key={j} initial={{ scale: 0 }} animate={{ scale: 1 }} className="px-2 py-0.5 rounded bg-primary/10 text-primary text-xs font-mono border border-primary/20">
                  {entry.key}: {entry.value}
                </motion.span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input value={key} onChange={(e) => setKey(e.target.value)} placeholder="Key" className="w-20 px-2 py-1.5 rounded-lg bg-muted text-foreground text-sm border border-border focus:border-primary outline-none font-mono" />
        <input value={value} onChange={(e) => setValue(e.target.value)} placeholder="Value" className="w-20 px-2 py-1.5 rounded-lg bg-muted text-foreground text-sm border border-border focus:border-primary outline-none font-mono" />
        <button onClick={put} className="px-3 py-1.5 rounded-lg bg-primary/20 text-primary text-sm font-medium hover:bg-primary/30">Put</button>
        <button onClick={() => setBuckets(Array.from({ length: 8 }, () => []))} className="px-3 py-1.5 rounded-lg bg-destructive/20 text-destructive text-sm font-medium hover:bg-destructive/30">Clear</button>
      </div>
    </motion.div>
  );
}

export default DataStructuresPage;
