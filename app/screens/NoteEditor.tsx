import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
  useColorScheme,
  useWindowDimensions,
} from "react-native";
import { getPalette, type Palette, type ThemeOverride } from "../theme";
import { type Note } from "../hooks/useNotes";

type NoteEditorProps = {
  themeOverride: ThemeOverride;
  onBack: () => void;
  onSave: (title: string, body: string, image?: string | null) => void;
  editingNote?: Note | null;
};

export default function NoteEditor({ themeOverride, onBack, onSave, editingNote }: NoteEditorProps) {
  const sysScheme = useColorScheme() || "light";
  const scheme = themeOverride === "system" ? sysScheme : themeOverride;
  const colors = getPalette(scheme);
  const [title, setTitle] = useState(editingNote?.title || "");
  const [body, setBody] = useState(editingNote?.body || "");
  const { width } = useWindowDimensions();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const isEditing = !!editingNote;
  const saveButtonText = isEditing ? "Update" : "Save";
  const headerImage = editingNote?.image
    ? { uri: editingNote.image }
    : require("../../assets/images/ChatGPT Image May 5, 2026, 12_49_08 AM.png");

  useEffect(() => {
    setTitle(editingNote?.title || "");
    setBody(editingNote?.body || "");
  }, [editingNote]);

  return (
    <KeyboardAvoidingView style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.select({ ios: "padding", android: undefined })}
      keyboardVerticalOffset={80}
    >
      <SafeAreaView style={{ backgroundColor: 'transparent' }}>
        <ImageBackground
          source={headerImage}
          style={[
            styles.header,
            {
              height: Math.max(190, Math.min(280, Math.round(width * 0.24))) + (Platform.OS === 'android' ? StatusBar.currentHeight ?? 0 : 0),
            },
          ]}
          imageStyle={styles.headerImage}
        >
          <View style={styles.headerOverlay}>
            <View style={[styles.headerRow, { paddingHorizontal: width > 700 ? 48 : 16 }]}>
              <Pressable
                style={[styles.headerButton, { backgroundColor: colors.accent }]}
                onPress={onBack}
              >
                <Text style={[styles.headerButtonText, { color: colors.text }]}>Back</Text>
              </Pressable>

              <Pressable
                style={[styles.headerButton, { backgroundColor: colors.accent }]}
                onPress={() => onSave(title, body, editingNote?.image ?? null)}
              >
                <Text style={[styles.headerButtonText, { color: colors.text }]}>{saveButtonText}</Text>
              </Pressable>
            </View>
          </View>
        </ImageBackground>
      </SafeAreaView>

      <View style={[styles.form, { paddingHorizontal: width > 700 ? 48 : 16 }]}>
        <TextInput
          placeholder="Title"
          placeholderTextColor={colors.placeholder}
          value={title}
          onChangeText={setTitle}
          style={styles.titleInput}
          returnKeyType="done"
        />
        <TextInput
          placeholder="Start writing your note..."
          placeholderTextColor={colors.placeholder}
          value={body}
          onChangeText={setBody}
          multiline
          style={styles.bodyInput}
          textAlignVertical="top"
        />
      </View>
    </KeyboardAvoidingView>
  );
}

function createStyles(colors: Palette) {
  return StyleSheet.create({
    container: { flex: 1 },
    header: {
      position: "relative",
      overflow: "hidden",
      borderBottomWidth: 1,
      width: "100%",
    },
    headerImage: {
      borderBottomLeftRadius: 18,
      borderBottomRightRadius: 18,
      resizeMode: "cover",
    },
    headerOverlay: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: "flex-start",
      paddingTop: 16,
      backgroundColor: "rgba(0,0,0,0.24)",
    },
    headerRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
      gap: 12,
    },
    headerButton: {
      paddingVertical: 12,
      paddingHorizontal: 18,
      borderRadius: 10,
      minWidth: 96,
      flexShrink: 0,
      alignItems: "center",
    },
    headerButtonText: { fontWeight: "600", fontSize: 14 },
    form: { flex: 1, width: "100%", paddingTop: 16, paddingHorizontal: 16 },
    titleInput: {
      fontSize: 20,
      fontWeight: "700",
      marginBottom: 12,
      color: colors.text,
      paddingVertical: 8,
    },
    bodyInput: {
      flex: 1,
      fontSize: 16,
      color: colors.text,
      paddingVertical: 8,
    },
  });
}
