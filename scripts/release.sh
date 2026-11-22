#!/usr/bin/env bash
set -euo pipefail

echo "=== Release Script Started ==="

if [[ -z "${NODE_AUTH_TOKEN:-}" ]]; then
  echo "::error::NODE_AUTH_TOKEN is not set. Please make sure NPM_TOKEN secret exists in GitHub repository secrets (Settings -> Secrets and variables -> Actions)."
  exit 1
fi

version=$(node -p "require('./package.json').version")
name=$(node -p "require('./package.json').name")
registry="${NPM_CONFIG_REGISTRY:-https://registry.npmjs.org}"

echo "Package: $name"
echo "Initial Version: $version"

# Check if this version is already published on the npm registry
status_code=$(curl -s -o /dev/null -w "%{http_code}" "$registry/$name/$version" || true)
echo "Registry HTTP status for $name@$version: $status_code"

if [[ "$status_code" != "404" ]]; then
  echo "Version $version is already published on npm. Bumping patch version automatically..."
  npm version patch --no-git-tag-version --ignore-scripts
  version=$(node -p "require('./package.json').version")
  echo "New release version: $version"
fi

# Ensure fresh production build
npm run build

artifact_dir=$(mktemp -d)
trap 'rm -rf -- "$artifact_dir"' EXIT
filename=$(npm pack --silent --pack-destination "$artifact_dir")
artifact="$artifact_dir/$filename"
echo "Packaged artifact: $filename ($artifact)"

echo "Publishing $name@$version to npm with public access..."
npm publish "$artifact" --access public --tag latest
echo "Successfully published $name@$version to npm!"

# Best-effort git tag (non-blocking if GitHub Actions token has restricted permissions)
git config user.name 'github-actions[bot]' 2>/dev/null || true
git config user.email '41898282+github-actions[bot]@users.noreply.github.com' 2>/dev/null || true
git tag -f -a "v$version" -m "Release v$version" 2>/dev/null || true
git push origin "refs/tags/v$version" 2>/dev/null || true

if [[ -n "${GITHUB_OUTPUT:-}" ]]; then
  echo "version=$version" >> "$GITHUB_OUTPUT"
fi

echo "=== Release Script Finished Successfully ==="
