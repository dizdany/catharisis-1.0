import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Platform } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import colors from '@/constants/colors';

export default function OfflineNotice() {
  const [isOffline, setIsOffline] = useState(false);
  const slideAnim = React.useRef(new Animated.Value(-50)).current;

  useEffect(() => {
    let isMounted = true;
    let unsubscribe: (() => void) | null = null;
    
    const checkConnection = async () => {
      try {
        let isConnected = true;
        
        // On web, use navigator.onLine if available
        if (Platform.OS === 'web') {
          if (typeof navigator !== 'undefined' && typeof navigator.onLine === 'boolean') {
            isConnected = navigator.onLine;
          }
        } else {
          // On native, use NetInfo
          const state = await NetInfo.fetch();
          if (state && typeof state.isConnected === 'boolean') {
            isConnected = state.isConnected;
          }
        }
        
        if (isMounted) {
          const wasOffline = isOffline;
          const nowOffline = !isConnected;
          
          setIsOffline(nowOffline);
          
          // Only animate if the state actually changed
          if (wasOffline !== nowOffline) {
            if (nowOffline) {
              // Slide in the notice
              Animated.spring(slideAnim, {
                toValue: 0,
                useNativeDriver: true,
                friction: 8,
                tension: 100,
              }).start();
            } else {
              // Slide out the notice
              Animated.spring(slideAnim, {
                toValue: -50,
                useNativeDriver: true,
                friction: 8,
                tension: 100,
              }).start();
            }
          }
        }
      } catch (error) {
        console.error('Error checking network connection:', error);
        // On error, assume connected to prevent blocking UI
        if (isMounted) {
          setIsOffline(false);
        }
      }
    };
    
    // Check immediately
    checkConnection();
    
    // Set up platform-specific listeners
    if (Platform.OS === 'web') {
      // Web: listen to online/offline events
      const handleOnline = () => {
        if (isMounted) {
          setIsOffline(false);
          Animated.spring(slideAnim, {
            toValue: -50,
            useNativeDriver: true,
            friction: 8,
            tension: 100,
          }).start();
        }
      };
      
      const handleOffline = () => {
        if (isMounted) {
          setIsOffline(true);
          Animated.spring(slideAnim, {
            toValue: 0,
            useNativeDriver: true,
            friction: 8,
            tension: 100,
          }).start();
        }
      };
      
      if (typeof window !== 'undefined') {
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        
        return () => {
          isMounted = false;
          window.removeEventListener('online', handleOnline);
          window.removeEventListener('offline', handleOffline);
        };
      }
    } else {
      // Native: use NetInfo listener
      try {
        unsubscribe = NetInfo.addEventListener(state => {
          if (isMounted && state) {
            const isConnected = state.isConnected ?? true;
            const wasOffline = isOffline;
            const nowOffline = !isConnected;
            
            setIsOffline(nowOffline);
            
            // Only animate if the state actually changed
            if (wasOffline !== nowOffline) {
              if (nowOffline) {
                Animated.spring(slideAnim, {
                  toValue: 0,
                  useNativeDriver: true,
                  friction: 8,
                  tension: 100,
                }).start();
              } else {
                Animated.spring(slideAnim, {
                  toValue: -50,
                  useNativeDriver: true,
                  friction: 8,
                  tension: 100,
                }).start();
              }
            }
          }
        });
      } catch (error) {
        console.error('Error setting up NetInfo listener:', error);
        // Fallback to periodic checking
        const intervalId = setInterval(checkConnection, 5000);
        return () => {
          isMounted = false;
          clearInterval(intervalId);
        };
      }
    }
    
    return () => {
      isMounted = false;
      if (unsubscribe) {
        try {
          unsubscribe();
        } catch (error) {
          console.error('Error unsubscribing from NetInfo:', error);
        }
      }
    };
  }, [slideAnim, isOffline]);

  if (!isOffline) return null;

  return (
    <Animated.View 
      style={[
        styles.container,
        { transform: [{ translateY: slideAnim }] }
      ]}
    >
      <Text style={styles.text}>You are offline. Some features may be limited.</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.error,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
});