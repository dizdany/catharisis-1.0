import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Platform, Text, View } from "react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ErrorBoundary } from "@/components/ErrorBoundary";
import OfflineNotice from "@/components/OfflineNotice";
import AchievementBubble from "@/components/AchievementBubble";
import { trpc, trpcClient } from "@/lib/trpc";
import { useTheme } from "@/hooks/useTheme";
import { UserProfileProvider, useUserProfile } from "@/store/userProfileStore";
import { OnboardingProvider } from "@/store/onboardingStore";
import { useSettingsStore } from "@/store/settingsStore";
import { useAchievementStore } from "@/store/achievementStore";
import * as Updates from 'expo-updates';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        console.log(`Query retry attempt ${failureCount}:`, error);
        // Don't retry on network errors
        if (error instanceof Error && (error.message.includes('Network request failed') || error.message.includes('Failed to fetch'))) {
          console.log('Not retrying network error:', error.message);
          return false;
        }
        return failureCount < 3;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Custom error fallback component
const ErrorFallback = ({ error, resetError }: { error: Error, resetError: () => void }) => {
  const { colors } = useTheme();
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: colors.background }}>
      <Text style={{ fontSize: 18, color: colors.text, marginBottom: 10 }}>Something went wrong!</Text>
      <Text style={{ fontSize: 14, color: colors.lightText, marginBottom: 20, textAlign: 'center' }}>
        {Platform.OS === 'web' ? 'The app works best on mobile devices. Some features may be limited on web.' : error.message}
      </Text>
    </View>
  );
};

export default function RootLayout() {
  const [loaded, error] = useFonts({
    // Use system fonts to avoid loading issues
  });

  // Handle updates errors gracefully
  useEffect(() => {
    const handleUpdatesError = () => {
      console.log('Updates disabled in development mode');
    };

    // Only check for updates in production
    if (__DEV__) {
      handleUpdatesError();
    } else {
      // In production, handle updates properly
      Updates.checkForUpdateAsync()
        .then((update) => {
          if (update.isAvailable) {
            console.log('Update available, fetching...');
            return Updates.fetchUpdateAsync();
          }
        })
        .then((result) => {
          if (result?.isNew) {
            console.log('New update fetched, reloading...');
            Updates.reloadAsync();
          }
        })
        .catch((error) => {
          console.warn('Update check failed:', error);
          // Don't block the app if updates fail
        });
    }
  }, []);

  useEffect(() => {
    if (error) {
      console.error("Font loading error:", error);
      // Don't block the app if fonts fail to load
      try {
        SplashScreen.hideAsync();
      } catch (e) {
        console.warn("Error hiding splash screen:", e);
      }
    }
  }, [error]);

  useEffect(() => {
    if (loaded || error) {
      try {
        SplashScreen.hideAsync();
      } catch (e) {
        console.warn("Error hiding splash screen:", e);
      }
    }
  }, [loaded, error]);

  // Don't block the app if fonts are still loading
  // The app should work with system fonts as fallback
  if (!loaded && !error) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <QueryClientProvider client={queryClient}>
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
          <UserProfileProvider>
            <OnboardingProvider>
              <ErrorBoundary FallbackComponent={ErrorFallback}>
                <OfflineNotice />
                <RootLayoutNav />
              </ErrorBoundary>
            </OnboardingProvider>
          </UserProfileProvider>
        </trpc.Provider>
        </QueryClientProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

function RootLayoutNav() {
  const { colors } = useTheme();
  const router = useRouter();
  const segments = useSegments();
  const { profile, isLoading, hasSkippedOnboarding } = useUserProfile();
  const { setMoodDisplayMode } = useSettingsStore();
  const { currentNotification, showNotification, hideCurrentNotification } = useAchievementStore();
  
  // Sync mood display mode with user age
  useEffect(() => {
    if (profile) {
      setMoodDisplayMode(profile.age >= 16 ? 'text' : 'emoji');
    }
  }, [profile?.age, setMoodDisplayMode]);

  useEffect(() => {
    if (isLoading) return;
    
    // Wait for the navigation to be ready
    const timeout = setTimeout(() => {
      const inTabsGroup = segments[0] === '(tabs)';
      const inOnboarding = segments[0] === 'onboarding';
      const isOnboardingComplete = profile?.isOnboardingComplete || hasSkippedOnboarding;
      
      if (!isOnboardingComplete && !inOnboarding) {
        router.replace('/onboarding');
      } else if (isOnboardingComplete && !inTabsGroup && !segments[0]) {
        router.replace('/(tabs)');
      }
    }, 100);

    return () => clearTimeout(timeout);
  }, [profile, isLoading, hasSkippedOnboarding, segments, router]);
  
  return (
    <>
      <Stack
        screenOptions={{
          headerBackTitle: "Back",
          animation: 'slide_from_right',
        }}
      >
      <Stack.Screen 
        name="onboarding" 
        options={{ 
          headerShown: false,
          animation: 'fade',
        }} 
      />
      <Stack.Screen 
        name="(tabs)" 
        options={{ 
          headerShown: false,
          animation: 'none',
        }} 
      />
      <Stack.Screen 
        name="modal" 
        options={{ 
          presentation: "modal",
          animation: 'slide_from_bottom',
        }} 
      />
      <Stack.Screen
        name="verse/[id]"
        options={{
          headerShown: true,
          animation: 'slide_from_right',
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTitleStyle: {
            color: colors.text,
          },
          headerTintColor: colors.primary,
        }}
      />
      <Stack.Screen
        name="bible/[book]/index"
        options={{
          headerShown: true,
          animation: 'slide_from_right',
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTitleStyle: {
            color: colors.text,
          },
          headerTintColor: colors.primary,
        }}
      />
      <Stack.Screen
        name="bible/[book]/[chapter]"
        options={{
          headerShown: true,
          animation: 'slide_from_right',
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTitleStyle: {
            color: colors.text,
          },
          headerTintColor: colors.primary,
        }}
      />
      </Stack>
      
      {/* Achievement Bubble Notification */}
      <AchievementBubble
        achievement={currentNotification}
        visible={showNotification}
        onHide={hideCurrentNotification}
      />
    </>
  );
}