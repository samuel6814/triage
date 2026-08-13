#!/usr/bin/env python3
"""Compile thesis, project-framing, research-findings and copy into pdf-outputs/."""

from __future__ import annotations

import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def run_pdflatex(workdir: Path, tex: str, passes: int = 2) -> None:
    for _ in range(passes):
        r = subprocess.run(
            ["pdflatex", "-interaction=nonstopmode", "-halt-on-error", tex],
            cwd=workdir,
            capture_output=True,
            text=True,
        )
        if r.returncode != 0:
            print(r.stdout[-2000:], file=sys.stderr)
            print(r.stderr[-1000:], file=sys.stderr)
            raise SystemExit(f"pdflatex failed in {workdir} / {tex}")


def main() -> None:
    thesis_dir = ROOT / "thesis" / "first-draft"
    framing_dir = ROOT / "project-framing"
    findings_dir = ROOT / "research-findings"
    out = ROOT / "pdf-outputs"
    out.mkdir(exist_ok=True)

    # Thesis (bibtex cycle)
    run_pdflatex(thesis_dir, "My_thesis_template.tex", passes=1)
    subprocess.run(["bibtex", "My_thesis_template"], cwd=thesis_dir, check=False, capture_output=True)
    run_pdflatex(thesis_dir, "My_thesis_template.tex", passes=2)

    run_pdflatex(framing_dir, "project-framing.tex", passes=2)
    run_pdflatex(findings_dir, "research-findings.tex", passes=2)

    thesis_pdf = thesis_dir / "My_thesis_template.pdf"
    framing_pdf = framing_dir / "project-framing.pdf"
    findings_pdf = findings_dir / "research-findings.pdf"

    named = thesis_dir / "Hospital_Chatbot_Color_Coded_Clinical_Pathways.pdf"
    shutil.copy2(thesis_pdf, named)
    shutil.copy2(thesis_pdf, out / "01-thesis-first-draft.pdf")
    shutil.copy2(framing_pdf, out / "02-project-framing.pdf")
    shutil.copy2(findings_pdf, out / "03-research-findings.pdf")

    for p in sorted(out.glob("*.pdf")):
        print(f"{p.relative_to(ROOT)}  ({p.stat().st_size} bytes)")


if __name__ == "__main__":
    main()
