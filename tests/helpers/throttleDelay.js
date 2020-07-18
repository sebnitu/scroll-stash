import { defaults } from '../../src/settings';

export const throttleDelay = (time = defaults.throttleDelay) => {
  return new Promise(function(resolve) {
    setTimeout(resolve, time);
  });
};
