#!/usr/bin/env bash
set -euo pipefail

version="${1:?Expected release version}"
scratch=$(mktemp -d)
trap 'rm -rf -- "$scratch"' EXIT

echo "Verifying public install of glowafter@$version..."

for attempt in {1..12}; do
  dir="$scratch/$attempt"
  mkdir -p "$dir/test-pkg" "$dir/home"
  
  if output=$(cd "$dir/test-pkg" && env -i PATH="$PATH" HOME="$dir/home" \
    npm_config_cache="$dir/cache" npm_config_registry=https://registry.npmjs.org/ \
    timeout 35s node -e "
      const { execSync } = require('child_process');
      execSync('npm init -y', { stdio: 'ignore' });
      execSync('npm install --prefer-online react react-dom glowafter@$version', { stdio: 'ignore' });
      const pkg = require('glowafter');
      if (!pkg.naturePresets) throw new Error('naturePresets missing');
      console.log('glowafter-verified');
    " 2>&1); then
    if [[ "$output" == *"glowafter-verified"* ]]; then
      echo "Verified: glowafter@$version installs and imports successfully from npm registry." | tee -a "${GITHUB_STEP_SUMMARY:-/dev/null}"
      exit 0
    fi
  fi
  echo "Attempt $attempt: waiting for registry replication..."
  if [[ "$attempt" != 12 ]]; then sleep 15; fi
done

echo "Publication succeeded, but public install verification timed out after 3 minutes." | tee -a "${GITHUB_STEP_SUMMARY:-/dev/null}"
exit 1
