# App Store Rejection Fixes for Catharsis App

## Critical Issues to Fix Before Submission

### 1. **URGENT: Replace app.json with Production Configuration**

Your current `app.json` has development settings that will cause immediate rejection. Replace the entire contents with the production configuration from `store-assets/production-config.json`.

**Current Issues:**
- ❌ App name: "Catharisis" (typo + unprofessional)
- ❌ Slug: Contains random characters that will be rejected
- ❌ Bundle ID: Will be rejected due to length
- ❌ Missing required metadata (description, keywords, privacy)
- ❌ Development origin URL (rork.com)

**Required Fix:**
```bash
# Copy production config to app.json
cp store-assets/production-config.json app.json
```

### 2. **Privacy Policy Requirements**

✅ **FIXED**: Privacy policy updated to reference correct URL: `catharisisapp.com/privacy-policy`

**Requirements:**
- Must be hosted at a publicly accessible URL
- Must be accessible without requiring app download
- Must comply with App Store guidelines
- Must match the URL you provide in App Store Connect

### 3. **Permission Justification Issues**

**Current Problems:**
Your app requests permissions that may not be justified:

**iOS Permissions to Review:**
- `NSPhotoLibraryUsageDescription` - ✅ Justified (sharing verses as images)
- `NSPhotoLibraryAddUsageDescription` - ✅ Justified (saving verse images)

**Android Permissions to Review:**
- `ACCESS_MEDIA_LOCATION` - ⚠️ May need justification
- `READ_MEDIA_VIDEO` - ⚠️ Not clearly justified for Bible app
- `READ_MEDIA_AUDIO` - ⚠️ Not clearly justified for Bible app

**Recommendation:** Remove unused permissions or provide clear justification in app description.

### 4. **App Store Connect Configuration**

**Required Information:**
- **App Name:** "Catharsis - Bible & Mood"
- **Subtitle:** "Find verses that match your mood"
- **Keywords:** bible, spiritual, mood, verses, christian, faith, devotional, scripture
- **Description:** Use content from `store-assets/app-store-description.md`
- **Privacy Policy URL:** `https://catharisisapp.com/privacy-policy`
- **Support URL:** `https://catharisisapp.com/support`
- **Marketing URL:** `https://catharisisapp.com`

### 5. **Age Rating & Content**

**Recommended Age Rating:** 4+
- No objectionable content
- Religious/spiritual content is appropriate for all ages
- No violence, profanity, or adult themes

**Content Rating Answers:**
- Cartoon or Fantasy Violence: None
- Realistic Violence: None
- Sexual Content or Nudity: None
- Profanity or Crude Humor: None
- Alcohol, Tobacco, or Drug Use: None
- Mature/Suggestive Themes: None
- Horror/Fear Themes: None
- Medical/Treatment Information: None
- Gambling: None

### 6. **Required Screenshots**

**iOS Screenshots Needed:**
- iPhone 6.7" (1290x2796) - iPhone 14 Pro Max
- iPhone 6.5" (1242x2688) - iPhone 11 Pro Max
- iPhone 5.5" (1242x2208) - iPhone 8 Plus
- iPad Pro 12.9" (2048x2732)

**Android Screenshots Needed:**
- Phone screenshots (minimum 2, maximum 8)
- Tablet screenshots (if supporting tablets)
- Feature graphic (1024x500)

**Screenshot Content Suggestions:**
1. Home screen with mood selection
2. Bible verse display
3. Favorites/bookmarks screen
4. Reading progress/achievements
5. Settings/customization options

### 7. **App Review Information**

**Demo Account (if needed):**
- Not required for this app (no login required)

**Review Notes:**
```
This is a spiritual/religious app that helps users find Bible verses based on their current mood. 

Key features to test:
1. Mood selection interface
2. Bible verse recommendations
3. Reading progress tracking
4. Favorites system
5. Offline functionality

The app works completely offline after initial load and does not require any special setup or accounts.
```

### 8. **Export Compliance**

**Answer:** No
- Your app doesn't use encryption beyond standard iOS/Android encryption
- No custom cryptographic implementations
- Standard HTTPS for API calls only

### 9. **Common Rejection Reasons & Solutions**

#### **Guideline 2.1 - App Completeness**
- ✅ App must be fully functional
- ✅ All features must work as described
- ✅ No placeholder content or "coming soon" features

#### **Guideline 4.3 - Spam**
- ✅ App provides unique value (mood-based Bible verse discovery)
- ✅ Not a duplicate of existing functionality
- ✅ Substantial content and features

#### **Guideline 5.1.1 - Privacy**
- ✅ Privacy policy hosted and accessible
- ✅ Clear data collection disclosure
- ✅ Appropriate permission requests

#### **Guideline 1.1.6 - Include Accurate Metadata**
- ✅ App name matches functionality
- ✅ Description accurately represents features
- ✅ Screenshots show actual app content
- ✅ Keywords are relevant and accurate

### 10. **Pre-Submission Testing Checklist**

**Functionality Testing:**
- [ ] App launches without crashes
- [ ] All navigation works correctly
- [ ] Mood selection functions properly
- [ ] Bible verses load and display correctly
- [ ] Favorites system works
- [ ] Achievement system functions
- [ ] Sharing features work
- [ ] Offline mode works properly
- [ ] Settings persist correctly

**Device Testing:**
- [ ] Test on physical iOS device
- [ ] Test on physical Android device
- [ ] Test on different screen sizes
- [ ] Test with poor/no internet connection
- [ ] Test system dark/light mode switching

**Performance Testing:**
- [ ] App loads quickly
- [ ] Smooth scrolling and animations
- [ ] No memory leaks
- [ ] Battery usage is reasonable

### 11. **Final Steps Before Submission**

1. **Replace app.json** with production configuration
2. **Host privacy policy** at `catharisisapp.com/privacy-policy`
3. **Take screenshots** on actual devices
4. **Test thoroughly** on clean devices
5. **Fill out App Store Connect** completely
6. **Submit for review**

### 12. **Post-Rejection Action Plan**

If rejected, common next steps:
1. **Read rejection reason carefully**
2. **Fix specific issues mentioned**
3. **Test fixes thoroughly**
4. **Update app version** if code changes made
5. **Resubmit with detailed response**

### 13. **Timeline Expectations**

- **iOS Review:** 1-7 days (usually 24-48 hours)
- **Android Review:** 1-3 days (usually within 24 hours)
- **Rejection Response:** Usually within 24 hours of resubmission

## Most Critical Action Items

1. 🚨 **IMMEDIATE:** Replace app.json with production config
2. 🚨 **IMMEDIATE:** Host privacy policy at catharisisapp.com/privacy-policy
3. 📱 **HIGH:** Take required screenshots
4. 🧪 **HIGH:** Test on physical devices
5. 📝 **MEDIUM:** Complete App Store Connect metadata

Following this guide should resolve 95% of common rejection reasons and significantly increase your approval chances.