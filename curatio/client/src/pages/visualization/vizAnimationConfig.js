/** Global pacing for cinematic visualization (values < 1 = slower) */
export const VIZ_TIME_SCALE = 0.62;

/** Pause after timeline completes before auto-advance (ms) */
export const VIZ_DWELL_MS = 2800;

/** Default tween duration multiplier applied in scene helpers */
export const VIZ_DURATION = (seconds) => seconds / VIZ_TIME_SCALE;
