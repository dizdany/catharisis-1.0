import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  RefreshControl,
  Alert,
  Animated,
  Modal
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { ChevronLeft, ChevronRight, Heart, RefreshCw, Check, X, HeartOff } from 'lucide-react-native';
import { trpc } from '@/lib/trpc';
import { useTheme } from '@/hooks/useTheme';
import { typography } from '@/constants/typography';
import { useTranslation } from '@/hooks/useTranslation';
import { useVerseStore } from '@/store/verseStore';
import { useLanguageStore } from '@/store/languageStore';
import { useSettingsStore } from '@/store/settingsStore';
import { useReadingStore } from '@/store/readingStore';
import AnimatedButton from '@/components/AnimatedButton';

interface BibleVerse {
  verse: number;
  text: string;
}

interface ChapterContentProps {
  book: string;
  chapter: string;
  highlightVerse?: string;
}

function ChapterContent({ book, chapter, highlightVerse }: ChapterContentProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { language } = useLanguageStore();
  const { 
    addBibleVerseToFavorites, 
    addVerseRangeToFavorites,
    removeFromFavorites, 
    removeSelectedVersesFromFavorites,
    isFavorite, 
    generateVerseId,
    selectedVerses,
    selectionMode,
    toggleVerseSelection,
    clearSelection,
    setSelectionMode,
    isVerseSelected
  } = useVerseStore();
  const { markChapterAsRead, startReadingSession, endReadingSession } = useReadingStore();
  
  const [refreshing, setRefreshing] = useState(false);
  const [highlightedVerse, setHighlightedVerse] = useState<number | null>(null);
  const [favoriteHighlightVerse, setFavoriteHighlightVerse] = useState<number | null>(null);
  const [showBookTransitionModal, setShowBookTransitionModal] = useState(false);
  const [transitionData, setTransitionData] = useState<{
    direction: 'prev' | 'next';
    targetBook?: any;
    message: string;
    confirmText: string;
    onConfirm: () => void;
  } | null>(null);
  const scrollY = useRef(new Animated.Value(0)).current;
  const stickyHeaderOpacity = useRef(new Animated.Value(0)).current;
  const modalScale = useRef(new Animated.Value(0)).current;
  const modalOpacity = useRef(new Animated.Value(0)).current;
  
  // Set highlighted verse from params
  useEffect(() => {
    if (highlightVerse) {
      setHighlightedVerse(parseInt(highlightVerse));
    }
  }, [highlightVerse]);
  
  // Double tap detection
  const lastTap = useRef<number | null>(null);
  const DOUBLE_TAP_DELAY = 300;

  // Use appropriate API based on language
  const { 
    data: chapterData, 
    isLoading, 
    error, 
    refetch 
  } = language === 'ro' 
    ? trpc.bible.getChapterRomanian.useQuery({
        book: book,
        chapter: parseInt(chapter)
      })
    : trpc.bible.getChapter.useQuery({
        book: book,
        chapter: parseInt(chapter)
      });

  // Start reading session when component mounts and data is loaded
  useEffect(() => {
    if (chapterData && book && chapter) {
      console.log('Starting reading session for:', book, chapter);
      startReadingSession();
    }
  }, [chapterData, book, chapter, startReadingSession]);

  // Mark chapter as read and end session when component unmounts or navigates away
  useEffect(() => {
    return () => {
      if (book && chapter) {
        console.log('Ending reading session and marking chapter as read:', book, chapter);
        endReadingSession(book, parseInt(chapter));
        markChapterAsRead(book, parseInt(chapter));
      }
    };
  }, [book, chapter, endReadingSession, markChapterAsRead]);

  // Clear highlight after delay
  useEffect(() => {
    if (highlightedVerse) {
      const timer = setTimeout(() => {
        setHighlightedVerse(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [highlightedVerse]);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleVerseDoubleTap = (verse: BibleVerse) => {
    if (!chapterData || !book) return;
    
    // Use the URL book parameter for consistent ID generation
    const verseId = generateVerseId(book, parseInt(chapter), verse.verse);
    const reference = `${chapterData.book} ${chapter}:${verse.verse}`;
    
    if (isFavorite(verseId)) {
      removeFromFavorites(verseId);
    } else {
      addBibleVerseToFavorites({
        text: verse.text,
        reference: reference,
        book: book, // Use URL book parameter
        chapter: parseInt(chapter),
        verse: verse.verse
      });
      
      // Trigger favorite highlight
      setFavoriteHighlightVerse(verse.verse);
      
      // Clear highlight after delay
      setTimeout(() => {
        setFavoriteHighlightVerse(null);
      }, 3000);
    }
  };

  const handleVerseTap = (verse: BibleVerse) => {
    if (selectionMode) {
      // In selection mode, tap to select/deselect verses
      toggleVerseSelection(verse.verse);
      return;
    }
    
    const now = Date.now();
    
    if (lastTap.current && (now - lastTap.current) < DOUBLE_TAP_DELAY) {
      // Double tap detected
      handleVerseDoubleTap(verse);
      lastTap.current = null;
    } else {
      // Single tap
      lastTap.current = now;
    }
  };
  
  const handleVerseLongPress = (verse: BibleVerse) => {
    if (!selectionMode) {
      setSelectionMode(true);
      toggleVerseSelection(verse.verse);
      // Show sticky header when entering selection mode
      Animated.timing(stickyHeaderOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };
  
  const handleSaveSelectedVerses = () => {
    if (selectedVerses.length === 0 || !chapterData) return;
    
    const versesToSave = chapterData.verses
      .filter(v => selectedVerses.includes(v.verse))
      .map(v => ({ verse: v.verse, text: v.text }));
    
    addVerseRangeToFavorites({
      verses: versesToSave,
      book: book,
      chapter: parseInt(chapter),
      bookDisplayName: chapterData.book
    });
    
    // Show heart animation for all selected verses
    selectedVerses.forEach((verseNum, index) => {
      setTimeout(() => {
        setFavoriteHighlightVerse(verseNum);
        setTimeout(() => {
          setFavoriteHighlightVerse(null);
        }, 1500);
      }, index * 100); // Stagger the animations
    });
    
    clearSelection();
    
    // Hide sticky header when saving
    Animated.timing(stickyHeaderOpacity, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
    
    // Show success feedback
    Alert.alert(
      t('success'),
      t('versesAddedToFavorites'),
      [{ text: t('ok'), style: 'default' }]
    );
  };
  
  const handleRemoveSelectedVerses = () => {
    if (selectedVerses.length === 0) return;
    
    Alert.alert(
      t('removeFavorites'),
      t('confirmRemoveFavorites'),
      [
        { text: t('cancel'), style: 'cancel' },
        { 
          text: t('remove'), 
          style: 'destructive',
          onPress: () => {
            removeSelectedVersesFromFavorites(book, parseInt(chapter));
            
            clearSelection();
            
            // Hide sticky header when removing
            Animated.timing(stickyHeaderOpacity, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }).start();
            
            // Show success feedback
            Alert.alert(
              t('success'),
              t('versesRemovedFromFavorites'),
              [{ text: t('ok'), style: 'default' }]
            );
          }
        }
      ]
    );
  };
  
  const handleCancelSelection = () => {
    clearSelection();
    // Hide sticky header when exiting selection mode
    Animated.timing(stickyHeaderOpacity, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  // Get book info to check chapter limits
  const { data: booksData, isLoading: booksLoading, error: booksError } = trpc.bible.getBibleBooks.useQuery({ language });
  const currentBook = booksData?.find(b => b.id === book);
  
  // Debug logging for books data
  useEffect(() => {
    console.log('Books query state:', {
      booksLoading,
      booksError: booksError?.message,
      booksDataLength: booksData?.length,
      currentBookId: book,
      currentBookFound: !!currentBook,
      language
    });
    if (booksData) {
      console.log('Available book IDs:', booksData.map(b => b.id));
    }
  }, [booksData, booksLoading, booksError, book, currentBook, language]);
  
  const navigateChapter = (direction: 'prev' | 'next') => {
    const currentChapter = parseInt(chapter);
    const newChapter = direction === 'prev' ? currentChapter - 1 : currentChapter + 1;
    
    console.log('Navigate chapter:', { direction, currentChapter, newChapter, bookChapters: currentBook?.chapters });
    
    if (direction === 'prev' && newChapter < 1) {
      // At the beginning of current book
      if (isAtFirstBook()) {
        // Already at the first book, show message
        setTransitionData({
          direction: 'prev',
          message: t('firstBookReached'),
          confirmText: t('ok'),
          onConfirm: () => {}
        });
        setShowBookTransitionModal(true);
        return;
      }
      // Try to go to previous book
      console.log('At beginning of book, transitioning to previous book');
      handleBookTransition('prev');
      return;
    }
    
    if (direction === 'next' && currentBook && newChapter > currentBook.chapters) {
      // At the end of current book
      if (isAtLastBook()) {
        // Already at the last book, show message
        setTransitionData({
          direction: 'next',
          message: t('lastBookReached'),
          confirmText: t('ok'),
          onConfirm: () => {}
        });
        setShowBookTransitionModal(true);
        return;
      }
      // Try to go to next book
      console.log('At end of book, transitioning to next book');
      handleBookTransition('next');
      return;
    }
    
    // Navigate within the same book using replace to avoid stacking history
    console.log('Navigating within book to chapter:', newChapter);
    router.replace(`/bible/${book}/${newChapter}` as any);
  };
  
  // Helper functions to determine button states
  const isAtFirstChapter = () => {
    return parseInt(chapter) === 1;
  };
  
  const isAtLastChapter = () => {
    return currentBook && parseInt(chapter) === currentBook.chapters;
  };
  
  const isAtFirstBook = () => {
    if (!booksData || !currentBook) return false;
    const sortedBooks = [...booksData].sort((a, b) => a.order - b.order);
    return sortedBooks[0]?.id === book;
  };
  
  const isAtLastBook = () => {
    if (!booksData || !currentBook) return false;
    const sortedBooks = [...booksData].sort((a, b) => a.order - b.order);
    return sortedBooks[sortedBooks.length - 1]?.id === book;
  };
  
  const getNavigationButtonText = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      if (isAtFirstChapter()) {
        // Check if this is the first book of the Bible
        if (isAtFirstBook()) {
          return t('startOfBible');
        }
        return t('previousBook');
      }
      return t('previous');
    } else {
      if (isAtLastChapter()) {
        // Check if this is the last book of the Bible
        if (isAtLastBook()) {
          return t('endOfBible');
        }
        return t('nextBook');
      }
      return t('next');
    }
  };
  
  const handleBookTransition = (direction: 'prev' | 'next') => {
    console.log('handleBookTransition called with direction:', direction);
    
    // Wait for books data to load if it's still loading
    if (booksLoading) {
      console.log('Books data still loading, waiting...');
      setTimeout(() => handleBookTransition(direction), 500);
      return;
    }
    
    if (!booksData || !currentBook) {
      console.log('Missing data for book transition:', { 
        booksData: !!booksData, 
        currentBook: !!currentBook,
        booksLoading,
        booksError: booksError?.message
      });
      setTransitionData({
        direction,
        message: 'Unable to load book data. Please try again.',
        confirmText: t('ok'),
        onConfirm: () => {}
      });
      setShowBookTransitionModal(true);
      return;
    }
    
    // Sort books by order to find adjacent books
    const sortedBooks = [...booksData].sort((a, b) => a.order - b.order);
    const currentIndex = sortedBooks.findIndex(b => b.id === book);
    
    console.log('Book transition:', { 
      direction, 
      currentIndex, 
      totalBooks: sortedBooks.length, 
      currentBook: book,
      sortedBooks: sortedBooks.map(b => ({ id: b.id, name: b.name, order: b.order }))
    });
    
    if (currentIndex === -1) {
      console.error('Current book not found in books data');
      setTransitionData({
        direction,
        message: 'Current book not found. Please try again.',
        confirmText: t('ok'),
        onConfirm: () => {}
      });
      setShowBookTransitionModal(true);
      return;
    }
    
    if (direction === 'prev') {
      if (currentIndex === 0) {
        // First book of the Bible - this should not happen as we check isAtFirstBook() before calling this function
        console.log('Unexpected: handleBookTransition called for first book');
        setTransitionData({
          direction: 'prev',
          message: t('firstBookReached'),
          confirmText: t('ok'),
          onConfirm: () => {}
        });
        setShowBookTransitionModal(true);
        return;
      }
      
      const previousBook = sortedBooks[currentIndex - 1];
      console.log('Going to previous book:', previousBook);
      console.log('About to show Alert for previous book transition');
      
      // Show custom modal for previous book transition
      setTransitionData({
        direction: 'prev',
        targetBook: previousBook,
        message: t('goToPreviousBook'),
        confirmText: t('previousBook'),
        onConfirm: () => {
          const targetPath = `/bible/${previousBook.id}/${previousBook.chapters}`;
          console.log('Navigating to previous book:', targetPath);
          router.replace(targetPath as any);
        }
      });
      setShowBookTransitionModal(true);
    } else {
      if (currentIndex === sortedBooks.length - 1) {
        // Last book of the Bible - this should not happen as we check isAtLastBook() before calling this function
        console.log('Unexpected: handleBookTransition called for last book');
        setTransitionData({
          direction: 'next',
          message: t('lastBookReached'),
          confirmText: t('ok'),
          onConfirm: () => {}
        });
        setShowBookTransitionModal(true);
        return;
      }
      
      const nextBook = sortedBooks[currentIndex + 1];
      console.log('Going to next book:', nextBook);
      console.log('About to show Alert for next book transition');
      
      // Show custom modal for next book transition
      setTransitionData({
        direction: 'next',
        targetBook: nextBook,
        message: t('continueToNextBook'),
        confirmText: t('nextBook'),
        onConfirm: () => {
          const targetPath = `/bible/${nextBook.id}/1`;
          console.log('Navigating to next book:', targetPath);
          router.replace(targetPath as any);
        }
      });
      setShowBookTransitionModal(true);
    }
  };

  // Modal animation functions
  const showModal = useCallback(() => {
    setShowBookTransitionModal(true);
    // Reset animation values first
    modalScale.setValue(0);
    modalOpacity.setValue(0);
    
    // Start animations after a small delay to ensure modal is rendered
    setTimeout(() => {
      Animated.parallel([
        Animated.spring(modalScale, {
          toValue: 1,
          useNativeDriver: true,
          friction: 8,
          tension: 100,
        }),
        Animated.timing(modalOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        })
      ]).start();
    }, 50);
  }, [modalScale, modalOpacity]);

  const hideModal = useCallback(() => {
    Animated.parallel([
      Animated.timing(modalScale, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(modalOpacity, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      })
    ]).start(() => {
      setShowBookTransitionModal(false);
      setTransitionData(null);
    });
  }, [modalScale, modalOpacity]);

  // Show modal when transition data is set
  useEffect(() => {
    if (transitionData) {
      showModal();
    }
  }, [transitionData, showModal]);

  if (error) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: colors.background }]}>
        <RefreshCw size={32} color={colors.secondaryText} style={styles.errorIcon} />
        <Text style={[styles.errorTitle, { color: colors.primaryText }]}>
          {t('failedToLoadChapter')}
        </Text>
        <Text style={[styles.errorText, { color: colors.secondaryText }]}>
          {error.message}
        </Text>
        <AnimatedButton
          title={t('retry')}
          onPress={() => refetch()}
          style={[styles.retryButton, { backgroundColor: colors.primary }]}
        />
      </View>
    );
  }

  const chapterTitle = chapterData ? `${chapterData.book} ${chapter}` : `${book} ${chapter}`;

  return (
    <>
      <Stack.Screen 
        options={{
          title: chapterTitle,
          headerTitleStyle: {
            color: colors.primaryText,
            fontWeight: '600',
            fontSize: 16,
          },
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTitleAlign: 'center',
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={{ 
                marginLeft: 8, 
                padding: 12,
                marginTop: 8,
                borderRadius: 8,
                backgroundColor: colors.background + '80'
              }}
            >
              <ChevronLeft size={24} color={colors.primaryText} />
            </TouchableOpacity>
          ),
        }} 
      />
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Sticky Header for Selection Mode */}
        {selectionMode && (
          <Animated.View 
            style={[
              styles.stickyHeader, 
              { 
                backgroundColor: colors.background,
                borderBottomColor: colors.divider,
                opacity: stickyHeaderOpacity,
                transform: [{
                  translateY: stickyHeaderOpacity.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-60, 0],
                  })
                }]
              }
            ]}
          >
            <View style={styles.stickyHeaderContent}>
              <View style={styles.stickyHeaderInfo}>
                <Text style={[styles.stickyHeaderTitle, { color: colors.primaryText }]}>
                  {chapterTitle}
                </Text>
                <Text style={[styles.stickyHeaderSubtitle, { color: colors.primary }]}>
                  {selectedVerses.length} {t('versesSelected')}
                </Text>
              </View>
              <View style={styles.stickyHeaderActions}>
                <TouchableOpacity
                  style={[styles.stickyActionButton, { backgroundColor: colors.primary }]}
                  onPress={handleSaveSelectedVerses}
                  disabled={selectedVerses.length === 0}
                >
                  <Heart size={14} color={colors.buttonText} fill={colors.buttonText} />
                  <Text style={[styles.stickyActionButtonText, { color: colors.buttonText }]}>
                    {t('save')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.stickyActionButton, { backgroundColor: colors.error }]}
                  onPress={handleRemoveSelectedVerses}
                  disabled={selectedVerses.length === 0}
                >
                  <HeartOff size={14} color={colors.buttonText} />
                  <Text style={[styles.stickyActionButtonText, { color: colors.buttonText }]}>
                    {t('remove')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.stickyActionButton, { backgroundColor: colors.secondaryText }]}
                  onPress={handleCancelSelection}
                >
                  <X size={14} color={colors.buttonText} />
                  <Text style={[styles.stickyActionButtonText, { color: colors.buttonText }]}>
                    {t('cancel')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        )}
        
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text style={[styles.loadingText, { color: colors.secondaryText }]}>
              {t('loadingChapter')}
            </Text>
          </View>
        ) : (
          <>
            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={[
                styles.scrollContent,
                selectionMode && { paddingTop: 76 } // Add padding when sticky header is visible
              ]}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  tintColor={colors.primary}
                  title={t('refreshing')}
                  titleColor={colors.secondaryText}
                />
              }
              showsVerticalScrollIndicator={false}
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                { useNativeDriver: false }
              )}
              scrollEventThrottle={16}
            >
              {chapterData?.verses.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Text style={[styles.emptyText, { color: colors.secondaryText }]}>
                    {t('noVersesFound')}
                  </Text>
                </View>
              ) : (
                <>
                  <Text style={[styles.instructionText, { color: colors.mutedText }]}>
                    {t('doubleTapToFavorite')} • {t('longPressToSelect')}
                  </Text>
                  {chapterData?.verses.map((verse) => {
                    // Use the URL book parameter for consistent ID generation
                    const verseId = generateVerseId(book, parseInt(chapter), verse.verse);
                    const isFav = isFavorite(verseId);
                    const isHighlighted = highlightedVerse === verse.verse;
                    const isFavoriteHighlighted = favoriteHighlightVerse === verse.verse;
                    const isSelected = isVerseSelected(verse.verse);
                    
                    // Check if this verse is part of a favorited range
                    const isPartOfFavoritedRange = (() => {
                      if (!chapterData) return false;
                      
                      // Check all possible ranges that include this verse
                      for (let startVerse = 1; startVerse <= verse.verse; startVerse++) {
                        for (let endVerse = verse.verse; endVerse <= Math.max(...chapterData.verses.map(v => v.verse)); endVerse++) {
                          if (startVerse === endVerse) continue; // Skip single verses
                          const rangeId = `${book}-${parseInt(chapter)}-${startVerse}-${endVerse}-range`;
                          if (isFavorite(rangeId)) {
                            return true;
                          }
                        }
                      }
                      return false;
                    })();
                    
                    return (
                      <TouchableOpacity
                        key={verse.verse}
                        onPress={() => handleVerseTap(verse)}
                        onLongPress={() => handleVerseLongPress(verse)}
                        activeOpacity={0.7}
                      >
                        <View 
                          style={[
                            styles.verseContainer,
                            isHighlighted && { backgroundColor: colors.primary + '20' },
                            isFavoriteHighlighted && { backgroundColor: '#FF6B6B20' },
                            isSelected && { backgroundColor: colors.primary + '30', borderColor: colors.primary, borderWidth: 2 }
                          ]}
                        >
                          <View style={styles.verseContent}>
                            <Text style={[styles.verseNumber, { color: colors.primary }]}>
                              {verse.verse}
                            </Text>
                            <Text style={[styles.verseText, typography.body, { color: colors.primaryText }]}>
                              {verse.text}
                            </Text>
                          </View>
                          <View style={styles.indicators}>
                            {isSelected && (
                              <View style={[styles.selectionIndicator, { backgroundColor: colors.primary }]}>
                                <Check size={12} color={colors.buttonText} />
                              </View>
                            )}
                            {(isFav || isPartOfFavoritedRange) && (
                              <View style={[
                                styles.favoriteIndicator,
                                isPartOfFavoritedRange && !isFav && styles.rangeHeartIndicator
                              ]}>
                                <Heart 
                                  size={16} 
                                  color={isPartOfFavoritedRange && !isFav ? "#FF9500" : "#FF6B6B"} 
                                  fill={isPartOfFavoritedRange && !isFav ? "#FF9500" : "#FF6B6B"} 
                                />
                              </View>
                            )}
                          </View>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </>
              )}
            </ScrollView>
            
            {/* Navigation buttons */}
            <View style={[styles.navigationContainer, { 
              borderTopColor: colors.divider,
              backgroundColor: colors.background + 'F0'
            }]}>
              <AnimatedButton
                title={getNavigationButtonText('prev')}
                onPress={() => navigateChapter('prev')}
                icon={<ChevronLeft size={16} color={colors.primary} />}
                style={[styles.navigationButton, { borderColor: colors.divider }]}
                variant="outlined"
                direction="right"
              />
              
              <AnimatedButton
                title={getNavigationButtonText('next')}
                onPress={() => navigateChapter('next')}
                icon={<ChevronRight size={16} color={colors.primary} />}
                style={[styles.navigationButton, { borderColor: colors.divider }]}
                variant="outlined"
                direction="left"
              />
            </View>
          </>
        )}
        
        {/* Custom Book Transition Modal */}
        <Modal
          visible={showBookTransitionModal}
          transparent
          animationType="none"
          onRequestClose={hideModal}
        >
          <View style={styles.modalOverlay}>
            <Animated.View 
              style={[
                styles.modalContainer,
                {
                  backgroundColor: colors.cardBackground,
                  borderColor: colors.divider,
                  transform: [{ scale: modalScale }],
                  opacity: modalOpacity,
                }
              ]}
            >
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: colors.primaryText }]}>
                  {transitionData?.direction === 'next' ? t('endOfBook') : t('startOfBible')}
                </Text>
              </View>
              
              <View style={styles.modalContent}>
                <Text style={[styles.modalMessage, { color: colors.secondaryText }]}>
                  {transitionData?.message}
                </Text>
                
                {transitionData?.targetBook && (
                  <View style={[styles.bookInfo, { backgroundColor: colors.background }]}>
                    <Text style={[styles.bookName, { color: colors.primary }]}>
                      {transitionData.targetBook.name}
                    </Text>
                    <Text style={[styles.bookChapters, { color: colors.mutedText }]}>
                      {transitionData.targetBook.chapters} {t('chapters')}
                    </Text>
                  </View>
                )}
              </View>
              
              <View style={styles.modalActions}>
                {transitionData?.targetBook && (
                  <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton, { borderColor: colors.divider }]}
                    onPress={hideModal}
                  >
                    <Text style={[styles.cancelButtonText, { color: colors.secondaryText }]}>
                      {t('cancel')}
                    </Text>
                  </TouchableOpacity>
                )}
                
                <TouchableOpacity
                  style={[
                    styles.modalButton, 
                    styles.confirmButton, 
                    { backgroundColor: colors.primary },
                    !transitionData?.targetBook && styles.singleButton
                  ]}
                  onPress={() => {
                    transitionData?.onConfirm();
                    hideModal();
                  }}
                >
                  <Text style={[styles.confirmButtonText, { color: colors.buttonText }]}>
                    {transitionData?.confirmText}
                  </Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </View>
        </Modal>
      </View>
    </>
  );
}

export default function ChapterScreen() {
  const { isHydrated } = useSettingsStore();
  const params = useLocalSearchParams<{ 
    book: string; 
    chapter: string;
    highlightVerse?: string;
  }>();
  
  // Don't render until hydrated to prevent SSR mismatch
  if (!isHydrated) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  // Don't render if params are not available
  if (!params.book || !params.chapter) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ChapterContent 
      book={params.book}
      chapter={params.chapter}
      highlightVerse={params.highlightVerse}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  instructionText: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 20,
    fontStyle: 'italic',
    opacity: 0.6,
    fontWeight: '300',
  },
  verseContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    position: 'relative',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
  },
  favoriteIndicator: {
    backgroundColor: 'rgba(255, 107, 107, 0.2)',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  rangeHeartIndicator: {
    backgroundColor: 'rgba(255, 149, 0, 0.2)',
    shadowColor: '#FF9500',
    borderWidth: 1,
    borderColor: 'rgba(255, 149, 0, 0.3)',
  },
  verseContent: {
    flexDirection: 'row',
    flex: 1,
  },
  verseNumber: {
    fontSize: 12,
    fontWeight: '700',
    marginRight: 12,
    marginTop: 3,
    minWidth: 20,
    opacity: 0.8,
  },
  verseText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 24,
    fontWeight: '400',
  },
  navigationContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    gap: 12,
  },
  navigationButton: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  errorIcon: {
    marginBottom: 16,
    opacity: 0.6,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 18,
  },
  retryButton: {
    paddingHorizontal: 32,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },

  indicators: {
    flexDirection: 'column',
    gap: 4,
  },
  selectionIndicator: {
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  stickyHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    borderBottomWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  stickyHeaderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  stickyHeaderInfo: {
    flex: 1,
  },
  stickyHeaderTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  stickyHeaderSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    opacity: 0.8,
  },
  stickyHeaderActions: {
    flexDirection: 'row',
    gap: 8,
  },
  stickyActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 18,
    gap: 4,
    minWidth: 70,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  stickyActionButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 340,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  modalHeader: {
    paddingTop: 24,
    paddingHorizontal: 24,
    paddingBottom: 16,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  modalContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  modalMessage: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: '400',
  },
  bookInfo: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  bookName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
  bookChapters: {
    fontSize: 13,
    fontWeight: '400',
    textAlign: 'center',
  },
  modalActions: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingBottom: 24,
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
  },
  confirmButton: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  singleButton: {
    flex: 1,
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  confirmButtonText: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});