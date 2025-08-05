#!/usr/bin/env node

// Catharsis App - Configuration Validator
// Checks for common App Store rejection issues

const fs = require('fs');
const path = require('path');

console.log('🔍 Validating Catharsis app configuration...\n');

let hasErrors = false;
let hasWarnings = false;

function error(message) {
  console.log(`❌ ERROR: ${message}`);
  hasErrors = true;
}

function warning(message) {
  console.log(`⚠️  WARNING: ${message}`);
  hasWarnings = true;
}

function success(message) {
  console.log(`✅ ${message}`);
}

// Check if app.json exists
if (!fs.existsSync('app.json')) {
  error('app.json file not found');
  process.exit(1);
}

// Read and parse app.json
let appConfig;
try {
  const appConfigText = fs.readFileSync('app.json', 'utf8');
  appConfig = JSON.parse(appConfigText);
} catch (e) {
  error('Failed to parse app.json: ' + e.message);
  process.exit(1);
}

const expo = appConfig.expo;

// Validate app name
if (!expo.name) {
  error('App name is missing');
} else if (expo.name.includes('pre-release') || expo.name.includes('test')) {
  error('App name contains development keywords: ' + expo.name);
} else if (expo.name === 'Catharsis - Bible & Mood') {
  success('App name is production-ready');
} else {
  warning('App name may not be optimal: ' + expo.name);
}

// Validate slug
if (!expo.slug) {
  error('App slug is missing');
} else if (expo.slug.length > 50) {
  error('App slug is too long (max 50 characters): ' + expo.slug);
} else if (expo.slug.includes('random') || expo.slug.match(/[0-9]{5,}/)) {
  error('App slug appears to contain random characters: ' + expo.slug);
} else if (expo.slug === 'catharsis-bible-mood') {
  success('App slug is production-ready');
} else {
  warning('App slug may not be optimal: ' + expo.slug);
}

// Validate version
if (!expo.version) {
  error('App version is missing');
} else if (expo.version === '1.0.0') {
  success('App version is set for initial release');
} else {
  success('App version: ' + expo.version);
}

// Validate bundle identifiers
if (expo.ios && expo.ios.bundleIdentifier) {
  if (expo.ios.bundleIdentifier.length > 50) {
    error('iOS bundle identifier is too long: ' + expo.ios.bundleIdentifier);
  } else if (expo.ios.bundleIdentifier === 'com.catharsis.bible.mood') {
    success('iOS bundle identifier is production-ready');
  } else {
    warning('iOS bundle identifier: ' + expo.ios.bundleIdentifier);
  }
} else {
  error('iOS bundle identifier is missing');
}

if (expo.android && expo.android.package) {
  if (expo.android.package.length > 50) {
    error('Android package name is too long: ' + expo.android.package);
  } else if (expo.android.package === 'com.catharsis.bible.mood') {
    success('Android package name is production-ready');
  } else {
    warning('Android package name: ' + expo.android.package);
  }
} else {
  error('Android package name is missing');
}

// Validate required metadata
if (!expo.description) {
  error('App description is missing');
} else {
  success('App description is present');
}

if (!expo.keywords || expo.keywords.length === 0) {
  error('App keywords are missing');
} else {
  success('App keywords are present (' + expo.keywords.length + ' keywords)');
}

if (!expo.privacy) {
  error('Privacy setting is missing');
} else if (expo.privacy === 'public') {
  success('Privacy setting is correct for App Store');
} else {
  warning('Privacy setting: ' + expo.privacy);
}

// Validate iOS specific settings
if (expo.ios) {
  if (!expo.ios.buildNumber) {
    error('iOS build number is missing');
  } else {
    success('iOS build number: ' + expo.ios.buildNumber);
  }

  if (expo.ios.config && expo.ios.config.usesNonExemptEncryption === false) {
    success('Export compliance is properly configured');
  } else {
    warning('Export compliance setting may need attention');
  }
}

// Validate Android specific settings
if (expo.android) {
  if (!expo.android.versionCode) {
    error('Android version code is missing');
  } else {
    success('Android version code: ' + expo.android.versionCode);
  }
}

// Check for development URLs
const plugins = expo.plugins || [];
for (const plugin of plugins) {
  if (Array.isArray(plugin) && plugin[0] === 'expo-router') {
    const config = plugin[1];
    if (config && config.origin) {
      if (config.origin.includes('rork.com')) {
        error('Development origin URL detected: ' + config.origin);
      } else if (config.origin.includes('catharisisapp.com')) {
        success('Production origin URL is set');
      } else {
        warning('Origin URL: ' + config.origin);
      }
    }
  }
}

// Validate permission descriptions
if (expo.ios && expo.ios.infoPlist) {
  const plist = expo.ios.infoPlist;
  
  if (plist.NSPhotoLibraryUsageDescription) {
    if (plist.NSPhotoLibraryUsageDescription.includes('$(PRODUCT_NAME)')) {
      warning('iOS photo library permission uses placeholder text');
    } else {
      success('iOS photo library permission has descriptive text');
    }
  }
  
  if (plist.NSPhotoLibraryAddUsageDescription) {
    if (plist.NSPhotoLibraryAddUsageDescription.includes('$(PRODUCT_NAME)')) {
      warning('iOS photo library add permission uses placeholder text');
    } else {
      success('iOS photo library add permission has descriptive text');
    }
  }
}

// Summary
console.log('\n📊 Validation Summary:');
if (hasErrors) {
  console.log(`❌ ${hasErrors ? 'ERRORS FOUND' : 'No errors'} - App will likely be rejected`);
  console.log('🔧 Run: bash scripts/prepare-for-production.sh');
} else if (hasWarnings) {
  console.log(`⚠️  Warnings found - Review recommended`);
  console.log('📖 See APPSTORE_REJECTION_FIXES.md for details');
} else {
  console.log(`✅ Configuration looks good for App Store submission!`);
}

console.log('\n📋 Next steps:');
console.log('1. Host privacy policy at: https://catharisisapp.com/privacy-policy');
console.log('2. Take screenshots for App Store');
console.log('3. Test on physical devices');
console.log('4. Complete App Store Connect metadata');

process.exit(hasErrors ? 1 : 0);