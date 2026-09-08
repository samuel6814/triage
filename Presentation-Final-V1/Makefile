MAIN = main
LATEX = pdflatex -interaction=nonstopmode

.PHONY: all clean

all: $(MAIN).pdf

$(MAIN).pdf: $(MAIN).tex preamble.tex Gabby.sty myref.bib \
	sections/01-introduction.tex \
	sections/02-methodology.tex \
	sections/03-mathematics.tex \
	sections/04-results.tex \
	sections/05-limitations.tex \
	sections/06-references.tex
	$(LATEX) $(MAIN)
	bibtex $(MAIN) || true
	$(LATEX) $(MAIN)
	$(LATEX) $(MAIN)

clean:
	rm -f *.aux *.log *.nav *.out *.snm *.toc *.bbl *.blg *.vrb *.synctex.gz
