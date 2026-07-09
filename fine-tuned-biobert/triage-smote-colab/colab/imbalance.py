"""Oversampling and optional embedding-space SMOTE."""

from __future__ import annotations

from typing import Optional

import numpy as np
import pandas as pd
from imblearn.over_sampling import RandomOverSampler, SMOTE
from sklearn.neighbors import NearestNeighbors

import config


def random_oversample(
    df: pd.DataFrame,
    target_counts: dict[int, int],
    level_col: str = "acuity_level",
    seed: int = config.RANDOM_SEED,
) -> pd.DataFrame:
    """
    Oversample each class up to target_counts[level] using random duplication.
    Classes not in target_counts keep their current size.
    """
    parts = []
    rng = np.random.default_rng(seed)

    for level, group in df.groupby(level_col):
        target = target_counts.get(int(level), len(group))
        if target <= len(group):
            parts.append(group)
            continue
        n_extra = target - len(group)
        extra_idx = rng.choice(group.index, size=n_extra, replace=True)
        extra = df.loc[extra_idx].copy()
        extra["is_oversampled"] = True
        g = group.copy()
        g["is_oversampled"] = False
        parts.append(pd.concat([g, extra], ignore_index=True))

    return pd.concat(parts, ignore_index=True)


def balance_dataset(
    df: pd.DataFrame,
    target_counts: Optional[dict[int, int]] = None,
) -> pd.DataFrame:
    """Apply random oversampling to meet TARGET_COUNTS."""
    target_counts = target_counts or config.TARGET_COUNTS
    return random_oversample(df, target_counts)


def embedding_smote_oversample(
    df: pd.DataFrame,
    embeddings: np.ndarray,
    target_counts: dict[int, int],
    k_neighbors: int = config.SMOTE_K_NEIGHBORS,
    seed: int = config.RANDOM_SEED,
) -> pd.DataFrame:
    """
    SMOTE on embedding vectors for minority classes; assign nearest real text.

    embeddings: shape (n_samples, hidden_dim), same row order as df
    """
    levels = df["acuity_level"].values
    unique_levels = sorted(df["acuity_level"].unique())

    # Build combined index list after per-class SMOTE
    result_rows = []
    emb_list = []

    for level in unique_levels:
        mask = levels == level
        idx = np.where(mask)[0]
        X = embeddings[idx]
        texts = df.iloc[idx]["text"].values
        labels = df.iloc[idx]["label"].values

        target = target_counts.get(int(level), len(idx))
        if target <= len(idx) or len(idx) < 2:
            for i in range(len(idx)):
                result_rows.append({
                    "text": texts[i],
                    "label": labels[i],
                    "acuity_level": level,
                    "is_smote": False,
                })
                emb_list.append(X[i])
            continue

        k = min(k_neighbors, len(idx) - 1)
        smote = SMOTE(
            sampling_strategy={0: target},
            k_neighbors=k,
            random_state=seed,
        )
        y_dummy = np.zeros(len(idx), dtype=int)
        X_res, _ = smote.fit_resample(X, y_dummy)

        # Map synthetic embeddings (beyond original count) to nearest real text
        n_orig = len(idx)
        nn = NearestNeighbors(n_neighbors=1, metric="cosine")
        nn.fit(X)

        for j in range(len(X_res)):
            if j < n_orig:
                text = texts[j]
                is_smote = False
            else:
                dist, ind = nn.kneighbors(X_res[j : j + 1])
                text = texts[ind[0, 0]]
                is_smote = True
            result_rows.append({
                "text": text,
                "label": labels[min(j, n_orig - 1)],
                "acuity_level": level,
                "is_smote": is_smote,
            })
            emb_list.append(X_res[j])

    return pd.DataFrame(result_rows)


def compute_class_weights(df: pd.DataFrame, label_col: str = "label") -> np.ndarray:
    """Inverse-frequency weights per sample for WeightedRandomSampler."""
    counts = df[label_col].value_counts().sort_index()
    weights_map = {lbl: 1.0 / cnt for lbl, cnt in counts.items()}
    return df[label_col].map(weights_map).values.astype(np.float64)
