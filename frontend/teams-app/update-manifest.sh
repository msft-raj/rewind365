#!/bin/bash

# Script to update Teams manifest with ngrok URL
# Usage: ./update-manifest.sh https://your-ngrok-url.ngrok.io

if [ $# -eq 0 ]; then
    echo "Usage: $0 <ngrok-url>"
    echo "Example: $0 https://abc123.ngrok.io"
    exit 1
fi

NGROK_URL=$1

# Remove trailing slash if present
NGROK_URL=$(echo "$NGROK_URL" | sed 's:/*$::')

echo "Updating manifest.json with ngrok URL: $NGROK_URL"

# Update the manifest.json file
sed -i "s|https://localhost:3000|$NGROK_URL|g" manifest.json

# Verify the changes
echo "Updated URLs in manifest.json:"
grep -n "https://" manifest.json

# Recreate the zip package
echo "Creating updated Teams app package..."
zip -r rewind365-teams-app-ngrok.zip manifest.json color.png outline.png

echo "✅ Teams app package updated: rewind365-teams-app-ngrok.zip"
echo ""
echo "Next steps:"
echo "1. Upload rewind365-teams-app-ngrok.zip to Teams"
echo "2. Install the app in your M365 dev tenant"
echo "3. Test the functionality"