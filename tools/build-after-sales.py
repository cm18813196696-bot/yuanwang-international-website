"""Build the English overseas service policy and four printable records.

Source: client-supplied YW-AFS-2026-01 V1.0, 8 November 2026.
The generator preserves the current shared header/footer from support.html.
"""
from pathlib import Path
import html
import re

ROOT = Path(__file__).resolve().parent.parent
ESC = html.escape


def para(text):
    return f'<p>{text}</p>'


def items(values, ordered=False):
    tag = 'ol' if ordered else 'ul'
    return f'<{tag} class="service-list">' + ''.join(f'<li>{v}</li>' for v in values) + f'</{tag}>'


def table(caption, headers, rows):
    return '<div class="service-table-wrap" role="region" aria-label="' + ESC(caption) + '" tabindex="0"><table class="service-table"><caption>' + caption + '</caption><thead><tr>' + ''.join('<th scope="col">' + h + '</th>' for h in headers) + '</tr></thead><tbody>' + ''.join('<tr>' + ''.join('<td>' + cell + '</td>' for cell in row) + '</tr>' for row in rows) + '</tbody></table></div>'


def detail(title, body):
    return f'<details class="service-detail"><summary>{title}</summary><div>{body}</div></details>'


def section(key, index, title, body):
    return f'<section class="service-section" id="{key}"><div class="service-kicker">{index}</div><h2>{title}</h2>{body}</section>'


source = (ROOT / 'support.html').read_text()
header = re.search(r'<header class="nav">.*?</header>', source, re.S).group()
footer = re.search(r'<footer class="site-footer">.*?</footer>', source, re.S).group()


def page(title, description, body, extra_class=''):
    return f'''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow"><meta name="theme-color" content="#e9f2ef">
<title>{ESC(title)} | YUANWANG</title><meta name="description" content="{ESC(description)}">
<link rel="icon" href="assets/yuanwang-symbol.svg"><link rel="stylesheet" href="style.css"><link rel="stylesheet" href="spa-theme.css"><link rel="stylesheet" href="site-polish.css"><link rel="stylesheet" href="after-sales.css">
</head><body class="support-page {extra_class}"><a class="skip-link" href="#main-content">Skip to content</a>{header}
{body}{footer}<script src="site-polish.js" defer></script><script src="after-sales.js" defer></script></body></html>'''


hero = '''<section class="service-hero"><div class="service-shell service-hero-grid"><div>
<div class="service-kicker">OVERSEAS AFTER-SALES · YW-AFS-2026-01</div>
<h1>Care for the years<br>after opening.</h1>
<p>Clear service steps for your hot spring, pool and geothermal systems. From commissioning records to preventive maintenance, spare parts and engineering support.</p>
<div class="service-meta"><span>V1.0 · Effective 8 November 2026</span><span>EU / EEA / Great Britain</span><span>Chinese &amp; English support</span></div></div>
<aside class="service-quick" aria-label="Service request guidance"><div class="service-kicker">NEED TECHNICAL SUPPORT?</div><h2>Start with the right information.</h2>
<p>Have your project name, equipment serial number, fault description and current operating readings ready. For an urgent shutdown, leak or safety concern, call the project contact named in your contract.</p>
<div class="service-actions"><a class="btn" href="#service-request">Prepare a service request ↗</a><a class="btn outline" href="#response">Response targets</a></div>
<p class="service-note">Use your contract-designated service channel for formal registration. The company office can help identify that channel.</p></aside></div></section>'''

jumps = '<nav class="service-jumps" aria-label="After-sales topics">' + ''.join(f'<a href="#{key}">{label}</a>' for key, label in [
    ('commitment','Our commitment'),('response','Response & visits'),('warranty','Warranty'),('commissioning','Commissioning'),('maintenance','Maintenance'),('spares','Spare parts'),('responsibilities','Delivery & compliance'),('claims','Claims & terms'),('service-request','Service request'),('service-records','Forms & records')]) + '</nav>'

commitment = section('commitment','01 / OUR COMMITMENT','Support with a clear next step.', '''<div class="service-trust">
<article><div class="service-kicker">ACKNOWLEDGE &amp; ASSESS</div><h3>A named point of contact.</h3><p>We acknowledge a complete service request, assign an engineer and establish the next technical step. A remote assessment cannot guarantee a repair outcome before the cause is understood.</p></article>
<article><div class="service-kicker">PLAN THE VISIT</div><h3>Site support by agreement.</h3><p>The number of visits, scope, engineer fees and travel responsibilities are agreed in the project contract. Overseas attendance depends on travel, visas and site access.</p></article>
<article><div class="service-kicker">OWN THE RESPONSIBILITY</div><h3>Quality beyond shipment.</h3><p>Transfer of shipping risk or acceptance does not remove responsibility for material, workmanship or design defects already present at delivery. Contractual and applicable legal notice requirements still apply.</p></article></div>
<div class="service-notice"><strong>How this policy applies.</strong> This policy can be incorporated into a project contract. Signed contract terms take precedence where they differ; service targets, warranty periods, exclusions and commercial arrangements below are subject to that agreement and applicable mandatory law.</div>''' + detail('Products and services covered', table('Covered systems', ['System','Included equipment / services'], [
    ['Hot spring and swimming pool water systems','Circulation pumps; sand, diatomaceous-earth and bag filters; disinfection and dosing; heat exchangers; temperature controls.'],
    ['Geothermal and heat-pump equipment','Plate heat-exchange stations, water-source and ground-source heat pumps, geothermal wellheads, well pumps and extraction systems.'],
    ['Water features and bathing pools','Pool jets, water distribution, cascades, spring features, underwater lights and pool accessories.'],
    ['Wellness experiences','Pool temperature systems, hydrotherapy jets, mist and other non-medical wellness equipment.'],
    ['Supporting services','Commissioning, operator training, annual inspections, water-quality diagnostics and energy-performance reviews.']
])) + detail('Items outside Yuanwang’s contracted supply', para('Paid technical assistance may be available for matters outside the agreed supply scope. Responsibility for the following normally rests with the buyer, its contractors or the relevant local authority:') + items([
    'Destination-market registration, importer registration, energy-labelling administration and locally required sampling or testing, except where expressly included in the agreed scope.',
    'Building structures, civil works, levelling, decorative finishes and waterproofing supplied or installed by other contractors. Warranty for Yuanwang-supplied and installed pool waterproofing is described separately below.',
    'Local electricity, water, drainage or gas infrastructure; voltage fluctuations, inadequate supply pressure, abrupt water-quality changes and utility interruptions.',
    'Third-party equipment independently procured or installed by the buyer, unless supplied with Yuanwang’s system.',
    'Installation, wiring or commissioning errors by the buyer or its contractors, including incorrect pipework, omitted flushing or departure from approved drawings.',
    'Unapproved alterations, dismantling, relocation, software changes, control replacement, misuse, operation beyond design conditions or missed maintenance.'
]) + para('Notify Yuanwang in writing before modifying equipment. A substantial modification can create new conformity-assessment responsibilities for the party making it; the applicable destination rules must be assessed for the specific change.')))

response = section('response','02 / SERVICE RESPONSE','From first report to agreed action.', para('Timing starts when complete fault information reaches the service channel designated in the contract. First response means acknowledgement and assignment of a responsible engineer. The action target is a technical assessment or plan; transport, replacement delivery, visas and final repair completion are separate.') + table('Response targets — where incorporated into the service agreement', ['Priority','Typical situation','First response','Action target'], [
    ['P1 · Emergency','Complete system shutdown, significant leakage or flooding, electrical risk, or an incident affecting personal safety.','Within 2 hours during working hours; within 8 hours outside working hours.','Interim action plan within 24 hours.'],
    ['P2 · Important','A major function fails but partial operation is possible: a pump failure, temperature-control fault or water quality outside the agreed range.','Within 8 hours.','Solution plan within 3 business days.'],
    ['P3 · General','Localised malfunction, parameter deviation or a cosmetic issue.','Within 2 business days.','Action plan within 7 business days.'],
    ['P4 · Enquiry','Operating questions, spare-parts enquiries or document requests.','Within 3 business days.','Follow the applicable enquiry or quotation process.']
]) + '''<div class="service-notice urgent"><strong>For a safety incident:</strong> use the site’s emergency procedures and the contract emergency contact immediately. Do not wait for an email response. Where necessary, involve local emergency services and qualified site personnel.</div>''' + detail('Complete fault information and formal registration', items([
    'Project and customer name; equipment model and serial number.',
    'The fault, when it began, how often it occurs and actions already attempted.',
    'Site photographs or video and alarm records.',
    'Current flow, pressure, temperature and electrical-current readings, with recent water-quality results where relevant.'
]) + para('Requests sent only to a salesperson’s personal WeChat, WhatsApp or private telephone are not formally registered service requests and do not start the agreed response clock. After registration, video calls may be arranged through WeChat, WhatsApp or Teams as appropriate.')) + detail('Overseas on-site service: timing and costs', table('Planning a visit from China', ['Item','Arrangement'], [
    ['Mobilisation','Typically 15–30 calendar days from confirmation to arrival, allowing for visas, travel and equipment transport.'],
    ['Visit duration','Normally planned for 5–10 business days per visit.'],
    ['Costs','Return international flights, visas, accommodation, local travel and engineer day rates are itemised. For visits within warranty scope, the engineer day rate is waived; travel allocation follows the contract. For work outside warranty, the buyer bears the agreed costs.'],
    ['Included visits','The contract specifies the number and scope of included visits; additional visits are quoted separately.'],
    ['If attendance is unavailable','Continue with remote diagnostics and, where appropriate, a qualified local service provider.']
])) + detail('Remote diagnosis and local service providers', items([
    'Video inspection, an agreed site evidence checklist and transfer of operating data normally come first.',
    'Remote control-system access requires the customer’s written permission, a temporary access route and closure of that route after the session.',
    'Yuanwang can provide technical guidance and parts to a local provider. A written service authorisation defines the work; the provider acts for the customer and cannot make warranty commitments on Yuanwang’s behalf.',
    'Unless otherwise agreed, the customer contracts with and pays the local provider directly.'
])))

warranty = section('warranty','03 / WARRANTY','Coverage matched to the system.', para('The following are standard recommended periods, confirmed by the signed contract. Cover applies to faults and underperformance caused by materials, workmanship or design under normal operating and maintenance conditions. Extended cover can be agreed separately.') + table('Recommended warranty schedule', ['Part / system','Period','Conditions'], [
    ['Pool waterproofing and liner system','5 years','Only the portion supplied and installed by Yuanwang; excludes civil structure and levelling layers.'],
    ['Buried and distribution pipework','3 years','Excludes external damage, frost heave and ground settlement.'],
    ['Plate / shell-and-tube heat exchangers','2 years','Scaling or corrosion caused by water outside the agreed design conditions is excluded.'],
    ['Yuanwang own-brand pumps, filters, dosing and control cabinets','2 years','Wear parts are excluded from this period.'],
    ['Heat pumps and geothermal wellhead equipment','2 years','Annual maintenance must follow the manual and agreed warranty conditions.'],
    ['Wellness / hydrotherapy experience equipment','1 year','For commercial, high-frequency use.'],
    ['Purchased third-party valves, instruments, inverters and other equipment','Original manufacturer’s terms','Yuanwang assists with claims within the original manufacturer’s obligations.'],
    ['Seals, O-rings, cartridges, nozzles, light covers and dosing diaphragms','3 months','Consumable and wear-part cover; stock initial replacements with the first parts package.']
]) + detail('When the warranty starts', para('Normally the warranty begins on signed commissioning and acceptance at the destination site, after the fifth commissioning checkpoint. If acceptance is delayed by the customer for more than 30 days, the warranty start date moves to the date the equipment arrived on site. This arrangement must be reflected in the project contract.')) + detail('Exclusions and maintenance requirements', items([
    'Installation, operation or maintenance contrary to the manuals, including omitted flushing, missed backwashing and incorrect electrical connections.',
    'Water outside the design water-quality schedule attached to the contract, including damaging scaling, corrosion, iron, manganese, sulphur or chloride conditions.',
    'Overdue maintenance. Where the agreed warranty incorporates this condition, failure to complete required annual maintenance reduces the original warranty period by half.',
    'Human damage, misuse, unapproved modifications and operation outside the approved conditions.',
    'Force-majeure events such as earthquake, flood, extreme freezing, lightning, war or epidemic restrictions.',
    'Normal wear and natural changes in appearance.'
]) + para('Keep dated maintenance and water-quality records so that the cause and applicable cover can be established.')))

commissioning = section('commissioning','04 / INSTALLATION & HANDOVER','Record the system from day one.', para('The project contract identifies one of the following installation arrangements. All arrangements retain the same five evidence checkpoints so the operating baseline and responsibilities are clear.') + table('Installation options', ['Mode','Work arrangement','Typical application'], [
    ['A · Yuanwang-supervised installation','The buyer organises the installation team; Yuanwang provides on-site technical guidance, critical checkpoint confirmation and commissioning.','Recommended for projects with an available local installation team.'],
    ['B · Yuanwang installation package','Yuanwang’s team completes installation and commissioning within the agreed scope.','Complex systems or projects without a suitable local team.'],
    ['C · Customer installation with remote commissioning','Yuanwang supplies drawings, video guidance and remote commissioning; the buyer returns photographs and signed evidence at critical stages.','Simpler systems and experienced customer teams.']
]) + table('Five mandatory handover checkpoints', ['Stage','Evidence to retain'], [
    ['1 · Unpacking and receipt','Photographs of all delivered items; damage check; quantity and nameplate details compared with the contract.'],
    ['2 · Flushing and pressure testing','Clear-water flushing confirmation; recorded pressure and hold time; test photographs.'],
    ['3 · Electrical inspection','Wiring, earthing and insulation-test records.'],
    ['4 · First water and initial run','Leak check, correct rotation and initial operating parameters, with video.'],
    ['5 · Commissioning and acceptance','Performance against design conditions, control-logic check, water-quality report and signed acceptance.']
]) + detail('Operator training and language versions', para('The standard proposal includes one on-site training session lasting 2–3 business days for the customer’s operations and maintenance staff. It covers daily operation, backwashing, dosing, setpoints and common fault diagnosis. A signed training record identifies attendees and topics completed.') + para('Electronic English operation and maintenance manuals are provided, with diagrams for key procedures. Follow-up video training or training in China may be arranged at an agreed cost.') + para('Yuanwang supplies Chinese originals and an English version. Required destination-language translations, their accuracy and cost must be allocated in the contract. English alone may not satisfy destination requirements; this allocation does not displace statutory manufacturer or importer duties.') + para('For machinery covered by Regulation (EU) 2023/1230 when it applies, digital instructions must be downloadable, printable and accessible for the required period. Paper instructions requested at purchase must be supplied free within one month; essential safety information for non-professional users must be supplied on paper. Apply the rules in force when the specific product is placed on the market.')))

maintenance = section('maintenance','05 / PREVENTIVE MAINTENANCE','Keep the operating baseline in view.', para('Use this standard-duty schedule together with the equipment manual and project water-quality conditions. Local operating requirements or the equipment manual may call for more frequent work. Retain dated readings, inspection results and replacement records.') + table('Maintenance schedule — standard operating conditions', ['Frequency','Tasks'], [
    ['Daily','Record flow, pressure, temperature, residual chlorine / ORP and pH. Check noise, leaks and alarms.'],
    ['Weekly','Backwash filters; check dosing-liquid levels and dosing rate; inspect pump vibration and temperature behaviour.'],
    ['Monthly','Full water-quality testing, including turbidity, hardness, alkalinity, iron, manganese, chloride and microbiological results; clean control cabinets; check fasteners.'],
    ['Quarterly','Review heat-exchanger temperature differentials, pump efficiency and the prescribed safety-valve test by qualified personnel.'],
    ['Every six months','Electrical insulation testing, inverter-parameter backups and sensor calibration.'],
    ['Annually','Comprehensive overhaul; assess seals and wear parts; geothermal well water-level, temperature, yield and sand-content checks where applicable; issue the annual system health report.']
]) + detail('Annual system health report', para('Yuanwang or an authorised service provider prepares a report covering annual operating trends, efficiency change against the first-year baseline, component-life estimates, replacement recommendations and next-year maintenance or upgrade priorities.') + para('The report gives owners a documented condition review that may support operational, insurance or financing discussions. The scope and any third-party acceptance requirements should be agreed separately.') + para('<a href="support-annual-report.html">Open the annual report template →</a>')) + detail('Geothermal wells: additional records and early warnings', items([
    'Create a well record at handover: depth, diameter, aquifer, initial water level, temperature, yield, sand content and mineralisation.',
    'Define acceptance at an agreed operating point, including yield, temperature and drawdown. Record the actual values rather than leaving these conditions unspecified.',
    'Compare annual results with the initial baseline. A 15% decline in yield triggers a diagnostic review of screen blockage, scaling, pump wear and regional groundwater changes.',
    'Assess well-pump replacement after approximately 5–8 years according to condition and duty. Qualified personnel must carry out the work; Yuanwang can assist with selection and supervision.',
    'Consider online level, temperature and flow monitoring, with an agreed route for returning the data for early assessment.'
])))

spares = section('spares','06 / SPARES & CONSUMABLES','Plan replacements before a shutdown.', table('Supply targets — confirmed in the quotation / contract', ['Item','Target'], [
    ['Standard parts','Dispatch within 15 business days of receipt of the order, subject to the applicable order and payment terms. Includes seals, filter elements, nozzles, diaphragms and common electrical components.'],
    ['Non-standard or custom parts','Dispatch within 45 business days; the specific quotation governs.'],
    ['Discontinued models','Key spare parts remain available for 8 years after a model is discontinued, as agreed for the supplied equipment.'],
    ['Spare-parts quotation','Price, lead time and transport method within 2 business days after receipt of a complete parts request.']
]) + '''<ol class="service-flow"><li><strong>Identify</strong>Send equipment serial number, part number, quantity and fault description.</li><li><strong>Confirm</strong>Review the price, lead time and transport proposal.</li><li><strong>Order</strong>Confirm the order and agreed payment; tracking follows dispatch.</li><li><strong>Inspect</strong>Check the packaging and visible condition within 48 hours of arrival.</li></ol>''' + detail('Three levels of spare-parts stock', table('Stocking strategy', ['Level','Stock','Holder / arrangement'], [
    ['1 · Supplied with equipment','First-year package: mechanical seals, O-rings, cartridges, nozzles, dosing diaphragms, common fuses and relays.','Customer site.'],
    ['2 · Critical components','Pump bodies, motors, controllers and sensors.','A regional stock point is a future arrangement, not an existing service network. For current projects, agree customer-held critical stock.'],
    ['3 · China central stock','Full range; standard-parts dispatch target of 15 business days.','Yuanwang, subject to order confirmation and the agreed supply terms.']
])) + detail('Recommended first-year critical stock', items([
    'Circulation-pump mechanical seals: 2 sets for each installed model.',
    'Filter-system O-rings and differential-pressure gauges.',
    'Dosing-pump diaphragms and non-return valves.',
    'Heat-exchanger gaskets: 1 set for each model.',
    'Critical control-cabinet relays and fuses.',
    'Underwater lights: 2 spares of the same model.'
]) + para('First orders normally use full prepayment; terms for established customers can be agreed. Report packaging or visible damage within 48 hours. Under this policy, absence of such a report is treated as confirmation of external condition; it does not by itself determine a latent-defect claim.')))

responsibilities = section('responsibilities','07 / DELIVERY & COMPLIANCE','Agree the destination responsibilities.', para('Confirm the Incoterms® 2020 term, named place or port, importer of record, destination rules and documentation before ordering. Transport risk and responsibility for pre-existing product defects are separate matters.') + table('Typical delivery allocations', ['Term','Yuanwang normally covers','Buyer normally covers','Risk transfer'], [
    ['FOB · Named port of shipment','Delivery on board at the Chinese shipment port and export clearance.','Sea freight, insurance, destination import clearance, duties, VAT and locally allocated market-access obligations.','When goods are on board the vessel.'],
    ['CIF · Named destination port','Export clearance, sea freight and the agreed cargo insurance to the destination port.','Destination import clearance, duties, VAT, onward transport and locally allocated market-access obligations.','When goods are on board at shipment, despite freight being paid to the destination port.'],
    ['DDP · Named destination','Delivery to the named place, including import clearance and duties / taxes as agreed and legally feasible.','Unloading and handling at site unless expressly included.','At the named destination, ready for unloading.']
]) + detail('Importer of record and traceability', para('Record which legal entity is the importer of record. Possible arrangements are the buyer or its local company; an EU authorised representative for specified manufacturer duties together with the buyer as importer; or an agreed local partner under a separate three-party arrangement.') + para('An authorised representative is not automatically the importer. Each role retains its legal duties. Relevant importer checks can include conformity assessment, marking and accompanying documents, destination-language instructions, traceability and cooperation with market-surveillance authorities. Required document-retention periods must be recorded.') + para('The current policy assumes project-specific arrangements; it does not claim that Yuanwang already operates a European service organisation.')) + detail('EU / EEA: model-specific regulatory review', table('Regulatory areas to assess — applicability is product-specific', ['Instrument','Possible relevance'], [
    ['Machinery Directive 2006/42/EC; Machinery Regulation (EU) 2023/1230','Machinery and related equipment. The new regulation generally applies from 20 January 2027. Confirm the applicable regime by product and placing-on-market date.'],
    ['Low Voltage Directive 2014/35/EU','Electrical equipment within the specified voltage scope, generally AC 50–1,000 V and DC 75–1,500 V; review exclusions and interaction with machinery legislation.'],
    ['EMC Directive 2014/30/EU','Electromagnetic compatibility of relevant controls, inverters, instruments and assemblies.'],
    ['RoHS Directive 2011/65/EU, as amended','Restricted substances for electrical and electronic equipment within scope.'],
    ['Pressure Equipment Directive 2014/68/EU','Pressure equipment above the relevant 0.5 bar threshold, subject to classification and exclusions.'],
    ['General Product Safety Regulation (EU) 2023/988','Consumer products where applicable; consider the relationship with sector-specific safety legislation.']
]) + para('CE marking is the manufacturer’s indication that the applicable requirements have been met. It is not a blanket third-party approval; some product categories require notified-body involvement. Confirm the correct assessment route, declaration, technical records, markings and manuals for each model.') + para('Pump energy-efficiency obligations depend on product scope and the rules in force. Confirm current ecodesign applicability for the particular pump rather than treating a general swimming-pool-pump exemption as a performance claim.')) + detail('Great Britain, Northern Ireland and other destinations', para('Great Britain means England, Scotland and Wales. Official guidance provides for continued recognition of CE marking for relevant regulated product groups, including machinery, alongside UKCA. Check the specific product route and current GB requirements before placing equipment on the market, especially around changes to EU machinery rules.') + para('Northern Ireland follows a distinct route under the Windsor Framework. CE is used where applicable; CE with UKNI is relevant where a UK body performs mandatory third-party assessment. UKNI is not a standalone mark and UKCA alone is not accepted for EU market access.') + table('Other markets — confirm before quotation and shipment', ['Destination','Project review'], [
    ['Saudi Arabia','Confirm the applicable SABER / SASO conformity route, product classification and customs requirements.'],
    ['United Arab Emirates','Confirm current MoIAT product-conformity or registration requirements for the specific equipment.'],
    ['North America','Assess the required local electrical-safety listing / certification and applicable pool, spa and underwater-light standards with the destination authority.'],
    ['Australia / New Zealand','Assess electrical safety, EMC, responsible-supplier registration and RCM obligations for equipment within scope.']
])) + detail('Shipment documentation checklist', items([
    'Commercial invoice, packing list and bill of lading or air waybill.',
    'Applicable conformity declaration identifying legislation, standards, model and authorised signatory; the required technical file is retained and made available to authorities as required.',
    'Original instructions and any required translations, clearly identified as such where applicable.',
    'Nameplate verification: manufacturer details, model, serial number, manufacturing year and required conformity markings.',
    'Compliant solid-wood packaging / ISPM 15 treatment evidence where applicable.',
    'Export and inspection documents matched to the actual HS code and current regulatory requirements. Confirm any statutory inspection before booking shipment.'
])) + '''<div class="service-source-links" aria-label="Official compliance references"><a href="https://eur-lex.europa.eu/eli/reg/2023/1230/oj" target="_blank" rel="noopener noreferrer">EU machinery regulation ↗</a><a href="https://www.gov.uk/government/publications/supply-of-machinery-safety-regulations-2008/supply-of-machinery-safety-regulations-2008-great-britain" target="_blank" rel="noopener noreferrer">GB machinery guidance ↗</a><a href="compliance.html">International delivery information →</a></div>''')

claims = section('claims','08 / CLAIMS & COMMERCIAL TERMS','Evidence first. A documented decision.', para('A warranty claim should include equipment serial number and proof of purchase; a description and timing of the fault; photographs or video; operating and water-quality records; and evidence of required maintenance. Incomplete claims may be held pending the missing information.') + detail('Assessment order, notification and timing', para('Responsibility is assessed in the following order:') + items([
    'Contract and attachments, including design duty, water-quality conditions and acceptance criteria.',
    'The five installation and commissioning checkpoint records.',
    'Operating and maintenance logs.',
    'Examination of the failed part and any independent test report.',
    'Relevant industry practice and original manufacturer standards.'
], True) + para('This policy proposes notice within 30 days after discovering, or being expected to discover, a defect. This is a proposed contractual notification period, not a fixed deadline imposed by CISG Article 39. Where the CISG applies, Article 39 uses a reasonable-time requirement and generally a two-year outer limit from actual handover, subject to the contractual guarantee period and applicable exceptions.') + para('Yuanwang’s response follows the priority table above. The target for a written responsibility assessment is 30 business days after complete claim materials are received.') + para('<a href="https://uncitral.un.org/en/texts/salegoods/conventions/sale_of_goods/cisg" target="_blank" rel="noopener noreferrer">Official CISG text and resources ↗</a>')) + detail('Claim-value handling', table('Proposed handling arrangements — subject to the agreed policy', ['Value / impact','Process'], [
    ['Below EUR 500 equivalent','Minor remedial work may be arranged without advance approval, up to 2 occasions per year. Retain photographs and invoices; reimbursement follows the agreed claim conditions.'],
    ['EUR 500–5,000 equivalent','Remote diagnosis and responsibility assessment before settlement; initial reply normally within 10 business days.'],
    ['Above EUR 5,000 or involving safety','A dedicated review team and, where needed, on-site assessment. Coordinate the investigation and communicate substantiated findings.']
])) + detail('Liability and dispute arrangements', para('The recommended contract arrangement is a project aggregate liability cap equal to the contract value and exclusion of indirect loss, lost profit, business interruption and third-party claims, except for deliberate misconduct, gross negligence and personal injury. These are proposed B2B contract terms; they apply only as agreed and to the extent legally enforceable.') + para('The proposed governing law is the law of the People’s Republic of China, excluding Hong Kong, Macao and Taiwan for this choice of law. The proposed forum is CIETAC arbitration in Beijing, with Chinese and/or English as agreed. Confirm governing law, seat, institution and language when signing; undisputed obligations continue during a dispute.')) + detail('Payment, currency, tax and travel deposits', items([
    'Services and spare parts normally use agreed prepayment. Allow for cross-border payment processing and intermediary charges; allow approximately 3–7 business days, with actual timing dependent on banks.',
    'USD or EUR pricing is suggested. Specify who bears exchange-rate movements and which rate is used.',
    'Destination duties and VAT normally fall to the buyer / importer, except under an agreed DDP allocation. Quotations should state whether destination taxes are excluded.',
    'For an on-site visit, the suggested arrangement is a 50% advance against estimated travel expenses, followed by settlement against actual agreed costs.'
])) + detail('Force majeure and changed circumstances', para('Relevant events can include war, civil disorder, terrorism, government restrictions, natural disasters, epidemic or quarantine restrictions, visa refusals or entry restrictions, shipping disruption, port strikes, export controls, sanctions, embargoes and destination-law changes preventing lawful supply.') + para('The suggested contract arrangement provides for written notice and supporting evidence within 15 days; the parties then agree a revised plan. If the event continues for more than 6 months, either party may terminate the unperformed portion, with completed work settled on an actual basis. Any relief depends on the signed terms and applicable law.')))

request = section('service-request','09 / SERVICE REQUEST','Prepare a complete fault report.', '''<div class="service-request-grid"><form class="service-form" id="service-request-form" aria-describedby="request-explanation">
<p class="service-note" id="request-explanation">This form prepares an email or a downloadable text report. It does not submit a ticket to a server. Send the report through your contract-designated service channel, and add supporting photographs or files in your email application.</p>
<div class="service-form-grid">
<label>Customer / company *<input name="company" autocomplete="organization" required maxlength="160"></label>
<label>Country *<input name="country" autocomplete="country-name" required maxlength="100"></label>
<label>Project name / location *<input name="project" required maxlength="180"></label>
<label>Equipment model *<input name="model" required maxlength="140"></label>
<label>Equipment serial number *<input name="serial" required maxlength="140"></label>
<label>Priority *<select name="priority" required><option value="">Select a priority</option><option>P1 · Emergency</option><option>P2 · Important</option><option>P3 · General</option><option>P4 · Enquiry</option></select></label>
<label>Commissioning date<input name="commissioned" type="date"></label>
<label>Fault first observed *<input name="observed" type="datetime-local" required><small>Enter the site’s local date and time.</small></label>
<label>Site time zone *<input name="timezone" required maxlength="100" placeholder="e.g. Europe/London or UTC+1"></label>
<label>Contact name *<input name="contact" autocomplete="name" required maxlength="120"></label>
<label>Contact email *<input name="email" type="email" autocomplete="email" required maxlength="180"></label>
<label>Contact telephone *<input name="phone" type="tel" autocomplete="tel" required maxlength="80"></label>
<label class="full">Fault description / frequency *<textarea name="fault" required maxlength="4000" placeholder="Describe what happened, any alarms and whether the system can operate."></textarea></label>
<label class="full">Actions already taken *<textarea name="actions" required maxlength="2000" placeholder="List checks or actions already attempted. If none, enter None."></textarea></label>
<label class="full">Current operating parameters *<textarea name="parameters" required maxlength="2000" placeholder="Flow, pressure, temperature and current, including units. State if a reading cannot be obtained safely."></textarea></label>
<label class="full">Latest water-quality results<textarea name="water" maxlength="2000" placeholder="Date, pH, disinfectant / ORP, turbidity and relevant project water-quality values."></textarea></label>
<label class="full">Photo / video / log references *<textarea name="evidence" required maxlength="2000" placeholder="List the filenames or secure sharing references you will include with your email."></textarea></label>
<label class="full">Contract-designated service email<input name="recipient" type="email" maxlength="180" placeholder="Enter the service address stated in your contract"><small>If left blank, the report is addressed to the published company office (317196186@qq.com) for routing. Formal registration and response timing must be confirmed with your designated service contact.</small></label>
</div><label class="checkbox-label"><input name="reviewed" type="checkbox" required><span>I have reviewed these details and will attach the supporting evidence before sending. I understand that preparing this report does not register or send a service request.</span></label>
<div class="service-actions"><button class="btn" type="submit">Prepare service email ↗</button><button class="btn outline" type="button" id="download-service-request">Download report (.txt)</button><button class="btn outline" type="button" id="copy-service-request">Copy report</button></div>
<p class="service-status" id="service-request-status" role="status" aria-live="polite"></p><details class="service-detail" id="service-report-preview" hidden><summary>Review prepared report</summary><textarea class="service-message" id="service-report-output" aria-label="Prepared service report" rows="14" readonly></textarea></details>
</form><aside><h3>Service contacts</h3><p class="service-note"><strong>Formal service / emergency contact</strong><br>The project manager and service channel named on your signed contract. For emergencies, telephone that contact.</p>
<p class="service-note"><strong>Company office — routing assistance</strong><br><a href="mailto:317196186@qq.com">317196186@qq.com</a><br><a href="tel:+861058614186">+86 10 5861 4186</a><br>Office hours: 09:00–18:00 Beijing (UTC+8).</p>
<p class="service-note"><strong>Time difference</strong><br>Beijing office hours correspond to 01:00–10:00 in the UK in winter and 02:00–11:00 in summer. In Central Europe they correspond to 02:00–11:00 in winter and 03:00–12:00 in summer.</p>
<p class="service-note"><strong>Languages</strong><br>Chinese and English. Arrange other languages or written translation in advance.</p><div class="service-notice">A request number and assigned engineer are confirmed by the service team after registration. No number is generated by this webpage.</div>
<a href="support-service-request.html" class="btn outline">Open printable request form →</a></aside></div>''')

records = section('service-records','10 / FORMS & RECORDS','Keep a shared service history.', para('Four English forms support the service policy. Open a form to print it or save it as a PDF with your browser. Complete the records with the project team and retain the signed copies.') + '''<div class="service-records">''' + ''.join(f'''<a class="service-record" href="{path}"><span>APPENDIX {i:02d}</span><h3>{title}</h3><p>{desc}</p><strong>Open printable form ↗</strong></a>''' for i,(path,title,desc) in enumerate([
    ('support-service-request.html','Service request form','Equipment, fault evidence, operating parameters, response and closure.'),
    ('support-project-record.html','Overseas project record','Project and importer details, commissioning dates and the operating baseline.'),
    ('support-annual-report.html','Annual system health report','Annual trends, efficiency, water quality, component condition and next-year actions.'),
    ('support-commissioning-checklist.html','Commissioning checklist','The five handover checkpoints, evidence references and signatures.')
],1)) + '''</div><div class="service-signoff"><p>A good system proves itself in the years after opening.</p><p>Water changes, pipework scales and components age. Our purpose is to give owners a practical way to monitor that change, plan maintenance and make informed decisions with the engineering team.</p></div><p class="service-note">Issued by Beijing Yuanwang Hot Spring Design · YW-AFS-2026-01 · V1.0 · 8 November 2026. Signed project terms and applicable mandatory requirements govern.</p><div class="service-actions"><button class="btn outline" type="button" data-print-policy>Print full service policy / save PDF</button><a class="btn outline" href="resources.html">Resource centre →</a></div>''')

(ROOT/'support.html').write_text(page('Overseas After-Sales Service Policy', 'Overseas support for Yuanwang hot spring, swimming pool and geothermal systems: warranty, service response, maintenance, spare parts and printable service records.', hero+'<main id="main-content" class="service-shell">'+jumps+commitment+response+warranty+commissioning+maintenance+spares+responsibilities+claims+request+records+'</main>'))


def blank_fields(labels):
    return '<table class="record-fields"><tbody>'+''.join(f'<tr><th scope="row">{label}</th><td>&nbsp;</td></tr>' for label in labels)+'</tbody></table>'


def record(name,title,appendix,intro,body):
    main=f'''<main id="main-content" class="service-shell record-page"><a href="support.html#service-records" data-no-print>← After-sales forms &amp; records</a><div class="service-kicker" style="margin-top:25px">YW-AFS-2026-01 / APPENDIX {appendix:02d}</div><h1>{title}</h1><p class="service-note">{intro}</p><div class="service-actions" data-no-print><button type="button" class="btn" data-print-record>Print form / save PDF</button><a class="btn outline" href="support.html#service-request">Prepare service email →</a></div>{body}<p class="service-note">YUANWANG · Overseas After-Sales Service Policy · V1.0 · 8 November 2026. Retain signed records with the project contract.</p></main>'''
    (ROOT/name).write_text(page(title,intro,main,'service-record-page'))


record('support-service-request.html','Service request form',1,'Complete the customer and equipment information, then send it with supporting evidence through your contract-designated service channel.',
       '<div class="record-block">'+blank_fields([
           'Request number (Yuanwang use)','Customer / country','Project / site location','Equipment name / model','Equipment serial number','Commissioning date','Report date / local time / time zone','Priority: P1 / P2 / P3 / P4','Fault description (customer’s own words)','Occurrence / frequency','Actions already attempted','Photo / video / log references','Current flow / pressure / temperature / current','Latest water-quality test / date','Customer contact / telephone / email','Yuanwang contact / receipt time','Initial assessment','Proposed action / owner / target date','Closure date / customer confirmation'
       ])+'</div><p class="service-note">A complete report enables registration and assessment. Preparing or printing this form does not send a request. Call the contract emergency contact for safety incidents.</p>')

baseline=['Total circulation flow','Filter inlet / outlet differential pressure','Heat-exchanger inlet / outlet temperature difference','Pool water / system outlet temperature','Geothermal well yield','Geothermal dynamic water level','Geothermal outlet temperature','Water: pH / turbidity / hardness','Water: iron / manganese / chloride','Water: mineralisation / sand content']
record('support-project-record.html','Overseas project record',2,'Keep the agreed legal roles, delivery history and commissioning baseline together for future diagnosis.',
       '<div class="record-block"><h2>A. Project &amp; compliance</h2>'+blank_fields([
           'Project / country / city','Customer legal entity','Importer of record: name / address','Authorised representative (if applicable)','Incoterm / named place / contract number / date','Applicable product regimes / conformity route','Declaration reference / issue date','Technical documentation location','Manual language versions','HS code / required statutory inspection','Shipment batch / arrival date'
       ])+'</div><div class="record-block"><h2>B. Delivery &amp; commissioning</h2>'+blank_fields([
           'Unpacking inspection date / findings','Installation mode: A / B / C','Flushing / pressure-test completion','Electrical / insulation-test record','First water / initial run date','Commissioning acceptance / signatories','Training date / staff trained','Warranty start / component expiry dates'
       ])+'</div><div class="record-block"><h2>C. Initial operating baseline</h2>'+table('Record actual values and units', ['Parameter','Initial value / unit','Notes / design condition'], [[x,'&nbsp;','&nbsp;'] for x in baseline])+'</div>')

annual_sections=[
    ('1. Annual operation','Operating hours, total treated water, fault count and downtime.'),
    ('2. Parameter trends','Compare flow, differential pressure, temperature differences and energy use with commissioning and the previous year.'),
    ('3. Efficiency','Pump and heat-exchange performance; percentage change in system energy use.'),
    ('4. Water quality, scaling and corrosion','Water-quality trends, scaling tendency, corrosion risks and action taken.'),
    ('5. Geothermal well review, where applicable','Yield, water-level and temperature changes; identify whether the 15% yield-decline warning has been triggered.'),
    ('6. Component condition','Estimated remaining condition / life of key components; replacement recommendations and rationale.'),
    ('7. Problems and corrective work','Faults and root-cause categories: equipment, operation, water quality or external causes; evidence and corrective action.'),
    ('8. Next-year recommendations','Maintenance priorities, spare-parts stock and proposed upgrades.'),
    ('9. Overall condition','Excellent / Good / Monitor / Intervention required. State the basis, limitations and priority actions.')]
record('support-annual-report.html','Annual system health report',3,'For completion by Yuanwang or the authorised service provider following the annual condition review.',
       '<div class="record-block">'+blank_fields(['Project / country','Reporting year / inspection date','Service provider / engineer','Operating baseline reference'])+'</div>'+''.join('<div class="record-block"><h2>'+title+'</h2><p class="service-note">'+description+'</p><table class="record-fields"><tbody><tr class="writing-row"><td>Findings / evidence / action:</td></tr><tr class="writing-row"><td>&nbsp;</td></tr></tbody></table></div>' for title,description in annual_sections)+'<div class="record-signatures"><p>Engineer / service provider signature &amp; date</p><p>Customer acknowledgement &amp; date</p></div>')

record('support-commissioning-checklist.html','Installation & commissioning checklist',4,'Complete every checkpoint with its evidence reference and both parties’ confirmation.',
       '<div class="record-block">'+blank_fields(['Project / contract reference','Customer / site location','Equipment / model / serial number','Site arrival date / installation mode'])+'</div><div class="record-block">'+table('Five commissioning checkpoints', ['Stage','Confirmation','Evidence','Date','Both parties’ signatures'], [
           ['1 · Receipt','No visible damage; correct quantity; nameplate matches contract.','Unpacking photographs','&nbsp;','&nbsp;'],
           ['2 · Pipework','Flushed to clear water; test pressure and hold time meet approved requirements.','Test record / photographs','&nbsp;','&nbsp;'],
           ['3 · Electrical','Correct wiring; reliable earthing; acceptable insulation readings.','Electrical / insulation record','&nbsp;','&nbsp;'],
           ['4 · First run','No leaks; correct rotation; parameters within agreed range.','Parameter log / video','&nbsp;','&nbsp;'],
           ['5 · Acceptance','Design duty achieved; acceptable water quality; controls operating correctly.','Acceptance / water-quality reports','&nbsp;','&nbsp;']
       ])+'</div><div class="record-block">'+blank_fields(['Outstanding items / responsible party / due date','Operator training / attendees / record','Agreed warranty start date / basis'])+'</div><p class="service-note">The normal warranty start is completion and signature of checkpoint 5. Where the signed contract incorporates this policy’s condition, a customer-caused acceptance delay exceeding 30 days moves the start to equipment arrival at site. Record the agreed basis above.</p><div class="record-signatures"><p>Yuanwang representative / date</p><p>Customer representative / date</p></div>')

resources=ROOT/'resources.html'
text=resources.read_text()
if 'support-service-request.html' not in text:
    card='<a class="hub-card" href="support.html"><h2>Overseas after-sales service</h2><p>Response targets, warranty, maintenance and four printable service records.</p><span>Explore →</span></a>'
    text=text.replace('<div class="hub-grid">','<div class="hub-grid">'+card)
    resources.write_text(text)

print('Built support policy, 4 English printable records and resource-centre entry.')
