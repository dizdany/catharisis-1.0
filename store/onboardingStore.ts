import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';

interface OnboardingState {
  isCompleted: boolean;
  currentStep: number;
  totalSteps: number;
}

const STORAGE_KEY = 'onboarding-state';

export const [OnboardingProvider, useOnboardingStore] = createContextHook(() => {
  const [state, setState] = useState<OnboardingState>({
    isCompleted: false,
    currentStep: 0,
    totalSteps: 3,
  });
  const [isHydrated, setIsHydrated] = useState(false);

  // Load onboarding state from storage on mount
  useEffect(() => {
    loadOnboardingState();
  }, []);

  const loadOnboardingState = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsedState = JSON.parse(stored);
        setState(parsedState);
      }
    } catch (error) {
      console.log('Error loading onboarding state:', error);
    } finally {
      setIsHydrated(true);
    }
  };

  const saveOnboardingState = async (newState: OnboardingState) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
      setState(newState);
    } catch (error) {
      console.log('Error saving onboarding state:', error);
    }
  };

  const completeOnboarding = () => {
    const newState = {
      ...state,
      isCompleted: true,
      currentStep: state.totalSteps,
    };
    saveOnboardingState(newState);
  };

  const setCurrentStep = (step: number) => {
    const newState = {
      ...state,
      currentStep: Math.max(0, Math.min(step, state.totalSteps)),
    };
    saveOnboardingState(newState);
  };

  const nextStep = () => {
    if (state.currentStep < state.totalSteps) {
      setCurrentStep(state.currentStep + 1);
    }
  };

  const previousStep = () => {
    if (state.currentStep > 0) {
      setCurrentStep(state.currentStep - 1);
    }
  };

  const resetOnboarding = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      setState({
        isCompleted: false,
        currentStep: 0,
        totalSteps: 3,
      });
    } catch (error) {
      console.log('Error resetting onboarding:', error);
    }
  };

  return {
    isCompleted: state.isCompleted,
    currentStep: state.currentStep,
    totalSteps: state.totalSteps,
    isHydrated,
    completeOnboarding,
    setCurrentStep,
    nextStep,
    previousStep,
    resetOnboarding,
  };
});