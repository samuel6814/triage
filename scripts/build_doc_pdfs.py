#!/usr/bin/env python3
"""Concatenate markdown files into a pdflatex article and compile to PDF."""

from __future__ import annotations

import re
import shutil
import subprocess
import sys
from pathlib import Path


def esc(text: str) -> str:
    repl = {
        "\\": r"\textbackslash{}",
        "&": r"\&",
        "%": r"\%",
        "$": r"\$",
        "#": r"\#",
        "_": r"\_",
        "{": r"\{",
        "}": r"\}",
        "~": r"\textasciitilde{}",
        "^": r"\textasciicircum{}",
    }
    return "".join(repl.get(ch, ch) for ch in text)


def ascii_safe(text: str) -> str:
    repl = {
        "→": r"$\rightarrow$",
        "←": r"$\leftarrow$",
        "↔": r"$\leftrightarrow$",
        "…": "...",
        "–": "-",
        "—": "---",
        "‘": "'",
        "’": "'",
        "“": '"',
        "”": '"',
        "∈": r"$\in$",
        "≤": r"$\leq$",
        "≥": r"$\geq$",
        "×": r"$\times$",
        "·": r"$\cdot$",
        "ĉ": r"$\hat{c}$",
        "≈": r"$\approx$",
        "≠": r"$\neq$",
        "⊂": r"$\subset$",
        "∘": r"$\circ$",
        "τ": r"$\tau$",
        "\u00a0": " ",
    }
    for k, v in repl.items():
        text = text.replace(k, v)
    # drop other non-ascii that would break pdflatex latin1/utf8 inputenc without unicode-math
    cleaned = []
    for ch in text:
        if ord(ch) < 128:
            cleaned.append(ch)
        elif ch in "áéíóúàèìòùäëïöüñçÁÉÍÓÚ":
            cleaned.append(ch)
        else:
            cleaned.append("?")
    return "".join(cleaned)


def inline(text: str) -> str:
    text = ascii_safe(text)
    # [label](url) → label
    text = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", text)

    math_slots: list[str] = []

    def stash_math(m: re.Match[str]) -> str:
        math_slots.append(m.group(0))
        return f"@@MATH{len(math_slots) - 1}@@"

    text = re.sub(r"\\\((.+?)\\\)", stash_math, text)
    text = re.sub(r"\\\[(.+?)\\\]", stash_math, text)

    text = re.sub(r"`([^`]+)`", lambda m: r"\texttt{" + esc(m.group(1)) + "}", text)
    text = re.sub(r"\*\*([^*]+)\*\*", lambda m: r"\textbf{" + esc(m.group(1)) + "}", text)
    text = re.sub(r"(?<!\*)\*([^*]+)\*(?!\*)", lambda m: r"\textit{" + esc(m.group(1)) + "}", text)

    parts = re.split(r"(\\(?:texttt|textbf|textit)\{[^}]*\}|@@MATH\d+@@)", text)
    result = []
    for p in parts:
        m = re.fullmatch(r"@@MATH(\d+)@@", p or "")
        if m:
            raw = math_slots[int(m.group(1))]
            if raw.startswith(r"\("):
                result.append("$" + raw[2:-2] + "$")
            else:
                result.append(raw)
        elif p.startswith(r"\texttt") or p.startswith(r"\textbf") or p.startswith(r"\textit"):
            result.append(p)
        else:
            result.append(esc(p))
    return "".join(result)


def md_to_latex(md: str) -> str:
    lines = md.splitlines()
    out: list[str] = []
    i = 0
    in_code = False
    in_ul = False
    in_ol = False
    table_rows: list[list[str]] = []

    def close_lists() -> None:
        nonlocal in_ul, in_ol
        if in_ul:
            out.append(r"\end{itemize}")
            in_ul = False
        if in_ol:
            out.append(r"\end{enumerate}")
            in_ol = False

    def flush_table() -> None:
        nonlocal table_rows
        if not table_rows:
            return
        cols = max(len(r) for r in table_rows)
        body = [
            r
            for r in table_rows
            if not all(re.match(r"^:?-+:?$", c.strip()) for c in r)
        ]
        table_rows = []
        if not body:
            return
        # p-columns avoid optional-arg clashes with [ in cells
        spec = "".join([f"p{{{12/cols:.2f}cm}}" for _ in range(cols)])
        out.append(r"\begin{tabular}{" + spec + "}")
        out.append(r"\hline")
        for ri, row in enumerate(body):
            cells = [inline(c.strip()) for c in row]
            while len(cells) < cols:
                cells.append("")
            out.append(" & ".join(cells) + r" \tabularnewline")
            if ri == 0:
                out.append(r"\hline")
        out.append(r"\hline")
        out.append(r"\end{tabular}")
        out.append("")

    while i < len(lines):
        line = lines[i]
        if line.strip().startswith("```"):
            close_lists()
            flush_table()
            if not in_code:
                in_code = True
                out.append(r"\begin{verbatim}")
            else:
                in_code = False
                out.append(r"\end{verbatim}")
            i += 1
            continue
        if in_code:
            safe = ascii_safe(line).replace("\t", "    ")
            # verbatim cannot contain TeX math from ascii_safe — flatten
            safe = re.sub(r"\$\\?[a-zA-Z]+\$", lambda m: m.group(0).strip("$").replace("\\", ""), safe)
            safe = safe.replace("$\\rightarrow$", "->").replace("$\\in$", "in")
            safe = re.sub(r"\$[^$]+\$", "?", safe)
            out.append(safe)
            i += 1
            continue

        if "|" in line and line.strip().startswith("|"):
            close_lists()
            cells = [c.strip() for c in line.strip().strip("|").split("|")]
            table_rows.append(cells)
            i += 1
            if i >= len(lines) or not (lines[i].strip().startswith("|")):
                flush_table()
            continue

        flush_table()

        if not line.strip():
            close_lists()
            out.append("")
            i += 1
            continue

        # Longer heading markers first
        if line.startswith("### "):
            close_lists()
            out.append(r"\subsubsection*{" + inline(line[4:].strip()) + "}")
        elif line.startswith("## "):
            close_lists()
            out.append(r"\subsection*{" + inline(line[3:].strip()) + "}")
        elif line.startswith("# "):
            close_lists()
            out.append(r"\section*{" + inline(line[2:].strip()) + "}")
        elif re.match(r"^[-*] ", line):
            if not in_ul:
                close_lists()
                out.append(r"\begin{itemize}")
                in_ul = True
            out.append(r"\item " + inline(line[2:].strip()))
        elif re.match(r"^\d+\. ", line):
            if not in_ol:
                close_lists()
                out.append(r"\begin{enumerate}")
                in_ol = True
            out.append(r"\item " + inline(re.sub(r"^\d+\.\s*", "", line)))
        elif line.strip() == "---":
            close_lists()
            out.append(r"\vspace{0.5em}\hrule\vspace{0.5em}")
        else:
            close_lists()
            out.append(inline(line))
            out.append("")
        i += 1

    close_lists()
    flush_table()
    return "\n".join(out)


def build(title: str, md_files: list[Path], out_pdf: Path) -> None:
    body_parts = []
    for f in md_files:
        body_parts.append(md_to_latex(f.read_text(encoding="utf-8")))
        body_parts.append(r"\clearpage")

    tex = rf"""\documentclass[11pt,a4paper]{{article}}
\usepackage[margin=1in]{{geometry}}
\usepackage[T1]{{fontenc}}
\usepackage[utf8]{{inputenc}}
\usepackage{{lmodern}}
\usepackage{{booktabs}}
\usepackage{{hyperref}}
\usepackage{{graphicx}}
\usepackage{{enumitem}}
\usepackage{{array}}
\setlist{{itemsep=0.25em}}
\title{{{esc(title)}}}
\author{{Hospital Chatbot for Color-Coded Clinical Pathways}}
\date{{\today}}
\begin{{document}}
\maketitle
{chr(10).join(body_parts)}
\end{{document}}
"""
    work = out_pdf.parent / "_build"
    work.mkdir(parents=True, exist_ok=True)
    # clean stale aux that can confuse reruns
    for stale in work.glob(out_pdf.stem + ".*"):
        if stale.suffix != ".tex":
            stale.unlink(missing_ok=True)
    tex_path = work / (out_pdf.stem + ".tex")
    tex_path.write_text(tex, encoding="utf-8")

    r = subprocess.run(
        ["timeout", "60", "pdflatex", "-interaction=nonstopmode", "-halt-on-error", tex_path.name],
        cwd=work,
        capture_output=True,
        text=True,
    )
    if r.returncode != 0:
        log_path = work / (out_pdf.stem + ".log")
        log = log_path.read_text(errors="replace") if log_path.exists() else r.stderr
        errs = [ln for ln in log.splitlines() if ln.startswith("!")]
        print("\n".join(errs[:30] or [log[-2000:]]), file=sys.stderr)
        raise SystemExit(f"pdflatex failed for {out_pdf.name} (code {r.returncode})")

    # second pass optional (no TOC)
    built = work / (out_pdf.stem + ".pdf")
    if not built.exists() or built.stat().st_size < 1000:
        raise SystemExit(f"PDF missing or too small: {built}")
    out_pdf.write_bytes(built.read_bytes())
    print(f"Wrote {out_pdf} ({out_pdf.stat().st_size} bytes)")


def main() -> None:
    root = Path(__file__).resolve().parents[1]
    framing = root / "project-framing"
    findings = root / "research-findings"
    thesis_pdf = root / "thesis" / "first-draft" / "My_thesis_template.pdf"
    outputs = root / "pdf-outputs"
    outputs.mkdir(exist_ok=True)

    framing_mds = [
        framing / "README.md",
        framing / "00-project-map.md",
        framing / "01-research-gaps.md",
        framing / "02-research-questions.md",
        framing / "03-pathways-design.md",
        framing / "04-mathematics-scope.md",
        framing / "05-thesis-outline.md",
        framing / "06-roadmap.md",
    ]
    findings_mds = [
        findings / "README.md",
        findings / "00-reading-list.md",
        findings / "01-sats-pathways-notes.md",
        findings / "02-nlp-triage-notes.md",
        findings / "03-green-tag-and-flow-notes.md",
        findings / "04-misc-findings.md",
    ]

    framing_pdf = framing / "project-framing.pdf"
    findings_pdf = findings / "research-findings.pdf"
    build(
        "Project Framing — Hospital Chatbot for Color-Coded Clinical Pathways",
        framing_mds,
        framing_pdf,
    )
    build(
        "Research Findings — Hospital Chatbot for Color-Coded Clinical Pathways",
        findings_mds,
        findings_pdf,
    )

    if not thesis_pdf.exists():
        raise SystemExit(f"Missing thesis PDF: {thesis_pdf}")

    thesis_named = (
        root
        / "thesis"
        / "first-draft"
        / "Hospital_Chatbot_Color_Coded_Clinical_Pathways.pdf"
    )
    shutil.copy2(thesis_pdf, thesis_named)
    shutil.copy2(thesis_pdf, outputs / "01-thesis-first-draft.pdf")
    shutil.copy2(framing_pdf, outputs / "02-project-framing.pdf")
    shutil.copy2(findings_pdf, outputs / "03-research-findings.pdf")

    print("Canonical outputs in pdf-outputs/:")
    for p in sorted(outputs.glob("*.pdf")):
        print(f"  {p} ({p.stat().st_size} bytes)")


if __name__ == "__main__":
    main()
