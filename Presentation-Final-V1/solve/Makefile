MAIN = main
LATEX = pdflatex -interaction=nonstopmode

.PHONY: all clean

all: $(MAIN).pdf

$(MAIN).pdf: $(MAIN).tex preamble.tex \
	sections/01-setup-gate.tex \
	sections/02-tokens-embed.tex \
	sections/03-attention-layers.tex \
	sections/04-softmax-colour-path.tex
	$(LATEX) $(MAIN)
	$(LATEX) $(MAIN)

clean:
	rm -f *.aux *.log *.out *.toc *.synctex.gz
