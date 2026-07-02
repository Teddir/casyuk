#!/bin/bash
set -e

REPO="Teddir/casyuk"
echo "🔋 Installing CasYuk..."

# Detect OS and architecture
OS="$(uname -s)"
ARCH="$(uname -m)"

if [ "$OS" = "Darwin" ]; then
    OS_NAME="macos"
    if [ "$ARCH" = "arm64" ] || [ "$ARCH" = "aarch64" ]; then
        FILE_EXT="aarch64.dmg"
    else
        FILE_EXT="x64.dmg"
    fi
elif [ "$OS" = "Linux" ]; then
    OS_NAME="linux"
    FILE_EXT="amd64.deb"
else
    echo "❌ Unsupported OS: $OS"
    exit 1
fi

echo "🔍 Finding latest release for $OS_NAME..."

# Fetch latest release from GitHub API
LATEST_URL=$(curl -s https://api.github.com/repos/$REPO/releases/latest | grep "browser_download_url" | grep "$FILE_EXT" | cut -d '"' -f 4 | head -n 1)

if [ -z "$LATEST_URL" ]; then
    # Fallback to universal dmg for macOS if specific arch not found
    if [ "$OS" = "Darwin" ]; then
        LATEST_URL=$(curl -s https://api.github.com/repos/$REPO/releases/latest | grep "browser_download_url" | grep ".dmg" | cut -d '"' -f 4 | head -n 1)
    fi
    if [ -z "$LATEST_URL" ]; then
        echo "❌ Could not find a suitable release for your system."
        exit 1
    fi
fi

echo "⬇️ Downloading CasYuk from $LATEST_URL..."
DOWNLOAD_PATH="/tmp/casyuk_install_$FILE_EXT"
curl -L -o "$DOWNLOAD_PATH" "$LATEST_URL"

echo "📦 Installing..."
if [ "$OS" = "Darwin" ]; then
    hdiutil attach "$DOWNLOAD_PATH" -nobrowse -quiet
    cp -R "/Volumes/CasYuk/CasYuk.app" /Applications/
    hdiutil detach "/Volumes/CasYuk" -quiet
    rm "$DOWNLOAD_PATH"
    echo "✅ CasYuk installed successfully to /Applications!"
elif [ "$OS" = "Linux" ]; then
    sudo dpkg -i "$DOWNLOAD_PATH"
    sudo apt-get install -f -y # Install missing dependencies if any
    rm "$DOWNLOAD_PATH"
    echo "✅ CasYuk installed successfully!"
fi

echo "🚀 You can now launch CasYuk!"
