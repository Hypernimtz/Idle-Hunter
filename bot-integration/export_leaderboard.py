"""Export public rankings from Idle Hunter SQLite. No Discord token needed."""
import argparse, datetime, json, os, sqlite3, tempfile
from pathlib import Path

def export(db_path, output, limit=100):
    db = Path(db_path).resolve()
    if not db.is_file():
        raise FileNotFoundError(f"Database not found: {db}")
    # Read-only, consistent snapshot; never create or mutate the bot database.
    with sqlite3.connect(db.as_uri() + "?mode=ro", uri=True, timeout=10) as conn:
        conn.execute("BEGIN")
        rankings = {}
        for stat in ("level", "money", "prestige"):
            records = conn.execute(f"SELECT username, {stat} FROM users ORDER BY {stat} DESC, user_id ASC LIMIT ?", (limit,)).fetchall()
            rankings[stat] = [{"name": str(name or "Unnamed hunter")[:100], "score": int(score or 0)} for name, score in records]
        rankings["tribes"] = [{"name": str(name)[:100], "score": int(level or 0)} for name, level in conn.execute("SELECT name, level FROM tribes ORDER BY level DESC, name ASC LIMIT ?", (limit,))]
    payload = {"updated_at": datetime.datetime.now(datetime.timezone.utc).isoformat(), "rankings": rankings}
    target = Path(output).resolve()
    target.parent.mkdir(parents=True, exist_ok=True)
    fd, temp = tempfile.mkstemp(prefix=".rankings-", suffix=".json", dir=target.parent)
    try:
        with os.fdopen(fd, "w", encoding="utf-8") as f:
            json.dump(payload, f, ensure_ascii=False, indent=2)
        os.replace(temp, target)
    finally:
        if os.path.exists(temp): os.unlink(temp)
    return target

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--db", default=os.environ.get("SQLITE_PATH", "idle_hunter.db"))
    parser.add_argument("--output", default="leaderboard.json")
    parser.add_argument("--limit", type=int, default=100)
    args = parser.parse_args()
    if not 1 <= args.limit <= 100: parser.error("--limit must be between 1 and 100")
    print("Exported rankings to", export(args.db, args.output, args.limit))
