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
        metadata = f'<meta name="robots" content="index,follow"><link rel="canonical" href="{url}">'
        text, count = re.subn(r'</head>', lambda _: metadata + '</head>', text, count=1, flags=re.I)
        if count != 1:
            raise ValueError(f'Expected one closing head in {page.name}')
        if text != old:
            page.write_text(text, encoding='utf-8')
            changed += 1
        urls.append(url)

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
