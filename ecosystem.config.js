module.exports = {
  apps: [
    {
      name: 'repos',
      script: 'server.js',
      env: {
        PORT: 4005,
        BASE_PATH: '/repos',
      },
    },
  ],
};
