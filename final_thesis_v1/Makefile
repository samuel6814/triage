MAIN = My_thesis_template
LATEX = pdflatex
BIBTEX = bibtex

.PHONY: all clean

all: $(MAIN).pdf

.PHONY: all clean figures

figures:
	cd ../fine-tuned-biobert && .venv/bin/python scripts/generate_thesis_figures.py

$(MAIN).pdf: $(MAIN).tex mystyle.sty myref.bib titlepage.tex declaration.tex dedication.tex abstract.tex acknowledgment.tex appendix.tex chapter1.tex chapter2.tex chapter3.tex chapter3a.tex chapter3b.tex chapter4.tex chapter5.tex $(wildcard figures/ch4/*.pdf)
	$(LATEX) $(MAIN).tex
	$(BIBTEX) $(MAIN)
	$(LATEX) $(MAIN).tex
	$(LATEX) $(MAIN).tex

clean:
	rm -f *.aux *.log *.out *.toc *.lof *.lot *.bbl *.blg *.synctex.gz
