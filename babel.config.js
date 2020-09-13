module.exports = (api) => {
  const config = {};

  if (api.env('test')) {
    config.presets = [[
      '@babel/preset-env',
      { targets: { node: 'current' } }
    ]];
  } else {
    config.presets = ['@babel/preset-env'];
    config.comments = false;
  }

  return config;
};
