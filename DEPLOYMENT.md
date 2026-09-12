# GitHub Pages

1. In repository Settings → Pages, select **GitHub Actions** as the source.
2. Push changes to `main`. The **Deploy to GitHub Pages** workflow uploads the static site and deploys it automatically. You can also select **Run workflow** from its Actions page.
3. Wait for the workflow to succeed, then open https://perryong.github.io/SG-kopitiam-lab/.

Relative paths support repository subpaths. There is no backend, API key or build step. Keep every module and vendor file together.

The downloadable ZIP excludes itself. Upload it under `downloads/kopitiam-lab-source.zip` if you want the footer download to work on your GitHub-hosted copy, or remove that footer link.
