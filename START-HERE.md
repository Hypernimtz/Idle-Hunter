# Idle Hunter: one Render Web Service + your existing XHosting bot

No terminal on XHosting is needed. Render runs its build/start commands for you.

## 1. Put the website service on Git
Create a NEW Git repository for the Render website service. Upload the CONTENTS of `render-service` into its root. You should see server.py, requirements.txt, gunicorn.conf.py, and the website folder at the root.

Do NOT upload xhosting-bot, token.env, or your bot database to this repository. The bot continues running at XHosting, not Render.

## 2. Create the Render Web Service
Keep the existing Static Site running until this new service works. In Render choose New > Web Service, then connect the new repository. Use:

| Setting | Value |
| --- | --- |
| Language/runtime | Python 3 |
| Root Directory | Leave empty (if you uploaded render-service CONTENTS to the root) |
| Build Command | pip install -r requirements.txt |
| Start Command | gunicorn -c gunicorn.conf.py server:app |
| Health Check Path | /healthz |

These are Render form fields, not commands you run in your XHosting panel.

Under Environment add `LEADERBOARD_PUSH_TOKEN`. Use a password manager to generate a random 64-character ASCII alphanumeric value. Keep this value private. It is NOT your Discord bot token. Set the exact same value on XHosting in step 3. Missing or short values cause the service to refuse startup.

Deploy. Copy the new HTTPS address Render gives you, for example https://your-chosen-name.onrender.com. This new Web Service address now serves the whole website, including its existing video, artwork, tabs, Terms, and Privacy pages.

The separate Static Site will NOT automatically use this API. Use the NEW Web Service website address after testing. Later, stop the old Static Site or move your custom domain if you have one. Do not remove the old site until the new one works.

## 3. Update XHosting through File Manager
Back up your current bot files and database first. Stop the bot while replacing files.

Upload `app.py` and `leaderboard_push.py` from `xhosting-bot` into the SAME folder where your current app.py runs. The included app.py is based on your supplied app(4).py with only the publisher import, initialization, start and shutdown integration added. If your panel startup file has another name, replace that actual startup file with the new app.py contents while keeping the panel's filename setting consistent.

backend.py and game_data.py are unchanged copies of the files you supplied; replace them only if your running copies should match those uploads. Keep your existing installed bot dependencies, database files, other runtime data, startup settings and token.env.

Open your EXISTING token.env in the panel editor. Keep its existing TOKEN line. Append:

LEADERBOARD_URL=https://YOUR-NEW-RENDER-SERVICE.onrender.com/api/leaderboard
LEADERBOARD_PUSH_TOKEN=THE_SAME_PRIVATE_VALUE_FROM_RENDER

Replace both example values. Use the Web Service URL, not the old Static Site URL. Do not include angle brackets, spaces around the URL, or a trailing slash after leaderboard. Never send the private value in chat or put it in website files. The new publisher uses Python's standard library: no extra bot dependency is needed.

Restart the bot. Its first leaderboard push starts after normal bot initialization. Look for `Website leaderboard connected; public rankings update every 60 seconds.` in the panel logs. Open the new Render website and choose Leaderboard.

## 4. What updates
- Top 100 hunters by level, coins, prestige and total animals caught.
- Top 100 tribes by level.
- Names and scores only. No user IDs, server IDs, account JSON, mail, warnings, or credentials leave the bot.
- Scores are sent as decimal strings so extremely large balances keep their exact digits in the browser.
- Snapshot creation uses the bot's current in-memory data. HTTPS runs in a background thread, so a slow website does not block Discord commands.
- Updates send about every 60 seconds; an open visible leaderboard checks every 60 seconds. Allow roughly two minutes for a change to appear. The Refresh button reloads the most recent received update, not the bot directly.
- Equal scores preserve the bot's current ordering. These are global all-time rankings, not daily/weekly/server-specific rankings.
- Optional `LEADERBOARD_EXCLUDE_IDS=123456789,987654321` in token.env excludes those user IDs from the published hunter lists without changing bot rankings. Restart to apply changes.

## Reliability and cost
One Render worker stores a small replaceable snapshot in memory; there is no added database to pay for or maintain. Keep workers=1 in gunicorn.conf.py. After a Render restart, rankings are empty until the bot sends the next update. The bot's real database stays on XHosting. If the bot stops, existing results are marked delayed after three minutes. The bot retries failed requests; credentials and payloads are not written to its sync logs.

Render Free Web Services can sleep after 15 minutes without inbound traffic, take around a minute to wake, and have monthly usage limits. Regular real updates normally provide traffic while the bot is running, but a Free plan does not guarantee constant availability. The combined site's first load can be delayed after inactivity. For predictable uptime use an appropriate paid service; no paid resource is created by these files.

## Troubleshooting
- Render startup error about token: set LEADERBOARD_PUSH_TOKEN in Render Environment; use at least 32 ASCII characters, then redeploy/restart.
- Bot says sync disabled: add both settings to the existing token.env and restart. Check for conflicting panel environment variables; those can override token.env.
- HTTP 401: the two private token values do not match. Correct them and restart the bot.
- HTTP 404/405 or HTML returned: the bot is pointing to the old Static Site or the URL is missing /api/leaderboard.
- Timeout/connection error: verify the Web Service deployed and is reachable; free instances may be waking. If errors persist, XHosting may need to allow outbound HTTPS to your Render address.
- Empty rankings: wait for a successful bot push, confirm you're visiting the NEW Render URL, and check that the bot actually loaded player data.
- Missing pictures/video: upload the whole website directory, including assets, unchanged. The server supports video range requests.

## Included validation
The request tests cover authorization, malformed/oversized updates, public-field filtering, static-source isolation, video byte-range delivery, stale state, and exact large scores. The bot file is syntax checked; a live Discord/XHosting/Render connection cannot be tested until you enter your private settings and deploy.

Sources: https://render.com/docs/deploy-flask and https://render.com/docs/free (reviewed September 6, 2026).
