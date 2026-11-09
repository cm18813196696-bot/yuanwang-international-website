# Yuanwang production domain launch — 9 November 2026

Production origin: https://www.yuanwangspa.com/

## Hosting and source

- Render workspace: My Workspace (`tea-db4uodflk1mc7383upeg`).
- Existing static site: `yuanwang-international-preview` (`srv-dbm4pmjbc2fs738all4g`).
- Source: `cm18813196696-bot/yuanwang-international-website`, branch `main`.
- Pre-launch source checkpoint: `ed9008dc959708b10d0231e22c681faa94490364`.
- The existing Render subdomain remains enabled for continuity.

## DNS and certificates

Aliyun DNS records were saved and visibly confirmed as enabled:

| Host | Type | Value | TTL |
| --- | --- | --- | --- |
| `@` | A | `216.24.57.1` | 10 minutes |
| `www` | CNAME | `yuanwang-international-preview.onrender.com` | 10 minutes |

Render reports **Verified** and **Certificate Issued** for both `www.yuanwangspa.com` and `yuanwangspa.com`.
The root domain redirects to `https://www.yuanwangspa.com/`.
Both the HTTPS homepage and the root-to-www redirect were verified in the browser.
Only `yuanwangspa.com` was configured in this launch; `joypoool.com` remains outside this change.

## Production metadata

- Replaced the preview origin with the production origin in public page metadata.
- Removed the preview `noindex,nofollow` instruction from all 67 root HTML pages.
- Added one production canonical URL per page, plus `robots.txt` and a sitemap containing 67 unique URLs.
- Added `tools/promote-production.py`, an idempotent production finalizer.
- The after-sales generator and source restoration script reapply production metadata after generating pages.
- No page design, contact information, or service-policy content was changed for this launch.

## Validation and continuation

Production metadata, canonical URLs, JSON-LD, sitemap XML, Python syntax and repeated generation were checked.
The after-sales generator was run twice with identical results; the original service content was preserved.
The source restoration script was syntax-checked, but its full PDF extraction workflow was not rerun.

After any future page generation, run `python tools/promote-production.py` before committing.
Render auto-deploys commits to `main`; inspect the deployment's commit before reporting a subsequent release as live.
Allowing crawlers does not guarantee immediate search-engine indexing.
