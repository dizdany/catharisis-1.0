import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, ScrollView, Keyboard } from 'react-native';
import { User, UserCheck, Minus, Plus, ArrowRight, Globe, ArrowLeft, Lightbulb, Heart, Share, BookOpen, X } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { useUserProfile, Gender } from '@/store/userProfileStore';
import { useRouter } from 'expo-router';
import { useTranslation } from '@/hooks/useTranslation';
import { useLanguageStore } from '@/store/languageStore';
import { Language } from '@/constants/translations';
import { searchNameSuggestions } from '@/constants/romanianNames';
import { searchEnglishNameSuggestions } from '@/constants/englishNames';
import { getNameMeaning } from '@/constants/namesMeanings';

interface OnboardingData {
  language: Language;
  name: string;
  age: number;
  gender: Gender;
}

export default function OnboardingFlow() {
  const { colors } = useTheme();
  const { createProfile, markOnboardingAsSkipped } = useUserProfile();
  const { setLanguage } = useLanguageStore();
  const router = useRouter();
  const { t } = useTranslation();
  
  const [data, setData] = useState<OnboardingData>({
    language: 'en',
    name: '',
    age: 25,
    gender: 'male',
  });
  
  const [currentStep, setCurrentStep] = useState<'language' | 'name' | 'age' | 'gender' | 'tips' | 'complete'>('language');
  const [nameSuggestions, setNameSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);

  const handleNext = () => {
    if (currentStep === 'language') {
      setLanguage(data.language);
      setCurrentStep('name');
    } else if (currentStep === 'name' && data.name.trim()) {
      setShowSuggestions(false);
      setCurrentStep('age');
    } else if (currentStep === 'age') {
      setCurrentStep('gender');
    } else if (currentStep === 'gender') {
      setCurrentStep('tips');
    } else if (currentStep === 'tips') {
      setCurrentStep('complete');
    }
  };

  const handleBack = () => {
    if (currentStep === 'name') {
      setCurrentStep('language');
    } else if (currentStep === 'age') {
      setCurrentStep('name');
    } else if (currentStep === 'gender') {
      setCurrentStep('age');
    } else if (currentStep === 'tips') {
      setCurrentStep('gender');
    } else if (currentStep === 'complete') {
      setCurrentStep('tips');
    }
  };

  const handleNameChange = (name: string) => {
    setData(prev => ({ ...prev, name }));
    
    if (name.length >= 2) {
      let suggestions: string[] = [];
      
      if (data.language === 'en') {
        suggestions = searchEnglishNameSuggestions(name);
      } else if (data.language === 'ro') {
        suggestions = searchNameSuggestions(name); // This searches both Romanian and English
      } else {
        // For other languages, search both English and Romanian
        suggestions = searchNameSuggestions(name);
      }
      
      setNameSuggestions(suggestions);
      setShowSuggestions(suggestions.length > 0);
    } else {
      setNameSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const selectNameSuggestion = (selectedName: string) => {
    setData(prev => ({ ...prev, name: selectedName }));
    setShowSuggestions(false);
    setNameSuggestions([]);
    Keyboard.dismiss();
  };

  const handleComplete = () => {
    createProfile(data.name.trim(), data.age, data.gender);
    // Don't preselect any mood - let user choose
    router.replace('/(tabs)');
  };

  const handleSkip = () => {
    // Skip onboarding without creating a profile - let user choose their preferences
    markOnboardingAsSkipped();
    router.replace('/(tabs)');
  };

  const handleSkipTips = () => {
    setCurrentStep('complete');
  };

  const canContinue = () => {
    if (currentStep === 'name') return data.name.trim().length > 0;
    return true;
  };

  const languageOptions = [
    { code: 'en' as Language, name: 'English', flag: '🇺🇸' },
    { code: 'es' as Language, name: 'Español', flag: '🇪🇸' },
    { code: 'ro' as Language, name: 'Română', flag: '🇷🇴' },
  ];

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      {currentStep !== 'language' && (
        <Pressable
          style={[styles.backButton, { backgroundColor: colors.cardBackground }]}
          onPress={handleBack}
        >
          <ArrowLeft size={24} color={colors.primaryText} />
        </Pressable>
      )}
      
      {currentStep !== 'complete' && (
        <Pressable
          style={[styles.skipButton, { backgroundColor: colors.cardBackground }]}
          onPress={handleSkip}
        >
          <X size={20} color={colors.secondaryText} />
        </Pressable>
      )}
      
      <View style={styles.stepContainer}>
        {currentStep === 'language' && (
          <View style={styles.step}>
            <Text style={[styles.title, { color: colors.primaryText }]}>
              {t('chooseLanguage')}
            </Text>
            <View style={styles.languageContainer}>
              {languageOptions.map((option) => (
                <Pressable
                  key={option.code}
                  style={[
                    styles.languageOption,
                    {
                      backgroundColor: data.language === option.code ? colors.primary : colors.cardBackground,
                      borderColor: data.language === option.code ? colors.primary : colors.divider,
                    }
                  ]}
                  onPress={() => setData(prev => ({ ...prev, language: option.code }))}
                >
                  <Text style={styles.flagEmoji}>{option.flag}</Text>
                  <Text style={[
                    styles.languageText,
                    { color: data.language === option.code ? colors.buttonText : colors.primaryText }
                  ]}>
                    {option.name}
                  </Text>
                  {data.language === option.code && (
                    <UserCheck 
                      size={20} 
                      color={colors.buttonText} 
                      style={styles.checkIcon}
                    />
                  )}
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {currentStep === 'name' && (
          <View style={styles.step}>
            <Text style={[styles.title, { color: colors.primaryText }]}>
              {t('whatIsYourName')}
            </Text>
            <View style={styles.nameInputWrapper}>
              <View style={[
                styles.inputContainer,
                {
                  backgroundColor: colors.cardBackground,
                  borderColor: colors.divider,
                }
              ]}>
                <User size={20} color={colors.secondaryText} />
                <TextInput
                  style={[styles.input, { color: colors.primaryText }]}
                  value={data.name}
                  onChangeText={handleNameChange}
                  placeholder={t('yourName')}
                  placeholderTextColor={colors.secondaryText}
                  autoCapitalize="words"
                  autoCorrect={false}
                  returnKeyType="next"
                  onSubmitEditing={canContinue() ? handleNext : undefined}
                  onFocus={() => {
                    if (data.name.length >= 2) {
                      let suggestions: string[] = [];
                      
                      if (data.language === 'en') {
                        suggestions = searchEnglishNameSuggestions(data.name);
                      } else if (data.language === 'ro') {
                        suggestions = searchNameSuggestions(data.name);
                      } else {
                        suggestions = searchNameSuggestions(data.name);
                      }
                      
                      setNameSuggestions(suggestions);
                      setShowSuggestions(suggestions.length > 0);
                    }
                  }}
                  onBlur={() => {
                    // Delay hiding suggestions to allow for selection
                    setTimeout(() => setShowSuggestions(false), 150);
                  }}
                />
              </View>
              
              {showSuggestions && nameSuggestions.length > 0 && (
                <View style={[
                  styles.suggestionsContainer,
                  {
                    backgroundColor: colors.cardBackground,
                    borderColor: colors.divider,
                  }
                ]}>
                  <View style={styles.suggestionsList}>
                    {nameSuggestions.map((item, index) => (
                      <Pressable
                        key={`${item}-${index}`}
                        style={[
                          styles.suggestionItem,
                          { borderBottomColor: colors.divider }
                        ]}
                        onPress={() => selectNameSuggestion(item)}
                      >
                        <Text style={[styles.suggestionText, { color: colors.primaryText }]}>
                          {item}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </View>
              )}
            </View>
            <Text style={[styles.tipText, { color: colors.secondaryText }]}>
              {t('nameTip')}
            </Text>
          </View>
        )}

        {currentStep === 'age' && (
          <View style={styles.step}>
            <Text style={[styles.title, { color: colors.primaryText }]}>
              {t('howOldAreYou')}
            </Text>
            <View style={styles.ageContainer}>
              <Pressable
                style={[
                  styles.ageButton,
                  { backgroundColor: colors.cardBackground, borderColor: colors.divider }
                ]}
                onPress={() => setData(prev => ({ ...prev, age: Math.max(5, prev.age - 1) }))}
              >
                <Minus size={24} color={colors.primaryText} />
              </Pressable>
              
              <View style={[styles.ageDisplay, { backgroundColor: colors.primary }]}>
                <Text style={[styles.ageText, { color: colors.buttonText }]}>
                  {data.age}
                </Text>
              </View>
              
              <Pressable
                style={[
                  styles.ageButton,
                  { backgroundColor: colors.cardBackground, borderColor: colors.divider }
                ]}
                onPress={() => setData(prev => ({ ...prev, age: Math.min(100, prev.age + 1) }))}
              >
                <Plus size={24} color={colors.primaryText} />
              </Pressable>
            </View>
            <Text style={[styles.tipText, { color: colors.secondaryText }]}>
              {t('ageTip')}
            </Text>
          </View>
        )}

        {currentStep === 'gender' && (
          <View style={styles.step}>
            <Text style={[styles.title, { color: colors.primaryText }]}>
              {t('iAm')}
            </Text>
            <View style={styles.genderContainer}>
              <Pressable
                style={[
                  styles.genderOption,
                  {
                    backgroundColor: data.gender === 'male' ? colors.primary : colors.cardBackground,
                    borderColor: data.gender === 'male' ? colors.primary : colors.divider,
                  }
                ]}
                onPress={() => setData(prev => ({ ...prev, gender: 'male' }))}
              >
                <User 
                  size={32} 
                  color={data.gender === 'male' ? colors.buttonText : colors.primaryText} 
                />
                <Text style={[
                  styles.genderText,
                  { color: data.gender === 'male' ? colors.buttonText : colors.primaryText }
                ]}>
                  {t('male')}
                </Text>
                {data.gender === 'male' && (
                  <UserCheck 
                    size={20} 
                    color={colors.buttonText} 
                    style={styles.checkIcon}
                  />
                )}
              </Pressable>
              
              <Pressable
                style={[
                  styles.genderOption,
                  {
                    backgroundColor: data.gender === 'female' ? colors.primary : colors.cardBackground,
                    borderColor: data.gender === 'female' ? colors.primary : colors.divider,
                  }
                ]}
                onPress={() => setData(prev => ({ ...prev, gender: 'female' }))}
              >
                <User 
                  size={32} 
                  color={data.gender === 'female' ? colors.buttonText : colors.primaryText} 
                />
                <Text style={[
                  styles.genderText,
                  { color: data.gender === 'female' ? colors.buttonText : colors.primaryText }
                ]}>
                  {t('female')}
                </Text>
                {data.gender === 'female' && (
                  <UserCheck 
                    size={20} 
                    color={colors.buttonText} 
                    style={styles.checkIcon}
                  />
                )}
              </Pressable>
            </View>
          </View>
        )}

        {currentStep === 'tips' && (
          <View style={styles.step}>
            <Text style={[styles.title, { color: colors.primaryText }]}>
              {t('helpfulTips')}
            </Text>
            <Text style={[styles.subtitle, { color: colors.secondaryText }]}>
              {t('tipsSubtitle')}
            </Text>
            
            <View style={styles.tipsContainer}>
              <View style={[styles.tipCard, { backgroundColor: colors.cardBackground, borderColor: colors.divider }]}>
                <View style={[styles.tipIconContainer, { backgroundColor: colors.primary }]}>
                  <Heart size={24} color={colors.buttonText} />
                </View>
                <Text style={[styles.tipTitle, { color: colors.primaryText }]}>
                  {t('tip1Title')}
                </Text>
                <Text style={[styles.tipDescription, { color: colors.secondaryText }]}>
                  {t('tip1Description')}
                </Text>
              </View>
              
              <View style={[styles.tipCard, { backgroundColor: colors.cardBackground, borderColor: colors.divider }]}>
                <View style={[styles.tipIconContainer, { backgroundColor: colors.primary }]}>
                  <Lightbulb size={24} color={colors.buttonText} />
                </View>
                <Text style={[styles.tipTitle, { color: colors.primaryText }]}>
                  {t('tip2Title')}
                </Text>
                <Text style={[styles.tipDescription, { color: colors.secondaryText }]}>
                  {t('tip2Description')}
                </Text>
              </View>
              
              <View style={[styles.tipCard, { backgroundColor: colors.cardBackground, borderColor: colors.divider }]}>
                <View style={[styles.tipIconContainer, { backgroundColor: colors.primary }]}>
                  <Share size={24} color={colors.buttonText} />
                </View>
                <Text style={[styles.tipTitle, { color: colors.primaryText }]}>
                  {t('tip3Title')}
                </Text>
                <Text style={[styles.tipDescription, { color: colors.secondaryText }]}>
                  {t('tip3Description')}
                </Text>
              </View>
              
              <View style={[styles.tipCard, { backgroundColor: colors.cardBackground, borderColor: colors.divider }]}>
                <View style={[styles.tipIconContainer, { backgroundColor: colors.primary }]}>
                  <BookOpen size={24} color={colors.buttonText} />
                </View>
                <Text style={[styles.tipTitle, { color: colors.primaryText }]}>
                  {t('tip4Title')}
                </Text>
                <Text style={[styles.tipDescription, { color: colors.secondaryText }]}>
                  {t('tip4Description')}
                </Text>
              </View>
            </View>
          </View>
        )}

        {currentStep === 'complete' && (
          <View style={styles.step}>
            <Text style={[styles.title, { color: colors.primaryText }]}>
              {t('hello')}, {data.name}!
            </Text>
            <Text style={[styles.subtitle, { color: colors.secondaryText }]}>
              {t('readyToStart')}
            </Text>
            {(() => {
              const nameMeaning = getNameMeaning(data.name, data.language);
              if (nameMeaning) {
                return (
                  <View style={[styles.nameMeaningContainer, { backgroundColor: colors.cardBackground, borderColor: colors.divider }]}>
                    <Text style={[styles.nameMeaningHeader, { color: colors.primary }]}>
                      {t('yourNameMeans')}
                    </Text>
                    <Text style={[styles.nameMeaningTitle, { color: colors.primaryText }]}>
                      {data.age >= 16 ? '' : '🕊️ '}{nameMeaning.meaning}
                    </Text>
                    <Text style={[styles.nameMeaningDescription, { color: colors.secondaryText }]}>
                      {nameMeaning.biblicalCharacter}
                    </Text>
                    <View style={styles.verseContainer}>
                      <Text style={[styles.verseText, { color: colors.primaryText }]}>
                        &ldquo;{nameMeaning.verse.text}&rdquo;
                      </Text>
                      <Text style={[styles.verseReference, { color: colors.primary }]}>
                        {nameMeaning.verse.reference}
                      </Text>
                    </View>
                  </View>
                );
              }
              return null;
            })()}
          </View>
        )}
      </View>

      <View style={styles.buttonContainer}>
        {currentStep === 'tips' ? (
          <View style={styles.tipsButtonContainer}>
            <Pressable
              style={[styles.tipsSkipButton, { backgroundColor: colors.cardBackground, borderColor: colors.divider }]}
              onPress={handleSkipTips}
            >
              <Text style={[styles.skipText, { color: colors.secondaryText }]}>
                {t('skipTips')}
              </Text>
            </Pressable>
            <Pressable
              style={[styles.continueButton, { backgroundColor: colors.primary }]}
              onPress={handleNext}
            >
              <Text style={[styles.continueText, { color: colors.buttonText }]}>
                {t('gotIt')}
              </Text>
              <ArrowRight size={20} color={colors.buttonText} />
            </Pressable>
          </View>
        ) : currentStep !== 'complete' ? (
          <Pressable
            style={[
              styles.continueButton,
              { 
                backgroundColor: canContinue() ? colors.primary : colors.divider,
                opacity: canContinue() ? 1 : 0.5,
              }
            ]}
            onPress={handleNext}
            disabled={!canContinue()}
          >
            <Text style={[styles.continueText, { color: colors.buttonText }]}>
              {t('continue')}
            </Text>
            <ArrowRight size={20} color={colors.buttonText} />
          </Pressable>
        ) : (
          <Pressable
            style={[styles.continueButton, { backgroundColor: colors.primary }]}
            onPress={handleComplete}
          >
            <Text style={[styles.continueText, { color: colors.buttonText }]}>
              {t('start')}
            </Text>
            <ArrowRight size={20} color={colors.buttonText} />
          </Pressable>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  skipButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  stepContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  step: {
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700' as const,
    marginBottom: 40,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  nameInputWrapper: {
    width: '100%',
    maxWidth: 300,
    position: 'relative',
    zIndex: 1000,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    width: '100%',
    gap: 12,
  },
  suggestionsContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    borderWidth: 1,
    borderTopWidth: 0,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    maxHeight: 200,
    zIndex: 1001,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  suggestionsList: {
    maxHeight: 200,
  },
  suggestionItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  suggestionText: {
    fontSize: 16,
    fontWeight: '500' as const,
  },
  input: {
    flex: 1,
    fontSize: 18,
    fontWeight: '500' as const,
  },
  ageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  ageButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ageDisplay: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ageText: {
    fontSize: 32,
    fontWeight: '700' as const,
  },
  genderContainer: {
    flexDirection: 'row',
    gap: 20,
  },
  genderOption: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
    paddingHorizontal: 40,
    borderRadius: 20,
    borderWidth: 2,
    minWidth: 140,
    position: 'relative',
  },
  genderText: {
    fontSize: 18,
    fontWeight: '600' as const,
    marginTop: 12,
  },
  languageContainer: {
    gap: 16,
    width: '100%',
    maxWidth: 300,
  },
  languageOption: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderRadius: 16,
    borderWidth: 2,
    position: 'relative',
    flexDirection: 'row',
    gap: 12,
  },
  languageText: {
    fontSize: 18,
    fontWeight: '600' as const,
  },
  flagEmoji: {
    fontSize: 24,
  },
  checkIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  buttonContainer: {
    paddingTop: 40,
  },
  continueButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 25,
    gap: 8,
  },
  continueText: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
  nameMeaningContainer: {
    marginTop: 30,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    maxWidth: 350,
    width: '100%',
  },
  nameMeaningHeader: {
    fontSize: 16,
    fontWeight: '600' as const,
    textAlign: 'center',
    marginBottom: 12,
  },
  nameMeaningTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    textAlign: 'center',
    marginBottom: 8,
  },
  nameMeaningDescription: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
    fontStyle: 'italic',
  },
  verseContainer: {
    alignItems: 'center',
  },
  verseText: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 8,
    fontStyle: 'italic',
  },
  verseReference: {
    fontSize: 13,
    fontWeight: '600' as const,
  },
  tipsContainer: {
    width: '100%',
    maxWidth: 400,
    gap: 16,
    marginTop: 20,
  },
  tipCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
  },
  tipIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    textAlign: 'center',
    marginBottom: 8,
  },
  tipDescription: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  tipsButtonContainer: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  tipsSkipButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 25,
    borderWidth: 1,
  },
  skipText: {
    fontSize: 16,
    fontWeight: '500' as const,
  },
  tipText: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 16,
    paddingHorizontal: 20,
    fontStyle: 'italic',
  },
});