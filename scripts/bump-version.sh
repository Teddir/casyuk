#!/bin/bash

if [ -z "$1" ]; then
  echo "Usage: ./bump-version.sh <new_version>"
  echo "Example: ./bump-version.sh 0.1.1"
  exit 1
fi

NEW_VERSION=$1

echo "Bumping version to $NEW_VERSION..."

# Update package.json
sed -i '' -e 's/"version": ".*"/"version": "'$NEW_VERSION'"/' package.json

# Update tauri.conf.json
sed -i '' -e 's/"version": ".*"/"version": "'$NEW_VERSION'"/' src-tauri/tauri.conf.json

# Update Cargo.toml
sed -i '' -e 's/^version = ".*"/version = "'$NEW_VERSION'"/' src-tauri/Cargo.toml

echo "Version bumped successfully!"
