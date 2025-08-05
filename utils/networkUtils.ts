import { Platform } from 'react-native';
import NetInfo from '@react-native-community/netinfo';

// Check if the app is connected to the internet
export const checkNetworkConnection = async (): Promise<boolean> => {
  try {
    // On web, use navigator.onLine if available
    if (Platform.OS === 'web') {
      // Check if navigator and onLine are available
      if (typeof navigator !== 'undefined' && typeof navigator.onLine === 'boolean') {
        return navigator.onLine;
      }
      // Fallback for web - assume connected if navigator.onLine is not available
      return true;
    }
    
    // On native platforms, use NetInfo
    const state = await NetInfo.fetch();
    
    // Handle null/undefined state
    if (!state) {
      console.warn('NetInfo returned null state, assuming connected');
      return true;
    }
    
    // Check if isConnected exists and is a boolean
    if (typeof state.isConnected === 'boolean') {
      return state.isConnected;
    }
    
    // Fallback - check if we have any connection type
    if (state.type && state.type !== 'none' && state.type !== 'unknown') {
      return true;
    }
    
    // Default to connected if we can't determine the state
    console.warn('Unable to determine network state, assuming connected');
    return true;
    
  } catch (error) {
    console.error('Error checking network connection:', error);
    // Return true on error to prevent blocking functionality
    return true;
  }
};

// Safe fetch function with timeout and offline handling
export const safeFetch = async (
  url: string, 
  options?: RequestInit,
  timeout = 10000
): Promise<Response> => {
  try {
    // First check if we're online
    const isConnected = await checkNetworkConnection();
    if (!isConnected) {
      throw new Error('No internet connection');
    }

    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    // Add abort signal to options
    const fetchOptions: RequestInit = {
      ...options,
      signal: controller.signal,
    };

    try {
      const response = await fetch(url, fetchOptions);
      clearTimeout(timeoutId);
      return response;
    } catch (fetchError) {
      clearTimeout(timeoutId);
      throw fetchError;
    }
    
  } catch (error) {
    console.error('Network request failed:', error);
    
    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timed out');
      }
      if (error.message === 'No internet connection') {
        throw error;
      }
    }
    
    throw new Error('Network request failed');
  }
};

// Get network connection info (mobile only)
export const getNetworkInfo = async () => {
  if (Platform.OS === 'web') {
    return {
      type: 'unknown',
      isConnected: typeof navigator !== 'undefined' ? navigator.onLine : true,
      details: null
    };
  }

  try {
    const state = await NetInfo.fetch();
    
    if (!state) {
      return {
        type: 'unknown',
        isConnected: true,
        details: null
      };
    }

    return {
      type: state.type || 'unknown',
      isConnected: state.isConnected ?? true,
      details: state.details || null
    };
  } catch (error) {
    console.error('Error getting network info:', error);
    return {
      type: 'unknown',
      isConnected: true,
      details: null
    };
  }
};