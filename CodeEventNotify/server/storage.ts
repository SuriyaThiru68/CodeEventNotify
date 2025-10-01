import { type User, type InsertUser, type Event, type InsertEvent, type Rsvp, type InsertRsvp } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Event methods
  getAllEvents(): Promise<Event[]>;
  getEvent(id: string): Promise<Event | undefined>;
  createEvent(event: InsertEvent): Promise<Event>;
  updateEvent(id: string, event: Partial<Event>): Promise<Event | undefined>;
  deleteEvent(id: string): Promise<boolean>;
  searchEvents(query: string): Promise<Event[]>;
  
  // RSVP methods
  createRsvp(rsvp: InsertRsvp): Promise<Rsvp>;
  getRsvpsByEvent(eventId: string): Promise<Rsvp[]>;
  deleteRsvp(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private events: Map<string, Event>;
  private rsvps: Map<string, Rsvp>;

  constructor() {
    this.users = new Map();
    this.events = new Map();
    this.rsvps = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getAllEvents(): Promise<Event[]> {
    return Array.from(this.events.values()).sort((a, b) => 
      new Date(a.date + ' ' + a.time).getTime() - new Date(b.date + ' ' + b.time).getTime()
    );
  }

  async getEvent(id: string): Promise<Event | undefined> {
    return this.events.get(id);
  }

  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    const id = randomUUID();
    const event: Event = {
      ...insertEvent,
      id,
      attendees: 0,
      status: "pending",
      createdAt: new Date(),
      sendNotifications: insertEvent.sendNotifications ?? false,
    };
    this.events.set(id, event);
    return event;
  }

  async updateEvent(id: string, eventUpdate: Partial<Event>): Promise<Event | undefined> {
    const event = this.events.get(id);
    if (!event) return undefined;
    
    const updatedEvent = { ...event, ...eventUpdate };
    this.events.set(id, updatedEvent);
    return updatedEvent;
  }

  async deleteEvent(id: string): Promise<boolean> {
    return this.events.delete(id);
  }

  async searchEvents(query: string): Promise<Event[]> {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.events.values()).filter(event =>
      event.title.toLowerCase().includes(lowercaseQuery) ||
      event.description.toLowerCase().includes(lowercaseQuery) ||
      event.technology.toLowerCase().includes(lowercaseQuery)
    );
  }

  async createRsvp(insertRsvp: InsertRsvp): Promise<Rsvp> {
    const id = randomUUID();
    const rsvp: Rsvp = {
      ...insertRsvp,
      id,
      createdAt: new Date(),
    };
    this.rsvps.set(id, rsvp);
    
    // Update attendee count
    const event = this.events.get(insertRsvp.eventId);
    if (event) {
      event.attendees = (event.attendees || 0) + 1;
      this.events.set(insertRsvp.eventId, event);
    }
    
    return rsvp;
  }

  async getRsvpsByEvent(eventId: string): Promise<Rsvp[]> {
    return Array.from(this.rsvps.values()).filter(rsvp => rsvp.eventId === eventId);
  }

  async deleteRsvp(id: string): Promise<boolean> {
    const rsvp = this.rsvps.get(id);
    if (!rsvp) return false;
    
    // Update attendee count
    const event = this.events.get(rsvp.eventId);
    if (event && event.attendees && event.attendees > 0) {
      event.attendees = event.attendees - 1;
      this.events.set(rsvp.eventId, event);
    }
    
    return this.rsvps.delete(id);
  }
}

export const storage = new MemStorage();
