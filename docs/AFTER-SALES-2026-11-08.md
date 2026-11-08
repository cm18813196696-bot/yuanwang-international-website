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

## Checkpoint 3 — completed release

- Desktop browser review passed; responsive QA in 390 px and 820 px frames passed. At phone size the document width remains 375 CSS px and the 580 px tables scroll inside their own 336 px container.
- Mobile navigation opens and closes correctly. Service details expand correctly, and form validation prevents an empty report.
- A clearly labelled synthetic report was prepared in the browser. Its serial number and time zone were retained. Copy and text-download actions passed; the page did not send a message or generate a false ticket number.
- Rechecked the Qingliangwan project cover and its 29 remaining gallery entries. No removed screenshot references or completed image-load failures remain.
- Added direct PDF downloads for the English policy and all four records, generated from the same HTML. All 19 pages were rendered and visually reviewed; text bounds pass. Fixed split writing boxes in the annual report and improved table column proportions.
- PDF inventory: policy 12 pages; service request 1; overseas project record 2; annual report 3; commissioning checklist 1. PDF generation: `python tools/export-after-sales-pdfs.py` (ReportLab, lxml, DejaVu fonts).
- Browser download of the policy PDF passed. Browser-native print output could not be inspected in this cloud browser; the verified direct PDFs are the dependable download option. The page retains standard print buttons and styles.
- Code, generated HTML, the five PDFs, both reproducible generators and this log are preserved in `archive/after-sales-2026-11-08`.

## Publication and future continuation

This is the completed source release for the original `main` branch and its existing auto-deploying Render static site `srv-dbm4pmjbc2fs738all4g` in workspace `tea-db4uodflk1mc7383upeg`.

Production origin: https://yuanwang-international-preview.onrender.com/

Verify publication by matching the Render deployment's commit to this release before reporting completion. The original source attachment remains `远望海外客户售后服务守则-2026-11-08.docx` (YW-AFS-2026-01 V1.0, 8 November 2026). Future edits should update the HTML generator first, regenerate pages and PDFs, validate references, then publish and advance the archive checkpoint. Existing product studios, the other project photographs and the remaining engineering/geothermal resources were retained.
