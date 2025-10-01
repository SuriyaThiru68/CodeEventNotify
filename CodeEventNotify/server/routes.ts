import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertEventSchema, insertRsvpSchema } from "@shared/schema";
import nodemailer from "nodemailer";

// Configure nodemailer
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER || process.env.EMAIL_USER,
    pass: process.env.SMTP_PASS || process.env.EMAIL_PASS,
  },
});

async function sendEventNotification(email: string, eventTitle: string, eventDate: string, eventTime: string) {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_USER || process.env.EMAIL_USER,
      to: email,
      subject: `Event Confirmation: ${eventTitle}`,
      html: `
        <div style="background: #000; color: #fff; padding: 20px; font-family: Arial, sans-serif;">
          <h2 style="color: #87CEEB;">Event Confirmation</h2>
          <p>You have successfully RSVP'd for:</p>
          <h3 style="color: #ADD8E6;">${eventTitle}</h3>
          <p><strong>Date:</strong> ${eventDate}</p>
          <p><strong>Time:</strong> ${eventTime}</p>
          <p>We look forward to seeing you there!</p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Failed to send email:", error);
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all events
  app.get("/api/events", async (_req, res) => {
    try {
      const events = await storage.getAllEvents();
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch events" });
    }
  });

  // Get single event
  app.get("/api/events/:id", async (req, res) => {
    try {
      const event = await storage.getEvent(req.params.id);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      res.json(event);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch event" });
    }
  });

  // Create event
  app.post("/api/events", async (req, res) => {
    try {
      const validatedData = insertEventSchema.parse(req.body);
      const event = await storage.createEvent(validatedData);
      res.status(201).json(event);
    } catch (error) {
      res.status(400).json({ message: "Invalid event data" });
    }
  });

  // Update event
  app.patch("/api/events/:id", async (req, res) => {
    try {
      const event = await storage.updateEvent(req.params.id, req.body);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      res.json(event);
    } catch (error) {
      res.status(500).json({ message: "Failed to update event" });
    }
  });

  // Delete event
  app.delete("/api/events/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteEvent(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Event not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete event" });
    }
  });

  // Search events
  app.get("/api/events/search/:query", async (req, res) => {
    try {
      const events = await storage.searchEvents(req.params.query);
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: "Failed to search events" });
    }
  });

  // Create RSVP
  app.post("/api/rsvps", async (req, res) => {
    try {
      const validatedData = insertRsvpSchema.parse(req.body);
      const rsvp = await storage.createRsvp(validatedData);
      
      // Get event details for notification
      const event = await storage.getEvent(validatedData.eventId);
      if (event && event.sendNotifications) {
        await sendEventNotification(
          validatedData.email,
          event.title,
          event.date,
          event.time
        );
      }
      
      res.status(201).json(rsvp);
    } catch (error) {
      res.status(400).json({ message: "Invalid RSVP data" });
    }
  });

  // Get RSVPs for event
  app.get("/api/events/:id/rsvps", async (req, res) => {
    try {
      const rsvps = await storage.getRsvpsByEvent(req.params.id);
      res.json(rsvps);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch RSVPs" });
    }
  });

  // Get stats
  app.get("/api/stats", async (_req, res) => {
    try {
      const events = await storage.getAllEvents();
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();
      
      const stats = {
        totalEvents: events.length,
        totalAttendees: events.reduce((sum, event) => sum + (event.attendees || 0), 0),
        thisMonth: events.filter(event => {
          const eventDate = new Date(event.date);
          return eventDate.getMonth() === currentMonth && eventDate.getFullYear() === currentYear;
        }).length,
        upcoming: events.filter(event => {
          const eventDate = new Date(event.date + ' ' + event.time);
          return eventDate > now;
        }).length,
      };
      
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
