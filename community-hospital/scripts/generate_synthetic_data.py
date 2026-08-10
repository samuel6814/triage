#!/usr/bin/env python3
"""Generate skewed synthetic Community Hospital patient CSV (1000 rows)."""

from __future__ import annotations

import csv
import random
from pathlib import Path

SEED = 42
TOTAL = 1000

# ED-realistic skew: 5% / 15% / 30% / 25% / 25%
LEVEL_COUNTS = {1: 50, 2: 150, 3: 300, 4: 250, 5: 250}

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "data" / "community_hospital_patients.csv"

LOCATIONS = [
    "Kejetia", "Bantama", "Ejisu", "Sunyani", "Manhyia", "Tafo",
    "Asokwa", "Suame", "KATH", "Community Hospital",
]

SATS_BY_ACUITY = {1: "Red", 2: "Orange", 3: "Yellow", 4: "Green", 5: "Green"}

PATHWAYS = {
    1: ("Resuscitation bay", 0, "emergency"),
    2: ("Acute / high-dependency bed", 10, "emergency"),
    3: ("ED waiting / urgent stream", 60, "emergency"),
    4: ("OPD / Minors / Polyclinic", 240, "routine"),
    5: ("OPD / Minors / Polyclinic", 240, "follow_up"),
}

# Borderline wording (could sit on adjacent acuity levels)
BORDERLINE_TEMPLATES: dict[int, list[str]] = {
    2: [
        "Chest discomfort and tired since {loc}, not sure if emergency, breath a bit short when walking.",
        "Bad headache two days at {loc}, worse today, vomiting once but still talking fine.",
    ],
    3: [
        "Fever and body pain from {loc}, feel weak but can still walk, not sure if need emergency.",
        "Stomach pain since yesterday, moderate, came from {loc} polyclinic, nausea but no blood.",
    ],
    4: [
        "Cough and mild fever one week, tired from {loc}, wonder if need ED or can wait OPD.",
        "Ankle pain after football at {loc}, swollen, can limp, not sure if urgent.",
    ],
}

TEMPLATES: dict[int, list[str]] = {
    1: [
        "{who} collapse at {loc} market, not breathing proper, lips blue, family carry am here quick.",
        "They rush {who} from {loc} after road accident, blood plenty, {who} almost unconscious now.",
        "Seizure at home in {loc}, {who} convulsing, foam at mouth, cannot wake after it stop.",
        "{who} choke on food at chop bar near {loc}, cannot talk, clutching throat, turning blue.",
        "Snake bite at farm near {loc}, {who} dizzy, swelling fast, vomiting, weak pulse family say.",
        "Burn from kerosene fire at {loc}, {who} scream, skin peel off arm, shock and confusion.",
        "Baby from {loc}, not feeding, floppy, fever very high, mother run to emergency now.",
        "Chest pain and collapse at church in {loc}, {who} sweat cold, pulse weak, cannot stand.",
        "Gunshot wound at {loc}, bleeding won't stop, {who} pale and confused, need resuscitation.",
        "Drowning rescue from {loc}, {who} pulled from water, not responsive, breathing shallow.",
    ],
    2: [
        "Crushing central chest pain since {loc}, {who} sweat plenty, pain go left arm, breath short.",
        "Worst headache of life at {loc} market, thunderclap, neck stiff, vomiting, cannot bend head.",
        "Sudden chest and back pain at {loc}, like knife, doctor suspect dissection, sweating in cool room.",
        "Tension pneumothorax, rush from {loc}, chest tight like band, vomited twice in trotro.",
        "Meningococcal purpura, dark spots on skin since leaving {loc}, weak and confused.",
        "Severe shortness of breath at {loc}, cannot lie flat, gasping, lips tingling.",
        "Pregnant woman from {loc}, heavy vaginal bleeding, dizzy, cramping, soaked pad.",
        "Stroke symptoms at {loc}, face droop, slurred speech, weak one side since morning.",
        "Anaphylaxis after groundnut at {loc}, throat tight, rash spread, wheezing bad.",
        "Open fracture from fall at {loc}, bone show, pain 10/10, bleeding moderate.",
    ],
    3: [
        "High fever and rigors three days from {loc}, {who} weak, malaria RDT positive, vomiting.",
        "Severe abdominal pain since yesterday, {loc} polyclinic refer to ED, guarding and fever.",
        "Asthma attack at {loc}, inhaler finish, wheezing loud, can speak but breath tight.",
        "Deep cut at {loc} workshop, bleeding controlled but need suture and tetanus today.",
        "Painful rash with shingles on side, nausea and fever, walk from {loc} for review.",
        "Diarrhoea and dehydration, {loc} child cannot keep fluids, sunken eyes, still alert.",
        "Suspected appendicitis, pain move to right side, vomit twice, came from {loc}.",
        "Urinary retention painful, {loc} man cannot pass urine since morning, lower belly hard.",
        "Moderate head injury at {loc}, brief confusion, vomit once, now awake but headache.",
        "Sickle cell crisis from {loc}, bone pain severe, fever, known SS patient.",
    ],
    4: [
        "Mild rash on arm after farm near {loc}, itch but no fever, want nurse check today.",
        "Sore throat two days, swallow pain, fever on and off, walk from {loc} to OPD.",
        "Red eye since yesterday, scratchy, see fine, bought drops at {loc} pharmacy.",
        "Back pain one week, no trauma, can walk, want pain advice at {loc} clinic.",
        "Sprained ankle at {loc} football, swollen but can bear weight, need X-ray maybe.",
        "Ear pain three days, child from {loc}, pulling ear, no high fever.",
        "Mild burn from hot water, small blister, clean, mother from {loc} want dressing.",
        "Cough one week, no breathlessness, sleeping fine, came from {loc} for review.",
        "Request malaria test, fever mild, feel tired, from {loc}, not feeling emergency.",
        "Wound check, cut healing, small pain, farmer from {loc} want nurse look.",
    ],
    5: [
        "Family planning visit, no emergency, contraception advice after injection last year, from {loc}.",
        "Stitches removal only, doctor at {loc} sew cut last week, wound clean, no fever.",
        "Medication refill, hypertension tablets finish, stable, walk from {loc} for prescription.",
        "Follow-up BP check, nurse say come back, no new symptoms, live near {loc}.",
        "Health certificate for work, need medical form, no illness, from {loc}.",
        "Immunization for baby, routine visit, child well, mother from {loc}.",
        "Chronic review diabetes, sugars stable, no hypoglycaemia, appointment from {loc}.",
        "Suture removal request, small cut, pain small, travel from {loc} before farm work.",
        "Advice on skin cream, mild dryness, no rash spread, pharmacy at {loc} sent here.",
        "Administrative visit, transfer notes from {loc} clinic, no acute complaint today.",
    ],
}

WHO_PHRASES = [
    "I", "my husband", "my wife", "my mother", "my father", "my child",
    "my sister", "my brother", "the patient", "our neighbour",
]

# ~7% of rows get borderline templates
BORDERLINE_FRACTION = 0.07


def age_for_level(level: int, rng: random.Random) -> int:
    if level == 1:
        return rng.choice([*range(4, 12), *range(18, 65), *range(66, 78)])
    if level == 5:
        return rng.choice([*range(18, 45), *range(46, 70)])
    return rng.randint(4, 78)


def build_complaint(level: int, rng: random.Random, borderline: bool) -> tuple[str, str]:
    if borderline and level in BORDERLINE_TEMPLATES:
        template = rng.choice(BORDERLINE_TEMPLATES[level])
    else:
        template = rng.choice(TEMPLATES[level])
    loc = rng.choice(LOCATIONS)
    who = rng.choice(WHO_PHRASES)
    text = template.format(who=who, loc=loc)
    return text, loc


def main() -> None:
    rng = random.Random(SEED)
    rows: list[dict] = []
    pid = 1

    for level, count in LEVEL_COUNTS.items():
        dest, t_max, visit = PATHWAYS[level]
        colour = SATS_BY_ACUITY[level]
        n_borderline = max(1, int(count * BORDERLINE_FRACTION))
        borderline_indices = set(rng.sample(range(count), n_borderline))

        for i in range(count):
            sex = rng.choice(["Male", "Female"])
            age = age_for_level(level, rng)
            complaint, loc = build_complaint(level, rng, i in borderline_indices)
            rows.append(
                {
                    "patient_id": f"CH-{pid:04d}",
                    "sex": sex,
                    "age": age,
                    "chief_complaint": complaint,
                    "acuity_level": level,
                    "sats_colour": colour,
                    "pathway_destination": dest,
                    "t_max_minutes": t_max,
                    "visit_type": visit,
                    "location_mention": loc,
                    "ambiguity_flag": "true" if i in borderline_indices else "false",
                    "predicted_acuity": "",
                    "predicted_colour": "",
                    "pathway_correct": "",
                }
            )
            pid += 1

    rng.shuffle(rows)

    OUT.parent.mkdir(parents=True, exist_ok=True)
    fieldnames = list(rows[0].keys())
    with OUT.open("w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=fieldnames)
        w.writeheader()
        w.writerows(rows)

    print(f"Wrote {len(rows)} rows to {OUT}")
    for lv, n in LEVEL_COUNTS.items():
        print(f"  Level {lv}: {n}")


if __name__ == "__main__":
    main()
