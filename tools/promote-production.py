#!/usr/bin/env python3
"""Apply the production domain and crawler metadata after generating pages."""
from pathlib import Path
import re
from xml.etree import ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
ORIGIN = 'https://www.yuanwangspa.com'
PREVIEW_ORIGIN = 'https://yuanwang-international-preview.onrender.com'
ROBOTS = re.compile(r'''<meta\b(?=[^>]*\bname\s*=\s*["']robots["'])[^>]*>''', re.I)
CANONICAL = re.compile(r'''<link\b(?=[^>]*\brel\s*=\s*["']canonical["'])[^>]*>''', re.I)
SOCIAL = re.compile(r'''<meta\b(?=[^>]*\b(?:property|name)\s*=\s*["'](?:og:|twitter:)[^"']*["'])[^>]*>''', re.I)
TITLE = re.compile(r'<title>(.*?)</title>', re.I | re.S)
DESC = re.compile(r'''<meta\b(?=[^>]*\bname\s*=\s*["']description["'])[^>]*\bcontent\s*=\s*"([^"]*)"''', re.I)
IMG = re.compile(r'''<img\b[^>]*\bsrc\s*=\s*["'](assets/[^"']+\.(?:jpe?g|png|webp))["']''', re.I)
DEFAULT_IMAGE = 'assets/projects/ruilin-05.jpg'
NOT_INDEXED = {'404.html'}


def social(text, url):
    title = TITLE.search(text)
    desc = DESC.search(text)
    img = IMG.search(text)
    title = title.group(1).strip() if title else 'YUANWANG'
    desc = desc.group(1) if desc else 'Hot spring design, spa engineering and geothermal systems by Beijing Yuanwang Hot Spring Design Group.'
    image = ORIGIN + '/' + (img.group(1) if img else DEFAULT_IMAGE)
    return (f'<meta property="og:type" content="website"><meta property="og:site_name" content="YUANWANG">'
            f'<meta property="og:title" content="{title}"><meta property="og:description" content="{desc}">'
            f'<meta property="og:url" content="{url}"><meta property="og:image" content="{image}">'
            f'<meta name="twitter:card" content="summary_large_image">')


def main():
    pages = sorted(ROOT.glob('*.html'))
    urls = []
    changed = 0
    for page in pages:
        old = page.read_text(encoding='utf-8')
        url = ORIGIN + ('/' if page.name == 'index.html' else '/' + page.name)
        text = old.replace(PREVIEW_ORIGIN, ORIGIN)
        text = ROBOTS.sub('', text)
        text = CANONICAL.sub('', text)
        text = SOCIAL.sub('', text)
        if page.name in NOT_INDEXED:
            metadata = '<meta name="robots" content="noindex">'
        else:
            metadata = f'<meta name="robots" content="index,follow"><link rel="canonical" href="{url}">' + social(text, url)
        text, count = re.subn(r'</head>', lambda _: metadata + '</head>', text, count=1, flags=re.I)
        if count != 1:
            raise ValueError(f'Expected one closing head in {page.name}')
        if text != old:
            page.write_text(text, encoding='utf-8')
            changed += 1
        if page.name not in NOT_INDEXED:
            urls.append(url)
    urls.append(ORIGIN + '/stavsjo/')

    namespace = 'http://www.sitemaps.org/schemas/sitemap/0.9'
    ET.register_namespace('', namespace)
    sitemap = ET.Element(f'{{{namespace}}}urlset')
    for url in urls:
        item = ET.SubElement(sitemap, f'{{{namespace}}}url')
        ET.SubElement(item, f'{{{namespace}}}loc').text = url
    ET.indent(sitemap, space='  ')
    ET.ElementTree(sitemap).write(ROOT / 'sitemap.xml', encoding='utf-8', xml_declaration=True)
    (ROOT / 'robots.txt').write_text('User-agent: *\nAllow: /\n\nSitemap: ' + ORIGIN + '/sitemap.xml\n', encoding='utf-8')
    print(f'Production metadata ready: {len(pages)} pages, {changed} updated; robots.txt and sitemap.xml generated.')


if __name__ == '__main__':
    main()
