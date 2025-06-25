#!/usr/bin/env bash

# =============================================================================
# MONOREPO RELEASE SCRIPT
# =============================================================================
#
# Updates version numbers across all packages in a Lerna monorepo.
#
# USAGE: ./release.sh 20.12.3
#
# REQUIREMENTS:
# - nvm installed (macOS/Linux only)
# - Run from monorepo root directory
#
# WHAT IT DOES:
# - Switches to Node.js 20
# - Updates all package.json files to new version
# - Updates cross-package dependencies to same version
# - Regenerates package-lock.json
#
# WHAT IT DOESN'T DO:
# - No Git commits/tags created
#
# =============================================================================

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

# Update the root package.json version
npm version "$VERSION" --no-git-tag-version

# Update all packages in the monorepo
npx lerna version "$VERSION" --no-push --no-git-tag-version

# regenerate lockfile
npm install --package-lock-only

echo "Release process completed for version $VERSION"
