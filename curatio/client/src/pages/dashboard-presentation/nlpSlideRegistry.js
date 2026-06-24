import { Page01, Page02 } from './slides/nlp/Page01Intro';
import { Page03 } from './slides/nlp/Page03Clinical';
import { Page04 } from './slides/nlp/Page04DualPathway';
import { Page05 } from './slides/nlp/Page05Supervised';
import { Page06, Page07, Page08 } from './slides/nlp/Page06Tokenization';
import { Page09, Page10 } from './slides/nlp/Page09Embedding';
import { Page11, Page12 } from './slides/nlp/Page11Contextual';
import { Page13, Page14 } from './slides/nlp/Page13Matrix';
import { Page15, Page16, Page17 } from './slides/nlp/Page15Transformer';
import { Page18, Page19 } from './slides/nlp/Page18Attention';
import { Page20, Page21, Page22 } from './slides/nlp/Page20Pretraining';
import { Page23, Page24, Page25, Page26, Page27 } from './slides/nlp/Page23Learning';
import { Page28 } from './slides/nlp/Page28Summary';

export const NLP_SLIDE_COMPONENTS = {
  1: Page01,
  2: Page02,
  3: Page03,
  4: Page04,
  5: Page05,
  6: Page06,
  7: Page07,
  8: Page08,
  9: Page09,
  10: Page10,
  11: Page11,
  12: Page12,
  13: Page13,
  14: Page14,
  15: Page15,
  16: Page16,
  17: Page17,
  18: Page18,
  19: Page19,
  20: Page20,
  21: Page21,
  22: Page22,
  23: Page23,
  24: Page24,
  25: Page25,
  26: Page26,
  27: Page27,
  28: Page28,
};

export const getNlpSlideComponent = (page) => NLP_SLIDE_COMPONENTS[page] ?? Page01;
