module.exports = {
    apps: [
      {
        name: "bikes-store",
        script: "node",
        args: "-r dotenv/config ./dist/server/entry.mjs",
        env: {
          NODE_ENV: "production",
          PORT: 4321,
          ENV_FILE: ".env",
          TEMP: "./tmp",
          TMPDIR: "./tmp",
          SESSION_SECRET: "bikes-secret-123",
          STORE_ID: "bikes"
        },
        cwd: "./stores/bikes",
        namespace: "bikes",
        instances: 1,
        exec_mode: "fork"
      },
      {
        name: "digivast-store",
        script: "node",
        args: "-r dotenv/config ./dist/server/entry.mjs",
        env: {
          NODE_ENV: "production",
          PORT: 4322,
          ENV_FILE: ".env",
          TEMP: "./tmp",
          TMPDIR: "./tmp",
          SESSION_SECRET: "digivast-secret-456",
          STORE_ID: "digivast"
        },
        cwd: "./stores/digivast",
        namespace: "digivast",
        instances: 1,
        exec_mode: "fork"
      },
      {
        name: "cosplayverse-store",
        script: "node",
        args: "-r dotenv/config ./dist/server/entry.mjs",
        env: {
          NODE_ENV: "production",
          PORT: 4323,
          ENV_FILE: ".env",
          TEMP: "./tmp",
          TMPDIR: "./tmp",
          SESSION_SECRET: "cosplayverse-secret-456",
          STORE_ID: "cosplayverse"
        },
        cwd: "./stores/cosplayverse",
        namespace: "cosplayverse",
        instances: 1,
        exec_mode: "fork"
      },
      {
        name: "repbag-store",
        script: "node",
        args: "-r dotenv/config ./dist/server/entry.mjs",
        env: {
          NODE_ENV: "production",
          PORT: 4324,
          ENV_FILE: ".env",
          TEMP: "./tmp",
          TMPDIR: "./tmp",
          SESSION_SECRET: "repbag-secret-456",
          STORE_ID: "repbag"
        },
        cwd: "./stores/repbag",
        namespace: "repbag",
        instances: 1,
        exec_mode: "fork"
      },
      {
        name: "repshoes-store",
        script: "node",
        args: "-r dotenv/config ./dist/server/entry.mjs",
        env: {
          NODE_ENV: "production",
          PORT: 4325,
          ENV_FILE: ".env",
          TEMP: "./tmp",
          TMPDIR: "./tmp",
          SESSION_SECRET: "repshoes-secret-456",
          STORE_ID: "repshoes"
        },
        cwd: "./stores/repshoes",
        namespace: "repshoes",
        instances: 1,
        exec_mode: "fork"
      }
    ]
};