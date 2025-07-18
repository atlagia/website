module.exports = {
    apps: [
      {
        name: "atlagia-solution2",
        script: "node",
        args: "-r dotenv/config ./dist/server/entry.mjs",
        env: {
          NODE_ENV: "production",
          PORT: 5502,
          ENV_FILE: ".env",
          TEMP: "./tmp",
          TMPDIR: "./tmp",
          SESSION_SECRET: "atlagia-secret-456",
          STORE_ID: "atlagia"
        },
        cwd: "./stores/Sooq.Network",
        namespace: "atlagia",
        instances: 1,
        exec_mode: "fork"
      }
    ]
};
