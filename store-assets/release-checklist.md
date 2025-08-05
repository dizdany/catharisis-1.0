# Release Checklist for Catharsis App

## Pre-Release Requirements

### 1. App Configuration (app.json) - CRITICAL
- [ ] Change app name from "Catharisis0.3 pre-release" to "Catharsis - Bible & Mood"
- [ ] Update slug to "catharsis-bible-mood"
- [ ] Change iOS bundleIdentifier to "com.catharsis.bible.mood"
- [ ] Change Android package to "com.catharsis.bible.mood"
- [ ] Add app description
- [ ] Add keywords array
- [ ] Set privacy to "public"
- [ ] Add primaryColor
- [ ] Update iOS buildNumber to "1"
- [ ] Update Android versionCode to 1
- [ ] Add proper permission descriptions

### 2. Store Assets
- [x] Privacy Policy created
- [x] App Store description created
- [ ] Screenshots needed (see requirements below)
- [ ] App icons verified (512x512 for stores)
- [ ] Feature graphic for Google Play (1024x500)

### 3. Technical Requirements

#### iOS Specific
- [ ] Test on physical iOS device
- [ ] Verify all permissions work correctly
- [ ] Test offline functionality
- [ ] Verify no crashes on launch
- [ ] Test on different screen sizes
- [ ] Verify proper handling of system dark/light mode

#### Android Specific
- [ ] Test on physical Android device
- [ ] Verify adaptive icon displays correctly
- [ ] Test on different Android versions (API 23+)
- [ ] Verify proper back button handling
- [ ] Test permissions on Android 13+
- [ ] Verify proper handling of system themes

### 4. Content & Legal
- [x] Privacy Policy hosted and accessible
- [ ] Terms of Service (recommended)
- [ ] Content rating completed
- [ ] Age rating questionnaire completed
- [ ] Copyright and trademark verification

### 5. Store-Specific Requirements

#### Apple App Store
- [ ] App Store Connect account setup
- [ ] Screenshots for all required device sizes:
  - iPhone 6.7" (1290x2796)
  - iPhone 6.5" (1242x2688)  
  - iPhone 5.5" (1242x2208)
  - iPad Pro 12.9" (2048x2732)
- [ ] App preview videos (optional but recommended)
- [ ] App Review Information filled
- [ ] Export Compliance information
- [ ] Age rating completed

#### Google Play Store
- [ ] Google Play Console account setup
- [ ] Screenshots for phone and tablet
- [ ] Feature graphic (1024x500)
- [ ] High-res icon (512x512)
- [ ] Content rating questionnaire
- [ ] Target audience selection
- [ ] Data safety section completed

### 6. Testing Checklist
- [ ] App launches successfully
- [ ] All navigation works
- [ ] Mood selection functions properly
- [ ] Bible reading works offline
- [ ] Favorites system works
- [ ] Achievement system functions
- [ ] Sharing features work
- [ ] Onboarding flow completes
- [ ] Settings persist correctly
- [ ] No memory leaks or crashes
- [ ] Performance is acceptable

### 7. Final Steps
- [ ] Version numbers match across all files
- [ ] All console.log statements reviewed (keep only necessary ones)
- [ ] Error handling tested
- [ ] Network error scenarios tested
- [ ] App works in airplane mode
- [ ] Final build testing on clean devices

## Critical Issues to Address

1. **🚨 URGENT: Replace app.json**: Current config has development settings that will cause immediate rejection
   - Run: `cp store-assets/production-config.json app.json`
   - Or run: `bash scripts/prepare-for-production.sh`

2. **✅ FIXED: Privacy Policy**: Updated to reference catharisisapp.com/privacy-policy
   - Must be hosted at this exact URL before submission

3. **⚠️ Permissions**: Review Android permissions - some may not be justified
   - READ_MEDIA_VIDEO and READ_MEDIA_AUDIO may need removal
   - ACCESS_MEDIA_LOCATION needs clear justification

4. **📱 Screenshots**: Required for both stores - need to be created
   - iOS: 6.7", 6.5", 5.5", iPad Pro 12.9"
   - Android: Phone + tablet screenshots, feature graphic

5. **🧪 Testing**: Must test on physical devices before submission

## Recommended Next Steps

1. **IMMEDIATE**: Run `bash scripts/prepare-for-production.sh`
2. **IMMEDIATE**: Host privacy policy at catharisisapp.com/privacy-policy
3. **HIGH**: Take screenshots on actual devices
4. **HIGH**: Test thoroughly on physical devices
5. **MEDIUM**: Complete App Store Connect metadata
6. **FINAL**: Submit for review

## Quick Validation

Run this to check for common issues:
```bash
node scripts/validate-app-config.js
```

## Store Review Timeline
- **iOS**: 1-7 days (usually 24-48 hours)
- **Android**: 1-3 days (usually within 24 hours)

## Post-Launch
- [ ] Monitor crash reports
- [ ] Respond to user reviews
- [ ] Plan first update based on feedback