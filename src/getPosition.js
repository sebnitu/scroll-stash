import { getPosTop } from './getPosTop';
import { getPosBot } from './getPosBot';
import { getPosNearest } from './getPosNearest';

export const getPosition = (el, anchor, settings) => {
  const align = settings.alignment;
  switch (align) {
  case 'start' : return getPosTop(el, anchor, settings);
  case 'end' : return getPosBot(el, anchor, settings);
  case 'nearest' : return getPosNearest(el, anchor, settings);
  default: return false;
  }
};
