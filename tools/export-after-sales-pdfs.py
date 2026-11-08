"""Export the English service pages as PDFs from the same canonical HTML."""
from pathlib import Path
import re
from html import escape
from lxml import html
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, KeepTogether

ROOT=Path(__file__).resolve().parent.parent
OUT=ROOT/'downloads'
OUT.mkdir(exist_ok=True)
FONT=Path('/usr/share/fonts/truetype/dejavu')
for name,file in [('YWText','DejaVuSans.ttf'),('YWTextBold','DejaVuSans-Bold.ttf'),('YWTitle','DejaVuSerif.ttf')]:
    pdfmetrics.registerFont(TTFont(name,str(FONT/file)))
pdfmetrics.registerFontFamily('YWText',normal='YWText',bold='YWTextBold',italic='YWText',boldItalic='YWTextBold')
INK=colors.HexColor('#183f48'); MUTED=colors.HexColor('#526e73'); LINE=colors.HexColor('#ccdcd2'); MIST=colors.HexColor('#edf4ee')
WIDTH=A4[0]-90
STYLES={
    'body':ParagraphStyle('YWBody',fontName='YWText',fontSize=8.8,leading=13.1,textColor=INK,spaceAfter=8),
    'small':ParagraphStyle('YWSmall',fontName='YWText',fontSize=7.4,leading=11,textColor=MUTED,spaceAfter=8),
    'title':ParagraphStyle('YWTitle',fontName='YWTitle',fontSize=25,leading=31,textColor=INK,spaceAfter=14),
    'h2':ParagraphStyle('YWH2',fontName='YWTitle',fontSize=17,leading=22,textColor=INK,spaceBefore=17,spaceAfter=10,keepWithNext=True),
    'h3':ParagraphStyle('YWH3',fontName='YWTextBold',fontSize=10,leading=14,textColor=INK,spaceBefore=11,spaceAfter=7,keepWithNext=True),
    'cell':ParagraphStyle('YWCell',fontName='YWText',fontSize=7.5,leading=10.8,textColor=INK,spaceAfter=0),
    'head':ParagraphStyle('YWHead',fontName='YWTextBold',fontSize=7.2,leading=10.4,textColor=INK),
    'bullet':ParagraphStyle('YWBullet',fontName='YWText',fontSize=8.6,leading=12.7,textColor=INK,leftIndent=11,firstLineIndent=-8,spaceAfter=5),
}


def clean(s):
    for a,b in [('↗',''),('→',''),('←',''),('’',"'"),('‘',"'"),('“','"'),('”','"'),('–','-'),('—','-'),('\u2011','-'),('\xa0',' ')]:s=s.replace(a,b)
    return re.sub(r'\s+',' ',s).strip()


def text(el):return clean(' '.join(el.itertext()))


def paragraph(s,style='body'):
    return Paragraph(escape(clean(s)),STYLES[style])


def make_table(el):
    rows=el.xpath('./thead/tr|./tbody/tr|./tr')
    if not rows:return []
    headers=bool(el.xpath('./thead'))
    cells=[]
    for i,row in enumerate(rows):
        vals=[paragraph(text(cell),'head' if (headers and i==0) else 'cell') for cell in row.xpath('./th|./td')]
        cells.append(vals)
    n=max(len(row) for row in cells)
    for row in cells:row.extend([paragraph('','cell')]*(n-len(row)))
    if n==1: widths=[WIDTH]
    elif n==2: widths=[WIDTH*.35,WIDTH*.65]
    elif n==3:widths=[WIDTH*.32,WIDTH*.14,WIDTH*.54]
    elif n==4:widths=[WIDTH*.14,WIDTH*.37,WIDTH*.25,WIDTH*.24]
    else:widths=[WIDTH*.12,WIDTH*.34,WIDTH*.22,WIDTH*.10,WIDTH*.22]
    # Keep the narrative column wide in two-stage handover tables.
    if n==3 and 'Initial value' in text(el): widths=[WIDTH*.48,WIDTH*.24,WIDTH*.28]
    if n==3 and 'Work arrangement' in text(el): widths=[WIDTH*.22,WIDTH*.50,WIDTH*.28]
    if n==3 and 'Holder / arrangement' in text(el): widths=[WIDTH*.19,WIDTH*.38,WIDTH*.43]
    tbl=Table(cells,colWidths=widths,repeatRows=1 if headers else 0,hAlign='LEFT')
    style=[('VALIGN',(0,0),(-1,-1),'TOP'),('GRID',(0,0),(-1,-1),.4,LINE),('LEFTPADDING',(0,0),(-1,-1),8),('RIGHTPADDING',(0,0),(-1,-1),8),('TOPPADDING',(0,0),(-1,-1),8),('BOTTOMPADDING',(0,0),(-1,-1),8)]
    if headers:style.append(('BACKGROUND',(0,0),(-1,0),MIST))
    else:
        if n>1:style.append(('BACKGROUND',(0,0),(0,-1),MIST))
        for i,row in enumerate(rows):
            if 'writing-row' in row.get('class',''):style.extend([('TOPPADDING',(0,i),(-1,i),22),('BOTTOMPADDING',(0,i),(-1,i),22)])
    tbl.setStyle(TableStyle(style))
    result=[]
    cap=el.xpath('./caption')
    if cap:result.append(paragraph(text(cap[0]),'h3'))
    result.extend([tbl,Spacer(1,11)])
    return result


def walk(el):
    tag=el.tag if isinstance(el.tag,str) else ''
    cls=el.get('class','')
    if tag in ['script','style','nav','button','form'] or 'data-no-print' in el.attrib:return []
    if tag=='table':return make_table(el)
    if tag in ['h2','h3','h4','summary']:
        return [paragraph(text(el),'h2' if tag=='h2' else 'h3')]
    if tag=='p':return [paragraph(text(el),'small' if 'service-note' in cls else 'body')]
    if tag in ['ul','ol']:
        values=[]
        for i,item in enumerate(el.xpath('./li'),1):
            values.append(paragraph((f'{i}. ' if tag=='ol' else '- ')+text(item),'bullet'))
        return values+[Spacer(1,4)]
    if 'service-notice' in cls:return [paragraph(text(el),'body'),Spacer(1,3)]
    if 'service-kicker' in cls:return []
    if tag=='a' and 'service-record' in cls:
        title=el.xpath('./h3')[0]
        desc=el.xpath('./p')[0]
        return [paragraph(text(title),'h3'),paragraph(text(desc))]
    if tag=='a' and el.get('href','').startswith('http'):
        return [paragraph(text(el)+': '+el.get('href'),'small')]
    if 'service-actions' in cls or 'service-source-links' in cls:return []
    if 'record-signatures' in cls:return [Spacer(1,22),Table([[paragraph('Engineer / Yuanwang signature: __________________','small'),paragraph('Customer signature: __________________','small')]],colWidths=[WIDTH/2,WIDTH/2]),Spacer(1,10)]
    result=[]
    for child in el:result.extend(walk(child))
    if 'record-block' in cls and el.xpath('.//tr[contains(@class,"writing-row")]'):
        return [KeepTogether(result)]
    return result


def footer(canvas,doc):
    canvas.saveState()
    canvas.setStrokeColor(LINE);canvas.setLineWidth(.4);canvas.line(45,39,A4[0]-45,39)
    canvas.setFont('YWText',7);canvas.setFillColor(MUTED)
    canvas.drawString(45,27,'YUANWANG  |  YW-AFS-2026-01  |  V1.0 - 8 November 2026')
    canvas.drawRightString(A4[0]-45,27,str(doc.page))
    canvas.restoreState()


files=[('support.html','YUANWANG-Overseas-After-Sales-Policy-EN.pdf','Overseas after-sales service policy'),('support-service-request.html','YUANWANG-Service-Request-Form-EN.pdf','Service request form'),('support-project-record.html','YUANWANG-Overseas-Project-Record-EN.pdf','Overseas project record'),('support-annual-report.html','YUANWANG-Annual-System-Health-Report-EN.pdf','Annual system health report'),('support-commissioning-checklist.html','YUANWANG-Commissioning-Checklist-EN.pdf','Installation & commissioning checklist')]
for source,name,title in files:
    tree=html.fromstring((ROOT/source).read_text())
    story=[paragraph('YUANWANG / OVERSEAS SERVICE','small'),paragraph(title,'title'),paragraph('YW-AFS-2026-01 - V1.0 - Effective 8 November 2026','small')]
    if source=='support.html':
        story.append(paragraph('For hot spring, swimming pool, geothermal and non-medical wellness equipment in the EU / EEA and Great Britain. Signed contract terms and applicable mandatory requirements govern.'))
        for sec in tree.xpath('//main/section'):
            if sec.get('id')=='service-request':
                story.extend([paragraph('Prepare a complete fault report.','h2'),paragraph('Use the separate Service Request Form and send it with photographs, video references and operating logs through the service channel in your contract. For an emergency, call the designated project contact. Company office for routing: 317196186@qq.com; +86 10 5861 4186; 09:00-18:00 Beijing (UTC+8). Languages: Chinese and English.')])
            else:story.extend(walk(sec))
        story.extend([paragraph('Official reference links','h3')]+[paragraph(label+': '+url,'small') for label,url in [
            ('EU machinery regulation','https://eur-lex.europa.eu/eli/reg/2023/1230/oj'),
            ('Great Britain machinery guidance','https://www.gov.uk/government/publications/supply-of-machinery-safety-regulations-2008/supply-of-machinery-safety-regulations-2008-great-britain'),
            ('CISG resources','https://uncitral.un.org/en/texts/salegoods/conventions/sale_of_goods/cisg')]])
    else:
        main=tree.xpath('//main')[0]
        for el in main:
            if el.tag=='h1' or 'service-kicker' in el.get('class',''):continue
            story.extend(walk(el))
    target=OUT/name
    doc=SimpleDocTemplate(str(target),pagesize=A4,leftMargin=45,rightMargin=45,topMargin=44,bottomMargin=53,title='YUANWANG - '+title,author='Beijing Yuanwang Hot Spring Design',allowSplitting=1)
    doc.build(story,onFirstPage=footer,onLaterPages=footer)
    print(target.name,target.stat().st_size)
