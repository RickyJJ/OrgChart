module.exports = {
  apps: [
    {
      name: 'qyz-backend',
      script: 'node_modules/directus/cli.js',
      args: 'start',
      cwd: './backend',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 8055
      }
    }
  ]
};
