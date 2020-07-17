export const getPosTop = (el, anchor, settings) => {
  let pos = settings.anchorPadding;
  if (settings.selectorTopElem) {
    const topElem = el.querySelector(settings.selectorTopElem);
    if (topElem) pos += topElem.offsetHeight;
  }
  return anchor.offsetTop - (pos);
};
