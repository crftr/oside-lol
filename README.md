# OSIDE.LOL

The unofficial official website for Oceanside, California.

Still gritty. Now with oat milk.

## What this is

OSIDE.LOL is a dependency-free, static joke site for a very real domain. It treats Oceanside like a municipal computer system that washed ashore in 1987 and has been issuing surf reports, development notices, and certified pier facts ever since.

The visual direction mixes:

- vaporwave sunsets and CRT grime;
- surf-town localism and marine-layer fatalism;
- Oceanside's working coastal-town texture;
- civic bureaucracy applied to useless information; and
- the uneasy transition from potholes and tackle shops to cold brew and five-over-ones.

No framework, package manager, build step, analytics, or backend is required.

## Features

- Responsive layouts from small phones through wide desktops
- Collapsible mobile navigation with keyboard support
- Reduced-motion support
- Accessible focus states, labels, live regions, dialogs, and skip navigation
- Rotating facts and taglines
- A fake guestbook (entries last until refresh)
- Several unnecessary interactive surprises
- A footer year calculated with `new Date().getFullYear()`
- Cloudflare Pages security headers via [`_headers`](./_headers)

## Run locally

From the repository root:

```sh
python3 -m http.server 4173
```

Then open <http://localhost:4173>.

Because the site uses only browser-native HTML, CSS, and JavaScript, opening `index.html` directly also works. A local server more closely matches production behavior.

## Project structure

```text
.
├── index.html   # Content, sections, SVG art, dialogs, and overlays
├── styles.css   # Vaporwave system, animation, and responsive layouts
├── script.js    # Interactions, jokes, accessibility behavior, and year
├── _headers     # Cloudflare Pages response headers
└── README.md
```

## Deploy to Cloudflare Pages

This repository can be deployed as-is with Cloudflare Pages.

### Git integration

1. In Cloudflare, create a Pages project and connect this GitHub repository.
2. Use these build settings:

   | Setting | Value |
   | --- | --- |
   | Framework preset | None |
   | Build command | Leave blank |
   | Build output directory | `.` |
   | Root directory | Repository root |

3. Deploy. Cloudflare will serve the top-level `index.html` and apply the rules in `_headers`.
4. In the Pages project, add the custom domain under **Custom domains** and follow the DNS prompts for `oside.lol` (and `www.oside.lol` if desired).

Cloudflare's current guides for this setup are [Static HTML](https://developers.cloudflare.com/pages/framework-guides/deploy-anything/), [Git integration](https://developers.cloudflare.com/pages/get-started/git-integration/), and [custom headers](https://developers.cloudflare.com/pages/configuration/headers/).

### Direct upload

If the Pages project uses Direct Upload instead of Git integration, upload the repository's deployable files together so `index.html`, `styles.css`, `script.js`, and `_headers` remain at the output root.

## Content and behavior notes

- All statistics are jokes unless independently verified. The pier has declined comment.
- Guestbook entries are created in the DOM only and are not stored or transmitted.
- The boot screen and prize popup use `sessionStorage`, so they normally appear once per tab session.
- The `_headers` Content Security Policy intentionally blocks third-party scripts, remote fonts, embeds, network requests, and framing. Update it if the site later adds any of those.
- Animations stop or simplify when the visitor enables reduced motion.

## Making changes

Keep the page fast and weird. Prefer native browser features, specific Oceanside details, and one good interaction over adding dependencies or generic retro decoration.

Suggested future nonsense:

- a marine-layer burn-off forecast that keeps moving later;
- a coastal-development naming generator;
- a Strand parking-space oracle;
- a surf-local seniority calculator that always says “you should've been here yesterday”; or
- a live pier-status monitor whose only state is `STILL HOLDING`.

## Disclaimer

Not affiliated with the City of Oceanside. No warranty expressed or implied. No refunds. Powered by the marine layer since 1987.
