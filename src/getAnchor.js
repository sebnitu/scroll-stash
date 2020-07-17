import { camelCase } from '@vrembem/core';

export const getAnchor = (el, settings) => {
  // 1. If dataAnchor is disabled, return null
  const dataAnchor = el.dataset[camelCase(settings.dataAnchor)];
  if (dataAnchor == 'false' || dataAnchor == 'ignore') {
    return null;
  }

  // 2. If dataAnchor returns an anchor, return dataAnchor
  if (dataAnchor && el.querySelector(dataAnchor)) {
    return el.querySelector(dataAnchor);
  }

  // 3. If selectAnchor and parentAnchor return an anchor, return parentAnchor
  const selectorAnchor = (settings.selectorAnchor) ?
    el.querySelector(settings.selectorAnchor) : null;
  if (selectorAnchor && settings.selectorAnchorParent) {
    const parentAnchor = selectorAnchor.closest(settings.selectorAnchorParent);
    if (parentAnchor) return parentAnchor;
  }

  // 4. If selectAnchor returned an anchor, return selectorAnchor
  // 5. else null
  return (selectorAnchor) ? selectorAnchor : null;
};
