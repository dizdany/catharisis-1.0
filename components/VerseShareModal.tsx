import React, { useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  Pressable,
  Alert,
  Platform,
  Dimensions,
} from 'react-native';
import { 
  X, 
  Download, 
  Share2, 
  Instagram, 
  Facebook, 
  Twitter,
  Copy,
  Heart
} from 'lucide-react-native';
import ViewShot from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import * as Clipboard from 'expo-clipboard';
import { typography } from '@/constants/typography';
import { useTranslation } from '@/hooks/useTranslation';
import { MoodVerse } from '@/constants/moodVerses';
import { Verse, BibleVerse } from '@/constants/verses';
import AnimatedButton from './AnimatedButton';
import { useTheme } from '@/hooks/useTheme';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface VerseShareModalProps {
  visible: boolean;
  onClose: () => void;
  verse: Verse | BibleVerse | MoodVerse;
}

export default function VerseShareModal({ visible, onClose, verse }: VerseShareModalProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const viewShotRef = useRef<ViewShot>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  // Calculate dynamic font size based on text length
  const getVerseFontSize = (text: string) => {
    const textLength = text.length;
    if (textLength < 100) return 18;
    if (textLength < 200) return 16;
    if (textLength < 300) return 14;
    if (textLength < 400) return 13;
    return 12;
  };

  const getVerseLineHeight = (fontSize: number) => {
    return fontSize * 1.4;
  };

  const verseFontSize = getVerseFontSize(verse.text);
  const verseLineHeight = getVerseLineHeight(verseFontSize);

  const handleSaveImage = async () => {
    try {
      setIsCapturing(true);
      
      // Request media library permissions
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(t('permissionRequired'), t('mediaLibraryPermissionRequired'));
        return;
      }

      // Capture the view as image
      const uri = await viewShotRef.current?.capture?.();
      if (!uri) {
        throw new Error('Failed to capture image');
      }

      // Save to media library
      await MediaLibrary.saveToLibraryAsync(uri);
      Alert.alert(t('success'), t('imageSavedToGallery'));
      
    } catch (error) {
      console.error('Error saving image:', error);
      Alert.alert(t('error'), t('failedToSaveImage'));
    } finally {
      setIsCapturing(false);
    }
  };

  const handleShareImage = async () => {
    try {
      setIsCapturing(true);
      
      // Capture the view as image
      const uri = await viewShotRef.current?.capture?.();
      if (!uri) {
        throw new Error('Failed to capture image');
      }

      // Check if sharing is available
      if (!(await Sharing.isAvailableAsync())) {
        Alert.alert(t('error'), t('sharingNotAvailable'));
        return;
      }

      // For web, use different approach
      if (Platform.OS === 'web') {
        // Convert to blob and use Web Share API or fallback to download
        try {
          const response = await fetch(uri);
          const blob = await response.blob();
          
          if (navigator.share && navigator.canShare && navigator.canShare({ files: [new File([blob], 'verse.png', { type: 'image/png' })] })) {
            await navigator.share({
              title: t('shareVerse'),
              files: [new File([blob], 'verse.png', { type: 'image/png' })]
            });
          } else {
            // Fallback: create download link
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'verse.png';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            Alert.alert(t('success'), 'Image downloaded');
          }
        } catch (webError) {
          console.error('Web sharing error:', webError);
          Alert.alert(t('error'), t('failedToShareImage'));
        }
      } else {
        // For mobile platforms
        await Sharing.shareAsync(uri, {
          mimeType: 'image/png',
          dialogTitle: t('shareVerse'),
        });
      }
      
    } catch (error) {
      console.error('Error sharing image:', error);
      Alert.alert(t('error'), t('failedToShareImage'));
    } finally {
      setIsCapturing(false);
    }
  };

  const handleCopyText = async () => {
    try {
      const textToShare = `"${verse.text}"\n\n${verse.reference}\n${t('bookOf')} ${verse.book}`;
      await Clipboard.setStringAsync(textToShare);
      Alert.alert(t('success'), t('textCopiedToClipboard'));
    } catch (error) {
      console.error('Error copying text:', error);
      Alert.alert(t('error'), t('failedToCopyText'));
    }
  };

  const handleShareText = async () => {
    try {
      const textToShare = `"${verse.text}"\n\n${verse.reference}\n${t('bookOf')} ${verse.book}`;
      
      if (Platform.OS === 'web') {
        if (navigator.share) {
          await navigator.share({
            title: t('shareVerse'),
            text: textToShare,
          });
        } else {
          await handleCopyText();
        }
      } else {
        // For mobile platforms, use Sharing API
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(textToShare);
        } else {
          await handleCopyText();
        }
      }
    } catch (error) {
      console.error('Error sharing text:', error);
      // Fallback to copying text if sharing fails
      await handleCopyText();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={[styles.overlay, { backgroundColor: colors.overlay }]}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        
        <View style={[styles.modalContainer, { backgroundColor: colors.cardBackground, shadowColor: colors.shadow }]}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, typography.heading, { color: colors.primaryText }]}>
              {t('shareVerse')}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={colors.primaryText} />
            </TouchableOpacity>
          </View>

          {/* Verse Preview Card */}
          <ViewShot
            ref={viewShotRef}
            options={{
              format: 'png',
              quality: 1.0,
              result: 'tmpfile',
            }}
            style={styles.previewContainer}
          >
            <View style={[
              styles.verseCard, 
              { 
                backgroundColor: colors.cardBackground,
                borderColor: colors.divider,
                shadowColor: colors.shadow
              }
            ]}>
              {/* Decorative elements */}
              <View style={styles.decorativeTop}>
                <View style={[styles.decorativeLine, { backgroundColor: colors.primary }]} />
                <Heart size={16} color={colors.primary} fill={colors.primary} />
                <View style={[styles.decorativeLine, { backgroundColor: colors.primary }]} />
              </View>

              {/* Verse content */}
              <View style={styles.verseContent}>
                <Text style={[
                  styles.verseText, 
                  typography.body,
                  { 
                    fontSize: verseFontSize,
                    lineHeight: verseLineHeight,
                    color: colors.primaryText
                  }
                ]}>
                  &quot;{verse.text}&quot;
                </Text>
                
                <View style={styles.verseInfo}>
                  <Text style={[styles.reference, typography.heading, { color: colors.primaryText }]}>
                    {verse.reference}
                  </Text>
                  <Text style={[styles.book, typography.caption, { color: colors.secondaryText }]}>
                    {t('bookOf')} {verse.book}
                  </Text>
                </View>
              </View>

              {/* Decorative bottom */}
              <View style={styles.decorativeBottom}>
                <View style={[styles.decorativeLine, { backgroundColor: colors.primary }]} />
                <Text style={[styles.appName, { color: colors.primaryText }]}>Catharisis App</Text>
                <View style={[styles.decorativeLine, { backgroundColor: colors.primary }]} />
              </View>
            </View>
          </ViewShot>

          {/* Action Buttons */}
          <View style={styles.actionsContainer}>
            <Text style={[styles.sectionTitle, typography.caption, { color: colors.secondaryText }]}>
              {t('saveOrShare')}
            </Text>
            
            <View style={styles.actionButtons}>
              <AnimatedButton
                title={t('saveImage')}
                onPress={handleSaveImage}
                icon={<Download size={18} color={colors.buttonText} />}
                style={[styles.actionButton, { backgroundColor: colors.primary }]}
                textStyle={[styles.actionButtonText, { color: colors.buttonText }]}
                variant="filled"
                disabled={isCapturing}
              />
              
              <AnimatedButton
                title={t('shareImage')}
                onPress={handleShareImage}
                icon={<Share2 size={18} color={colors.primary} />}
                style={[styles.actionButton, { borderColor: colors.primary, borderWidth: 1, backgroundColor: 'transparent' }]}
                textStyle={[styles.actionButtonText, { color: colors.primary }]}
                variant="outlined"
                disabled={isCapturing}
              />
            </View>

            <View style={[styles.textActions, { borderTopColor: colors.divider }]}>
              <TouchableOpacity
                style={styles.textActionButton}
                onPress={handleCopyText}
              >
                <Copy size={20} color={colors.secondaryText} />
                <Text style={[styles.textActionText, typography.caption, { color: colors.secondaryText }]}>
                  {t('copyText')}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.textActionButton}
                onPress={handleShareText}
              >
                <Share2 size={20} color={colors.secondaryText} />
                <Text style={[styles.textActionText, typography.caption, { color: colors.secondaryText }]}>
                  {t('shareText')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContainer: {
    borderRadius: 20,
    padding: 20,
    width: Math.min(screenWidth - 40, 400),
    maxHeight: screenHeight - 100,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '700' as const,
  },
  closeButton: {
    padding: 4,
  },
  previewContainer: {
    alignItems: 'center',
    marginBottom: 24,
    alignSelf: 'center',
  },
  verseCard: {
    borderRadius: 16,
    padding: 24,
    width: 320,
    minHeight: 500,
    justifyContent: 'space-between',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    aspectRatio: 0.64,
  },
  decorativeTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  decorativeLine: {
    height: 1,
    flex: 1,
    marginHorizontal: 12,
    opacity: 0.6,
  },
  verseContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  verseText: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 24,
    fontStyle: 'italic',
    flexShrink: 1,
  },
  verseInfo: {
    alignItems: 'center',
  },
  reference: {
    fontSize: 16,
    fontWeight: '600' as const,
    marginBottom: 8,
  },
  book: {
    fontSize: 14,
    textAlign: 'center',
  },
  decorativeBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  appName: {
    fontSize: 12,
    fontWeight: '500' as const,
    marginHorizontal: 12,
  },
  actionsContainer: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    minHeight: 48,
  },

  actionButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    textAlign: 'center',
  },
  textActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
  },
  textActionButton: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    minWidth: 80,
  },
  textActionText: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
});