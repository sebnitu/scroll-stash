export const anchorPositionTop = (el, anchor, settings) => {
  let pos = settings.anchorPadding;
  if (settings.selectorTopElem) {
    const topElem = el.querySelector(settings.selectorTopElem);
    if (topElem) pos += topElem.offsetHeight;
  }
  return anchor.offsetTop - (pos);
};

export const anchorPositionBottom = (el, anchor, settings) => {
  let pos = settings.anchorPadding;
  if (settings.selectorBotElem) {
    const botElem = el.querySelector(settings.selectorBotElem);
    if (botElem) pos += botElem.offsetHeight;
  }
  return anchor.offsetTop - (el.offsetHeight - (anchor.offsetHeight + pos));
};

export const anchorPositionNearest = (el, anchor, settings) => {
  const posTop = anchorPositionTop(el, anchor, settings);
  const posBot = anchorPositionBottom(el, anchor, settings);

  if (el.scrollTop > posTop) return posTop;
  if (el.scrollTop < posBot) return posBot;
  return false;
};

export const anchorInView = (el, anchor, settings) => {
  const posTop = anchorPositionTop(el, anchor, settings);
  const posBot = anchorPositionBottom(el, anchor, settings);

  if (el.scrollTop > posTop || el.scrollTop < posBot) return false;
  return true;
};

export const anchorPositionGet = (el, anchor, settings) => {
  const inView = anchorInView(el, anchor, settings);
  switch (settings.alignment) {
    case 'start' : return (inView) ? false : anchorPositionTop(el, anchor, settings);
    case 'end' : return (inView) ? false : anchorPositionBottom(el, anchor, settings);
    case 'nearest' : return anchorPositionNearest(el, anchor, settings);
    default: return false;
  }
};

export default {
  top: anchorPositionTop,
  bottom: anchorPositionBottom,
  nearest: anchorPositionNearest,
  get: anchorPositionGet
};
