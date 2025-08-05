import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  TouchableWithoutFeedback,
  Animated,
  Dimensions
} from 'react-native';
import { Search, X, ChevronLeft, ChevronRight, Check } from 'lucide-react-native';
import { typography } from '@/constants/typography';
import { useTranslation } from '@/hooks/useTranslation';
import { useTheme } from '@/hooks/useTheme';
import { useReadingStore } from '@/store/readingStore';
import AnimatedButton from '@/components/AnimatedButton';

interface ChapterGridProps {
  totalChapters: number;
  selectedChapter: number | null;
  onChapterSelect: (chapter: number) => void;
  bookId: string;
}

const { width: screenWidth } = Dimensions.get('window');
const CHAPTERS_PER_PAGE = 24; // 6 columns x 4 rows

export default function ChapterGrid({ 
  totalChapters, 
  selectedChapter, 
  onChapterSelect,
  bookId
}: ChapterGridProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { isChapterRead } = useReadingStore();
  
  const [currentPage, setCurrentPage] = useState(0);
  const [showSearch, setShowSearch] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [pressedChapter, setPressedChapter] = useState<number | null>(null);
  
  const scaleAnim = useRef(new Animated.Value(1)).current;
  
  // Calculate total pages needed
  const totalPages = Math.ceil(totalChapters / CHAPTERS_PER_PAGE);
  
  // Get chapters for current page
  const getVisibleChapters = () => {
    const startChapter = currentPage * CHAPTERS_PER_PAGE + 1;
    const endChapter = Math.min(startChapter + CHAPTERS_PER_PAGE - 1, totalChapters);
    return Array.from({ length: endChapter - startChapter + 1 }, (_, i) => startChapter + i);
  };
  
  const visibleChapters = getVisibleChapters();
  
  const handleChapterPress = (chapter: number) => {
    setPressedChapter(chapter);
    
    // Animate press feedback
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      })
    ]).start(() => {
      setPressedChapter(null);
    });
    
    onChapterSelect(chapter);
  };
  
  const handlePageChange = (direction: 'prev' | 'next') => {
    const newPage = direction === 'prev' ? currentPage - 1 : currentPage + 1;
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };
  
  const handleSearch = () => {
    const chapterNum = parseInt(searchValue);
    if (chapterNum >= 1 && chapterNum <= totalChapters) {
      // Navigate to the page containing this chapter
      const targetPage = Math.floor((chapterNum - 1) / CHAPTERS_PER_PAGE);
      setCurrentPage(targetPage);
      
      // Select the chapter
      onChapterSelect(chapterNum);
      setShowSearch(false);
      setSearchValue('');
    }
  };
  
  const startChapter = currentPage * CHAPTERS_PER_PAGE + 1;
  const endChapter = Math.min(startChapter + CHAPTERS_PER_PAGE - 1, totalChapters);
  
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={[styles.title, typography.heading, { color: colors.primaryText }]}>
            {t('selectChapter')}
          </Text>
          <Text style={[styles.subtitle, typography.script, { color: colors.secondaryText }]}>
            {totalChapters} {t('chapters')}
          </Text>
        </View>
        
        <TouchableOpacity 
          style={[styles.searchButton, { backgroundColor: colors.primary + '20' }]}
          onPress={() => setShowSearch(true)}
        >
          <Search size={18} color={colors.primary} />
        </TouchableOpacity>
      </View>
      
      {/* Page Navigation */}
      {totalPages > 1 && (
        <View style={styles.navigationContainer}>
          <AnimatedButton
            title=""
            onPress={() => handlePageChange('prev')}
            icon={<ChevronLeft size={20} color={currentPage === 0 ? colors.secondaryText : colors.primary} />}
            style={[styles.navButton, currentPage === 0 && styles.navButtonDisabled]}
            variant="outlined"
            direction="right"
          />
          
          <View style={styles.pageInfo}>
            <Text style={[styles.pageText, typography.caption, { color: colors.secondaryText }]}>
              {startChapter}-{endChapter} of {totalChapters}
            </Text>
            <View style={styles.pageIndicatorDots}>
              {Array.from({ length: totalPages }, (_, i) => (
                <View
                  key={i}
                  style={[
                    styles.pageDot,
                    {
                      backgroundColor: i === currentPage ? colors.primary : colors.mutedText + '60'
                    }
                  ]}
                />
              ))}
            </View>
          </View>
          
          <AnimatedButton
            title=""
            onPress={() => handlePageChange('next')}
            icon={<ChevronRight size={20} color={currentPage === totalPages - 1 ? colors.secondaryText : colors.primary} />}
            style={[styles.navButton, currentPage === totalPages - 1 && styles.navButtonDisabled]}
            variant="outlined"
            direction="left"
          />
        </View>
      )}
      
      {/* Chapter Grid */}
      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.gridContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.grid}>
          {visibleChapters.map((chapter) => {
            const isSelected = chapter === selectedChapter;
            const isPressed = chapter === pressedChapter;
            const isRead = isChapterRead(bookId, chapter);
            
            return (
              <Animated.View
                key={chapter}
                style={[
                  styles.chapterContainer,
                  isPressed && { transform: [{ scale: scaleAnim }] }
                ]}
              >
                <TouchableOpacity
                  style={[
                    styles.chapterButton,
                    {
                      backgroundColor: isSelected 
                        ? colors.primary 
                        : isRead 
                        ? colors.primary + '20'
                        : colors.cardBackground,
                      borderColor: isSelected 
                        ? colors.primary 
                        : isRead 
                        ? colors.primary + '60'
                        : colors.divider + '40',
                      shadowColor: colors.shadow,
                    }
                  ]}
                  onPress={() => handleChapterPress(chapter)}
                  activeOpacity={0.8}
                >
                  <View style={styles.chapterContent}>
                    <Text style={[
                      styles.chapterNumber,
                      typography.heading,
                      { 
                        color: isSelected 
                          ? colors.buttonText 
                          : isRead 
                          ? colors.primary
                          : colors.primaryText 
                      }
                    ]}>
                      {chapter}
                    </Text>
                    {isRead && !isSelected && (
                      <View style={[styles.readIndicator, { backgroundColor: colors.primary }]}>
                        <Check size={8} color={colors.buttonText} strokeWidth={3} />
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>
      </ScrollView>
      
      {/* Search Modal */}
      <Modal
        visible={showSearch}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSearch(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowSearch(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={[
                styles.searchModal,
                {
                  backgroundColor: colors.cardBackground,
                  shadowColor: colors.shadow,
                }
              ]}>
                <View style={styles.searchHeader}>
                  <Text style={[styles.searchTitle, typography.heading, { color: colors.primaryText }]}>
                    Go to Chapter
                  </Text>
                  <TouchableOpacity onPress={() => setShowSearch(false)}>
                    <X size={20} color={colors.secondaryText} />
                  </TouchableOpacity>
                </View>
                
                <TextInput
                  style={[
                    styles.searchInput,
                    {
                      color: colors.primaryText,
                      backgroundColor: colors.background,
                      borderColor: colors.divider,
                    }
                  ]}
                  value={searchValue}
                  onChangeText={setSearchValue}
                  placeholder={`1-${totalChapters}`}
                  placeholderTextColor={colors.secondaryText}
                  keyboardType="numeric"
                  autoFocus
                  onSubmitEditing={handleSearch}
                />
                
                <AnimatedButton
                  title="Go"
                  onPress={handleSearch}
                  style={[
                    styles.searchButton,
                    !searchValue && styles.searchButtonDisabled
                  ]}
                  textStyle={[
                    styles.searchButtonText,
                    { color: searchValue ? colors.buttonText : colors.secondaryText }
                  ]}
                  variant={searchValue ? 'filled' : 'outlined'}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
  },
  searchButton: {
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navigationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  navButton: {
    width: 44,
    height: 44,
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  navButtonDisabled: {
    opacity: 0.3,
  },
  pageInfo: {
    alignItems: 'center',
    gap: 8,
  },
  pageText: {
    fontSize: 12,
  },
  pageIndicatorDots: {
    flexDirection: 'row',
    gap: 6,
  },
  pageDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  scrollContainer: {
    flex: 1,
  },
  gridContainer: {
    paddingBottom: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  chapterContainer: {
    width: (screenWidth - 32 - 60) / 6, // 6 columns with gaps
    marginBottom: 12,
  },
  chapterButton: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  chapterContent: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  chapterNumber: {
    fontSize: 16,
    fontWeight: '600',
  },
  readIndicator: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  searchModal: {
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 320,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  searchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  searchTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  searchInput: {
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    borderWidth: 1,
  },
  searchButtonDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  searchButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});