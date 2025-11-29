#!/bin/bash

mkdir -p build

TIMESTAMP=$(date +"%Y.%m.%d-%H.%M.%S")
FILENAME="./build/app-release-$TIMESTAMP.apk"

echo "🚀 Starting local Android build..."
echo "📂 Output path: $FILENAME"

eas build --platform android --profile preview --local --output "$FILENAME"

echo "✅ Build finished!"