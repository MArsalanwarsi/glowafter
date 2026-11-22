# How to Connect GitHub Actions to npm for Automatic Publishing

This 2-minute, one-time setup connects your GitHub repository to npm so that pushing to `main` automatically runs all tests and publishes `glowafter` to npm.

**Repository Link:**  
[https://github.com/MArsalanwarsi/light-dark-theme-switch](https://github.com/MArsalanwarsi/light-dark-theme-switch)

---

## Step 1: Generate an npm Access Token

1. Open your browser and go to:  
   [https://www.npmjs.com/settings/tokens](https://www.npmjs.com/settings/tokens)
2. Log in to your npm account (`arsalanwarsi`).
3. Click the **"Generate New Token"** button in the top right.
4. Select **"Granular Access Token"** (or **"Automation Token"**):
   - **Token Name**: `github-actions-publish-glowafter`
   - **Expiration**: 90 days, 180 days, or 1 year
   - **Permissions** (under _Packages and scopes_):
     - Select: **"All packages"**
     - Access level: **"Read and write"**
5. Click **"Generate Token"** at the bottom.
6. **Copy the token string immediately** (format `npm_xxxxxxxxxxxxxxxx`). You will not see it again.

---

## Step 2: Add the Token to GitHub Repository Secrets

1. Open your GitHub repository secrets page:  
   [https://github.com/MArsalanwarsi/light-dark-theme-switch/settings/secrets/actions](https://github.com/MArsalanwarsi/light-dark-theme-switch/settings/secrets/actions)
   _(Or navigate: GitHub Repo -> Settings -> Secrets and variables -> Actions)_
2. Click the green **"New repository secret"** button.
3. Fill in the fields:
   - **Name**: `NPM_TOKEN` _(must be uppercase and spelled exactly as `NPM_TOKEN`)_
   - **Secret**: Paste the npm token you copied from Step 1.
4. Click **"Add secret"**.

---

## Step 3: Automatic Releases on Push

Once `NPM_TOKEN` is saved:

1. Whenever code is pushed to `main`:
   - GitHub Actions runs the `checks` job (builds TypeScript, runs all 1,621 unit tests, and validates linting).
   - Once checks pass, the `release` job runs `scripts/release.sh`.
   - If `v1.0.0` is new, it publishes `glowafter@1.0.0` with `--access public --tag latest`.
   - On subsequent pushes, it automatically bumps the patch version (e.g. `1.0.1`, `1.0.2`), commits, tags, and publishes.
   - `scripts/verify-public-install.sh` verifies registry propagation.

2. You can also trigger a release manually anytime from:  
   [https://github.com/MArsalanwarsi/light-dark-theme-switch/actions/workflows/publish.yml](https://github.com/MArsalanwarsi/light-dark-theme-switch/actions/workflows/publish.yml)  
   _(Click "Run workflow" -> branch "main" -> "Run workflow")_
