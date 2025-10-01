import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PlusCircle, Rocket } from "lucide-react";
import { insertEventSchema, type InsertEvent } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { slideUp, pulseGlow, ripple } from "@/lib/animations";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

export default function EventForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InsertEvent>({
    resolver: zodResolver(insertEventSchema),
    defaultValues: {
      title: "",
      description: "",
      date: "",
      time: "",
      technology: "",
      sendNotifications: false,
    },
  });

  const createEventMutation = useMutation({
    mutationFn: async (data: InsertEvent) => {
      const response = await apiRequest("POST", "/api/events", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({
        title: "Event Created!",
        description: "Your coding event has been successfully created.",
      });
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create event. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertEvent) => {
    createEventMutation.mutate(data);
  };

  return (
    <motion.div 
      className="glass-effect rounded-2xl p-8"
      {...slideUp}
    >
      <h3 className="text-2xl font-bold mb-6 text-[hsl(201,96%,72%)] flex items-center">
        <PlusCircle className="mr-3" />
        Create New Event
      </h3>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300">Event Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter event title"
                    className="bg-[var(--glass)] border-[var(--glass-border)] text-white placeholder-gray-400 focus:ring-[hsl(201,96%,72%)] focus:border-transparent"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Date</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      className="bg-[var(--glass)] border-[var(--glass-border)] text-white focus:ring-[hsl(201,96%,72%)]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Time</FormLabel>
                  <FormControl>
                    <Input
                      type="time"
                      className="bg-[var(--glass)] border-[var(--glass-border)] text-white focus:ring-[hsl(201,96%,72%)]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="technology"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300">Technology Focus</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-[var(--glass)] border-[var(--glass-border)] text-white">
                      <SelectValue placeholder="Select technology" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-black border-[var(--glass-border)]">
                    <SelectItem value="javascript">JavaScript</SelectItem>
                    <SelectItem value="python">Python</SelectItem>
                    <SelectItem value="react">React</SelectItem>
                    <SelectItem value="nodejs">Node.js</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300">Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe your event..."
                    className="bg-[var(--glass)] border-[var(--glass-border)] text-white placeholder-gray-400 focus:ring-[hsl(201,96%,72%)] h-24 resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sendNotifications"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value || false}
                    onCheckedChange={field.onChange}
                    className="border-gray-300 data-[state=checked]:bg-[hsl(201,96%,72%)] data-[state=checked]:border-[hsl(201,96%,72%)]"
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-gray-300">
                    Send email notifications to attendees
                  </FormLabel>
                </div>
              </FormItem>
            )}
          />

          <motion.div
            variants={pulseGlow}
            animate="animate"
          >
            <Button
              type="submit"
              disabled={createEventMutation.isPending}
              className="w-full bg-gradient-to-r from-[hsl(201,96%,72%)] to-[hsl(206,73%,73%)] text-black font-semibold py-3 px-6 rounded-lg ripple-button hover-glow"
              {...ripple}
            >
              <Rocket className="mr-2" size={16} />
              {createEventMutation.isPending ? "Creating..." : "Create Event"}
            </Button>
          </motion.div>
        </form>
      </Form>
    </motion.div>
  );
}
