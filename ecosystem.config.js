module.exports = {
    apps : [{
      name   : "sipeda",
      script : "./index.js",
      env_production: {
          NODE_ENV: "production",
          SETUPD: false,
          PORT: 80
      }
    }]
  };
  