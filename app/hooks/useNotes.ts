import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";

// Fallback in-memory store used when native storage is unavailable (Expo Go edge-cases)
const __inMemoryStore: Record<string, string> = {};

async function storageGet(key: string): Promise<string | null> {
  try {
    const v = await SecureStore.getItemAsync(key);
    return v;
  } catch (e) {
    // fallback to localStorage (web) or in-memory store
    try {
      // @ts-ignore globalThis may have localStorage on web
      if (typeof localStorage !== "undefined") {
        const v = localStorage.getItem(key);
        return v;
      }
    } catch (_) {}
    return __inMemoryStore[key] ?? null;
  }
}

async function storageSet(key: string, value: string): Promise<void> {
  try {
    await SecureStore.setItemAsync(key, value);
    return;
  } catch (e) {
    try {
      // @ts-ignore
      if (typeof localStorage !== "undefined") {
        localStorage.setItem(key, value);
        return;
      }
    } catch (_) {}
    __inMemoryStore[key] = value;
  }
}

export type Note = {
  id: string;
  title: string;
  body: string;
  date: string;
  // optional image URI (local file uri or base64 data)
  image?: string | null;
};

const STORAGE_KEY = "@notes_app_notes";

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  // Load notes from storage on mount
  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const stored = await storageGet(STORAGE_KEY);
      if (stored) {
        setNotes(JSON.parse(stored));
      }
    } catch (error) {
      console.warn("Error loading notes (using fallback):", error);
    } finally {
      setLoading(false);
    }
  };

  const saveNote = async (note: Note) => {
    try {
      let updated: Note[] = [];
      setNotes((currentNotes) => {
        updated = currentNotes.some((n) => n.id === note.id)
          ? currentNotes.map((n) => (n.id === note.id ? note : n))
          : [note, ...currentNotes];
        return updated;
      });
      await storageSet(STORAGE_KEY, JSON.stringify(updated));
      return note.id;
    } catch (error) {
      console.warn("Error saving note (fallback active):", error);
      return null;
    }
  };

  const deleteNote = async (id: string) => {
    try {
      let updated: Note[] = [];
      setNotes((currentNotes) => {
        updated = currentNotes.filter((n) => n.id !== id);
        return updated;
      });
      await storageSet(STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.warn("Error deleting note (fallback active):", error);
    }
  };

  const getNoteById = (id: string) => {
    return notes.find((n) => n.id === id);
  };

  return {
    notes,
    loading,
    saveNote,
    deleteNote,
    getNoteById,
  };
}
