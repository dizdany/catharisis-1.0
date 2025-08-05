import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View, 
  Modal,
  TouchableWithoutFeedback,
  Pressable
} from 'react-native';
import { Globe, Check } from 'lucide-react-native';
import { useLanguageStore } from '@/store/languageStore';
import { useTranslation } from '@/hooks/useTranslation';
import { useTheme } from '@/hooks/useTheme';
import { Language } from '@/constants/translations';

const languages: { code: Language; name: string; nativeName: string; flag: string }[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'ro', name: 'Romanian', nativeName: 'Română', flag: '🇷🇴' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
];

export default function NewLanguageSelector() {
  const { language, setLanguage } = useLanguageStore();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  
  const currentLanguage = languages.find(lang => lang.code === language);
  
  const toggleModal = () => {
    setIsOpen(!isOpen);
  };
  
  const selectLanguage = (langCode: Language) => {
    setLanguage(langCode);
    setIsOpen(false);
  };

  return (
    <>
      <TouchableOpacity 
        style={[
          styles.button,
          {
            backgroundColor: colors.cardBackground,
            borderColor: colors.divider,
            shadowColor: colors.shadow,
          }
        ]} 
        onPress={toggleModal}
        activeOpacity={0.7}
        testID="language-selector-button"
      >
        <Text style={styles.flag}>{currentLanguage?.flag || '🇺🇸'}</Text>
        <Text style={[styles.languageCode, { color: colors.primaryText }]}>
          {language.toUpperCase()}
        </Text>
        <Globe size={16} color={colors.primaryText} />
      </TouchableOpacity>
      
      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={toggleModal}
      >
        <TouchableWithoutFeedback onPress={toggleModal}>
          <View style={[styles.overlay, { backgroundColor: colors.overlay }]}>
            <TouchableWithoutFeedback>
              <View 
                style={[
                  styles.modal,
                  {
                    backgroundColor: colors.cardBackground,
                    shadowColor: colors.shadow,
                    borderColor: colors.divider,
                  }
                ]}
              >
                <Text style={[styles.modalTitle, { color: colors.primaryText }]}>
                  {t('selectLanguage')}
                </Text>
                
                {languages.map((lang) => (
                  <Pressable
                    key={lang.code}
                    style={({ pressed }) => [
                      styles.languageOption,
                      {
                        backgroundColor: language === lang.code 
                          ? colors.primary + '20' 
                          : pressed 
                          ? colors.divider + '50'
                          : 'transparent'
                      }
                    ]}
                    onPress={() => selectLanguage(lang.code)}
                  >
                    <View style={styles.optionContent}>
                      <Text style={styles.optionFlag}>{lang.flag}</Text>
                      <View style={styles.optionText}>
                        <Text style={[
                          styles.optionName, 
                          { color: language === lang.code ? colors.primary : colors.primaryText }
                        ]}>
                          {lang.nativeName}
                        </Text>
                        <Text style={[
                          styles.optionSubname, 
                          { color: language === lang.code ? colors.primary : colors.secondaryText }
                        ]}>
                          {lang.name}
                        </Text>
                      </View>
                      {language === lang.code && (
                        <Check size={18} color={colors.primary} />
                      )}
                    </View>
                  </Pressable>
                ))}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 14,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    gap: 6,
    borderWidth: 1,
    minHeight: 40,
  },
  flag: {
    fontSize: 16,
  },
  languageCode: {
    fontSize: 12,
    fontWeight: '700' as const,
    minWidth: 20,
    textAlign: 'center',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modal: {
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 300,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 16,
    borderWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    marginBottom: 20,
    textAlign: 'center',
  },
  languageOption: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 4,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  optionFlag: {
    fontSize: 18,
  },
  optionText: {
    flex: 1,
  },
  optionName: {
    fontSize: 16,
    fontWeight: '500' as const,
    marginBottom: 2,
  },
  optionSubname: {
    fontSize: 12,
  },
});