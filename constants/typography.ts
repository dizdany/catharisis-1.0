import { StyleSheet } from 'react-native';
import colors from './colors';

export const typography = StyleSheet.create({
  // Clean, readable typography using system fonts
  title: {
    fontWeight: '600' as const,
    letterSpacing: 0.5,
    color: colors.primaryText,
  },
  body: {
    fontWeight: '400' as const,
    letterSpacing: 0.3,
    color: colors.primaryText,
  },
  script: {
    fontWeight: '300' as const,
    letterSpacing: 0.5,
    color: colors.secondaryText,
  },
  heading: {
    fontWeight: '500' as const,
    letterSpacing: 0.5,
    color: colors.primaryText,
  },
  caption: {
    fontWeight: '400' as const,
    letterSpacing: 0.3,
    color: colors.secondaryText,
  },
  button: {
    fontWeight: '500' as const,
    letterSpacing: 0.5,
    color: colors.buttonText,
  },
  buttonSecondary: {
    fontWeight: '500' as const,
    letterSpacing: 0.5,
    color: colors.buttonTextSecondary,
  },
});

export const elegantColors = {
  ...colors,
  // Clean color variations with better contrast
  elegantText: '#FFFFFF',
  elegantLight: '#CCCCCC',
  elegantAccent: '#DDDDDD',
};