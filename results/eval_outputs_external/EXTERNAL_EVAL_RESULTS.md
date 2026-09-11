# External evaluation (MIMIC + NHAMCS)

## nhamcs
- source: NHAMCS 2018-22 (processed)
- N retained: 12000
- support: `{'N_L1': 175, 'N_L2': 1775, 'N_L3': 6104, 'N_L4': 3451, 'N_L5': 495}`

## mimic_demo
- source: MIMIC-IV-ED (demo)
- N retained: 207
- support: `{'N_L1': 18, 'N_L2': 97, 'N_L3': 90, 'N_L4': 2, 'N_L5': 0}`

- **Baseline / nhamcs**: acc=0.4760, macroF1=0.2882, colour_acc=0.4995, under=0.2839, over=0.2401, L1_recall=0.0800 (support=175)
- **Oversample / nhamcs**: acc=0.3045, macroF1=0.2146, colour_acc=0.3422, under=0.3903, over=0.3052, L1_recall=0.2171 (support=175)
- **Baseline / mimic_demo**: acc=0.3043, macroF1=0.1748, colour_acc=0.3043, under=0.6377, over=0.0580, L1_recall=0.1111 (support=18)
- **Oversample / mimic_demo**: acc=0.2126, macroF1=0.1781, colour_acc=0.2126, under=0.6087, over=0.1787, L1_recall=0.5000 (support=18)
