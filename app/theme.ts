export type Palette = {
  background: string;
  surface: string;
  surfaceTransparent: string;
  text: string;
  muted: string;
  accent: string;
  cardFocus: string;
  placeholder: string;
  headerButtonBg: string;
  headerButtonText: string;
};

export type ThemeOverride = "system" | "light" | "dark";

export const palettes: Record<string, Palette> = {
  light: {
    background: "#ffffff",
    surface: "#ffffff",
    surfaceTransparent: "rgba(255,255,255,0.85)",
    text: "#0f172a",
    muted: "#6b7280",
    accent: "#eef2ff",
    cardFocus: "#eef2ff",
    placeholder: "#666666",
    headerButtonBg: "rgba(255,255,255,0.9)",
    headerButtonText: "#111827",
  },
  dark: {
    background: "#0b0b0f",
    surface: "#0f1113",
    surfaceTransparent: "rgba(15,17,19,0.6)",
    text: "#f8fafc",
    muted: "#9ca3af",
    accent: "#1f2937",
    cardFocus: "#111827",
    placeholder: "#999999",
    headerButtonBg: "rgba(0,0,0,0.6)",
    headerButtonText: "#f8fafc",
  },
};

export function getPalette(scheme: string | null | undefined) {
  if (!scheme) return palettes.light;
  return palettes[scheme] || palettes.light;
}
