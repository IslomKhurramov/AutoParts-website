module.exports = {
  apps: [
    {
      name: "AutoParts",
      cwd: "./",
      script: "./server.js",
      watch: true,
      env_production: {
        NODE_ENV: "production",
      },
      env_development: {
        NODE_ENV: "development",
      },
      //default=>fork mode , change to cluster mode
      instances: 2,
      exec_mode: "cluster",
    },
  ],
};
