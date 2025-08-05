# 🚀 Catharsis App Release Guide

## ⚠️ CRITICAL ACTIONS REQUIRED

### 1. **Replace app.json** (MANDATORY)
Your current `app.json` has several issues that will cause store rejection:

**Issues:**
- App name contains "pre-release" 
- Bundle identifiers are extremely long (will be rejected)
- Missing required store metadata

**Action:** Replace your current `app.json` with the content from `store-assets/production-config.json`

### 2. **Host Privacy Policy** (REQUIRED BY LAW)
- Upload `store-assets/privacy-policy.md` to your website
- Make it accessible at: `https://your-domain.com/privacy-policy`
- Update the URL in store listings

### 3. **Create Store Screenshots** (REQUIRED)

#### iOS Screenshots Needed:
- **iPhone 6.7"** (1290x2796) - iPhone 14 Pro Max, 15 Pro Max
- **iPhone 6.5"** (1242x2688) - iPhone XS Max, 11 Pro Max, 12 Pro Max, 13 Pro Max
- **iPhone 5.5"** (1242x2208) - iPhone 6s Plus, 7 Plus, 8 Plus
- **iPad Pro 12.9"** (2048x2732) - iPad Pro 12.9"

#### Android Screenshots Needed:
- **Phone** (1080x1920 or higher)
- **Tablet** (1200x1920 or higher)
- **Feature Graphic** (1024x500) - Required for Google Play

### 4. **Test on Physical Devices** (CRITICAL)
- Test all core features work offline
- Verify permissions are requested properly
- Test mood selection → verse display flow
- Test Bible reading functionality
- Test favorites and achievements
- Test sharing features

## 📋 Pre-Submission Checklist

### App Store Connect (iOS)
- [ ] Create app listing with new bundle ID: `com.catharsis.bible.mood`
- [ ] Upload screenshots for all device sizes
- [ ] Add app description (use content from `store-assets/app-store-description.md`)
- [ ] Set age rating (4+ recommended for religious content)
- [ ] Add privacy policy URL
- [ ] Complete App Review Information
- [ ] Set pricing (Free recommended)
- [ ] Add keywords: bible, spiritual, mood, verses, christian, faith, devotional, scripture

### Google Play Console (Android)
- [ ] Create app listing with package name: `com.catharsis.bible.mood`
- [ ] Upload screenshots and feature graphic
- [ ] Add app description
- [ ] Complete content rating questionnaire
- [ ] Add privacy policy URL
- [ ] Set target audience
- [ ] Complete Data Safety section
- [ ] Set pricing (Free recommended)

## 🔧 Technical Fixes Needed

### Console Logging (Production Cleanup)
Your app has extensive console logging. For production:
- Keep error logging for crash reporting
- Remove debug logs from production builds
- Consider using a logging service like Sentry

### Performance Optimizations
- [ ] Test app performance on older devices
- [ ] Verify memory usage is reasonable
- [ ] Test network error handling
- [ ] Verify offline functionality works completely

## 🎯 Store Optimization

### App Store Optimization (ASO)
**Title:** "Catharsis - Bible & Mood"
**Subtitle:** "Find verses for every feeling"
**Keywords:** bible, spiritual, mood, verses, christian, faith, devotional, scripture, daily, reading

### App Description Highlights:
- Mood-based verse discovery
- Complete Bible access
- Personal spiritual journey tracking
- Beautiful sharing features
- Offline reading capability

## 🚨 Common Rejection Reasons to Avoid

### iOS App Store:
- ❌ Long bundle identifiers (your current ones will be rejected)
- ❌ Missing privacy policy
- ❌ Incomplete app information
- ❌ Screenshots not matching actual app
- ❌ Crashes on launch

### Google Play Store:
- ❌ Missing privacy policy
- ❌ Incomplete Data Safety section
- ❌ Target audience not specified
- ❌ Content rating incomplete
- ❌ Package name conflicts

## 📱 Final Testing Protocol

### Before Submission:
1. **Clean Install Test**
   - Delete app completely
   - Install fresh build
   - Complete onboarding flow
   - Test all major features

2. **Network Scenarios**
   - Test with WiFi
   - Test with cellular data
   - Test in airplane mode (offline features)
   - Test with poor connection

3. **Device Compatibility**
   - Test on oldest supported iOS (iOS 13+)
   - Test on oldest supported Android (API 23+)
   - Test on different screen sizes

## 🎉 Post-Launch Checklist

### After Approval:
- [ ] Monitor crash reports
- [ ] Respond to user reviews within 24-48 hours
- [ ] Track key metrics (downloads, retention, ratings)
- [ ] Plan first update based on user feedback
- [ ] Set up analytics and monitoring

### Marketing:
- [ ] Share on social media
- [ ] Create app website
- [ ] Reach out to Christian/spiritual communities
- [ ] Consider app review sites

## 📞 Support Preparation

Set up:
- Support email: support@catharsis-app.com
- FAQ section on website
- User feedback collection system
- Bug reporting process

## 🔄 Update Strategy

Plan for regular updates:
- Bug fixes within 1-2 weeks
- Feature updates monthly
- Content updates (new verses, features) quarterly
- Major version updates annually

---

## 🚀 Ready to Launch?

Once you've completed all items above:
1. Build production version with updated app.json
2. Test thoroughly on physical devices
3. Submit to both stores simultaneously
4. Monitor for approval status
5. Celebrate your launch! 🎉

**Estimated Review Time:**
- iOS: 1-7 days (usually 24-48 hours)
- Android: 1-3 days (usually within 24 hours)

Good luck with your app launch! 🙏