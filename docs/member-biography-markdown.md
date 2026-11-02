# Member biography: DOCX → Markdown conventions

Member biographies are stored in the DB (`biography`, one value per locale) as Markdown.
The frontend renders them with the `markdown` pipe (`src/app/shared/pipes/markdown.pipe.ts`)
inside `.biography-text` on the member biography page.

## Conversion

1. Convert the document: `pandoc "<file>.docx" -t gfm --wrap=none -o bio.md`
   (or paste the text and ask Copilot to convert it).
2. Apply the rules below.
3. Paste the result into the DB `biography` field for the matching locale (`mk`, `sr`, `en`).
   Do one document per locale.

## Rules

### Headings
- The page already renders the name (`h1`) and "Biography" (`h2`).
  **Never use `#` or `##` in the biography.**
- Section titles → `###`.
- Sub-items inside a section (organisations, awards, etc.) → `####`.
- Do not use bold (`**`) inside headings.
- Keep the original wording and capitalisation of headings.

### Content to remove
- The document title and name, and the subtitle or tagline with the role.
  They are already shown from `fullName` and `role`.
- Repeated page headers and footers (for example "Name • Professional biography • date").
  These often split sentences and lists in the middle, so join the pieces back together.
- Page numbers, table of contents, and empty headings.

### Paragraphs and lists
- Separate paragraphs with one blank line.
- Bullet lists use `- ` (a dash and a space). Numbered lists use `1.`.
- Run-together items (several entries on one line, or items separated only by spacing or tabs)
  must become one list item per line.
- Date ranges use an en dash without spaces: `2010–2017`.
- Use `**bold**` only for lead-in labels (for example `**Founder and president.**`) and years in experience lists.
  Use `*italic*` sparingly.
- No HTML, no tables, no images, no inline styles.
  Tables should be rewritten as lists.

### Text
- Do not translate, paraphrase, shorten, or correct the content.
  Fix only obvious formatting problems.
- Preserve quotes (`„…“`) and special characters exactly.
- Ask the author if something is ambiguous (for example a list whose items cannot be told apart).

## Template

```markdown
Short intro line, if the document has one (optional).

### SECTION TITLE

Paragraph text.

#### Sub-item title

**Label.** Description.

### LIST SECTION

- Item one.
- Item two.

### EXPERIENCE

- **2010–now** – Company – role.
- **2001–2010** – Company – role.
```

## Checklist

- [ ] No `#` or `##` headings
- [ ] No title, name, tagline, or page footers left
- [ ] No sentence or list split in the middle
- [ ] One list item per line
- [ ] Text identical to the source
- [ ] Checked on the member page in each locale
