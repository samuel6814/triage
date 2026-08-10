#!/usr/bin/env bash
# Download CC-licensed gap images for research-gap slides (Wikimedia Commons).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
GAPS="$ROOT/slides/figures/gaps"
mkdir -p "$GAPS"

download() {
  local out="$1" file="$2"
  local encoded
  encoded=$(python3 -c "import urllib.parse; print(urllib.parse.quote('''$file'''))")
  curl -fsSL -L -o "$out" "https://commons.wikimedia.org/wiki/Special:FilePath/${encoded}?width=320"
  echo "Saved $out"
}

download "$GAPS/ed-intake.jpg" "Emergency Waiting Room - Aberdeen Royal Infirmary.jpg"
download "$GAPS/gap-intake.jpg" "Doctor explains x-ray to patient.jpg"
download "$GAPS/gap-overcrowding.jpg" "HK SKD TKO 將軍澳 Tseung Kwan O 坑口道 Hang Hau Road n 寶寧道 Po Ning Road 將軍澳醫院 Tseung Kwan O Hospital 急症室 Accident amd emergency Department waiting room March 2026 N13P 08.jpg"
download "$GAPS/gap-constrained.jpg" "Evaluator reviews medical checklist 130925-Z-SF323-001.jpg"
download "$GAPS/gap-pathway.jpg" "Hospital corridor.jpg"
download "$GAPS/gap-safety.png" "Star_of_life2.svg"

echo "Done. See slides/figures/gaps/ATTRIBUTION.md for sources."
