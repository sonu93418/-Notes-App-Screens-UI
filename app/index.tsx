import React, { useState } from "react";
import { View, Pressable, Text, StyleSheet, useColorScheme } from "react-native";
import NotesList from "./screens/NotesListScreen";
import NoteEditor from "./screens/NoteEditor";
import { getPalette, type ThemeOverride } from "./theme";
import { useNotes } from "./hooks/useNotes";

export default function Index() {
  const [screen, setScreen] = useState<"list" | "editor">("list");
  const [themeOverride, setThemeOverride] = useState<ThemeOverride>("system");
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const sysScheme = useColorScheme();
  const normalizedSystemScheme: "light" | "dark" = sysScheme === "dark" ? "dark" : "light";
  const activeScheme = themeOverride === "system" ? normalizedSystemScheme : themeOverride;
  const colors = getPalette(activeScheme);
  const styles = createStyles(colors);
  
  const { notes, saveNote, deleteNote, getNoteById } = useNotes();

  const handleEditNote = (id: string) => {
    setEditingNoteId(id);
    setScreen("editor");
  };

  const handleNewNote = () => {
    setEditingNoteId(null);
    setScreen("editor");
  };

  const handleSaveNote = async (title: string, body: string) => {
    const id = editingNoteId || Date.now().toString();
    const note = {
      id,
      title: title || "Untitled",
      body,
      date: new Date().toLocaleDateString(),
    };
    await saveNote(note);
    setEditingNoteId(null);
    setScreen("list");
  };

  const handleDeleteNote = async (id: string) => {
    await deleteNote(id);
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.segmentRow}>
        <Pressable
          style={StyleSheet.flatten([styles.segment, screen === "list" ? styles.segmentActive : null])}
          onPress={() => setScreen("list")}
        >
          <Text style={screen === "list" ? styles.segmentTextActive : styles.segmentText}>Notes</Text>
        </Pressable>
        <Pressable
          style={StyleSheet.flatten([styles.segment, screen === "editor" ? styles.segmentActive : null])}
          onPress={() => setScreen("editor")}
        >
          <Text style={screen === "editor" ? styles.segmentTextActive : styles.segmentText}>Editor</Text>
        </Pressable>
      </View>

      <View style={styles.content}>
        {screen === "list" ? (
          <NotesList
            themeOverride={themeOverride}
            activeScheme={activeScheme}
            onThemeOverrideChange={setThemeOverride}
            notes={notes}
            onEditNote={handleEditNote}
            onNewNote={handleNewNote}
            onDeleteNote={handleDeleteNote}
          />
        ) : (
          <NoteEditor
            themeOverride={themeOverride}
            onBack={() => setScreen("list")}
            onSave={handleSaveNote}
            editingNote={editingNoteId ? getNoteById(editingNoteId) : null}
          />
        )}
      </View>
    </View>
  );
}

const createStyles = (colors: ReturnType<typeof getPalette>) =>
  StyleSheet.create({
    wrapper: { flex: 1, backgroundColor: colors.background },
    segmentRow: {
      flexDirection: "row",
      padding: 12,
      backgroundColor: colors.background,
      justifyContent: "center",
      gap: 8,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.muted,
    },
    segment: {
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 999,
      backgroundColor: colors.surface,
    },
    segmentActive: { backgroundColor: colors.text },
    segmentText: { color: colors.text, fontWeight: "600" },
    segmentTextActive: { color: colors.background, fontWeight: "600" },
    content: { flex: 1, backgroundColor: colors.background },
  });
