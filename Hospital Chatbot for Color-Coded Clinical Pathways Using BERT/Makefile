MAIN = Hospital Chatbot for Color-Coded Clinical Pathways Using BERT
LATEX = pdflatex
BIBTEX = bibtex

.PHONY: all clean figures

all:
	$(LATEX) -interaction=nonstopmode "$(MAIN).tex"
	$(BIBTEX) "$(MAIN)"
	$(LATEX) -interaction=nonstopmode "$(MAIN).tex"
	$(LATEX) -interaction=nonstopmode "$(MAIN).tex"

figures:
	cd ../fine-tuned-biobert && .venv/bin/python scripts/generate_thesis_figures.py

clean:
	rm -f "$(MAIN).aux" "$(MAIN).log" "$(MAIN).out" "$(MAIN).toc" "$(MAIN).lof" "$(MAIN).lot" "$(MAIN).bbl" "$(MAIN).blg" "$(MAIN).synctex.gz"
