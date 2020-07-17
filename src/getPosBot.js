export const getPosBot = (el, anchor, settings) => {
  let pos = settings.anchorPadding;
  if (settings.selectorBotElem) {
    const botElem = el.querySelector(settings.selectorBotElem);
    if (botElem) pos += botElem.offsetHeight;
  }
  return anchor.offsetTop - (el.offsetHeight - (anchor.offsetHeight + pos));
};
