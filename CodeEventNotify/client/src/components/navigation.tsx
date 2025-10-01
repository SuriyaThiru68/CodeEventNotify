import { motion } from "framer-motion";
import { Code, Calendar, BarChart3, Plus } from "lucide-react";
import { useState } from "react";
import { fadeIn, hoverGlow } from "@/lib/animations";

interface NavigationProps {
  onCreateEvent: () => void;
}

export default function Navigation({ onCreateEvent }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <motion.nav 
      className="fixed top-0 left-0 right-0 z-50 glass-effect"
      {...fadeIn}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Code className="text-[hsl(201,96%,72%)] text-2xl" />
            <h1 className="text-2xl font-bold text-white">CodeEvents</h1>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a 
              href="#dashboard" 
              className="text-white hover:text-[hsl(201,96%,72%)] transition-colors"
            >
              Dashboard
            </a>
            <a 
              href="#events" 
              className="text-white hover:text-[hsl(201,96%,72%)] transition-colors"
            >
              Events
            </a>
            <a 
              href="#calendar" 
              className="text-white hover:text-[hsl(201,96%,72%)] transition-colors"
            >
              Calendar
            </a>
            <motion.button
              className="bg-[hsl(201,96%,72%)] text-black px-6 py-2 rounded-lg ripple-button font-medium flex items-center space-x-2"
              onClick={onCreateEvent}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              {...hoverGlow}
            >
              <Plus size={16} />
              <span>Create Event</span>
            </motion.button>
          </div>
          
          <button 
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <BarChart3 className="text-xl" />
          </button>
        </div>
      </div>
    </motion.nav>
  );
}
