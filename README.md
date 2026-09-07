# Idle Hunter — Render website

Upload these extracted files to the root of your existing Render repository. The website includes a Badges tab with all 31 transparent icons and unlock requirements.

Keep your existing Render Web Service settings:
- Build command: `pip install -r requirements.txt`
- Start command: `gunicorn server:app -c gunicorn.conf.py`
- Keep your existing `LEADERBOARD_PUSH_TOKEN` environment variable (at least 32 ASCII characters). It must match the bot.
- Health check: `/healthz`

This package contains only the Render service and website. No bot files are included. The existing leaderboard integration is preserved.

Badge requirements follow the supplied bot code. Ammo Variety's flag is read but never updated in that code, so its card marks tracking as pending. Platinum Game Master's check includes its own Platinum tier, making it unreachable through that check; its card marks it unavailable. No bot behavior has been modified.
