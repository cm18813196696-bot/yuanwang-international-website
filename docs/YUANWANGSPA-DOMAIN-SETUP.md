# Yuanwang official domain setup

Prepared 8 November 2026. Status: configuration plan saved; custom-domain attachment and DNS verification are not yet complete.

## Confirmed destination

- Requested primary URL: `https://www.yuanwangspa.com`.
- Existing service: Render static site `yuanwang-international-preview`, service `srv-dbm4pmjbc2fs738all4g`, workspace `tea-db4uodflk1mc7383upeg`.
- Existing origin: `https://yuanwang-international-preview.onrender.com`.
- Repository: `cm18813196696-bot/yuanwang-international-website`, `main`.
- Website release already live before this task: `ed9008dc959708b10d0231e22c681faa94490364`.
- Render service dashboard: https://dashboard.render.com/static/srv-dbm4pmjbc2fs738all4g

## Steps to complete

1. Sign in to the existing Render account and open this service's Settings / Custom Domains. Confirm the correct service and domain allowance before saving.
2. Add `www.yuanwangspa.com` as the primary custom domain. Render's documented behaviour is to add the apex `yuanwangspa.com` automatically and redirect it to `www`.
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

- The connected Render interface confirms the existing service but exposes no custom-domain mutation. The browser dashboard requires interactive sign-in; authentication is in progress with the owner. No passwords or verification codes are stored in this checkpoint.
- The registrar / authoritative DNS provider has not been identified in the available context or domain-specific Gmail search. Ask for the provider name or DNS-management page, then use its available integration or browser controls.
- The execution environment's resolver failed for both the requested hostnames and the already-working Render origin. This is an environment lookup limitation, not evidence that the purchased domain is unregistered or misconfigured.
- No website source, live audience, DNS record, custom-domain association or certificate has been changed by this checkpoint.

## Official references checked

- https://render.com/docs/custom-domains
- https://render.com/docs/configure-other-dns

These references confirm `www` CNAME routing, apex options, automatic redirects and TLS. Treat current dashboard values as authoritative when making the actual change.
