import React, { useState, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View, 
  Animated, 
  Easing,
  Modal,
  TouchableWithoutFeedback
} from 'react-native';
import { ChevronDown, Check } from 'lucide-react-native';
import { useLanguageStore } from '@/store/languageStore';
import { useTranslation } from '@/hooks/useTranslation';
import { typography } from '@/constants/typography';
import { Language } from '@/constants/translations';
import { useTheme } from '@/hooks/useTheme';

const languages: { code: Language; name: string; nativeName: string; flag: string }[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'ro', name: 'Romanian', nativeName: 'Română', flag: '🇷🇴' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
];

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguageStore();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  const currentLanguage = languages.find(lang => lang.code === language);
  
  const toggleDropdown = () => {
    if (isOpen) {
      closeDropdown();
    } else {
      openDropdown();
    }
  };
  
  const openDropdown = () => {
    setIsOpen(true);
    
    Animated.parallel([
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      })
    ]).start();
  };
  
  const closeDropdown = () => {
    Animated.parallel([
      Animated.timing(rotateAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      }),
      Animated.timing(scaleAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      })
    ]).start(() => {
      setIsOpen(false);
    });
  };
  
  const selectLanguage = (langCode: Language) => {
    setLanguage(langCode);
    closeDropdown();
  };
  
  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg']
  });
  
  return (
    <>
      <TouchableOpacity 
        style={[
          styles.selector,
          {
            backgroundColor: colors.cardBackground,
            borderColor: colors.divider,
          }
        ]}
        onPress={toggleDropdown}
        activeOpacity={0.7}
      >
        <View style={styles.selectorContent}>
          <Text style={styles.selectorFlag}>{currentLanguage?.flag || '🇺🇸'}</Text>
          <View style={styles.languageInfo}>
            <Text style={[styles.languageName, typography.heading, { color: colors.primaryText }]}>
              {currentLanguage?.nativeName || 'English'}
            </Text>
            <Text style={[styles.languageCode, typography.script, { color: colors.secondaryText }]}>
              {currentLanguage?.name || 'English'}
            </Text>
          </View>
          <Animated.View style={{ transform: [{ rotate: rotation }] }}>
            <ChevronDown size={18} color={colors.secondaryText} />
          </Animated.View>
        </View>
      </TouchableOpacity>
      
      <Modal
        visible={isOpen}
        transparent
        animationType="none"
        onRequestClose={closeDropdown}
      >
        <TouchableWithoutFeedback onPress={closeDropdown}>
          <View style={[styles.overlay, { backgroundColor: colors.overlay }]}>
            <Animated.View 
              style={[
                styles.dropdown,
                {
                  backgroundColor: colors.cardBackground,
                  borderColor: colors.divider,
                  shadowColor: colors.shadow,
                  opacity: fadeAnim,
                  transform: [{ scale: scaleAnim }]
                }
              ]}
            >
              <Text style={[styles.dropdownTitle, typography.heading, { color: colors.primaryText }]}>
                {t('selectLanguage')}
              </Text>
              
              {languages.map((lang) => (
                <TouchableOpacity
                  key={lang.code}
                  style={[
                    styles.languageOption,
                    language === lang.code && {
                      backgroundColor: colors.primary + '20',
                    }
                  ]}
                  onPress={() => selectLanguage(lang.code)}
                  activeOpacity={0.7}
                >
                  <View style={styles.optionContent}>
                    <Text style={styles.optionFlag}>{lang.flag}</Text>
                    <View style={styles.optionText}>
                      <Text style={[
                        styles.optionName, 
                        typography.heading,
                        { color: language === lang.code ? colors.primary : colors.primaryText }
                      ]}>
                        {lang.nativeName}
                      </Text>
                      <Text style={[
                        styles.optionSubname, 
                        typography.script,
                        { color: language === lang.code ? colors.primary : colors.secondaryText }
                      ]}>
                        {lang.name}
                      </Text>
                    </View>
                    {language === lang.code && (
                      <Check size={18} color={colors.primary} />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </Animated.View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  selector: {
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
  },
  selectorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectorFlag: {
    fontSize: 16,
    marginRight: 8,
  },
  languageInfo: {
    flex: 1,
  },
  languageName: {
    fontSize: 15,
    fontWeight: '500' as const,
    marginBottom: 2,
  },
  languageCode: {
    fontSize: 12,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  dropdown: {
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 280,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 16,
    borderWidth: 1,
  },
  dropdownTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    marginBottom: 16,
    textAlign: 'center',
  },
  languageOption: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginBottom: 6,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionFlag: {
    fontSize: 18,
    marginRight: 12,
  },
  optionText: {
    flex: 1,
  },
  optionName: {
    fontSize: 15,
    fontWeight: '500' as const,
    marginBottom: 2,
  },
  optionSubname: {
    fontSize: 12,
  },
});