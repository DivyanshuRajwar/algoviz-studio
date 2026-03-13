import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Binary, BarChart3, Database, Layers } from "lucide-react";

const navItems = [
  { path: "/", label: "Home", icon: null },
  { path: "/searching", label: "Searching", icon: Binary },
  { path: "/sorting", label: "Sorting", icon: BarChart3 },
  { path: "/data-structures", label: "Data Structures", icon: Database },
  { path: "/tower-of-hanoi", label: "Tower of Hanoi", icon: Layers },
];

const Navbar = () => {
  const location = useLocation();

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 glass-card border-t-0 border-x-0 rounded-none"
    >
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/20 neon-border flex items-center justify-center">
            <span className="font-mono font-bold text-primary text-sm">DS</span>
          </div>
          <span className="font-heading font-bold text-lg neon-text hidden sm:block">DSA Visualizer</span>
        </Link>

        <div className="flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`relative px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span className="hidden md:inline">{item.label}</span>
                {item.icon && <item.icon className="w-4 h-4 md:hidden" />}
                {!item.icon && <span className="md:hidden text-xs">Home</span>}
                {isActive && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute inset-0 rounded-lg bg-primary/10 neon-border -z-10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
