import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ArrowRight, Binary, BarChart3, Database, Layers } from "lucide-react";

const categories = [
  {
    title: "Searching",
    description: "Visualize Linear & Binary Search step by step",
    icon: Binary,
    path: "/searching",
    color: "primary",
  },
  {
    title: "Sorting",
    description: "Watch Bubble, Selection, Insertion & Quick Sort in action",
    icon: BarChart3,
    path: "/sorting",
    color: "secondary",
  },
  {
    title: "Data Structures",
    description: "Explore Arrays, Stacks, Queues, Linked Lists, Trees & Hash Maps",
    icon: Database,
    path: "/data-structures",
    color: "accent",
  },
  {
    title: "Tower of Hanoi",
    description: "Classic recursive algorithm with animated disk movements",
    icon: Layers,
    path: "/tower-of-hanoi",
    color: "neon-green",
  },
];

const colorMap: Record<string, string> = {
  primary: "hsl(175, 80%, 50%)",
  secondary: "hsl(260, 60%, 55%)",
  accent: "hsl(320, 70%, 55%)",
  "neon-green": "hsl(145, 70%, 50%)",
};

const HeroSection = () => {
  const barsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!barsRef.current) return;
    const bars = barsRef.current.children;
    gsap.fromTo(
      bars,
      { scaleY: 0.3, opacity: 0.3 },
      {
        scaleY: 1,
        opacity: 1,
        duration: 0.6,
        stagger: 0.08,
        ease: "power2.out",
        repeat: -1,
        yoyo: true,
        repeatDelay: 0.5,
      }
    );
  }, []);

  return (
    <section className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden pt-16">
      {/* Grid background */}
      <div className="absolute inset-0 grid-bg opacity-50" />

      {/* Radial glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px]" />

      <div className="relative z-10 container mx-auto px-4 text-center">
        {/* Animated bars */}
        <div ref={barsRef} className="flex items-end justify-center gap-1.5 mb-8 h-16">
          {[40, 65, 30, 80, 50, 70, 35, 90, 55, 45].map((h, i) => (
            <div
              key={i}
              className="w-2 rounded-t-full bg-primary/70 origin-bottom"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold mb-4"
        >
          <span className="text-gradient-cyan">DSA</span>{" "}
          <span className="text-foreground">Visualizer</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-12"
        >
          Understand how algorithms and data structures work internally through
          interactive, step-by-step visual animations.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-wrap justify-center gap-4 mb-20"
        >
          <Link
            to="/sorting"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:brightness-110 transition-all neon-glow"
          >
            Start Exploring <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {/* Category Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + i * 0.1 }}
            >
              <Link to={cat.path} className="block group">
                <div className="glass-card-hover p-6 text-left h-full">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                    style={{
                      backgroundColor: `${colorMap[cat.color]}20`,
                      border: `1px solid ${colorMap[cat.color]}40`,
                    }}
                  >
                    <cat.icon className="w-5 h-5" style={{ color: colorMap[cat.color] }} />
                  </div>
                  <h3 className="font-heading font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{cat.description}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
