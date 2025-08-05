import React from 'react';
import { StyleSheet, Text, View, FlatList, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useVerseStore } from '@/store/verseStore';
import VerseCard from '@/components/VerseCard';
import TranslatedVerseCard from '@/components/TranslatedVerseCard';
import { useTheme } from '@/hooks/useTheme';
import { Heart } from 'lucide-react-native';
import { useTranslation } from '@/hooks/useTranslation';
import { typography } from '@/constants/typography';
import AnimatedButton from '@/components/AnimatedButton';
import { Verse, BibleVerse, VerseRange } from '@/constants/verses';
import { MoodVerse } from '@/constants/moodVerses';
import VerseRangeCard from '@/components/VerseRangeCard';

export default function FavoritesScreen() {
  const { favoriteVerses } = useVerseStore();
  const router = useRouter();
  const { t } = useTranslation();
  const { colors } = useTheme();

  const handleReadMore = (verse: Verse | BibleVerse | MoodVerse | VerseRange) => {
    if ('mood' in verse) {
      // MoodVerse - navigate to verse detail with from parameter
      router.push({
        pathname: `/verse/${verse.id}` as any,
        params: { from: 'favorites' }
      });
    } else if ('startVerse' in verse) {
      // VerseRange - navigate to Bible chapter with start verse highlight
      const bookKey = verse.book.toLowerCase().replace(/\s+/g, '').replace(/[0-9]/g, '');
      router.push({
        pathname: `/bible/${bookKey}/${verse.chapter}` as any,
        params: { highlightVerse: verse.startVerse.toString() }
      });
    } else {
      // BibleVerse - navigate to Bible chapter
      const bookKey = verse.book.toLowerCase()
        .replace(/\s+/g, '')
        .replace(/[0-9]/g, '')
        .replace('împărați', 'kings')
        .replace('cronici', 'chronicles')
        .replace('corinteni', 'corinthians')
        .replace('tesaloniceni', 'thessalonians')
        .replace('timotei', 'timothy')
        .replace('fapteleapostolilor', 'acts')
        .replace('cântareacântărilor', 'song')
        .replace('plângerile', 'lamentations')
        .replace('geneza', 'genesis')
        .replace('exodul', 'exodus')
        .replace('leviticul', 'leviticus')
        .replace('numerii', 'numbers')
        .replace('deuteronomul', 'deuteronomy')
        .replace('iosua', 'joshua')
        .replace('judecătorii', 'judges')
        .replace('rut', 'ruth')
        .replace('ezra', 'ezra')
        .replace('neemia', 'nehemiah')
        .replace('estera', 'esther')
        .replace('iov', 'job')
        .replace('psalmii', 'psalms')
        .replace('proverbele', 'proverbs')
        .replace('ecclesiastul', 'ecclesiastes')
        .replace('isaia', 'isaiah')
        .replace('ieremia', 'jeremiah')
        .replace('ezechiel', 'ezekiel')
        .replace('daniel', 'daniel')
        .replace('osea', 'hosea')
        .replace('ioel', 'joel')
        .replace('amos', 'amos')
        .replace('obadia', 'obadiah')
        .replace('iona', 'jonah')
        .replace('mica', 'micah')
        .replace('naum', 'nahum')
        .replace('habacuc', 'habakkuk')
        .replace('țefania', 'zephaniah')
        .replace('hagai', 'haggai')
        .replace('zaharia', 'zechariah')
        .replace('maleahi', 'malachi')
        .replace('matei', 'matthew')
        .replace('marcu', 'mark')
        .replace('luca', 'luke')
        .replace('ioan', 'john')
        .replace('romani', 'romans')
        .replace('galateni', 'galatians')
        .replace('efeseni', 'ephesians')
        .replace('filipeni', 'philippians')
        .replace('coloseni', 'colossians')
        .replace('tit', 'titus')
        .replace('filimon', 'philemon')
        .replace('evrei', 'hebrews')
        .replace('iacov', 'james')
        .replace('petru', 'peter')
        .replace('iuda', 'jude')
        .replace('apocalipsa', 'revelation');
      
      router.push({
        pathname: `/bible/${bookKey}/${verse.chapter}` as any,
        params: { highlightVerse: verse.verse.toString() }
      });
    }
  };

  if (favoriteVerses.length === 0) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: colors.background }]}>
        <Heart size={32} color={colors.secondaryText} style={styles.emptyIcon} />
        <Text style={[styles.emptyTitle, { color: colors.primaryText }]}>
          {t('noSavedVerses')}
        </Text>
        <Text style={[styles.emptyText, { color: colors.secondaryText }]}>
          {t('savedVersesDescription')}
        </Text>
        <View style={styles.buttonContainer}>
          <AnimatedButton
            title={t('discoverVerses')}
            onPress={() => router.push('/')}
            style={[styles.discoverButton, { backgroundColor: colors.primary }]}
            textStyle={[styles.discoverButtonText, { color: colors.buttonText }]}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={favoriteVerses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          // Check the type of verse
          const isMoodVerse = 'mood' in item;
          const isVerseRange = 'startVerse' in item;
          
          if (isMoodVerse) {
            return (
              <VerseCard 
                verse={item as MoodVerse} 
                onReadMore={() => handleReadMore(item)}
              />
            );
          } else if (isVerseRange) {
            return (
              <VerseRangeCard 
                verseRange={item as VerseRange} 
                onReadMore={() => handleReadMore(item)}
              />
            );
          } else {
            // This is a BibleVerse
            return (
              <TranslatedVerseCard 
                verse={item as BibleVerse} 
                onReadMore={() => handleReadMore(item)}
              />
            );
          }
        }}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingTop: 10,
    paddingBottom: 8,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyIcon: {
    marginBottom: 16,
    opacity: 0.6,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 18,
    paddingHorizontal: 20,
    fontWeight: '300' as const,
  },
  buttonContainer: {
    paddingHorizontal: 40,
    width: '100%',
  },
  discoverButton: {},
  discoverButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
});