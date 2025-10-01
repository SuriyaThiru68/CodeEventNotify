import { motion } from "framer-motion";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Filter } from "lucide-react";
import { fadeIn, slideUp, staggerContainer } from "@/lib/animations";
import type { Event } from "@shared/schema";
import Navigation from "@/components/navigation";
import StatsCards from "@/components/stats-cards";
import EventForm from "@/components/event-form";
import InteractiveCalendar from "@/components/interactive-calendar";
import EventCard from "@/components/event-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);

  const { data: events = [], isLoading } = useQuery<Event[]>({
    queryKey: ["/api/events"],
  });

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.technology.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation onCreateEvent={() => setShowCreateForm(!showCreateForm)} />
      
      {/* Hero Section */}
      <motion.section 
        className="pt-24 pb-12"
        {...fadeIn}
      >
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <motion.h2 
              className="text-5xl font-bold mb-4"
              {...slideUp}
            >
              Welcome back, <span className="text-[hsl(201,96%,72%)]">Developer</span>
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-300"
              {...slideUp}
              style={{ animationDelay: "0.2s" }}
            >
              Manage your coding events and build amazing communities
            </motion.p>
          </div>

          <StatsCards />
        </div>
      </motion.section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
            {showCreateForm && <EventForm />}
            <InteractiveCalendar />
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-3xl font-bold text-white">Upcoming Events</h3>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-[var(--glass)] border-[var(--glass-border)] rounded-lg px-4 py-2 pl-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[hsl(201,96%,72%)] focus:border-transparent"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              </div>
              <Button
                variant="outline"
                className="bg-[var(--glass)] border-[var(--glass-border)] text-white hover:bg-[var(--glass-border)]"
              >
                <Filter className="mr-2" size={16} />
                Filter
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="glass-effect rounded-xl p-6 animate-pulse">
                  <div className="h-32 bg-gray-800 rounded"></div>
                </div>
              ))}
            </div>
          ) : filteredEvents.length === 0 ? (
            <motion.div 
              className="text-center py-12"
              {...slideUp}
            >
              <div className="glass-effect rounded-xl p-8">
                <h4 className="text-xl font-semibold text-gray-300 mb-2">
                  {searchQuery ? "No events found" : "No events yet"}
                </h4>
                <p className="text-gray-400">
                  {searchQuery 
                    ? "Try adjusting your search terms" 
                    : "Create your first event to get started"
                  }
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              {filteredEvents.map((event) => (
                <motion.div
                  key={event.id}
                  variants={slideUp}
                >
                  <EventCard event={event} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Notification Center */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <motion.div 
            className="glass-effect rounded-2xl p-8"
            {...slideUp}
          >
            <h3 className="text-2xl font-bold mb-6 text-[hsl(201,96%,72%)] flex items-center">
              <span className="mr-3">✉️</span>
              Notification Center
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-semibold text-white mb-4">Email Templates</h4>
                <div className="space-y-4">
                  <div className="bg-[var(--glass)] border border-[var(--glass-border)] rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-medium">Event Reminder</span>
                      <button className="text-[hsl(201,96%,72%)] hover:text-[hsl(206,73%,73%)] transition-colors">
                        <span>✏️</span>
                      </button>
                    </div>
                    <p className="text-gray-400 text-sm">Sent 24 hours before event starts</p>
                  </div>
                  <div className="bg-[var(--glass)] border border-[var(--glass-border)] rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-medium">Event Confirmation</span>
                      <button className="text-[hsl(201,96%,72%)] hover:text-[hsl(206,73%,73%)] transition-colors">
                        <span>✏️</span>
                      </button>
                    </div>
                    <p className="text-gray-400 text-sm">Sent immediately after RSVP</p>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white mb-4">Notification Settings</h4>
                <div className="space-y-4">
                  <label className="flex items-center justify-between">
                    <span className="text-white">Email notifications</span>
                    <input type="checkbox" defaultChecked className="w-5 h-5 text-[hsl(201,96%,72%)] bg-transparent border-gray-300 rounded focus:ring-[hsl(201,96%,72%)] focus:ring-2" />
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-white">SMS reminders</span>
                    <input type="checkbox" className="w-5 h-5 text-[hsl(201,96%,72%)] bg-transparent border-gray-300 rounded focus:ring-[hsl(201,96%,72%)] focus:ring-2" />
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-white">Browser notifications</span>
                    <input type="checkbox" defaultChecked className="w-5 h-5 text-[hsl(201,96%,72%)] bg-transparent border-gray-300 rounded focus:ring-[hsl(201,96%,72%)] focus:ring-2" />
                  </label>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-[var(--glass-border)]">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <span className="text-[hsl(201,96%,72%)] text-2xl">💻</span>
                <h3 className="text-xl font-bold text-white">CodeEvents</h3>
              </div>
              <p className="text-gray-400">Building developer communities through amazing coding events.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-[hsl(201,96%,72%)] transition-colors">Event Creation</a></li>
                <li><a href="#" className="hover:text-[hsl(201,96%,72%)] transition-colors">Calendar Integration</a></li>
                <li><a href="#" className="hover:text-[hsl(201,96%,72%)] transition-colors">Email Notifications</a></li>
                <li><a href="#" className="hover:text-[hsl(201,96%,72%)] transition-colors">RSVP Management</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-[hsl(201,96%,72%)] transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-[hsl(201,96%,72%)] transition-colors">API Reference</a></li>
                <li><a href="#" className="hover:text-[hsl(201,96%,72%)] transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-[hsl(201,96%,72%)] transition-colors">Status Page</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Connect</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-[hsl(201,96%,72%)] transition-colors text-xl">🐦</a>
                <a href="#" className="text-gray-400 hover:text-[hsl(201,96%,72%)] transition-colors text-xl">📱</a>
                <a href="#" className="text-gray-400 hover:text-[hsl(201,96%,72%)] transition-colors text-xl">💼</a>
              </div>
            </div>
          </div>
          <div className="border-t border-[var(--glass-border)] mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 CodeEvents. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
