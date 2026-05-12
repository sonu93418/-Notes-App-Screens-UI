import React, { useState } from "react";
import { View, Pressable, Text, StyleSheet, useColorScheme, SafeAreaView, Platform, StatusBar } from "react-native";
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

  const handleSaveNote = async (title: string, body: string, image?: string | null) => {
    const id = editingNoteId || Date.now().toString();
    const note = {
      id,
      title: title || "Untitled",
      body,
      date: new Date().toLocaleDateString(),
      image: image ?? null,
    } as const;
    await saveNote(note as any);
    setEditingNoteId(null);
    setScreen("list");
  };

  const handleDeleteNote = async (id: string) => {
    await deleteNote(id);
  };

  const androidTop = Platform.OS === "android" ? StatusBar.currentHeight ?? 0 : 0;

  return (
    <View style={[styles.wrapper, { paddingTop: androidTop }] }>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.segmentRow}>
          <Pressable
            style={[styles.segment, screen === "list" && styles.segmentActive]}
            onPress={() => setScreen("list")}
          >
            <Text style={screen === "list" ? styles.segmentTextActive : styles.segmentText}>Notes</Text>
          </Pressable>
          <Pressable
            style={[styles.segment, screen === "editor" && styles.segmentActive]}
            onPress={() => setScreen("editor")}
          >
            <Text style={screen === "editor" ? styles.segmentTextActive : styles.segmentText}>Editor</Text>
          </Pressable>
        </View>
      </SafeAreaView>

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
    wrapper: { flex: 1, width: "100%", backgroundColor: colors.background },
    safeArea: { width: "100%", backgroundColor: colors.surface },
    segmentRow: {
      flexDirection: "row",
      paddingVertical: 14,
      paddingHorizontal: 16,
      backgroundColor: colors.surface,
      justifyContent: "space-around",
      alignItems: "center",
      marginBottom: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.muted,
      borderRadius: 0,
    },
    segment: {
      paddingVertical: 10,
      paddingHorizontal: 24,
      borderRadius: 8,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.muted,
      minWidth: 90,
      alignItems: "center",
    },
    segmentActive: {
      backgroundColor: colors.text,
      borderColor: colors.text,
    },
    segmentText: { color: colors.text, fontWeight: "700", fontSize: 14 },
    segmentTextActive: { color: colors.background, fontWeight: "700", fontSize: 14 },
    content: { flex: 1, width: "100%", backgroundColor: colors.background, paddingTop: 0 },
  });
