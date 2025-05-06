
import { storage } from "./storage";

interface MemoryEntry {
  userId: number;
  context: string;
  data: any;
  timestamp: Date;
}

class MemoryLayer {
  private static instance: MemoryLayer;
  private memory: Map<number, MemoryEntry[]>;

  private constructor() {
    this.memory = new Map();
  }

  static getInstance(): MemoryLayer {
    if (!MemoryLayer.instance) {
      MemoryLayer.instance = new MemoryLayer();
    }
    return MemoryLayer.instance;
  }

  async storeMemory(userId: number, context: string, data: any) {
    const entry: MemoryEntry = {
      userId,
      context,
      data,
      timestamp: new Date()
    };

    if (!this.memory.has(userId)) {
      this.memory.set(userId, []);
    }

    this.memory.get(userId)!.push(entry);
    await storage.saveUserMemory(userId, entry);
  }

  async retrieveMemory(userId: number, context: string): Promise<any[]> {
    const memories = this.memory.get(userId) || [];
    return memories
      .filter(m => m.context === context)
      .map(m => m.data);
  }

  async getPersonalizedContext(userId: number): Promise<string> {
    const memories = await this.retrieveMemory(userId, "preferences");
    if (memories.length === 0) return "";

    return `Based on your previous interactions, you prefer ${memories.join(", ")}.`;
  }
}

export const memoryLayer = MemoryLayer.getInstance();
