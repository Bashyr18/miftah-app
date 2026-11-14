"""Download counts for Miftah, without tracking anyone: GitHub counts every download of a release file, and this keeps a daily
history of those counts so the guide can show the total, Android against Windows, each version, and downloads per day.

    python -I tools/download_stats.py stats/downloads.json          (GITHUB_TOKEN raises the API limit; not required)

Run once a day by .github/workflows/downloads.yml, which keeps the file on the `stats` branch (so the daily commit never
touches main, its checks or its Pages build). The guide reads it from raw.githubusercontent.com.

What counts: every .apk and .exe in every published release, versioned and stable names alike. .aab (the Play bundle),
checksums and drafts do not. GitHub's counts include re-downloads and automated fetches; they are downloads, not people.

The file:
  updated   when this ran (UTC, ISO 8601)
  total     { android, windows, all }        cumulative, as GitHub reports it now
  releases  [ { tag, name, published, android, windows } ]   newest first
  history   [ { date: 'YYYY-MM-DD', android, windows } ]      cumulative at each daily run, oldest first, one per day
A day's downloads are the difference between two history entries. A count never goes down; if GitHub reports less (a file
deleted and uploaded again resets its count), the history keeps the higher figure so no day shows a negative."""
import io, json, os, sys, urllib.request, datetime

REPO = os.environ.get('MIFTAH_REPO', 'Bashyr18/miftah-app')
KEEP_DAYS = 800   # a little over two years of daily points


def get(url):
    req = urllib.request.Request(url, headers={'Accept': 'application/vnd.github+json', 'User-Agent': 'miftah-download-stats', 'X-GitHub-Api-Version': '2022-11-28'})
    tok = os.environ.get('GITHUB_TOKEN')
    if tok:
        req.add_header('Authorization', 'Bearer ' + tok)
    with urllib.request.urlopen(req, timeout=60) as r:
        return json.load(r)


def platform(name):
    n = name.lower()
    return 'android' if n.endswith('.apk') else 'windows' if n.endswith('.exe') else None


def collect():
    releases, page = [], 1
    while True:
        batch = get('https://api.github.com/repos/%s/releases?per_page=100&page=%d' % (REPO, page))
        if not batch:
            break
        releases += batch; page += 1
        if len(batch) < 100:
            break
    out = []
    for r in releases:
        if r.get('draft'):
            continue
        c = {'android': 0, 'windows': 0}
        for a in r.get('assets', []):
            p = platform(a['name'])
            if p:
                c[p] += int(a.get('download_count', 0))
        out.append({'tag': r['tag_name'], 'name': r.get('name') or r['tag_name'], 'published': (r.get('published_at') or '')[:10], **c})
    out.sort(key=lambda x: x['published'], reverse=True)
    return out


def main():
    path = sys.argv[1] if len(sys.argv) > 1 else 'stats/downloads.json'
    old = {}
    if os.path.exists(path):
        with io.open(path, encoding='utf8') as f:
            old = json.load(f)
    rel = collect()
    android = sum(r['android'] for r in rel); windows = sum(r['windows'] for r in rel)
    hist = [h for h in old.get('history', []) if isinstance(h, dict) and 'date' in h]
    # never lower than the last day: a file uploaded again starts its count from zero
    if hist:
        android = max(android, hist[-1]['android']); windows = max(windows, hist[-1]['windows'])
    today = datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%d')
    point = {'date': today, 'android': android, 'windows': windows}
    if hist and hist[-1]['date'] == today:
        hist[-1] = point
    else:
        hist.append(point)
    hist = hist[-KEEP_DAYS:]
    data = {'updated': datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ'),
            'total': {'android': android, 'windows': windows, 'all': android + windows}, 'releases': rel, 'history': hist}
    os.makedirs(os.path.dirname(os.path.abspath(path)), exist_ok=True)
    with io.open(path, 'w', encoding='utf8', newline='\n') as f:
        json.dump(data, f, ensure_ascii=False, indent=1)
    print('%s: %d downloads (Android %d, Windows %d), %d releases, %d days of history' % (path, android + windows, android, windows, len(rel), len(hist)))


if __name__ == '__main__':
    main()
