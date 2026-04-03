module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          alias: {
            '@/theme': './src/theme',
            '@/components': './src/components',
            '@/screens': './src/screens',
            '@/data': './src/data',
            '@/utils': './src/utils',
            '@/hooks': './src/hooks',
            '@/types': './src/types',
          },
        },
      ],
    ],
  };
};
