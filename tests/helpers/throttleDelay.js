import ScrollStash from '../../index';
const scrollStash = new ScrollStash();

export const throttleDelay = (time = scrollStash.settings.throttleDelay) => {
  return new Promise(function(resolve) {
    setTimeout(resolve, time);
  });
};
