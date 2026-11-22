#!/usr/bin/env bash
# Run on a clean checkout of the tested commit, with full Git history.
set -euo pipefail

if [[ -z "${NODE_AUTH_TOKEN:-}" ]]; then
  echo "::error::NODE_AUTH_TOKEN is missing. Please add NPM_TOKEN to your GitHub repository secrets."
  exit 1
fi

git fetch origin main --tags || true
tested=$(git rev-parse HEAD)
tip=$(git rev-parse origin/main 2>/dev/null || echo "$tested")
version=$(node -p "require('./package.json').version")

# A publish retry must use exactly the same release commit and tag.
if [[ "$tip" != "$tested" ]]; then
  if [[ "$(git rev-parse "$tip^" 2>/dev/null || true)" = "$tested" ]] &&
     [[ "$(git show -s --format=%s "$tip")" = "chore(release): v"* ]]; then
    git checkout --detach "$tip"
    version=$(node -p "require('./package.json').version")
    [[ "$(git rev-parse "refs/tags/v$version^{commit}")" = "$tip" ]]
  else
    echo "main has advanced. Its newer workflow owns the release."
    exit 0
  fi
elif [[ "$(git show -s --format=%s HEAD)" = "chore(release): v$version" ]] &&
     [[ "$(git rev-parse -q --verify "refs/tags/v$version^{commit}" 2>/dev/null || true)" = "$tested" ]]; then
  echo "Resuming release v$version."
else
  # Check if current version is already tagged
  if ! git rev-parse -q --verify "refs/tags/v$version^{commit}" >/dev/null 2>&1; then
    echo "Using initial release tag v$version."
    git config user.name 'github-actions[bot]'
    git config user.email '41898282+github-actions[bot]@users.noreply.github.com'
    git tag -a "v$version" -m "Release $version"
    git push origin "refs/tags/v$version" || echo "Tag push skipped or already exists"
  else
    npm version patch --no-git-tag-version --ignore-scripts
    version=$(node -p "require('./package.json').version")
    git config user.name 'github-actions[bot]'
    git config user.email '41898282+github-actions[bot]@users.noreply.github.com'
    git add -- package.json
    if [[ -f package-lock.json ]]; then git add -- package-lock.json; fi
    git commit -m "chore(release): v$version"
    git tag -a "v$version" -m "Release $version"
    git push --atomic origin HEAD:refs/heads/main "refs/tags/v$version" || echo "Push skipped"
  fi
fi

# Ensure fresh build artifacts
npm run build

artifact_dir=$(mktemp -d)
trap 'rm -rf -- "$artifact_dir"' EXIT
filename=$(npm pack --silent --pack-destination "$artifact_dir")
artifact="$artifact_dir/$filename"

# Treat only a registry 404 as unpublished. A network or auth error fails the job.
state=$(node --input-type=module - "$artifact" <<'NODE'
import fs from 'node:fs';
import { createHash } from 'node:crypto';
const { name, version } = JSON.parse(fs.readFileSync('package.json'));
const registry = process.env.NPM_CONFIG_REGISTRY || 'https://registry.npmjs.org';
const response = await fetch(new URL(encodeURIComponent(name) + '/' + version, registry.replace(/\/?$/, '/')), {
  signal: AbortSignal.timeout(20000)
});
if (response.status === 404) {
  console.log('new');
} else {
  if (!response.ok) throw new Error('Registry returned ' + response.status);
  const metadata = await response.json();
  const integrity = 'sha512-' + createHash('sha512').update(fs.readFileSync(process.argv[2])).digest('base64');
  if (metadata.dist?.integrity !== integrity) throw new Error('Published tarball differs from the tagged source');
  console.log('verified');
}
NODE
)

if [[ "$state" = new ]]; then
  echo "Publishing $artifact to npm registry as latest..."
  npm publish "$artifact" --access public --tag latest
else
  echo "Verified that v$version is already published."
fi

if [[ -n "${GITHUB_OUTPUT:-}" ]]; then
  echo "version=$version" >> "$GITHUB_OUTPUT"
fi
