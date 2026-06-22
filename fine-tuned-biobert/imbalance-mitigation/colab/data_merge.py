"""Merge Triagegeist CSVs and encode labels."""

from __future__ import annotations

import pandas as pd
from sklearn.model_selection import train_test_split

import config


def merge_and_encode(
    train_csv: str,
    complaints_csv: str,
    text_column: str = config.TEXT_COLUMN,
    label_column: str = config.LABEL_COLUMN,
) -> pd.DataFrame:
    """Inner join on patient_id; return DataFrame with text, label, acuity_level."""
    train_df = pd.read_csv(train_csv)
    complaints_df = pd.read_csv(complaints_csv)
    df = pd.merge(train_df, complaints_df, on="patient_id")

    df = df.dropna(subset=[text_column, label_column])
    df[text_column] = df[text_column].astype(str)

    df[label_column] = df[label_column].astype("category")
    categories = list(df[label_column].cat.categories)
    label_mapping = dict(enumerate(categories))
    df["label"] = df[label_column].cat.codes
    df["acuity_level"] = df[label_column].astype(int)

    config.LABEL_TO_ACUITY = {k: int(v) for k, v in label_mapping.items()}
    config.ACUITY_TO_LABEL = {int(v): k for k, v in label_mapping.items()}

    return df.rename(columns={text_column: "text"})[
        ["text", "label", "acuity_level"]
    ].reset_index(drop=True)


def stratified_split(
    df: pd.DataFrame,
    test_size: float = config.TEST_SIZE,
    seed: int = config.RANDOM_SEED,
) -> tuple[pd.DataFrame, pd.DataFrame]:
    """90/10 stratified split on label codes."""
    train_df, val_df = train_test_split(
        df,
        test_size=test_size,
        random_state=seed,
        stratify=df["label"],
    )
    return train_df.reset_index(drop=True), val_df.reset_index(drop=True)


def class_distribution(df: pd.DataFrame, label_col: str = "acuity_level") -> pd.Series:
    """Count rows per acuity level."""
    return df[label_col].value_counts().sort_index()


def print_distribution(df: pd.DataFrame, title: str) -> None:
    """Print class counts and percentages."""
    counts = class_distribution(df)
    total = len(df)
    print(f"\n=== {title} (n={total:,}) ===")
    for level, count in counts.items():
        pct = 100.0 * count / total
        print(f"  Level {level}: {count:>6,}  ({pct:5.1f}%)")
