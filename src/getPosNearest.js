import { getPosTop } from './getPosTop';
import { getPosBot } from './getPosBot';

export const getPosNearest = (el, anchor, settings) => {
  const posTop = getPosTop(el, anchor, settings);
  const posBot = getPosBot(el, anchor, settings);

  if (el.scrollTop > posTop) return posTop;
  if (el.scrollTop < posBot) return posBot;
  return false;
};
