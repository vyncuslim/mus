#!/usr/bin/env python3
"""Download the pinned public TSV snapshot using the GitHub CLI, without storing credentials."""
import concurrent.futures
import json
import subprocess
import sys
import time
import urllib.parse
from pathlib import Path

REVISION = "be0cfb8d614470bc8b9d9006ddff8b921cd5c2e3"
ROOT = Path(sys.argv[1] if len(sys.argv) > 1 else "data/dumps/wiktionary-definitions")
ROOT.mkdir(parents=True, exist_ok=True)
result = subprocess.run(["gh", "api", f"repos/Vuizur/Wiktionary-Dictionaries/git/trees/{REVISION}?recursive=1"], capture_output=True, check=True)
tree = json.loads(result.stdout)
if tree.get("truncated"):
    raise SystemExit("GitHub returned a truncated tree; refusing to build incomplete data.")
files = [{"file": x["path"], "name": x["path"].removesuffix("-English Wiktionary dictionary.tsv"), "size": x["size"]} for x in tree["tree"] if x["path"].endswith("-English Wiktionary dictionary.tsv")]
(ROOT / "sources.json").write_text(json.dumps({"revision": REVISION, "files": files}, ensure_ascii=False, indent=2) + "\n")

def download(item):
    i, row = item
    dest = ROOT / f"{i:03}.tsv"
    if dest.exists() and dest.stat().st_size == row["size"]:
        return True
    route = "repos/Vuizur/Wiktionary-Dictionaries/contents/" + urllib.parse.quote(row["file"], safe="") + "?ref=" + REVISION
    for attempt in range(3):
        with dest.open("wb") as target:
            process = subprocess.run(["gh", "api", route, "-H", "Accept: application/vnd.github.raw+json"], stdout=target, stderr=subprocess.PIPE)
        if process.returncode == 0 and dest.stat().st_size == row["size"]:
            return True
        time.sleep(attempt + 1)
    print(f"Failed: {row['file']}", file=sys.stderr)
    return False

with concurrent.futures.ThreadPoolExecutor(max_workers=8) as executor:
    success = list(executor.map(download, enumerate(files)))
print(f"Downloaded {sum(success)}/{len(files)} source dictionaries.")
if not all(success):
    raise SystemExit(1)
