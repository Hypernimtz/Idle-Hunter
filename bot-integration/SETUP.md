# Connect the leaderboard to your bot

The site is ready to read leaderboard.json. It currently contains no players because the running bot database was not supplied. No scores are invented.

## First export
1. Copy export_leaderboard.py to the computer or host running the bot (it needs Python 3, no extra packages).
2. Locate the bot SQLite database: by default idle_hunter.db, or the SQLITE_PATH setting in your bot environment.
3. Run:

   python export_leaderboard.py --db /path/to/idle_hunter.db --output /path/to/website/leaderboard.json

4. Commit/upload ONLY the generated leaderboard.json to the website repository, alongside index.html. Redeploy the site if the host requires it. Click Refresh on the Leaderboard page to load the newly published file.

Never upload the bot database, bot token, .env file, private logs, or account JSON. The exporter emits only public display names and scores: top 100 by level, coins, prestige, and tribe level. It reads the SQLite users/tribes columns from the supplied backend code. Equal scores use a stable tie-break; ranking changes in unsaved bot memory will appear after the bot saves them.

## Updates
This is a published snapshot, not a live Discord connection. Running the exporter again changes only the output file; it does not publish to Git automatically. For periodic updates, run the same export on the bot host at your chosen interval, then publish that JSON through your own repository/deployment workflow. If the website and bot share a host, write directly to the served leaderboard.json path. On different hosts, an authenticated deployment upload or a separate public, read-only API is required. Never put deployment credentials in website JavaScript.

The page itself cannot read a private SQLite database or make your bot run an export. A database export is not performed by the website Refresh button. For a fully live API integration, the bot hosting provider and website URL are needed to configure routing and CORS correctly.

The leaderboard is global; it does not expose user IDs, server IDs, mail, warnings, bans, or inventories. Ensure these public rankings follow your community's privacy choices; implement exclusions before export if needed. Open the hosted page to load the JSON; file:// previews may block fetch.
