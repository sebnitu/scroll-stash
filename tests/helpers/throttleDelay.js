import ScrollStash from '../../index';

export const throttleDelay = () => {
  const scrollStash = new ScrollStash();
  return new Promise(function(resolve) {
    setTimeout(resolve, scrollStash.settings.throttleDelay);
  });
};
