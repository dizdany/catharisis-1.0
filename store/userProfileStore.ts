import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';

export type Gender = 'male' | 'female';
export type UserMoodType = 'lost' | 'unsure' | 'good' | 'wonderful';

interface UserProfile {
  name: string;
  age: number;
  gender: Gender;
  isOnboardingComplete: boolean;
}

const STORAGE_KEY = 'user-profile';

export const [UserProfileProvider, useUserProfile] = createContextHook(() => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasSkippedOnboarding, setHasSkippedOnboarding] = useState(false);

  // Load profile from storage on mount
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      const skippedFlag = await AsyncStorage.getItem('onboarding-skipped');
      
      if (stored) {
        const parsedProfile = JSON.parse(stored);
        setProfile(parsedProfile);
      }
      
      if (skippedFlag === 'true') {
        setHasSkippedOnboarding(true);
      }
    } catch (error) {
      console.log('Error loading profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveProfile = async (newProfile: UserProfile) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newProfile));
      setProfile(newProfile);
    } catch (error) {
      console.log('Error saving profile:', error);
    }
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (profile) {
      const updatedProfile = { ...profile, ...updates };
      saveProfile(updatedProfile);
    }
  };

  const createProfile = (name: string, age: number, gender: Gender) => {
    const newProfile: UserProfile = {
      name,
      age,
      gender,
      isOnboardingComplete: true,
    };
    saveProfile(newProfile);
  };

  const resetProfile = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      await AsyncStorage.removeItem('onboarding-skipped');
      setProfile(null);
      setHasSkippedOnboarding(false);
    } catch (error) {
      console.log('Error resetting profile:', error);
    }
  };

  const markOnboardingAsSkipped = async () => {
    try {
      await AsyncStorage.setItem('onboarding-skipped', 'true');
      setHasSkippedOnboarding(true);
    } catch (error) {
      console.log('Error marking onboarding as skipped:', error);
    }
  };

  const isAdult = () => {
    return profile ? profile.age >= 18 : true;
  };

  const shouldShowText = () => {
    // When no profile exists (user skipped onboarding), default to emoji display (false)
    return profile ? profile.age >= 16 : false;
  };

  return {
    profile,
    isLoading,
    hasSkippedOnboarding,
    createProfile,
    updateProfile,
    resetProfile,
    markOnboardingAsSkipped,
    isAdult,
    shouldShowText,
  };
});