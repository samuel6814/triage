#!/usr/bin/env python3
"""
ED transshipment LP — minimize total wait cost.
Skewed Community Hospital arrival mix: 50 / 150 / 300 / 500.
"""

from __future__ import annotations

import json
from pathlib import Path

import numpy as np
from scipy.optimize import linprog

ROOT = Path(__file__).resolve().parent.parent
OUT_JSON = ROOT / "analysis" / "transshipment_results.json"

# Sources: critical, very_urgent, urgent, non_urgent (L4+L5)
SUPPLIES = {1: 50.0, 2: 150.0, 3: 300.0, 4: 500.0}
# Destinations: resuscitation, majors, OPD
DEMANDS = {7: 50.0, 8: 450.0, 9: 500.0}


def build_lp(chatbot_active: bool) -> tuple[float, dict[tuple[int, int], float]]:
    if chatbot_active:
        arcs = [
            (1, 5, 1), (2, 5, 1), (3, 5, 2), (4, 5, 0.5),
            (1, 6, 4), (2, 6, 3), (3, 6, 3), (4, 6, 12),
            (5, 7, 2), (5, 8, 3), (5, 9, 1),
            (6, 7, 3), (6, 8, 4), (6, 9, 5),
            (1, 7, 4), (2, 8, 5), (3, 8, 4),
        ]
    else:
        arcs = [
            (1, 6, 3), (2, 6, 3), (3, 6, 3), (4, 6, 5),
            (6, 7, 3), (6, 8, 4), (6, 9, 8),
            (1, 7, 4), (2, 8, 5), (3, 8, 4),
            (4, 8, 3),
        ]

    n = len(arcs)
    c = np.array([a[2] for a in arcs])
    all_nodes = sorted(set(SUPPLIES) | set(DEMANDS) | ({5, 6} if chatbot_active else {6}))

    A_eq_rows = []
    b_eq = []
    for node in all_nodes:
        row = np.zeros(n)
        for j, (i, k, _) in enumerate(arcs):
            if i == node:
                row[j] -= 1
            if k == node:
                row[j] += 1
        if node in SUPPLIES:
            b_eq.append(-SUPPLIES[node])
        elif node in DEMANDS:
            b_eq.append(DEMANDS[node])
        else:
            b_eq.append(0.0)
        A_eq_rows.append(row)

    res = linprog(c, A_eq=np.array(A_eq_rows), b_eq=np.array(b_eq), bounds=[(0, None)] * n, method="highs")
    if not res.success:
        raise RuntimeError(f"LP failed: {res.message}")

    flows = {(arcs[i][0], arcs[i][1]): float(res.x[i]) for i in range(n)}
    return float(res.fun), flows


def main() -> None:
    cost_without, flow_without = build_lp(chatbot_active=False)
    cost_with, flow_with = build_lp(chatbot_active=True)

    acute_w = 450 + int(flow_without.get((4, 8), 0))  # L1-L3 + Green misrouted
    acute_c = int(round(
        sum(v for (i, j), v in flow_with.items() if j in (7, 8))
    ))

    result = {
        "cost_without": cost_without,
        "cost_with": cost_with,
        "cost_reduction_pct": 100 * (cost_without - cost_with) / cost_without,
        "acute_load_without_chatbot": acute_w,
        "acute_load_with_chatbot": acute_c,
        "acute_reduction_pct": 100 * (acute_w - acute_c) / acute_w if acute_w else 0,
        "supplies": SUPPLIES,
        "demands": DEMANDS,
        "flow_with_chatbot": {f"{i}->{j}": round(v, 1) for (i, j), v in flow_with.items() if v > 0.5},
        "flow_without_chatbot": {f"{i}->{j}": round(v, 1) for (i, j), v in flow_without.items() if v > 0.5},
    }

    OUT_JSON.parent.mkdir(parents=True, exist_ok=True)
    OUT_JSON.write_text(json.dumps(result, indent=2), encoding="utf-8")
    print(f"Without chatbot: cost={cost_without:.0f}, acute={acute_w}")
    print(f"With chatbot:    cost={cost_with:.0f}, acute={acute_c}")
    print(f"Wrote {OUT_JSON}")


if __name__ == "__main__":
    main()
