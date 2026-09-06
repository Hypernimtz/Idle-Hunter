# Idle Hunter legal website

Plain HTML and CSS. No installation, JavaScript, build step, database, secrets, or environment variables.

Files: index.html (game overview, getting started, commands, FAQ and support), terms.html, privacy.html, styles.css.
Open index.html locally to preview. Upload these files to the root of your Git repository; keep them together. Git alone does not host a website. For GitHub Pages, select the repository branch and /(root) in Settings > Pages. For a static host such as Render, publish the directory containing index.html (./ if at the repository root); no build step is needed.

After hosting, use /terms.html for the bot Terms URL and /privacy.html for its Privacy Policy URL.

## Operator review before public use
These are tailored drafts based on the supplied app(3).py, backend(3).py and game_data(3).py, not legal advice or a compliance certification. The code alone cannot verify actual operational practices. Review with qualified counsel where appropriate.
- Identify the actual operator/legal entity and add its required contact/address details. The site currently refers to the Idle Hunter operator and uses the support link found in the code: https://discord.gg/X9JzdxeS8p. Verify that this invite works and that maintainers can receive private requests. Add a direct privacy email or another reliable alternative if users cannot access the server.
- Confirm hosting/database providers, processing locations, safeguards, log retention and backup expiry; make the privacy disclosures specific to your setup.
- Establish and document a retention/deletion process and applicable response deadlines. The admin delete-account handler does not prove all associated records or backups are erased. Review related tribe, gift, audit and cache records. Do not promise complete deletion until that workflow is implemented.
- Verify message-content access is necessary. The code enables that intent; the policy deliberately does not claim the bot cannot access messages.
- Confirm there is no sale of data, advertising use or real-money redemption. The provided code does not establish an external payment service; add disclosures and purchase terms if one is introduced.
- Review regional requirements, eligibility, legal bases, international transfers and mandatory consumer rights. No arbitrary governing jurisdiction or binding arbitration has been invented.
- Set the actual effective/update date when adopting the documents.

This website itself sets no cookies or local storage and loads no external scripts; it loads fonts from Google Fonts. The eventual host may collect request/security logs.

Reference reviewed: Discord Developer Terms of Service, https://support-dev.discord.com/hc/en-us/articles/8562894815383-Discord-Developer-Terms-of-Service (privacy policy disclosures and deletion requests); Discord Privacy Policy, https://discord.com/privacy. These references do not certify the draft or your implementation.

Updated homepage: commands checked against the supplied bot code. The site has no fabricated bot authorization link: it directs players to /invite. Confirm the support invite remains valid before public use. Interactive FAQs use native HTML and need no JavaScript.

## Catalog pages and adding pictures
Welcome, Commands, Biomes, Animals, Weapons, and Ammo are separate HTML pages linked in the navigation. Catalog entries are generated from your supplied game_data(3).py; balance values are a snapshot, not live bot data. Animals shared by biomes appear once in the animal catalog with every matching biome listed.

All picture slots intentionally remain blank (no default animal picture, emoji or broken-image icon). Put future transparent PNG/WebP images in assets/animals, assets/biomes, assets/weapons or assets/ammo. Then edit the matching exact name in images.js, for example:

"Rat": "assets/animals/rat.png"

Keep images.js and catalog.js beside index.html. The catalogs render without JavaScript; JavaScript adds local search and loads your configured pictures. No upload backend is needed. Deploy the entire extracted ZIP contents, including assets.

## Monochrome design update
The multi-page site now follows the supplied reference: black/white surfaces, Syne display headings, Martian Mono labels, thin borders, spacious sections, a dot-grid welcome backdrop, scroll progress and subtle section reveals. theme.css contains the visual overrides; site.js contains the small progressive enhancements. No build is needed. Include all CSS and JS files.

Google Fonts is the only added external asset service; privacy.html discloses these requests. To operate fully offline, remove the three Google Fonts link elements from each HTML head; system fallbacks remain usable. JavaScript-disabled and reduced-motion visitors can still read and navigate every page. Animal and equipment picture slots remain empty and use images.js when you add assets.

## Equipment icons (v5)
All 21 weapon/tool and 29 ammo cards now show the supplied transparent artwork. The original image is preserved in assets/equipment-sprites.png and displayed using CSS sprite positions, so there are no separate crops to maintain. The first 21 cells map to weapons in code order and the remaining 29 to ammo in code order (left to right, top to bottom). The icons work without JavaScript. Keep the original sheet dimensions and layout when replacing this asset.

Animal and biome slots remain blank. To override any equipment icon, put an individual image path in images.js under its exact item name. A successfully loaded individual image replaces the sprite; a missing image leaves the sprite visible.

## Reference integration (v6)
Incorporates the supplied friend's stacked title, numbered game-loop rows, inverted getting-started panel, and closing camp section. Catalog tabs and data remain intact. Text and labels use brighter foregrounds; weapon and ammo art sits on a light slate backdrop so black outlines remain visible. The image file itself remains transparent and unchanged. Animal slots remain empty.

The uploaded Vite HTML references src/main.ts and src/legal.ts, which were not supplied. This package adapts the reference into the complete static version instead of shipping unresolved source references. Upload all extracted files as before; no package installation or build is needed.

## Animation and demo integration (v7)
Added the supplied demo.mp4, demo-poster.jpg and favicon.svg. The welcome page has a native, user-controlled video player (no autoplay). Adapted the supplied main.ts dot-field, scope crosshair and text-scramble functions into effects.js for the existing static pages. Added an accessible expanding mobile menu, back-to-top action and active policy-section highlighting. Reduced-motion settings suppress decorative motion. Search, catalog data, bright text, light equipment backdrops, and separate tabs are retained.

The supplied demo and poster are included unchanged. Review any visible Discord messages/usernames in the recording before making it public. The source remains plain HTML/CSS/JS; no Vite dependencies are required.
