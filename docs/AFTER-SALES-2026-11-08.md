# Overseas after-sales service and project image cleanup

Date: 8 November 2026. Original repository: cm18813196696-bot/yuanwang-international-website, main.
Base: b65ce89119094c226151973f0c246eb15ee3a90c. Existing Render site: yuanwang-international-preview.

## Checkpoint 1 — project images

- Visually reviewed all 61 project image files in contact sheets.
- Removed confirmed phone screenshots `qingliang-01.jpg` and `guanghegu-12.jpg` from the published asset set.
- Removed screenshot entries from project-02, project-03 and project-08; replaced the Qingliangwan cover with qingliang-13.jpg.
- Updated the generated photo gallery to skip those source indices and number the remaining 29 / 11 photographs correctly.
- Kept the remaining original photographs and the existing pool-detail studio intact.
- Validation: app.js passes Node syntax validation. Full link and browser checks follow the service-page integration.

## Checkpoint 2 — English policy and service records

- Integrated the supplied `远望海外客户售后服务守则-2026-11-08.docx` (YW-AFS-2026-01, V1.0) into support.html, covering scope, risk allocation, warranty, response, attendance, commissioning, training, compliance, maintenance, geothermal-well monitoring, parts, claims, commercial terms and force majeure.
- Added P1–P4 response targets; 8-row recommended warranty schedule; daily-to-annual maintenance schedule; 3 installation modes; 5 commissioning checkpoints; 3-level spare-parts strategy.
- Added an accessible local service-report builder: validates complete information, prepares an email, copies text or downloads a text report. It does not create a server ticket or claim successful sending.
- Added four standalone English printable records: service request, overseas project record, annual health report and commissioning checklist. Full-policy printing opens collapsed details for print, then restores their state.
- Added the policy to the resource centre. Shared navigation, palette and footer are retained.
- Unfilled `service@[domain]` and `+86-10-XXXX-XXXX` placeholders are never published. Existing company office 317196186@qq.com and +86 10 5861 4186 assist routing; formal registration uses the contract-designated service channel.
- Reproducible content generator: `python tools/build-after-sales.py`.
- Structural validation: all 67 HTML pages have valid local file and fragment references; English service pages have no Chinese body text or unfilled contact placeholders. app.js and after-sales.js syntax checks pass.

## Legal reference clarifications in the English web edition

- A 30-day defect-notice period is identified as a proposed contractual period, not a fixed deadline imposed by CISG Article 39. Article 39 uses reasonable time and a two-year outer limit, subject to guarantee periods and applicable exceptions.
- Corrected the machinery-instructions reference: Regulation (EU) 2023/1230 Article 10(7), including paper instructions requested at purchase and essential safety information for non-professional users. Avoided claiming English alone satisfies all EU markets.
- CE is an indication of conformity, not a blanket third-party certificate; some categories require a notified body. Regulatory applicability is model-specific.
- Preserved the general 20 January 2027 EU machinery application date. GB and Northern Ireland routes are separated; CE+UKNI is conditional on the applicable third-party assessment route.
- Did not publish speculative pump-energy-law dates, an undifferentiated 4% fine claim, obsolete UAE authority naming or blanket destination certification assurances.
- FOB/CIF risk transfer is on board at shipment; DDP is at the named destination ready for unloading. An authorised representative is not automatically an importer.
- All exclusions and suggested commercial terms remain subject to the signed contract and applicable mandatory law.

Primary references reviewed: EUR-Lex Regulation (EU) 2023/1230; GOV.UK GB machinery guidance and 2026 CE/UKCA guidance; GOV.UK CE/UKNI guidance; UNCITRAL's Article 39 text and digest. Exact shipment requirements still depend on the product, destination and placing-on-market date.

## Next checkpoint

Browser-check the desktop, phone and tablet layouts, form validation and copy/download actions, the four records and printing. Then save any fixes, advance the original main branch and verify the existing Render deployment. Preserve an archive branch at the completed source state.
