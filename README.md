# JobPower Static Site – GitHub Actions Versioning & Deployment

This repository is a static HTML site with automated deployment to GitHub Pages and versioned builds managed via Git tags and GitHub Actions.

## Features

- Automatically saves versioned builds under `versions/JobPower_<version>/` when a tag is pushed
- No need to manually copy files into the `versions/` folder
- Deploys the current site to the `gh-pages` branch automatically on every push to `main`
- Automatically deletes the corresponding `versions/` folder when a version tag is deleted

---

## How It Works

### Add a New Version (Tag)
To create a new version (for example, `v2.0.0`), use the following commands:
```bash
# Ensure your changes are committed and pushed to main first
git tag v2.0.0
git push origin v2.0.0
```
> **🚨 Important:** Tags must include the `v` prefix (e.g., `v1.0.0`, `v2.0.0`) to work correctly with the automated workflow.

#### This will:

- Copy the current project files into versions/JobPower_v2.0.0/
- Commit that folder into the main branch automatically via GitHub Actions
- Redeploy the site to GitHub Pages (excluding the versions/ folder)
- You do not need to manually copy files into the versions/ folder — the GitHub workflow handles it.

### Delete a Version
To delete a previously created version:
```bash
git tag -d v2.0.0
git push origin :refs/tags/v2.0.0
```
#### This will:
- Trigger a GitHub Action that automatically deletes the folder versions/JobPower_v2.0.0 from the main branch

## GitHub Pages Deployment

The site is deployed automatically via GitHub Actions whenever:

- You push to the `main` branch
- You create or delete a version tag

Only the relevant static files are deployed. The following folders are excluded from deployment:

- `versions/`
- `.github/`
- `.git/`

The deployed site is served from the `gh-pages` branch.
### URL of Deployed Site
```bash
https://idataVisualizationLab.github.io/JobPower/
```
## GitHub Actions Workflow

The deployment and versioning behavior is defined in:
```bash
.github/workflows/deploy.yml
```
This workflow:

- Creates version folders inside `versions/` on tag push
- Deletes corresponding version folders on tag deletion
- Creates a clean deployment copy (excluding internal folders)
- Pushes the deploy folder to the `gh-pages` branch


