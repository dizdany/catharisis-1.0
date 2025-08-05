import React, { useRef, useEffect, useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  Animated, 
  PanResponder,
  LayoutChangeEvent,
  Platform,
  Dimensions,
  TextInput,
  Modal,
  TouchableWithoutFeedback
} from 'react-native';
import { ChevronLeft, ChevronRight, Hash, X } from 'lucide-react-native';
import { useFocusEffect } from 'expo-router';
import { typography, elegantColors } from '@/constants/typography';
import { useTranslation } from '@/hooks/useTranslation';
import { useTheme } from '@/hooks/useTheme';
import AnimatedButton from '@/components/AnimatedButton';

interface CircularChapterSelectorProps {
  totalChapters: number;
  selectedChapter: number | null;
  onChapterSelect: (chapter: number) => void;
  onPageChange?: (page: number) => void;
}

const { width: screenWidth } = Dimensions.get('window');
const CHAPTERS_PER_PAGE = 8;

export default function CircularChapterSelector({ 
  totalChapters, 
  selectedChapter, 
  onChapterSelect,
  onPageChange
}: CircularChapterSelectorProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  
  // Dynamic styles based on theme
  const dynamicStyles = {
    chapterCircle: {
      backgroundColor: colors.cardBackground,
      shadowColor: colors.shadow,
    },
    selectedChapterCircle: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    thumbInner: {
      backgroundColor: colors.cardBackground,
      shadowColor: colors.shadow,
      borderColor: colors.primary,
    },
    inputModal: {
      backgroundColor: colors.cardBackground,
      shadowColor: colors.shadow,
    },
    chapterInput: {
      color: colors.primaryText,
    },
    directInputButton: {
      backgroundColor: colors.primary + '20',
    },
    pageDot: {
      backgroundColor: colors.mutedText + '60',
    },
    pageDotActive: {
      backgroundColor: colors.primary,
    },
    circle: {
      borderColor: colors.divider + '40',
      backgroundColor: colors.divider + '10',
    },
    connectionIndicator: {
      backgroundColor: colors.primary,
      shadowColor: colors.primary,
    },
    thumbConnected: {
      shadowColor: colors.primary,
    },
    thumbNearTarget: {
      shadowColor: colors.primary,
    },
    chapterGlow: {
      shadowColor: colors.primary,
    },
  };
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [nearestChapter, setNearestChapter] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [connectedChapter, setConnectedChapter] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [showDirectInput, setShowDirectInput] = useState(false);
  const [inputValue, setInputValue] = useState('');
  
  const animatedThumbPosition = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const animatedScale = useRef(new Animated.Value(1)).current;
  const pageTransition = useRef(new Animated.Value(0)).current;
  const resetTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Calculate total pages needed
  const totalPages = Math.ceil(totalChapters / CHAPTERS_PER_PAGE);
  
  // Get current page based on selected chapter
  const getCurrentPage = () => {
    if (!selectedChapter) return 0;
    return Math.floor((selectedChapter - 1) / CHAPTERS_PER_PAGE);
  };
  
  // Update current page when selected chapter changes
  useEffect(() => {
    if (selectedChapter) {
      const newPage = getCurrentPage();
      if (newPage !== currentPage) {
        setCurrentPage(newPage);
      }
    }
  }, [selectedChapter]);
  
  // Reset thumb to center when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      // Reset thumb position when the screen comes into focus
      resetThumbToCenter();
      
      // Clear any dragging states
      setIsDragging(false);
      setNearestChapter(null);
      setConnectedChapter(null);
      
      return () => {
        // Cleanup when screen loses focus
        if (resetTimeoutRef.current) {
          clearTimeout(resetTimeoutRef.current);
          resetTimeoutRef.current = null;
        }
      };
    }, [])
  );
  
  // Get chapters for current page
  const getVisibleChapters = () => {
    const startChapter = currentPage * CHAPTERS_PER_PAGE + 1;
    const endChapter = Math.min(startChapter + CHAPTERS_PER_PAGE - 1, totalChapters);
    return Array.from({ length: endChapter - startChapter + 1 }, (_, i) => startChapter + i);
  };
  
  const visibleChapters = getVisibleChapters();
  
  // Animation values for each visible chapter option (max 8 per page)
  const chapterAnimations = useRef(
    Array.from({ length: CHAPTERS_PER_PAGE }, (_, i) => ({
      scale: new Animated.Value(1),
      glow: new Animated.Value(0),
    }))
  ).current;
  
  // Calculate circle radius based on screen size and number of chapters
  const getCircleRadius = () => {
    const baseRadius = Math.min(screenWidth * 0.28, 110);
    // Adjust radius based on number of chapters on current page
    const adjustment = Math.max(0, (visibleChapters.length - 6) * 5);
    return baseRadius + adjustment;
  };
  
  const circleRadius = getCircleRadius();
  const centerX = containerSize.width / 2;
  const centerY = containerSize.height / 2;
  
  // Calculate positions for chapter options around the circle
  const getChapterPositions = () => {
    return visibleChapters.map((chapter, index) => {
      const angle = (index * 2 * Math.PI) / visibleChapters.length - Math.PI / 2;
      const x = centerX + circleRadius * Math.cos(angle);
      const y = centerY + circleRadius * Math.sin(angle);
      return { chapter, x, y, angle };
    });
  };
  
  const handleLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setContainerSize({ width, height });
  };
  
  const getClosestChapter = (x: number, y: number) => {
    const positions = getChapterPositions();
    let closestChapter = positions[0]?.chapter || visibleChapters[0];
    let minDistance = Infinity;
    
    positions.forEach(({ chapter, x: chapterX, y: chapterY }) => {
      const distance = Math.sqrt(Math.pow(x - chapterX, 2) + Math.pow(y - chapterY, 2));
      if (distance < minDistance) {
        minDistance = distance;
        closestChapter = chapter;
      }
    });
    
    // Ensure we return the actual chapter number from the current page
    return { chapter: closestChapter, distance: minDistance };
  };
  
  const resetThumbToCenter = () => {
    // Clear any existing timeout
    if (resetTimeoutRef.current) {
      clearTimeout(resetTimeoutRef.current);
      resetTimeoutRef.current = null;
    }
    
    Animated.spring(animatedThumbPosition, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: true,
      friction: 8,
      tension: 40,
    }).start();
  };
  
  const animateChapterSelection = (chapter: number, isSelected: boolean, isNear: boolean = false, isConnected: boolean = false) => {
    // Find the index in the visible chapters array for animation
    const visibleIndex = visibleChapters.indexOf(chapter);
    if (visibleIndex === -1) return;
    
    const animations = chapterAnimations[visibleIndex];
    if (!animations) return;
    
    Animated.parallel([
      Animated.spring(animations.scale, {
        toValue: isSelected ? 1.4 : (isConnected ? 1.3 : (isNear ? 1.2 : 1)),
        useNativeDriver: true,
        friction: 6,
        tension: 40,
      }),
      Animated.timing(animations.glow, {
        toValue: isSelected ? 1 : (isConnected ? 0.9 : (isNear ? 0.7 : 0)),
        duration: 200,
        useNativeDriver: true,
      })
    ]).start();
  };
  
  const updateChapterAnimations = (currentChapter: number | null, nearChapter: number | null, connectedChapter: number | null) => {
    visibleChapters.forEach(chapter => {
      const isSelected = chapter === currentChapter;
      const isNear = chapter === nearChapter && !isSelected;
      const isConnected = chapter === connectedChapter && !isSelected;
      animateChapterSelection(chapter, isSelected, isNear, isConnected);
    });
  };
  
  const handlePageChange = (direction: 'prev' | 'next') => {
    const newPage = direction === 'prev' ? currentPage - 1 : currentPage + 1;
    if (newPage >= 0 && newPage < totalPages) {
      // Animate page transition with correct direction
      const animationDirection = direction === 'next' ? 1 : -1;
      
      Animated.timing(pageTransition, {
        toValue: animationDirection,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setCurrentPage(newPage);
        // Reset thumb position immediately when changing pages
        animatedThumbPosition.setValue({ x: 0, y: 0 });
        // Reset page transition
        pageTransition.setValue(0);
        // Clear any dragging states
        setIsDragging(false);
        setNearestChapter(null);
        setConnectedChapter(null);
        // Notify parent component about page change
        onPageChange?.(newPage);
      });
    }
  };
  
  const handleDirectInput = () => {
    const chapterNum = parseInt(inputValue);
    if (chapterNum >= 1 && chapterNum <= totalChapters) {
      onChapterSelect(chapterNum);
      setShowDirectInput(false);
      setInputValue('');
      // Navigate to the page containing this chapter
      const targetPage = Math.floor((chapterNum - 1) / CHAPTERS_PER_PAGE);
      setCurrentPage(targetPage);
      
      // Reset thumb to center immediately
      resetThumbToCenter();
    }
  };
  
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        setIsDragging(true);
        setConnectedChapter(null);
        setNearestChapter(null);
        
        // Clear any pending reset
        if (resetTimeoutRef.current) {
          clearTimeout(resetTimeoutRef.current);
          resetTimeoutRef.current = null;
        }
        
        animatedThumbPosition.extractOffset();
        Animated.spring(animatedScale, {
          toValue: 1.1,
          useNativeDriver: true,
          friction: 8,
        }).start();
      },
      onPanResponderMove: (_, gestureState) => {
        const distance = Math.sqrt(gestureState.dx * gestureState.dx + gestureState.dy * gestureState.dy);
        // Increase max distance to allow reaching all chapters more easily
        const maxDistance = circleRadius + 120;
        
        let constrainedX = gestureState.dx;
        let constrainedY = gestureState.dy;
        
        if (distance > maxDistance) {
          const ratio = maxDistance / distance;
          constrainedX = gestureState.dx * ratio;
          constrainedY = gestureState.dy * ratio;
        }
        
        animatedThumbPosition.setValue({
          x: constrainedX,
          y: constrainedY
        });
        
        // Calculate the absolute position of the thumb
        const currentX = centerX + constrainedX;
        const currentY = centerY + constrainedY;
        
        // Get the closest chapter from the current page's visible chapters
        const positions = getChapterPositions();
        let closestChapter = positions[0]?.chapter || visibleChapters[0];
        let minDistance = Infinity;
        
        positions.forEach(({ chapter, x: chapterX, y: chapterY }) => {
          const dist = Math.sqrt(Math.pow(currentX - chapterX, 2) + Math.pow(currentY - chapterY, 2));
          if (dist < minDistance) {
            minDistance = dist;
            closestChapter = chapter;
          }
        });
        
        const connectionThreshold = 70;
        const nearThreshold = 90;
        
        if (minDistance < connectionThreshold) {
          if (connectedChapter !== closestChapter) {
            setConnectedChapter(closestChapter);
            setNearestChapter(null);
          }
        } else if (minDistance < nearThreshold) {
          if (nearestChapter !== closestChapter) {
            setNearestChapter(closestChapter);
            setConnectedChapter(null);
          }
        } else {
          if (nearestChapter !== null || connectedChapter !== null) {
            setNearestChapter(null);
            setConnectedChapter(null);
          }
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        setIsDragging(false);
        animatedThumbPosition.flattenOffset();
        
        Animated.spring(animatedScale, {
          toValue: 1,
          useNativeDriver: true,
          friction: 8,
        }).start();
        
        // Calculate the absolute position of the thumb
        const currentX = centerX + gestureState.dx;
        const currentY = centerY + gestureState.dy;
        
        // Get the closest chapter from the current page's visible chapters
        const positions = getChapterPositions();
        let closestChapter = positions[0]?.chapter || visibleChapters[0];
        let minDistance = Infinity;
        
        positions.forEach(({ chapter, x: chapterX, y: chapterY }) => {
          const dist = Math.sqrt(Math.pow(currentX - chapterX, 2) + Math.pow(currentY - chapterY, 2));
          if (dist < minDistance) {
            minDistance = dist;
            closestChapter = chapter;
          }
        });
        
        const selectionThreshold = 90;
        
        if (minDistance < selectionThreshold) {
          // Select the chapter and immediately reset to center
          onChapterSelect(closestChapter);
          resetThumbToCenter();
        } else {
          // Just reset to center if no chapter was selected
          resetThumbToCenter();
        }
        
        setConnectedChapter(null);
        setNearestChapter(null);
      },
      onPanResponderTerminationRequest: () => false,
      onShouldBlockNativeResponder: () => true,
    })
  ).current;
  
  useEffect(() => {
    updateChapterAnimations(selectedChapter, isDragging ? nearestChapter : null, isDragging ? connectedChapter : null);
  }, [selectedChapter, nearestChapter, connectedChapter, isDragging, visibleChapters]);
  
  // Reset thumb position when component mounts or when no chapter is selected
  useEffect(() => {
    if (!selectedChapter || !visibleChapters.includes(selectedChapter)) {
      resetThumbToCenter();
    }
  }, [selectedChapter, visibleChapters]);
  
  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (resetTimeoutRef.current) {
        clearTimeout(resetTimeoutRef.current);
      }
    };
  }, []);
  
  const handleChapterPress = (chapter: number) => {
    // Select the chapter and immediately reset to center
    onChapterSelect(chapter);
    resetThumbToCenter();
  };

  if (containerSize.width === 0) {
    return (
      <View style={styles.container} onLayout={handleLayout}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.title, typography.heading, { color: elegantColors.elegantText }]}>
            {t('selectChapter')}
          </Text>
        </View>
      </View>
    );
  }

  const chapterPositions = getChapterPositions();
  const startChapter = currentPage * CHAPTERS_PER_PAGE + 1;
  const endChapter = Math.min(startChapter + CHAPTERS_PER_PAGE - 1, totalChapters);

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={[styles.title, typography.heading, { color: colors.primaryText }]}>
          {t('selectChapter')}
        </Text>
        <Text style={[styles.subtitle, typography.script, { color: colors.secondaryText }]}>
          {totalChapters} {t('chapters')}
        </Text>
        
        {/* Page indicator and direct input */}
        <View style={styles.pageIndicator}>
          <Text style={[styles.pageText, typography.caption, { color: colors.secondaryText }]}>
            {startChapter}-{endChapter} of {totalChapters}
          </Text>
          <TouchableOpacity 
            style={[styles.directInputButton, dynamicStyles.directInputButton]}
            onPress={() => setShowDirectInput(true)}
          >
            <Hash size={14} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Navigation arrows */}
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
          
          <View style={styles.pageIndicatorDots}>
            {Array.from({ length: totalPages }, (_, i) => (
              <View
                key={i}
                style={[
                  styles.pageDot,
                  i === currentPage ? dynamicStyles.pageDotActive : dynamicStyles.pageDot
                ]}
              />
            ))}
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
      
      <View 
        style={[
          styles.circleContainer, 
          { 
            width: containerSize.width, 
            height: containerSize.width,
          }
        ]}
        onLayout={handleLayout}
      >
        <View style={[styles.circle, { 
          width: circleRadius * 2, 
          height: circleRadius * 2,
          left: centerX - circleRadius,
          top: centerY - circleRadius,
        }]} />
        
        {chapterPositions.map(({ chapter, x, y }, index) => {
          const animations = chapterAnimations[index];
          const isSelected = chapter === selectedChapter;
          const isNear = chapter === nearestChapter && isDragging;
          const isConnected = chapter === connectedChapter && isDragging;
          
          return (
            <View key={chapter} style={[styles.chapterOptionContainer, {
              left: x - 30,
              top: y - 30,
            }]}>
              <Animated.View 
                style={[
                  styles.chapterGlow,
                  dynamicStyles.chapterGlow,
                  isConnected && styles.chapterGlowConnected,
                  {
                    opacity: animations.glow,
                    transform: [{ scale: animations.scale }]
                  }
                ]}
              />
              
              <Animated.View
                style={[
                  styles.chapterOption,
                  {
                    transform: [{ scale: animations.scale }]
                  }
                ]}
              >
                <TouchableOpacity
                  style={styles.chapterTouchable}
                  onPress={() => handleChapterPress(chapter)}
                  activeOpacity={0.8}
                >
                  <View style={[
                    styles.chapterCircle,
                    dynamicStyles.chapterCircle,
                    isSelected && [styles.selectedChapterCircle, dynamicStyles.selectedChapterCircle]
                  ]}>
                    <Text style={[
                      styles.chapterNumber,
                      typography.heading,
                      { color: isSelected ? colors.buttonText : colors.primaryText }
                    ]}>
                      {chapter}
                    </Text>
                  </View>
                </TouchableOpacity>
              </Animated.View>
              
              {isConnected && (
                <Animated.View 
                  style={[
                    styles.connectionIndicator,
                    dynamicStyles.connectionIndicator,
                    styles.connectionIndicatorConnected,
                    {
                      opacity: animations.glow,
                    }
                  ]}
                />
              )}
            </View>
          );
        })}
        
        <Animated.View 
          style={[
            styles.centerThumb,
            {
              left: centerX - 35,
              top: centerY - 35,
              transform: [
                { translateX: animatedThumbPosition.x },
                { translateY: animatedThumbPosition.y },
                { scale: animatedScale }
              ]
            }
          ]}
          {...(Platform.OS !== 'web' ? panResponder.panHandlers : {})}
        >
          <View style={[
            styles.thumbInner,
            dynamicStyles.thumbInner,
            isDragging && styles.thumbDragging,
            connectedChapter && [styles.thumbConnected, dynamicStyles.thumbConnected],
            nearestChapter && !connectedChapter && [styles.thumbNearTarget, dynamicStyles.thumbNearTarget]
          ]}>
            {selectedChapter && (
              <Text style={[
                styles.selectedChapterText,
                typography.heading,
                { color: colors.primary }
              ]}>
                {selectedChapter}
              </Text>
            )}
          </View>
        </Animated.View>
      </View>
      
      {/* Direct input modal */}
      <Modal
        visible={showDirectInput}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDirectInput(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowDirectInput(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={[styles.inputModal, dynamicStyles.inputModal]}>
                <View style={styles.inputHeader}>
                  <Text style={[styles.inputTitle, typography.heading, { color: colors.primaryText }]}>
                    Go to Chapter
                  </Text>
                  <TouchableOpacity onPress={() => setShowDirectInput(false)}>
                    <X size={20} color={colors.secondaryText} />
                  </TouchableOpacity>
                </View>
                
                <TextInput
                  style={[styles.chapterInput, dynamicStyles.chapterInput]}
                  value={inputValue}
                  onChangeText={setInputValue}
                  placeholder={`1-${totalChapters}`}
                  placeholderTextColor={colors.secondaryText}
                  keyboardType="numeric"
                  autoFocus
                  onSubmitEditing={handleDirectInput}
                />
                
                <AnimatedButton
                  title="Go"
                  onPress={handleDirectInput}
                  style={[styles.inputButton, !inputValue && styles.inputButtonDisabled]}
                  textStyle={[
                    styles.inputButtonText,
                    { color: inputValue ? colors.buttonText : colors.secondaryText }
                  ]}
                  variant={inputValue ? 'filled' : 'outlined'}
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
    paddingVertical: 15,
    paddingHorizontal: 10,
    minHeight: 400,
  },
  titleContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 8,
  },
  pageIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pageText: {
    fontSize: 11,
  },
  directInputButton: {
    padding: 4,
    borderRadius: 4,
  },
  navigationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  navButton: {
    width: 40,
    height: 40,
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  navButtonDisabled: {
    opacity: 0.3,
  },
  pageIndicatorDots: {
    flexDirection: 'row',
    gap: 4,
  },
  pageDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  pageDotActive: {
    // Dynamic styles applied via dynamicStyles
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 250,
  },
  circleContainer: {
    position: 'relative',
    alignSelf: 'center',
    minHeight: 280,
  },
  circle: {
    position: 'absolute',
    borderRadius: 1000,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
  },
  chapterOptionContainer: {
    position: 'absolute',
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
  },
  chapterGlow: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 12,
  },
  chapterGlowConnected: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    shadowOpacity: 1,
    shadowRadius: 30,
    elevation: 18,
  },
  chapterOption: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chapterTouchable: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chapterCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  selectedChapterCircle: {
    // Dynamic styles applied via dynamicStyles
  },
  chapterNumber: {
    fontSize: 14,
    fontWeight: '600',
  },
  connectionIndicator: {
    position: 'absolute',
    width: 3,
    height: 20,
    borderRadius: 2,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 4,
    top: -25,
    left: 28,
  },
  connectionIndicatorConnected: {
    width: 4,
    height: 25,
    shadowRadius: 10,
    elevation: 8,
    shadowOpacity: 1,
  },
  centerThumb: {
    position: 'absolute',
    width: 70,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  thumbInner: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 2,
  },
  thumbDragging: {
    shadowOpacity: 0.6,
    shadowRadius: 15,
    elevation: 15,
    borderWidth: 3,
  },
  thumbConnected: {
    borderWidth: 4,
    shadowOpacity: 1,
    shadowRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  thumbNearTarget: {
    borderWidth: 3,
    shadowOpacity: 0.8,
    shadowRadius: 20,
  },
  selectedChapterText: {
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  inputModal: {
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 280,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  inputHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  inputTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  chapterInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  inputButton: {
    alignItems: 'center',
  },
  inputButtonDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  inputButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});