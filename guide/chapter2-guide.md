# Chapter 2 Guide: How to Write a Literature Review

A practical handbook for undergraduate and postgraduate thesis work (especially **Chapter 2: Literature Review**). It follows established research-writing practice: a literature review is a **critical synthesis** that positions your study, not a list of paper summaries.

Use this guide before and while drafting a literature chapter or a short literature section in a presentation.

---

## Table of contents

1. [What a literature review is (and is not)](#1-what-a-literature-review-is-and-is-not)
2. [Purpose in a thesis or project](#2-purpose-in-a-thesis-or-project)
3. [Types of review](#3-types-of-review)
4. [Before writing: search and selection](#4-before-writing-search-and-selection)
5. [Reading workflow](#5-reading-workflow)
6. [Organisation patterns](#6-organisation-patterns)
7. [Summary vs synthesis](#7-summary-vs-synthesis)
8. [Critical appraisal](#8-critical-appraisal)
9. [Chapter and section architecture](#9-chapter-and-section-architecture)
10. [Academic voice and paragraph craft](#10-academic-voice-and-paragraph-craft)
11. [Citations and ethics](#11-citations-and-ethics)
12. [Writing the research gap](#12-writing-the-research-gap)
13. [Common mistakes checklist](#13-common-mistakes-checklist)
14. [Revision checklist](#14-revision-checklist)
15. [Mini worked outline (illustrative template)](#15-mini-worked-outline-illustrative-template)
16. [Quick templates (copy and fill)](#16-quick-templates-copy-and-fill)

---

## 1. What a literature review is (and is not)

### What it is

A literature review is a **structured argument** built from published work. You:

- map what is already known on your topic;
- group findings into **themes**;
- compare methods, settings, and limits;
- show where evidence is strong, weak, or missing;
- end with a **research gap** that your study addresses.

In research-writing terms (Hart, Ridley, and similar guides), the review **evaluates and organises** knowledge so the reader sees why your question is worth asking.

### What it is not

| Not this | Why it fails |
|----------|----------------|
| Annotated bibliography | Lists papers one by one with no argument |
| Paper dump | “Author A said… Author B said…” with no link |
| Background story only | Context without critique or gap |
| Copy of abstracts | Summary without your analytical voice |
| Proof that you read a lot | Volume without selection or synthesis |

**Test:** if you remove the citations, does a clear story about the field still remain? If not, you are listing, not reviewing.

---

## 2. Purpose in a thesis or project

In a final-year or MSc thesis, the literature review usually does five jobs:

1. **Situate the problem** — show the real-world or scientific issue exists and matters.
2. **Define key terms** — triage, acuity, pathway, embedding, Softmax, and so on, as used in your field.
3. **Survey prior approaches** — what others tried (clinical protocols, scores, NLP models).
4. **Justify your method** — why BioBERT, why a colour map, why a gate (by showing what prior work supports or lacks).
5. **Lead into objectives** — the gap must match what you claim you will do in the next chapter.

### Funnel (keep this picture)

```text
Broad context (hospital pressure, triage need)
        ↓
Specific strands (vitals scores; NLP; domain models)
        ↓
Limits and mismatches (setting, data, missing local routing)
        ↓
Research gap
        ↓
Bridge to methodology / objectives
```

Your presentation “Literature Review” slide and thesis Chapter 2 should follow the same funnel: context → strands → gap.

---

## 3. Types of review

Be honest about which type you are writing.

| Type | What it is | Typical for |
|------|------------|-------------|
| **Narrative (traditional)** | Thematic synthesis guided by your research question; search is structured but not always fully reproducible | Most BSc/MPhil thesis chapters |
| **Systematic** | Pre-registered question, strict inclusion/exclusion, exhaustive search, often PRISMA flow | Health / evidence reviews; rare as a full BSc chapter unless required |
| **Scoping** | Maps breadth of a field; less depth of appraisal | Early exploration of a wide topic |
| **Integrative** | Combines empirical and theoretical work into a new framework | Advanced conceptual chapters |

**For most mathematics / applied AI final-year projects:** write a **narrative thematic review**. Say (if asked) that you used structured keyword search and snowballing, not a full systematic review protocol.

Do not call your chapter “systematic” unless you followed systematic methods end to end.

---

## 4. Before writing: search and selection

Writing starts with **finding and filtering**, not with opening a blank chapter file.

### 4.1 Clarify the review question

Turn your topic into a searchable question, for example:

- How has free-text chief-complaint NLP been used for emergency or hospital triage?
- How do SATS and TEWS structure urgency and routing?
- What do Transformer / BioBERT models contribute to clinical text classification?

One project can have **several sub-questions**, one per theme section.

### 4.2 Build keyword sets

Make three columns:

| Concept A | Concept B | Concept C |
|-----------|-----------|-----------|
| triage, acuity, SATS, TEWS | chief complaint, NLP, text classification | BioBERT, BERT, attention, LMIC, Ghana, pathway |

Combine with AND / OR. Example:

`("chief complaint" OR "presenting complaint") AND (triage OR acuity) AND (NLP OR BERT OR BioBERT)`

### 4.3 Where to search

Use more than Google:

- Google Scholar
- PubMed / PMC (clinical and BioBERT lineage)
- IEEE Xplore / ACM (systems and NLP)
- Your university library databases
- Official manuals (e.g. SATS training manual) as **primary protocol sources**

### 4.4 Inclusion and exclusion (write them down)

Example rules:

**Include** if: English (or your working language); about triage, clinical pathways, or clinical NLP; peer-reviewed or recognised protocol/manual; relevant to text or vitals at intake.

**Exclude** if: pure imaging AI with no text path; opinion pieces with no method; duplicates; topics that never touch your gap.

### 4.5 Snowballing

From 3–5 **seed papers** (e.g. BioBERT; a triage NLP review; SATS manual; a local overcrowding/triage study):

- check **references** (backward);
- check **who cited them** (forward on Scholar).

### 4.6 Search log template

Keep a simple table (spreadsheet or notes):

| Date | Database | Query | Hits | Kept | Notes |
|------|----------|-------|------|------|-------|
| 2026-03-01 | Scholar | chief complaint NLP triage | 120 | 8 | Stewart review useful |

This proves your process if a supervisor asks “how did you find these?”

### 4.7 Stop rule

You stop searching when **new papers repeat the same themes** and no longer change your gap statement. Completeness matters more than an endless list.

---

## 5. Reading workflow

Do not read every paper at the same depth.

### Three passes

1. **Skim** — title, abstract, conclusion, figures. Keep / drop / maybe.
2. **Structure** — introduction, method, results, limits. Fill a note card.
3. **Critique** — what would fail if we applied this to *your* setting?

### Note card template (one paper = one card)

```text
Citation:
Year / venue:
Setting (country, hospital type):
Research question:
Method (data, model, vitals vs text):
Main finding (1–2 sentences):
Limitations (authors' + yours):
How I will use this (theme + gap role):
Quote worth paraphrasing (page):
```

### Filing notes by theme, not by author

Create folders or tags such as:

- overcrowding / SATS
- TEWS / vitals
- attention / BERT / BioBERT
- NLP triage systems
- pathways / routing

When you write, you open a **theme**, not an author alphabet.

---

## 6. Organisation patterns

| Pattern | How it works | When to use |
|---------|--------------|-------------|
| **Thematic** (preferred) | Sections = ideas (SATS; TEWS; BioBERT; NLP triage) | Almost always for thesis chapters |
| **Chronological** | Early work → recent work | History of one narrow idea |
| **Methodological** | Rule-based vs classical ML vs deep learning | Comparing technique families |

### Why theme beats author-by-author

**Weak:**

> Smith (2018) found X. Jones (2019) found Y. Lee (2020) proposed BioBERT.

**Stronger:**

> Clinical text models moved from bag-of-words classifiers to contextual encoders. BioBERT continues BERT pre-training on PubMed/PMC so biomedical terms cluster more usefully in embedding space (Lee et al., 2020). Triage applications of deep attention to chief complaints exist, but most use high-income corpora (Stewart et al., 2023; …).

The second version **tells a story** and uses authors as evidence.

---

## 7. Summary vs synthesis

### Summary (necessary but not enough)

Restates what one source says.

> Lee et al. (2020) introduced BioBERT by continuing BERT training on PubMed and PMC.

### Synthesis (what markers look for)

Connects sources, contrasts them, and points toward your problem.

> Vital-sign scores such as TEWS give an objective colour band once measurements exist, but they do not read free text (SATS manual). In parallel, NLP triage research classifies chief complaints with deep models, largely on high-income datasets (Stewart et al., 2023). What remains under-specified for Ghanaian intake is an examinable chain from English complaint text to SATS colour and local pathway routing.

### Side-by-side

| Summary only | Synthesis |
|--------------|-----------|
| Lists findings | Relates findings to each other |
| Neutral report | Takes an analytical position |
| Ends anywhere | Ends at a gap or tension |
| “X said” | “X and Y together imply…, but Z is missing” |

**Rule of thumb:** each paragraph should answer “so what for my project?” in the last sentence or two.

---

## 8. Critical appraisal

For every important source, ask:

1. **Setting** — high-income ED vs LMIC teaching hospital; can results transfer?
2. **Data** — size, language, label source (nurse acuity vs diagnosis)?
3. **Input** — text only, vitals only, or multimodal?
4. **Output** — diagnosis, disposition, acuity level, colour, pathway?
5. **Evaluation** — accuracy alone, or also recall on rare urgent classes, latency, clinical safety?
6. **Limits the authors admit** — and limits they ignore.
7. **Relevance to your gap** — supports method, supports problem, or shows what is still missing?

Write critique calmly. Prefer:

> Most published NLP triage systems target high-income corpora; local department routing is rarely formalised.

Avoid:

> These papers are useless / wrong.

---

## 9. Chapter and section architecture

### Typical thesis chapter shape

1. **Short opener** — what this chapter covers and how it links to the problem.
2. **Theme section 1** — broadest clinical or operational context.
3. **Theme section 2** — established hospital standard (e.g. vitals score).
4. **Theme section 3** — technical lineage (attention → BERT → domain model).
5. **Theme section 4** — applied NLP triage literature.
6. **Research gap** — explicit, matching objectives.
7. **Optional bridge sentence** — “The next chapter presents the method that addresses this gap.”

### Section length

Prefer **few focused sections** over many tiny ones. Each section: about one claim family.

### Presentation slides

On a slide you only show the **compressed funnel**: 3–5 bullets + gap. The chapter holds the synthesis; the slide holds the map.

---

## 10. Academic voice and paragraph craft

### Paragraph skeleton (use often)

1. **Topic sentence** — the point of the paragraph (your claim about the literature).
2. **Evidence** — 1–3 citations with brief findings.
3. **Analysis** — compare, limit, or interpret.
4. **So-what** — link to problem, method choice, or gap.

Example skeleton filled:

> Topic: Text arrives before vitals at intake.  
> Evidence: Chief complaints are unstructured prose on paper forms; TEWS needs measured parameters.  
> Analysis: Therefore vitals-only pathways cannot cover the first minutes of arrival.  
> So-what: A text path is needed alongside TEWS, not instead of it.

### Tense (common convention)

| Use | For |
|-----|-----|
| Past | Specific completed studies (“Lee et al. (2020) trained…”) |
| Present | Established knowledge / still-true claims (“SATS uses five colour bands…”) |
| Present perfect | Line of research up to now (“Researchers have applied NLP to triage…”) |

### Hedging (precision, not weakness)

Use: suggests, reports, associated with, under-specified, limited evidence.

Avoid overclaiming: proves, all hospitals, always.

### Signposting

Help the reader:

- “A related limitation is…”
- “In contrast to vitals-based scores…”
- “These strands motivate the gap below.”

### Avoid

- Em dashes as a habit; use commas, colons, or new sentences.
- Rhetorical questions in formal chapters.
- “In this modern era of AI…” filler openings.

---

## 11. Citations and ethics

### Cite to support a claim

Every non-obvious factual or scholarly claim needs a source. Definitions from manuals need the manual.

### Paraphrase vs quote

- **Default:** paraphrase and cite.
- **Quote:** rare; reserve for precise definitions or protocol wording you must keep exact.
- Never copy sentence structure from a paper with only synonym swaps (that is still poor academic practice).

### Citation clusters

Three citations in one parenthesis are fine **if** they truly share the same point. Do not dump five names to look thorough without analysis.

### Secondary citation

Prefer reading the **primary** paper. If you must cite via a review, follow your department style (e.g. “X, cited in Y”).

### Ethics

- Do not invent citations.
- Do not cite papers you did not understand at least at abstract + method + limit level (for core sources: full read).
- Keep PDFs or stable links in your reference manager.

---

## 12. Writing the research gap

The gap is the **payoff** of the review. Objectives and method must answer it.

### Gap formula

```text
Prior work establishes A and B.
However, C remains missing / under-specified / not formalised for setting S.
Therefore this study does D.
```

### Weak vs strong

**Weak:**

> Little research has been done on hospital chatbots in Ghana.

(Vague; may be false; does not specify *what* is missing.)

**Stronger:**

> Existing work separates vital-sign scores (TEWS), manual SATS colour assignment, and NLP classifiers trained mainly on high-income corpora. There is no unified, examinable account of how free-text chief complaints at a Ghanaian teaching-hospital-style intake become a SATS colour and a local pathway card, while TEWS remains the nurse-facing vital standard.

### Match gap to pipeline (example framing)

If your contribution is an examinable chain such as:

```text
English chief complaint X
  → acuity probabilities ŷ
  → colour C_NLP
  → pathway card P(C)
```

then the gap paragraph should mention **text → colour → local routing**, not a vague “AI in hospitals.”

### One gap, not five unrelated gaps

Multiple missing pieces can appear, but they should form **one coherent hole** your project fills.

---

## 13. Common mistakes checklist

Mark each item when drafting.

- [ ] Author-by-author laundry list
- [ ] No critique (only praise or neutral summary)
- [ ] Themes missing; chronology used with no reason
- [ ] Gap too broad (“no one studied AI”)
- [ ] Gap does not match stated objectives
- [ ] Method not justified by literature (why this model?)
- [ ] Local / LMIC transfer ignored when claiming hospital relevance
- [ ] Mixing TEWS and NLP without clarifying they solve different inputs
- [ ] Orphan citations (cited in text, missing in bibliography, or the reverse)
- [ ] Over-quoting
- [ ] Informal tone or unsupported superlatives
- [ ] Sections that never return to the research question
- [ ] Ending the chapter without an explicit gap subsection

---

## 14. Revision checklist

Before sending to your supervisor:

### Structure

- [ ] Opener states purpose of the chapter
- [ ] Sections are thematic and in funnel order
- [ ] Each section ends with a clear takeaway
- [ ] Gap subsection is explicit and specific
- [ ] Bridge to methodology exists

### Argument

- [ ] Synthesis appears in most paragraphs (not only summary)
- [ ] Contradictions or limits are acknowledged
- [ ] Gap follows logically from the themes

### Scholarship

- [ ] Core seed papers are present and correctly cited
- [ ] Protocol manuals cited where colours / timers are defined
- [ ] Recent and foundational sources both appear where needed
- [ ] Bibliography format matches department style

### Clarity

- [ ] Terms defined on first use
- [ ] Abbreviations expanded once
- [ ] No unexplained equations dropped without prose
- [ ] English only (if that is your project rule)
- [ ] Sentences readable aloud in under ~25 seconds each

### Alignment

- [ ] Problem statement, objectives, and gap use the same vocabulary
- [ ] Presentation literature slide does not contradict the chapter

---

## 15. Mini worked outline (illustrative template)

**Label:** Use this as a **domain-agnostic shape**. Replace every bracketed placeholder with your own topic, sources, and wording. It is a **template**, not a substitute for your thesis Chapter 2.

### Theme A — Broader context / problem setting

- Claim: [why the topic matters in the real world or in the science].
- Evidence types: [background studies; policy; operational or scientific context papers].
- So-what: [what this implies for your research question].

### Theme B — Established standard or classical approach

- Claim: [the accepted method, protocol, baseline, or classical theory in the field].
- Evidence types: [manuals, standard algorithms, widely cited baselines].
- Limit: [what this standard does *not* cover that your project needs].
- So-what: [why a further strand of literature is required].

### Theme C — Core technical / theoretical lineage

- Claim: [the key models, theorems, or frameworks your method builds on].
- Evidence types: [foundational papers; textbooks; method surveys].
- So-what: [why this lineage justifies the tools you will use].

### Theme D — Applied / closely related studies

- Claim: [recent work closest to your exact task].
- Evidence types: [empirical papers; applied case studies; reviews of near neighbours].
- Limit: [setting, data, language, or scope that does not match yours].
- So-what: [near work is not the same as solving your specific problem].

### Theme E — Research gap (payoff)

- Prior: Themes A–D establish [A] and [B].
- Missing: [X] remains under-specified for setting [S].
- Bridge: this study addresses that gap by [one sentence on your contribution / method chain].

### Optional one-sentence viva closer

> The literature gives established approaches and related models; what was missing for us was a clear, examinable account of [your specific chain or question].

---

## 16. Quick templates (copy and fill)

### A. Search log row

```text
Date:
Database:
Query:
Results (n):
Titles screened:
Full texts read:
Kept (citations):
Reason excluded (examples):
```

### B. Paper note card

```text
Citation:
Setting:
Input (text / vitals / both):
Output (acuity / colour / diagnosis / other):
Method:
Finding:
Limit:
Use in my review (theme):
Supports gap? (yes/no + how):
```

### C. Synthesis paragraph

```text
[Topic sentence: claim about the field.]
[Source 1 finding + citation.]
[Source 2 finding + citation; show agreement or contrast.]
[Limit or transfer issue for my setting.]
[So-what: link to problem, method, or gap.]
```

### D. Gap paragraph

```text
Prior work establishes [A] and [B] (citations).
These approaches leave [C] under-specified for [setting / population / task].
In particular, [what exact chain or artefact is missing].
This study addresses that gap by [one sentence on your contribution].
```

### E. Theme section outline

```text
Section title:
One-sentence section claim:
3–6 sources to weave:
Limits to mention:
Closing so-what sentence:
```

---

## Further reading (craft, not your topic literature)

These are classic guides on *how* to write reviews (consult your library for editions):

- Chris Hart — *Doing a Literature Review*
- Diana Ridley — *The Literature Review: A Step-by-Step Guide for Students*
- Jill Jesson et al. — *Doing Your Literature Review* (traditional and systematic)
- ARCR / PRISMA materials — only if you attempt a systematic-style review

Your **topic** citations (BioBERT, SATS, Stewart, etc.) belong in the thesis bibliography, not necessarily in this craft guide.

---

## Final reminder

A good literature review is judged by **clarity of argument and honesty of gap**, not by how many papers you name. Select carefully, synthesise by theme, critique transfer to your setting, and make the gap match your objectives.
