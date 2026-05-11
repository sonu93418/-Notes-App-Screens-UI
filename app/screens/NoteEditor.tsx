import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  useColorScheme,
  useWindowDimensions,
} from "react-native";
import { getPalette, type Palette, type ThemeOverride } from "../theme";

type NoteEditorProps = {
  themeOverride: ThemeOverride;
  onBack: () => void;
  onSave: (title: string, body: string) => void;
};

export default function NoteEditor({ themeOverride, onBack, onSave }: NoteEditorProps) {
  const sysScheme = useColorScheme() || "light";
  const scheme = themeOverride === "system" ? sysScheme : themeOverride;
  const colors = getPalette(scheme);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const { width } = useWindowDimensions();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <KeyboardAvoidingView style={styles.container}
      behavior={Platform.select({ ios: "padding", android: undefined })}
      keyboardVerticalOffset={80}
    >
      <ImageBackground
        source={require("../../assets/images/splash-icon.png")}
        style={[styles.header, { paddingHorizontal: width > 700 ? 48 : 16 }]}
        imageStyle={{ borderBottomLeftRadius: 18, borderBottomRightRadius: 18 }}
      >
        <View style={styles.headerRow}>
          <Pressable
            style={[styles.headerButton, { backgroundColor: colors.headerButtonBg }]}
            onPress={onBack}
          >
            <Text style={[styles.headerButtonText, { color: colors.headerButtonText }]}>{"< Back"}</Text>
          </Pressable>
          <Pressable
            style={[styles.headerButton, { backgroundColor: colors.headerButtonBg }]}
            onPress={() => onSave(title, body)}
          >
            <Text style={[styles.headerButtonText, { color: colors.headerButtonText }]}>{"Save"}</Text>
          </Pressable>
        </View>
      </ImageBackground>

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
    container: { flex: 1, backgroundColor: colors.background },
    header: {
      height: 140,
      justifyContent: "flex-end",
      paddingVertical: 12,
      backgroundColor: "rgba(100, 150, 200, 0.4)",
    },
    headerRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    headerButton: {
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 8,
    },
    headerButtonText: { fontWeight: "600" },
    form: { flex: 1, paddingTop: 16 },
    titleInput: {
      fontSize: 20,
      fontWeight: "700",
      marginBottom: 12,
      color: colors.text,
    },
    bodyInput: {
      flex: 1,
      fontSize: 16,
      color: colors.text,
    },
  });
}
