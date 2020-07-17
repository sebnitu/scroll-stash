import { camelCase } from '@vrembem/core';
import { getAnchor } from './getAnchor';
import { getPosition } from './getPosition';

export const showAnchor = (el, behavior, settings) => {
  const anchor = getAnchor(el, settings);

  if (anchor) {
    const position = getPosition(el, anchor, settings);

    if (position) {
      el.scroll({
        top: position,
        behavior: (behavior) ? behavior : settings.behavior
      });
    } else {
      return true;
    }

    el.dispatchEvent(new CustomEvent(settings.customEventPrefix + 'anchor', {
      bubbles: true,
      detail: {
        key: el.dataset[camelCase(settings.dataScroll)],
        position: el.scrollTop,
      }
    }));
  }
};
