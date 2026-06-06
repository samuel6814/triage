
# BioBERT: Foundations, Mathematics, and How the Model Works

This document summarizes the theory behind **BioBERT** and the models it builds on, aligned with your project slides (`latex/deepdive-nlp/nlp.tex`) and integration notes.

---

## 1. Historical foundations (bottom-up)

| Era | Idea | Limitation for clinical text |
|-----|------|-------------------------------|
| **Bag-of-words / TF-IDF** | Count words | No word order; "not crushing chest pain" vs "crushing chest pain" |
| **Word2Vec / GloVe** (Mikolov et al., 2013) | Fixed vector per word type | **Static** — "bank" has one vector in river and finance contexts |
| **RNN / LSTM** | Sequential left-to-right context | Slow; hard to parallelize; weak long-range dependencies |
| **Attention (Bahdanau-style)** | Weight words by importance | Still often paired with RNNs |
| **Transformer** (Vaswani et al., 2017) | **Self-attention only** — full sequence in parallel | Needs large data; general English pre-training |
| **BERT** (Devlin et al., 2018) | **Bidirectional** encoder + MLM/NSP | Medical jargon under-represented |
| **BioBERT** (Lee et al., 2020) | BERT + **biomedical continual pre-training** | Still needs task-specific fine-tuning for triage |

---

## 2. Why attention matters in medicine

Standard pooling (mean/max over word vectors) treats every token equally. In triage, filler words ("I", "the") must weigh less than clinical cues ("crushing", "chest", "syncope").

**Additive attention (Deep Attention Model style):**

\[
a(i) = \frac{\exp(s(h_n^{(i)}; \theta))}{\sum_{j=1}^{l_n} \exp(s(h_n^{(j)}; \theta))}
\]

- \(a(i)\): normalized weight for token \(i\) (sums to 1 over the sequence)
- \(h_n^{(i)}\): hidden state (embedding) of token \(i\)
- \(s(\cdot;\theta)\): learned scoring function (small neural network)
- \(\theta\): trainable parameters

**Scaled dot-product attention (Transformer / BERT):**

\[
\text{Attention}(Q, K, V) = \text{softmax}\left(\frac{QK^\top}{\sqrt{d_k}}\right) V
\]

- **Query \(Q\)**: what this token is looking for  
- **Key \(K\)**: what this token advertises  
- **Value \(V\)**: semantic content passed forward  
- **\(QK^\top\)**: similarity between all pairs of positions  
- **\(\sqrt{d_k}\)**: scaling so softmax gradients stay stable  

**Multi-head attention** runs several attention operations in parallel so different heads can capture syntax, entities, and symptom relations.

---

## 3. Transformer architecture (BERT’s backbone)

- **Encoder–decoder** (original Transformer): encoder reads input; decoder generates output.  
- **BERT uses encoder-only** — goal is **understanding**, not open-ended generation.

Per layer \(l\):

**Step 1 — Self-attention + residual + layer norm:**

\[
Z^l = \text{LayerNorm}\left(H^{l-1} + \text{MultiHead}(H^{l-1}, H^{l-1}, H^{l-1})\right)
\]

**Step 2 — Feed-forward + residual + layer norm:**

\[
H^l = \text{LayerNorm}\left(Z^l + \text{FFN}(Z^l)\right)
\]

- **FFN**: two linear layers with GELU/ReLU — adds non-linearity per position.  
- **Residual connections** (\(+\,H^{l-1}\)) help deep networks train.  
- **LayerNorm** stabilizes activations across the batch.

**Input embedding** (before layer 1):

\[
E(\text{token}) = E_{\text{word}} + E_{\text{position}} + E_{\text{segment}}
\]

- \(E_{\text{word}}\): token identity (WordPiece subwords)  
- \(E_{\text{position}}\): position in sequence  
- \(E_{\text{segment}}\): sentence A vs B (for pair tasks)

Positional information can be **learned embeddings** (BERT) or **sin/cos encodings** (original Transformer).

---

## 4. How BERT works (pre-training)

**BERT** = *Bidirectional Encoder Representations from Transformers*.

### 4.1 Masked Language Modeling (MLM)

- Randomly mask ~15% of tokens.  
- Model predicts masked tokens using **left and right** context.  
- Forces true bidirectional representations (unlike left-to-right language models).

Example: *"The patient presented with severe \_\_\_\_ pain"* → predict masked word using full sentence.

### 4.2 Next Sentence Prediction (NSP)

- Input: sentence pair \((A, B)\).  
- Task: predict whether \(B\) follows \(A\).  
- Trains document-level coherence (useful for QA and relation tasks).

### 4.3 Fine-tuning

After pre-training on Wikipedia + BookCorpus, BERT is fine-tuned on **labeled** downstream tasks (classification, NER, QA) by adding a small task head on top of `[CLS]` or token outputs.

---

## 5. How BioBERT extends BERT

**Problem:** General English BERT underperforms on PubMed-style text (drug names, gene symbols, abbreviations, rare compound terms).

**Method (Lee et al., 2020):**

1. Start from **public BERT checkpoints** (same architecture).  
2. **Continual pre-training** on biomedical corpora (~23 days on GPUs in original work):  
   - **PubMed abstracts** (~4.5B words)  
   - **PubMed Central full text** (~13.5B words)  
3. Same MLM objective (and optionally NSP) on biomedical sentences.  
4. **Fine-tune** on task data: NER (e.g. disease, chemical), relation extraction, biomedical QA.

**Result:** Better F1 on biomedical NER/RE/QA than vanilla BERT — the vocabulary and contextual statistics match the clinical domain.

**Important:** BioBERT does **not** change the Transformer math; it changes **what the weights have seen during pre-training**.

---

## 6. BioBERT in your hospital chatbot (conceptual pipeline)

From your project notes and slides:

1. **Input** — patient free-text symptoms (SMS/chat).  
2. **Tokenization** — WordPiece splits rare terms (e.g. medical compounds).  
3. **BioBERT encoder** — multi-head self-attention → **contextual embeddings** per token.  
4. **NER / discriminator detection** — map tokens to clinical entities and SATS-style discriminators (e.g. central chest pain).  
5. **Optional PCA** — reduce embedding dimension before a classifier.  
6. **Fusion with non-NLP layers** — TEWS (deterministic vitals) and Bayesian override when text and vitals disagree.

BioBERT’s role is **Layer 1**: interpret unstructured language; it does **not** replace vital-sign arithmetic or safety overrides.

---

## 7. Mathematics used alongside BioBERT in your hybrid system

BioBERT handles **text**. Your full triage stack also uses:

### 7.1 TEWS (deterministic)

\[
\text{TEWS} = \sum_{k=1}^{n} w_k \cdot f_k(v_k)
\]

\(v_k\): vital signs; \(f_k\): scoring functions; \(w_k\): weights — maps to color pathways (Red / Orange / Yellow / Green).

### 7.2 Bayesian override (probabilistic)

\[
P(D \mid S) = \frac{P(S \mid D)\, P(D)}{P(S)}
\]

When symptoms strongly suggest serious disease but TEWS is low, a **clinical override** can upgrade priority.

These are **separate** from BioBERT’s internal attention but **combined** in your master classification logic.

---

## 8. Training vs inference (practical)

| Phase | What happens |
|-------|----------------|
| **Pre-training** | MLM on huge unlabeled text (expensive; done once by DMIS/NAVER) |
| **Fine-tuning** | Labeled hospital or biomedical data for NER/classification |
| **Inference** | Forward pass only — embeddings + classifier; no masking |

For a final-year prototype, you typically **download pre-trained BioBERT weights** and fine-tune on a small labeled set (or use embeddings + a shallow classifier), rather than pre-training from scratch.

---

## 9. Limitations (from literature and your notes)

- **Domain shift:** Performance drops on informal patient language vs PubMed abstracts — local fine-tuning on KATH-style messages helps.  
- **Not generative triage:** Use BioBERT as **encoder + classifier**, not free-text diagnosis generation (hallucination risk).  
- **Self-report bias:** Model cannot verify if symptoms are exaggerated or omitted.  
- **Missing vitals:** Text-only path must pair with TEWS/Bayesian when numbers are absent.

---

## 10. Data contracts and module interfaces

Full detail is in [`mathematics/biobert-mathematics.pdf`](mathematics/biobert-mathematics.pdf). Summary:

**Session state** \(\mathbf{S}_s = (X, \mathbf{D}, T, \mathbf{P}, C, \text{flags})\).

**Functions:** \(\mathbf{D} = f_{\text{NLP}}(X)\), \(T = f_{\text{TEWS}}(\mathbf{v})\), \(\mathbf{P} = f_{\text{Bayes}}(E)\), \(C = f_{\text{fusion}}(\mathbf{D}, T, \mathbf{P})\).

**Voice:** \(X = g_{\text{trans}}(g_{\text{ASR}}(\text{audio}))\) when language is Twi.

**Required data:** patient text/audio; SATS piecewise tables; discriminator list; Bayesian priors; optional BioBERT fine-tune labels; audit log of all scores.

**API sequence:** `/speech/recognize` → `/translate` → `/nlp/analyze` → `/triage/compute`.

---

## 11. Key references

See [`references.bib`](references.bib) and PDFs in [`papers/`](papers/).

| Model | Citation |
|-------|----------|
| Transformer | Vaswani et al., 2017 |
| BERT | Devlin et al., 2018 |
| BioBERT | Lee et al., 2020 |
| Deep attention triage | Gligorijevic et al., 2018 |
