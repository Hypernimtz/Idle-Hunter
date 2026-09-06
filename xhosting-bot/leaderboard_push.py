"""Small optional background publisher. No tokens or private user records are exported."""
import asyncio
import contextlib
import heapq
import json
import logging
import os
from urllib import request, error, parse

log = logging.getLogger('idlehunter.leaderboard')

class NoRedirect(request.HTTPRedirectHandler):
    # Never forward the secret to a redirect destination.
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None


def score(value):
    try:
        return max(0, min(int(value), 10**100 - 1))
    except (ValueError, TypeError, OverflowError):
        return 0


def public_name(value, fallback):
    text = ''.join(c for c in str(value or fallback) if ord(c) >= 32).strip()
    return text[:100] or fallback


def build_payload(users, tribes, excluded=()):
    # Called on the Discord event loop without awaits, so no cross-thread access
    # to mutable bot state. Only this detached minimal payload goes to a thread.
    rankings = {}
    for key, field in [('level','level'), ('money','money'), ('prestige','prestige'), ('caught','total_caught')]:
        candidates = ((uid, record) for uid, record in users.items() if str(uid) not in excluded)
        top = heapq.nlargest(100, candidates, key=lambda pair: score(pair[1].get(field, 0)))
        rankings[key] = [{'name': public_name(d.get('username'), 'Unnamed hunter'), 'score': str(score(d.get(field, 0)))} for _, d in top]
    top_tribes = heapq.nlargest(100, tribes.items(), key=lambda pair: score(pair[1].get('level', 0)))
    rankings['tribes'] = [{'name': public_name(name, 'Unnamed tribe'), 'score': str(score(d.get('level', 0)))} for name, d in top_tribes]
    return {'rankings': rankings}


class LeaderboardPublisher:
    def __init__(self, users, tribes):
        self.users, self.tribes = users, tribes
        self.task = None
        self.url = ''
        self.token = ''
        self.excluded = set()

    def start(self):
        if self.task and not self.task.done():
            return
        self.url = os.getenv('LEADERBOARD_URL', '').strip()
        self.token = os.getenv('LEADERBOARD_PUSH_TOKEN', '')
        if not self.url or not self.token:
            log.warning('Leaderboard sync disabled: add LEADERBOARD_URL and LEADERBOARD_PUSH_TOKEN to token.env.')
            return
        parsed = parse.urlsplit(self.url)
        if parsed.scheme != 'https' or not parsed.netloc or parsed.username or parsed.password or parsed.query or parsed.fragment or parsed.path.rstrip('/') != '/api/leaderboard':
            log.warning('Leaderboard sync disabled: use https://YOUR-SERVICE.onrender.com/api/leaderboard.')
            return
        if len(self.token) < 32 or not self.token.isascii():
            log.warning('Leaderboard sync disabled: the private push token must be at least 32 ASCII characters.')
            return
        self.excluded = {s.strip() for s in os.getenv('LEADERBOARD_EXCLUDE_IDS', '').split(',') if s.strip()}
        self.task = asyncio.create_task(self._run(), name='website-leaderboard-push')

    def _send(self, payload):
        req = request.Request(self.url, data=json.dumps(payload).encode('utf-8'), method='POST', headers={'Content-Type':'application/json', 'Authorization':'Bearer '+self.token})
        try:
            with request.build_opener(NoRedirect()).open(req, timeout=25) as response:
                return response.status
        except error.HTTPError as exc:
            # Do not log request headers, response bodies, tokens or private records.
            return exc.code

    async def _run(self):
        announced = False
        while True:
            try:
                payload = build_payload(self.users(), self.tribes(), self.excluded)
                result = await asyncio.to_thread(self._send, payload)
                if result == 200:
                    if not announced:
                        log.warning('Website leaderboard connected; public rankings update every 60 seconds.')
                    announced = True
                else:
                    log.warning('Leaderboard upload returned HTTP %s; retrying in 60 seconds.', result)
                    announced = False
            except asyncio.CancelledError:
                raise
            except Exception as exc:
                log.warning('Leaderboard upload failed (%s); retrying in 60 seconds.', type(exc).__name__)
                announced = False
            await asyncio.sleep(60)

    async def stop(self):
        if self.task:
            self.task.cancel()
            with contextlib.suppress(asyncio.CancelledError):
                await self.task
            self.task = None
