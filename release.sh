#!/usr/bin/env bash
set -euo pipefail

# Check if version argument is provided
VERSION=$1
[ -z "$VERSION" ] && { echo "Usage: $0 <version>"; exit 1; }

# make sure nvm is available
export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
if [ -s "$NVM_DIR/nvm.sh" ]; then
  . "$NVM_DIR/nvm.sh"
else
  echo "nvm not found in $NVM_DIR. please install nvm or update NVM_DIR."
  exit 1
fi

echo "Starting release process for version $VERSION"

# switch to Node 20
nvm install 20
nvm use 20
echo "Using Node.js $(node --version)"

# update versions
npm version "$VERSION" --no-git-tag-version # updates the root package.json
npx lerna version "$VERSION" --no-push --no-git-tag-version # updates the package's package.json

# regenerate lockfile
npm install --package-lock-only

echo "Release process completed for version $VERSION"
