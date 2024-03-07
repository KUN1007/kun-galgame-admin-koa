const path = require('path')

module.exports = {
  apps: [
    {
      name: 'kun-galgame-admin-koa',
      port: 6666,
      script: './dist/kun.js',
      cwd: path.join(__dirname),
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
}
