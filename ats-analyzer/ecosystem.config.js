module.exports = {
  apps: [
    {
      name: "ats-backend",
      script: "npm",
      args: "start",
      cwd: "./backend",
      env: {
        NODE_ENV: "production",
      }
    },
    {
      name: "ats-frontend",
      script: "npm",
      args: "run start",
      cwd: "./frontend",
      env: {
        NODE_ENV: "production",
      }
    }
  ]
};
