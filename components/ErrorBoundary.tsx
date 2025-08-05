import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import colors from '@/constants/colors';
import { Platform } from 'react-native';

interface Props {
  children: ReactNode;
  FallbackComponent?: React.ComponentType<{ error: Error; resetError: () => void }>;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  resetError = (): void => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render(): ReactNode {
    const { hasError, error } = this.state;
    const { children, FallbackComponent } = this.props;

    if (hasError && error) {
      if (FallbackComponent) {
        return <FallbackComponent error={error} resetError={this.resetError} />;
      }

      // Default fallback UI
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Something went wrong!</Text>
          <Text style={styles.message}>
            {Platform.OS === 'web' 
              ? 'The app works best on mobile devices. Some features may be limited on web.' 
              : error.message}
          </Text>
          <TouchableOpacity 
            style={styles.button} 
            onPress={this.resetError}
          >
            <Text style={styles.buttonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 18,
    color: colors.text,
    marginBottom: 10,
    fontWeight: '600',
  },
  message: {
    fontSize: 14,
    color: colors.lightText,
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 20,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: colors.secondary,
    fontWeight: '500',
  }
});