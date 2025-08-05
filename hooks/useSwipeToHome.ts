import { useRouter } from 'expo-router';

export const useSwipeToHome = () => {
  const router = useRouter();
  
  const navigateHome = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)/');
    }
  };

  return {
    navigateHome,
  };
};