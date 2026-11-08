# Yuanwang official domain setup

Updated 8 November 2026. Status: Render domain attachment and apex-to-www redirect are configured; DNS verification has not passed and HTTPS issuance is pending.

## Confirmed destination

- Requested primary URL: `https://www.yuanwangspa.com`.
- Existing service: Render static site `yuanwang-international-preview`, service `srv-dbm4pmjbc2fs738all4g`, workspace `tea-db4uodflk1mc7383upeg`.
- Existing origin: `https://yuanwang-international-preview.onrender.com`.
- Repository: `cm18813196696-bot/yuanwang-international-website`, `main`.
- Website release already live before this task: `ed9008dc959708b10d0231e22c681faa94490364`.
- Render service dashboard: https://dashboard.render.com/static/srv-dbm4pmjbc2fs738all4g

## Steps to complete

1. COMPLETED: signed in to the original Render account and verified this exact service. The workspace showed Hobby plan with 0 of 2 included domains used before the change.
2. COMPLETED: added `www.yuanwangspa.com` as the primary custom domain. Render automatically added `yuanwangspa.com` with a redirect to `www.yuanwangspa.com`. The existing Render subdomain remains enabled.
3. In the actual authoritative DNS provider, configure the following. Preserve unrelated records, including email MX and TXT records.

| Host | Type | Target | Applicability |
| --- | --- | --- | --- |
| `www` | CNAME | `yuanwang-international-preview.onrender.com` | All providers; enter a hostname without protocol or path. |
| `@` | A | `216.24.57.1` | Current documented Render load-balancer address for providers without apex ALIAS / ANAME / CNAME flattening. Confirm against the domain panel at execution time. |
| `@` | ALIAS / ANAME / flattened CNAME | `yuanwang-international-preview.onrender.com` | Alternative apex configuration where supported; Cloudflare uses flattened CNAME. Do not add this alongside a conflicting apex A record. |

4. Review conflicting website records for `www` and the apex, including any AAAA records. Limit changes to the website hostnames; do not change unrelated subdomains or mail routing.
5. Return to Render and verify each hostname. Wait for verification and automatic TLS issuance before reporting the domain live.
6. Check HTTPS at `www.yuanwangspa.com`, apex-to-www redirection, project pages and PDF downloads. Retain the working Render subdomain during setup.
7. When the custom domain works, update site canonical URLs, sitemap and indexing metadata for the official launch. The current preview pages deliberately carry `noindex,nofollow`; merely adding DNS does not remove that.

## Current blockers / evidence

- The connected Render interface confirms the existing service but exposes no custom-domain mutation, so the browser dashboard was used after the owner completed sign-in. No passwords or verification codes are stored in this checkpoint.
- Both custom domains now appear under Settings / Custom Domains. A verification attempt returned `Verification Error` for both; certificate status remains `Waiting for Verification`. Domain attachment alone is not a completed launch.
- The registrar / authoritative DNS provider has not been identified in the available context or domain-specific Gmail search. Ask for the provider name or DNS-management page, then use its available integration or browser controls.
- The execution environment's resolver failed for both the requested hostnames and the already-working Render origin. This is an environment lookup limitation, not evidence that the purchased domain is unregistered or misconfigured.
- Only the Render custom-domain association and automatic apex redirect were changed. Website source, the main branch, access settings and DNS records were not changed. Certificate issuance remains pending verification.
- Resume at this exact dashboard page: https://dashboard.render.com/static/srv-dbm4pmjbc2fs738all4g/settings#custom-domains . Obtain the domain's DNS-management platform, set the applicable records above, then verify again and confirm both HTTPS routes before reporting success.

## Official references checked

- https://render.com/docs/custom-domains
- https://render.com/docs/configure-other-dns

These references confirm `www` CNAME routing, apex options, automatic redirects and TLS. Treat current dashboard values as authoritative when making the actual change.
