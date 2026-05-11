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

type Note = {
  id: string;
  title: string;
  body: string;
  date: string;
};

const SAMPLE_NOTES: Note[] = Array.from({ length: 12 }).map((_, i) => ({
  id: String(i + 1),
  title: `Note ${i + 1}`,
  body:
    "This is a short preview of the note content. It should give a glimpse of the note body so users can scan quickly.",
  date: new Date(Date.now() - i * 1000 * 60 * 60 * 24).toLocaleDateString(),
}));

type NotesListProps = {
  themeOverride: ThemeOverride;
  activeScheme: "light" | "dark";
  onThemeOverrideChange: (mode: ThemeOverride) => void;
};

export default function NotesList({ activeScheme, onThemeOverrideChange }: NotesListProps) {
  const [focusMode, setFocusMode] = useState(false);
  const [query, setQuery] = useState("");
  const colors = getPalette(activeScheme);
  const { width } = useWindowDimensions();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return SAMPLE_NOTES;
    return SAMPLE_NOTES.filter(
      (n) => n.title.toLowerCase().includes(q) || n.body.toLowerCase().includes(q)
    );
  }, [query]);

  const styles = useMemo(() => createStyles(colors), [colors]);

  const renderItem = ({ item }: { item: Note }) => {
    const cardStyle = [styles.card, focusMode ? styles.cardFocus : null];
    return (
      <Pressable style={cardStyle} onPress={() => {}}>
        <View style={styles.cardHeader}>
          <Text style={styles.title} numberOfLines={1}>
            {item.title}
          </Text>
          {!focusMode && (
            <Text style={styles.date}>{item.date}</Text>
          )}
        </View>
        <Text style={styles.snippet} numberOfLines={2}>
          {item.body}
        </Text>
      </Pressable>
    );
  };

  return (
      <View style={[styles.container, { paddingHorizontal: width > 700 ? 48 : 16 }]}>
      <View style={styles.topRow}>
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
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ paddingVertical: 12 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
function createStyles(colors: Palette) {
  return StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 12,
      backgroundColor: colors.background,
    },
    topRow: {
      marginBottom: 12,
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
    card: {
      backgroundColor: colors.surface,
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
    title: { fontSize: 16, fontWeight: "600", color: colors.text },
    date: { fontSize: 12, color: colors.muted },
    snippet: { color: colors.muted, fontSize: 14 },
  });
}
