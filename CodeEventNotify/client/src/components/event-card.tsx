import { motion } from "framer-motion";
import { Calendar, Clock, Users, Edit, Trash2, Check, Share, Bell } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { cardHover, ripple } from "@/lib/animations";
import type { Event } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EventCardProps {
  event: Event;
}

const getTechnologyIcon = (tech: string) => {
  switch (tech.toLowerCase()) {
    case 'javascript':
    case 'react':
    case 'nodejs':
      return '⚡';
    case 'python':
      return '🐍';
    default:
      return '💻';
  }
};

const getTechnologyGradient = (tech: string) => {
  switch (tech.toLowerCase()) {
    case 'javascript':
    case 'react':
    case 'nodejs':
      return 'from-[hsl(201,96%,72%)] to-[hsl(206,73%,73%)]';
    case 'python':
      return 'from-yellow-400 to-orange-500';
    default:
      return 'from-purple-500 to-pink-500';
  }
};

export default function EventCard({ event }: EventCardProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showRsvpDialog, setShowRsvpDialog] = useState(false);
  const [rsvpData, setRsvpData] = useState({ name: "", email: "" });

  const deleteEventMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", `/api/events/${event.id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({
        title: "Event Deleted",
        description: "The event has been successfully deleted.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete event.",
        variant: "destructive",
      });
    },
  });

  const rsvpMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/rsvps", {
        eventId: event.id,
        name: rsvpData.name,
        email: rsvpData.email,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
      setShowRsvpDialog(false);
      setRsvpData({ name: "", email: "" });
      toast({
        title: "RSVP Confirmed!",
        description: event.sendNotifications 
          ? "You've been added to the event. Check your email for confirmation."
          : "You've been added to the event.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to RSVP. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      deleteEventMutation.mutate();
    }
  };

  const handleRsvp = () => {
    if (!rsvpData.name || !rsvpData.email) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }
    rsvpMutation.mutate();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event.title,
          text: event.description,
          url: window.location.href,
        });
      } catch (error) {
        // User cancelled or share failed
      }
    } else {
      // Fallback to copying to clipboard
      await navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied",
        description: "Event link copied to clipboard.",
      });
    }
  };

  return (
    <motion.div
      className="event-card glass-effect rounded-xl p-6 cursor-pointer"
      variants={cardHover}
      whileHover="hover"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-12 h-12 bg-gradient-to-br ${getTechnologyGradient(event.technology)} rounded-lg flex items-center justify-center text-xl`}>
            {getTechnologyIcon(event.technology)}
          </div>
          <div>
            <h4 className="font-semibold text-white">{event.title}</h4>
            <p className="text-sm text-gray-400">{event.date}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <motion.button
            className="text-gray-400 hover:text-[hsl(201,96%,72%)] transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Edit size={16} />
          </motion.button>
          <motion.button
            className="text-gray-400 hover:text-red-400 transition-colors"
            onClick={handleDelete}
            disabled={deleteEventMutation.isPending}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Trash2 size={16} />
          </motion.button>
        </div>
      </div>

      <p className="text-gray-300 text-sm mb-4 line-clamp-3">{event.description}</p>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4 text-sm text-gray-400">
          <span className="flex items-center">
            <Clock className="mr-1" size={14} />
            {event.time}
          </span>
          <span className="flex items-center">
            <Users className="mr-1" size={14} />
            {event.attendees} attending
          </span>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full ${
          event.status === 'confirmed' ? 'bg-green-500' : 
          event.status === 'pending' ? 'bg-blue-500' : 'bg-yellow-500'
        } text-white`}>
          {event.status ? event.status.charAt(0).toUpperCase() + event.status.slice(1) : 'Unknown'}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <Dialog open={showRsvpDialog} onOpenChange={setShowRsvpDialog}>
          <DialogTrigger asChild>
            <motion.button
              className="bg-[hsl(201,96%,72%)] text-black px-4 py-2 rounded-lg ripple-button hover-glow transition-all duration-300 text-sm font-medium flex items-center"
              variants={ripple}
              whileTap="tap"
            >
              <Check className="mr-1" size={14} />
              RSVP
            </motion.button>
          </DialogTrigger>
          <DialogContent className="bg-black border-[var(--glass-border)]">
            <DialogHeader>
              <DialogTitle className="text-white">RSVP for {event.title}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-gray-300">Name</Label>
                <Input
                  id="name"
                  value={rsvpData.name}
                  onChange={(e) => setRsvpData(prev => ({ ...prev, name: e.target.value }))}
                  className="bg-[var(--glass)] border-[var(--glass-border)] text-white"
                  placeholder="Your name"
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-gray-300">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={rsvpData.email}
                  onChange={(e) => setRsvpData(prev => ({ ...prev, email: e.target.value }))}
                  className="bg-[var(--glass)] border-[var(--glass-border)] text-white"
                  placeholder="your.email@example.com"
                />
              </div>
              <Button
                onClick={handleRsvp}
                disabled={rsvpMutation.isPending}
                className="w-full bg-[hsl(201,96%,72%)] text-black hover:bg-[hsl(206,73%,73%)]"
              >
                {rsvpMutation.isPending ? "Confirming..." : "Confirm RSVP"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <div className="flex items-center space-x-2">
          <motion.button
            className="text-gray-400 hover:text-[hsl(201,96%,72%)] transition-colors"
            onClick={handleShare}
            title="Share Event"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Share size={16} />
          </motion.button>
          <motion.button
            className="text-gray-400 hover:text-yellow-400 transition-colors"
            title="Set Reminder"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Bell size={16} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
