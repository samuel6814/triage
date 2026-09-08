# Chapter 2 Guide

Handbook for writing the thesis literature review (Chapter 2) and related presentation slides.

## Primary output (PDF)

| File | Use when |
|------|----------|
| [chapter2-guide.pdf](chapter2-guide.pdf) | Read or print the full handbook |
| [chapter2-guide.tex](chapter2-guide.tex) | Edit the LaTeX source |
| [Makefile](Makefile) | Rebuild: `cd guide && make` |

## Optional Markdown mirror

| File | Use when |
|------|----------|
| [chapter2-guide.md](chapter2-guide.md) | Quick edit in Markdown (keep in sync with `chapter2-guide.tex` if you change content) |

## Suggested order of use

1. **Search** — build keywords, run searches, keep a search log.
2. **Notes** — one note card per paper (claim, method, finding, limit, use-for-gap).
3. **Outline** — organise by theme, not by author list.
4. **Draft** — write synthesis paragraphs (evidence + so-what).
5. **Gap** — state what is missing and how your work responds.
6. **Revise** — run the checklists at the end of the handbook.

The handbook is general academic craft. The mini worked outline is a domain-agnostic template you fill with your own themes (it does not replace Chapter 2 itself).

## Build

```bash
cd guide
make
```

Requires `pdflatex` and the usual packages (`tcolorbox`, `booktabs`, `hyperref`, `listings`, etc.).
