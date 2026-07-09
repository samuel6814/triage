#!/usr/bin/env python3
"""De-identify chief complaint text before SMOTE fine-tuning."""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

import pandas as pd

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_TRAIN_CSV = ROOT / "train.csv"
DEFAULT_COMPLAINTS_CSV = ROOT / "chief_complaints.csv"
DEFAULT_OUTPUT = ROOT / "chief_complaints_deidentified.csv"


def _import_deidentify():
    ml_dir = ROOT.parent / "curatio" / "server" / "ml"
    if str(ml_dir) not in sys.path:
        sys.path.insert(0, str(ml_dir))

    import os

    os.environ.setdefault("OPENMED_ENABLED", "true")

    from openmed_enrich import deidentify_text

    return deidentify_text


def deidentify_complaints(
    complaints_csv: Path,
    output_csv: Path,
    method: str = "replace",
    limit: int | None = None,
) -> pd.DataFrame:
    deidentify_text = _import_deidentify()

    df = pd.read_csv(complaints_csv)
    if "chief_complaint_raw" not in df.columns:
        raise ValueError("complaints CSV must include chief_complaint_raw column")

    rows = df.head(limit) if limit else df
    safe_texts: list[str] = []
    entity_counts: list[int] = []

    total = len(rows)
    for i, text in enumerate(rows["chief_complaint_raw"].astype(str), start=1):
        if not text.strip():
            safe_texts.append(text)
            entity_counts.append(0)
            continue
        result = deidentify_text(text, method=method)
        safe_texts.append(result["deidentified_text"])
        entity_counts.append(result["entity_count"])
        if i % 100 == 0 or i == total:
            print(f"  De-identified {i:,}/{total:,} rows")

    out = rows.copy()
    out["chief_complaint_deidentified"] = safe_texts
    out["pii_entity_count"] = entity_counts
    out.to_csv(output_csv, index=False)
    return out


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--train-csv", type=Path, default=DEFAULT_TRAIN_CSV)
    parser.add_argument("--complaints-csv", type=Path, default=DEFAULT_COMPLAINTS_CSV)
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT)
    parser.add_argument("--method", choices=["mask", "replace", "hash", "shift_dates"], default="replace")
    parser.add_argument("--limit", type=int, default=None, help="Process first N rows only (smoke test)")
    args = parser.parse_args()

    if not args.complaints_csv.exists():
        print(f"ERROR: Missing {args.complaints_csv}", file=sys.stderr)
        return 1

    print(f"De-identifying {args.complaints_csv} -> {args.output} (method={args.method})")
    out = deidentify_complaints(args.complaints_csv, args.output, method=args.method, limit=args.limit)
    print(f"Wrote {len(out):,} rows to {args.output}")

    if args.train_csv.exists():
        merged = pd.merge(
            pd.read_csv(args.train_csv)[["patient_id", "triage_acuity"]],
            out[["patient_id", "chief_complaint_deidentified", "pii_entity_count"]],
            on="patient_id",
        )
        audit_path = args.output.with_name("deidentified_merge_audit.csv")
        merged.to_csv(audit_path, index=False)
        print(f"Wrote merge audit ({len(merged):,} labeled rows) to {audit_path}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
