import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  Pressable,
  Switch,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { getPalette, type Palette, type ThemeOverride } from "../theme";
import { type Note } from "../hooks/useNotes";

type NotesListProps = {
  themeOverride: ThemeOverride;
  activeScheme: "light" | "dark";
  onThemeOverrideChange: (mode: ThemeOverride) => void;
  notes: Note[];
  onEditNote: (id: string) => void;
  onNewNote: () => void;
  onDeleteNote: (id: string) => void;
};

export default function NotesListScreen({
  activeScheme,
  onThemeOverrideChange,
  notes,
  onEditNote,
  onNewNote,
  onDeleteNote,
}: NotesListProps) {
  const [focusMode, setFocusMode] = useState(false);
  const [query, setQuery] = useState("");
  const colors = getPalette(activeScheme);
  const { width } = useWindowDimensions();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return notes;
    return notes.filter(
      (note) => note.title.toLowerCase().includes(q) || note.body.toLowerCase().includes(q)
    );
  }, [query, notes]);

  const styles = useMemo(() => createStyles(colors), [colors]);

  const renderItem = ({ item }: { item: Note }) => {
    return (
      <View style={[styles.card, focusMode ? styles.cardFocus : null]}>
        <View style={styles.cardHeader}>
          <Text style={styles.title} numberOfLines={1}>
            {item.title}
          </Text>
          {!focusMode ? <Text style={styles.date}>{item.date}</Text> : null}
        </View>
        <Text style={styles.snippet} numberOfLines={2}>
          {item.body}
        </Text>
        <View style={styles.actionRow}>
          <Pressable style={[styles.actionBtn, styles.editBtn]} onPress={() => onEditNote(item.id)}>
            <Text style={styles.actionBtnText}>Edit</Text>
          </Pressable>
          <Pressable
            style={[styles.actionBtn, styles.deleteBtn]}
            onPress={() => onDeleteNote(item.id)}
          >
            <Text style={styles.actionBtnText}>Delete</Text>
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { paddingHorizontal: width > 700 ? 48 : 16 }]}>
      <View style={styles.topRow}>
        <Pressable style={styles.newNoteBtn} onPress={onNewNote}>
          <Text style={styles.newNoteBtnText}>+ New Note</Text>
        </Pressable>
        <TextInput
          placeholder="Search notes"
          placeholderTextColor={colors.placeholder}
          value={query}
          onChangeText={setQuery}
          style={styles.search}
        />
      </View>

      <View style={styles.switchRow}>
        <View style={styles.switchItem}>
          <Text style={styles.switchLabel}>Dark Mode</Text>
          <Switch
            value={activeScheme === "dark"}
            onValueChange={(value) => onThemeOverrideChange(value ? "dark" : "light")}
          />
        </View>
        <View style={styles.switchItem}>
          <Text style={styles.switchLabel}>Focus</Text>
          <Switch value={focusMode} onValueChange={setFocusMode} />
        </View>
      </View>

      <FlatList
        data={filtered}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={filtered.length === 0 ? styles.emptyListContainer : styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No notes yet</Text>
            <Text style={styles.emptyText}>Tap New Note to start writing and save your first note.</Text>
          </View>
        }
      />
    </View>
  );
}

function createStyles(colors: Palette) {
  return StyleSheet.create({
    container: {
      flex: 1,
      width: "100%",
      paddingTop: 12,
      backgroundColor: colors.background,
    },
    topRow: {
      marginBottom: 12,
    },
    newNoteBtn: {
      backgroundColor: colors.text,
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 8,
      marginBottom: 12,
      alignItems: "center",
    },
    newNoteBtnText: {
      color: colors.background,
      fontWeight: "700",
      fontSize: 14,
    },
    search: {
      backgroundColor: colors.surface,
      padding: 12,
      borderRadius: 10,
      color: colors.text,
    },
    switchRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 8,
    },
    switchItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    switchLabel: { color: colors.text, marginRight: 8 },
    listContainer: {
      paddingVertical: 12,
    },
    emptyListContainer: {
      flexGrow: 1,
      paddingVertical: 12,
    },
    card: {
      backgroundColor: colors.surfaceTransparent,
      padding: 14,
      borderRadius: 12,
      marginBottom: 10,
      shadowColor: "#000",
      shadowOpacity: 0.05,
      shadowRadius: 10,
      elevation: 2,
    },
    cardFocus: {
      backgroundColor: colors.cardFocus,
    },
    cardHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 6,
    },
    title: { fontSize: 16, fontWeight: "600", color: colors.text, flex: 1, paddingRight: 12 },
    date: { fontSize: 12, color: colors.muted },
    snippet: { color: colors.muted, fontSize: 14, marginBottom: 10 },
    actionRow: {
      flexDirection: "row",
      gap: 8,
      marginTop: 10,
    },
    actionBtn: {
      flex: 1,
      paddingVertical: 8,
      paddingHorizontal: 8,
      borderRadius: 6,
      alignItems: "center",
    },
    editBtn: {
      backgroundColor: colors.accent,
    },
    deleteBtn: {
      backgroundColor: "#ef4444",
    },
    actionBtnText: {
      color: colors.text,
      fontWeight: "600",
      fontSize: 12,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: 40,
    },
    emptyTitle: {
      color: colors.text,
      fontSize: 18,
      fontWeight: "700",
      marginBottom: 6,
    },
    emptyText: {
      color: colors.muted,
      fontSize: 14,
      textAlign: "center",
      maxWidth: 240,
    },
  });
}
