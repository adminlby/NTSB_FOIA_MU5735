from __future__ import annotations

import html
import json
import re
import sys
import time
from dataclasses import dataclass
from pathlib import Path
from urllib.parse import urljoin, urlparse
from urllib.request import Request, urlopen


BASE_URL = "https://mu5735-foia.com/"
DOCS_DIR = Path("MU5735_NTSB_Recorder_Report_CN")
EMAIL_DIR = DOCS_DIR / "email"
INDEX_MD = DOCS_DIR / "email-records.md"


@dataclass
class EmailRecord:
    title: str
    url: str
    slug: str
    pdf_name: str | None = None
    summary: str = ""
    body: str = ""


def fetch(url: str) -> bytes:
    request = Request(url, headers={"User-Agent": "NTSB_FOIA_MU5735 archive script"})
    with urlopen(request, timeout=60) as response:
        return response.read()


def clean_text(value: str) -> str:
    value = re.sub(r"<[^>]+>", " ", value)
    value = html.unescape(value)
    value = re.sub(r"\s+", " ", value)
    return value.strip()


def parse_email_links(index_html: str) -> list[EmailRecord]:
    records: list[EmailRecord] = []
    for href, text in re.findall(r'<a\s+href="([^"]*email/[^"]+)"[^>]*>(.*?)</a>', index_html, re.I | re.S):
        url = urljoin(BASE_URL, href)
        slug = Path(urlparse(url).path).name
        title = clean_text(text)
        records.append(EmailRecord(title=title, url=url, slug=slug))
    return records


def parse_pdf_url(detail_html: str, page_url: str) -> str | None:
    for href in re.findall(r'href="([^"]+\.pdf(?:\?[^"]*)?)"', detail_html, re.I):
        return urljoin(page_url, html.unescape(href))
    for src in re.findall(r'(?:src|data)="([^"]+\.pdf(?:\?[^"]*)?)"', detail_html, re.I):
        return urljoin(page_url, html.unescape(src))
    return None


def parse_summary(detail_html: str) -> str:
    meta = re.search(r'<meta\s+name="description"\s+content="([^"]+)"', detail_html, re.I)
    if meta:
        return html.unescape(meta.group(1)).strip()
    schema = re.search(r'"description"\s*:\s*"((?:\\"|[^"])*)"', detail_html)
    if schema:
        return html.unescape(schema.group(1).replace('\\"', '"')).strip()
    for heading in ("摘要", "Summary"):
        match = re.search(rf"<(?:h2|h3)[^>]*>\s*{heading}\s*</(?:h2|h3)>\s*(.*?)(?:<h[23][^>]*>|</main>|$)", detail_html, re.I | re.S)
        if match:
            return clean_text(match.group(1))
    paragraphs = [clean_text(p) for p in re.findall(r"<p[^>]*>(.*?)</p>", detail_html, re.I | re.S)]
    paragraphs = [p for p in paragraphs if p]
    return paragraphs[0] if paragraphs else ""


def parse_body(detail_html: str) -> str:
    props = re.search(r'<astro-island[^>]+component-export="default"[^>]+props="([^"]+)"', detail_html, re.I | re.S)
    if props:
        try:
            data = json.loads(html.unescape(props.group(1)))
            zh = data.get("zh")
            if isinstance(zh, list) and len(zh) > 1 and isinstance(zh[1], str):
                return zh[1].strip()
            en = data.get("en")
            if isinstance(en, list) and len(en) > 1 and isinstance(en[1], str):
                return en[1].strip()
        except json.JSONDecodeError:
            pass
    paragraphs = re.findall(r'<p class="[^"]*whitespace-pre-wrap[^"]*"[^>]*>(.*?)</p>', detail_html, re.I | re.S)
    return "\n\n".join(clean_text(paragraph) for paragraph in paragraphs if clean_text(paragraph))


def write_index(records: list[EmailRecord]) -> None:
    lines = [
        "# 电子邮件记录",
        "",
        "本页整理 `mu5735-foia.com` 邮件区列出的 59 封邮件。站点说明称，这些“每封邮件”由 AI 从 NTSB FOIA 合并 PDF 中自动切分、OCR、翻译和摘要，并非 NTSB 原始释放单位；严肃引用仍应以 NTSB 原始 FOIA PDF 为准。",
        "",
        f"- 来源：[{BASE_URL}]({BASE_URL})",
        "- 本地 PDF：`email/`",
        "",
        "| 日期/发件人/主题 | 本地 PDF | 来源页面 |",
        "| --- | --- | --- |",
    ]
    for record in records:
        pdf = f"[{record.pdf_name}](email/{record.pdf_name})" if record.pdf_name else "未找到"
        lines.append(f"| {record.title} | {pdf} | [来源]({record.url}) |")
    lines.append("")
    lines.append("## 摘要")
    lines.append("")
    for record in records:
        lines.append(f"### {record.title}")
        lines.append("")
        if record.pdf_name:
            lines.append(f"- PDF：[`email/{record.pdf_name}`](email/{record.pdf_name})")
        lines.append(f"- 来源：[{record.slug}]({record.url})")
        if record.summary:
            lines.append("")
            lines.append(record.summary)
        if getattr(record, "body", ""):
            lines.append("")
            lines.append("??? note \"页面正文/中文 OCR\"")
            lines.append("")
            for paragraph in record.body.splitlines():
                paragraph = paragraph.strip()
                if paragraph:
                    lines.append(f"    {paragraph}")
                else:
                    lines.append("")
            lines.append("")
        lines.append("")
    lines.append("")
    INDEX_MD.write_text("\n".join(lines), encoding="utf-8")


def main() -> int:
    EMAIL_DIR.mkdir(parents=True, exist_ok=True)
    index_html = fetch(BASE_URL).decode("utf-8", errors="replace")
    records = parse_email_links(index_html)
    if not records:
        print("No email records found.", file=sys.stderr)
        return 1

    for index, record in enumerate(records, start=1):
        detail = fetch(record.url).decode("utf-8", errors="replace")
        pdf_url = parse_pdf_url(detail, record.url)
        record.summary = parse_summary(detail)
        record.body = parse_body(detail)
        if pdf_url:
            pdf_name = f"{index:02d}-{record.slug}.pdf"
            target = EMAIL_DIR / pdf_name
            if not target.exists() or target.stat().st_size == 0:
                target.write_bytes(fetch(pdf_url))
            record.pdf_name = pdf_name
        print(f"{index:02d}/{len(records)} {record.slug} {'pdf' if record.pdf_name else 'no-pdf'}")
        time.sleep(0.15)

    write_index(records)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
