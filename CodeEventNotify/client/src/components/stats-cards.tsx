import { motion } from "framer-motion";
import { Calendar, Users, TrendingUp, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { slideUpStagger, staggerContainer, hoverGlow } from "@/lib/animations";

interface Stats {
  totalEvents: number;
  totalAttendees: number;
  thisMonth: number;
  upcoming: number;
}

export default function StatsCards() {
  const { data: stats, isLoading } = useQuery<Stats>({
    queryKey: ["/api/stats"],
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="glass-effect rounded-xl p-6 animate-pulse">
            <div className="h-16 bg-gray-800 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  const statsData = [
    {
      title: "Total Events",
      value: stats?.totalEvents || 0,
      icon: Calendar,
      color: "text-[hsl(201,96%,72%)]",
      delay: 0,
    },
    {
      title: "Attendees",
      value: stats?.totalAttendees || 0,
      icon: Users,
      color: "text-[hsl(206,73%,73%)]",
      delay: 0.1,
    },
    {
      title: "This Month",
      value: stats?.thisMonth || 0,
      icon: TrendingUp,
      color: "text-green-400",
      delay: 0.2,
    },
    {
      title: "Upcoming",
      value: stats?.upcoming || 0,
      icon: Clock,
      color: "text-yellow-400",
      delay: 0.3,
    },
  ];

  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      {statsData.map((stat, index) => (
        <motion.div
          key={stat.title}
          className="glass-effect rounded-xl p-6 hover-glow transition-all duration-300"
          variants={slideUpStagger}
          custom={stat.delay}
          whileHover="hover"
          {...hoverGlow}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">{stat.title}</p>
              <p className="text-3xl font-bold text-white">{stat.value}</p>
            </div>
            <stat.icon className={`${stat.color} text-2xl`} />
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
