#!/bin/bash

# Catharsis App - Production Preparation Script
# This script prepares your app for App Store submission

echo "🚀 Preparing Catharsis app for production submission..."

# 1. Backup current app.json
echo "📦 Backing up current app.json..."
cp app.json app.json.backup
echo "✅ Backup created: app.json.backup"

# 2. Replace with production configuration
echo "🔄 Applying production configuration..."
cp store-assets/production-config.json app.json
echo "✅ Production configuration applied"

# 3. Verify the change
echo "🔍 Verifying configuration..."
if grep -q "Catharsis - Bible & Mood" app.json; then
    echo "✅ App name updated correctly"
else
    echo "❌ App name not updated - check manually"
fi

if grep -q "catharsis-bible-mood" app.json; then
    echo "✅ Slug updated correctly"
else
    echo "❌ Slug not updated - check manually"
fi

if grep -q "com.catharsis.bible.mood" app.json; then
    echo "✅ Bundle identifier updated correctly"
else
    echo "❌ Bundle identifier not updated - check manually"
fi

echo ""
echo "🎉 Production preparation complete!"
echo ""
echo "📋 Next steps:"
echo "1. Host privacy policy at: https://catharisisapp.com/privacy-policy"
echo "2. Take screenshots for App Store"
echo "3. Test on physical devices"
echo "4. Complete App Store Connect metadata"
echo "5. Submit for review"
echo ""
echo "📖 See APPSTORE_REJECTION_FIXES.md for detailed instructions"