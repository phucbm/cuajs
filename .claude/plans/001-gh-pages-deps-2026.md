# 001 — Demo on GitHub Pages, latest deps, README fixes

Status: **approved, not started.** Written 2026-10-17.

One branch (`chore/gh-pages-deps-2026` off `main`), one PR, one commit per step. `main` is protected, so everything lands through the PR.

## Why

- The demo lives on Netlify (`cuajs.netlify.app`), deployed by hand. Moving it to GitHub Pages puts the demo next to the code and deploys it on every push to `main`.
- Dependencies are years behind (webpack-cli 4, Tailwind 3, Babel 7, shiki 1…), and two are deprecated.
- The README's npm dependents badge is broken: badgen's `npm/dependents` needs an npm API that no longer exists.
- Copyright years are stale (2022 in `LICENSE`, 2024 in the README and the SCSS banner).
- The demo has no visible link back to the repo.

## Decisions (owner, 2026-10-17)

- Upgrade everything to latest, majors included: Tailwind 4 and Babel 8.
- `LICENSE` year becomes the range `2022–2026`.
- OK to switch the Pages source to GitHub Actions with `gh api`.
- Add a GitHub link with the star count, fixed at the top right of the demo.

## Steps

### 1. Deploy the demo to GitHub Pages

- Pages is currently on in legacy mode, publishing the root of `main` to `https://phucbm.github.io/cuajs/`. Switch it to build from a workflow: `gh api -X PUT repos/phucbm/cuajs/pages -f build_type=workflow`.
- Add `.github/workflows/deploy-pages.yml`. It runs on push to `main` and on `workflow_dispatch`, installs with pnpm 10.22.0 on Node 22 (same as `publish.yml`), runs `pnpm run build`, then publishes `build/` with `actions/upload-pages-artifact` and `actions/deploy-pages`.
- Make the site work under `/cuajs/` instead of the domain root:
  - `config/webpack.build.js`: `publicPath: '/'` becomes `'./'`.
  - Make the hardcoded `/assets/images/favicon.png` links relative.
  - The default `BASE_URL` becomes `https://phucbm.github.io/cuajs`. The og/twitter image tags use it.
  - Check `dev/index.html` and `dev/*.js` for other root-absolute paths (the video sources point at `../public/images/…`).

### 2. Remove Netlify

- `package.json`: set `BASE_URL` in the `build` script to the Pages URL, and point `homepage` at the demo.
- `README.md`: replace the Netlify status badge with the Pages workflow status badge, and update both `cuajs.netlify.app` links (lines 29 and 198).
- Manual, owner: delete the Netlify site afterwards.

### 3. GitHub link with star count on the demo

- Add a small fixed pill at the top right of the demo: the GitHub mark, then the star count, linking to `https://github.com/phucbm/cuajs`. Style it in the demo's existing look (Tailwind classes and theme colour `#f9857a`), keep it readable over every section, and don't let it block the horizontal scroll.
- Get the count at runtime from `https://api.github.com/repos/phucbm/cuajs` (`stargazers_count`), so it stays current between deploys. If the request fails or hits the rate limit, show only the icon and the "Star" label. Inline SVG for the icon; no new dependency.
- The footer already links to the repo (`dev/index.html` ~line 259); leave it.

### 4. Upgrade every package to latest

- **Remove:**
  - `babel-preset-es2015` is not used anywhere.
  - `@babel/plugin-proposal-class-properties` is deprecated because preset-env handles class properties. Drop it from `.babelrc.json` too.
- **Minor/patch updates:** `pnpm update --latest` for the rest.
- **Majors**, each with its config migration:
  - babel 8, babel-loader 10
  - webpack-cli 7, webpack-dev-server 6, webpack-merge 6
  - css-loader 7, sass-loader 17, style-loader 4, postcss-loader 8, postcss-preset-env 11
  - copy-webpack-plugin 14, css-minimizer-webpack-plugin 8, html-loader 5
  - cross-env 10, shiki 4 (`dev/code-highlight.js` uses `codeToHtml`)
- **Tailwind 3 → 4:**
  - `postcss.config.js` moves to `@tailwindcss/postcss`.
  - `tailwind.config.js` moves to CSS-first `@import "tailwindcss"`, keeping the old config through `@config` only if needed.
  - `@tailwindcss/typography` is loaded with `@plugin`.
  - Check the v4 renamed and removed utilities used in `dev/index.html`.
- **Checks after each group:**
  - `pnpm run dev` starts.
  - `pnpm run build` builds the demo.
  - `pnpm run prod` builds the library.
  - Diff `dist/` against `main`: the library output must not change in a way that matters to users.
- **Delegation:** hand the mechanical bumps to opencode (`opencode-delegate`) and supervise.
- **Visual check:** ask before using the browser (Chrome tools). Without permission, verify the builds only and say plainly in the PR that the UI wasn't checked visually.

### 5. Fix the npm dependents badge

- Replace `https://badgen.net/npm/dependents/cuajs?icon=npm` with `https://img.shields.io/librariesio/dependents/npm/cuajs`, linked to `https://www.npmjs.com/package/cuajs?activeTab=dependents`.

### 6. Copyright

- `LICENSE:3`: `2022` becomes `2022–2026`.
- `README.md:220`: `2024` becomes `2026`.
- `src/_style.scss:5`: `@license MIT 2024` becomes `2026`.
- The `dist/` banner already takes the year from the build date (`config/config.js`), so it updates on the next release.

### 7. PR

- Push the branch, open one PR with a checklist of steps 1–6, the build results, and whether the UI was checked visually.
- No version bump: nothing changes for library users. If a release is wanted later, the bump goes in its own PR, per the release flow.

## After merge

- Watch the first `deploy-pages` run and open `https://phucbm.github.io/cuajs/`.
- Owner: delete the Netlify site.
