import React from 'react';
import { View, StyleSheet } from 'react-native';

interface SwipeToHomeWrapperProps {
  children: React.ReactNode;
  style?: any;
}

export default function SwipeToHomeWrapper({ children, style }: SwipeToHomeWrapperProps) {
  return <View style={[styles.container, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});