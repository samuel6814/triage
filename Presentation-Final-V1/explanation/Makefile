MAIN = main
LATEX = pdflatex -interaction=nonstopmode

.PHONY: all clean

all: $(MAIN).pdf

$(MAIN).pdf: $(MAIN).tex preamble.tex myref.bib \
	sections/01-front-background.tex \
	sections/02-problem-objectives.tex \
	sections/03-methodology.tex \
	sections/04a-token-embed.tex \
	sections/04b-encoder-attention.tex \
	sections/04c-head-gate-path.tex \
	sections/05-results-impact.tex
	$(LATEX) $(MAIN)
	bibtex $(MAIN) || true
	$(LATEX) $(MAIN)
	$(LATEX) $(MAIN)

clean:
	rm -f *.aux *.log *.out *.toc *.bbl *.blg *.synctex.gz
