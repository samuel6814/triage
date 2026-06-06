# BioBERT — Reference Library

Curated materials for **BioBERT**, its **foundations** (Transformers, BERT, attention), **mathematics**, and **clinical NLP / triage** context for the Hospital Chatbot project.

## Folder layout

```
biobert/
├── README.md              ← you are here
├── foundations.md         ← how the model works + key equations
├── references.bib         ← BibTeX for core citations
├── mathematics/           ← Beamer: full math spec + data contracts + interfaces (~52 slides)
├── integration/           ← Beamer: clinical narrative and system walkthrough
├── papers/                ← PDFs (downloaded + links to project papers)
├── slides/                ← compiled deep-dive presentation PDFs
└── latex/                 ← LaTeX source (deepdive-nlp deck)
```

## Core papers (in `papers/`)

| File | What it is |
|------|------------|
| `Lee2020-BioBERT-arxiv.pdf` | **BioBERT** — biomedical pre-training on PubMed/PMC (Lee et al., 2020) |
| `Devlin2018-BERT-arxiv.pdf` | **BERT** — bidirectional encoder pre-training (Devlin et al., 2018) |
| `Vaswani2017-Attention-is-All-You-Need-arxiv.pdf` | **Transformer** — scaled dot-product attention (Vaswani et al., 2017) |
| `Gligorijevic2018-Deep-Attention-Triage-arxiv.pdf` | **Deep attention for ED triage** — clinical use of attention weights |
| `deep attention nlp.pdf` | Local copy (project library) — same triage attention line of work |
| `journal.pone.0279953.pdf` | Narrative review: NLP at emergency department triage |
| `performance_of_emergency_triage_prediction_of_an.4.pdf` | NLP/chatbot performance in emergency triage scenarios |
| `natural language processing, a historical review.pdf` | NLP history and concepts |
| `project-nlp-integration-notes.txt` | Your project notes on BioBERT + TEWS + Bayesian stack |

See [`papers/README.md`](papers/README.md) for the full list and optional further reading.

## Your project content

| Resource | Location |
|----------|----------|
| **Mathematical specification (canonical)** | [`mathematics/biobert-mathematics.pdf`](mathematics/biobert-mathematics.pdf) — equations, data, APIs, fusion |
| Hybrid system narrative deck | [`integration/hybrid-triage-system.pdf`](integration/hybrid-triage-system.pdf) — clinical flow and scenarios |
| Full slide deck (BioBERT + math) | [`slides/nlp-deep-dive.pdf`](slides/nlp-deep-dive.pdf) |
| LaTeX source | [`latex/deepdive-nlp/nlp.tex`](latex/deepdive-nlp/nlp.tex) |
| Written foundations (equations explained) | [`foundations.md`](foundations.md) |

## Reading order (suggested)

1. `foundations.md` — conceptual map and equations  
2. `mathematics/biobert-mathematics.pdf` — **full technical spec** (math, data, module interfaces)  
3. `integration/hybrid-triage-system.pdf` — narrative: how layers + voice fit together  
4. `Vaswani2017-Attention-is-All-You-Need-arxiv.pdf` — attention mechanism  
5. `Devlin2018-BERT-arxiv.pdf` — MLM, NSP, encoder stack  
6. `Lee2020-BioBERT-arxiv.pdf` — domain adaptation to biomedicine  
7. `Gligorijevic2018-Deep-Attention-Triage-arxiv.pdf` — attention applied to triage text  

## Official resources (online)

- BioBERT code & weights: [github.com/dmis-lab/biobert](https://github.com/dmis-lab/biobert)  
- Pre-trained checkpoints: [github.com/naver/biobert-pretrained](https://github.com/naver/biobert-pretrained)  
