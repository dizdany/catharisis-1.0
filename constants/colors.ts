export const lightTheme = {
  primary: "#B8860B", // Dark goldenrod - main autumn color
  secondary: "#FFFFFF", // White
  background: "#FFF8DC", // Cornsilk - warm cream background
  text: "#2F1B14", // Dark brown text
  lightText: "#8B4513", // Saddle brown for secondary text
  cardBackground: "#F5E6D3", // Light beige for cards
  accent: "#DEB887", // Burlywood accent
  divider: "#D2B48C", // Tan divider
  shadow: "#8B4513", // Brown shadow
  overlay: "rgba(139, 69, 19, 0.5)", // Brown overlay for modals
  success: "#228B22", // Forest green
  error: "#CD853F", // Peru - warm error color
  primaryText: "#2F1B14",
  secondaryText: "#8B4513",
  mutedText: "#A0522D",
  buttonText: "#FFFFFF", // For buttons with colored background
  buttonTextSecondary: "#B8860B", // Autumn gold for buttons with light background
};

export const darkTheme = {
  primary: "#FFFFFF", // Pure white
  secondary: "#000000", // Pure black
  background: "#000000", // Black background
  text: "#FFFFFF", // White text - ensure high contrast
  lightText: "#CCCCCC", // Lighter gray text for better visibility
  cardBackground: "#1A1A1A", // Slightly lighter dark gray for cards
  accent: "#333333", // Dark gray accent
  divider: "#333333", // Dark divider
  shadow: "#000000", // Black shadow
  overlay: "rgba(0, 0, 0, 0.5)", // Overlay for modals
  success: "#4CAF50", // Success color
  error: "#F44336", // Error color
  primaryText: "#FFFFFF",
  secondaryText: "#CCCCCC",
  mutedText: "#999999",
  buttonText: "#000000", // For buttons with white background
  buttonTextSecondary: "#FFFFFF", // For buttons with dark background
};

// Default export for backward compatibility (dark theme)
const colors = darkTheme;

export default colors;