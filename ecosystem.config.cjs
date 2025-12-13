module.exports = {
    apps: [
      {
        name: "fastiptv",
        script: "node",
        args: "-r dotenv/config ./dist/server/entry.mjs",
        env: {
          NODE_ENV: "production",
          PORT: 7001,
          ENV_FILE: ".env",
          TEMP: "./tmp",
          TMPDIR: "./tmp",
          SESSION_SECRET: "fastiptv-secret-789",
          STORE_ID: "fastiptv",
          THEME: "iptv",
          PROJECT_TYPE: "iptv",
          PUBLIC_SITE_NAME: "FastIPTV",
          PUBLIC_STORE_NAME: "FastTV",
          PUBLIC_STORE_DOMAIN: "fastiptvstronger.com",
          DOMAINE: "https://fastiptvstronger.com",
          PUBLIC_BUSINESS_PHONE: "+1234567890",
          PUBLIC_ENABLE_WHATSAPP: "true"
        },
        cwd: "./stores/fastiptv",
        namespace: "fastiptv",
        instances: 1,
        exec_mode: "fork"
      },
      {
        name: "drivon",
        script: "node",
        args: "-r dotenv/config ./dist/server/entry.mjs",
        env: {
          NODE_ENV: "production",
          PORT: 7002,
          ENV_FILE: ".env",
          TEMP: "./tmp",
          TMPDIR: "./tmp",
          SESSION_SECRET: "drivon-secret-789",
          STORE_ID: "drivon",
          THEME: "bikes",
          PROJECT_TYPE: "bikes",
          PUBLIC_SITE_NAME: "Drivon",
          PUBLIC_STORE_NAME: "Drivon",
          PUBLIC_STORE_DOMAIN: "drivon.store",
          DOMAINE: "https://drivon.store",
          PUBLIC_BUSINESS_PHONE: "+1234567890",
          PUBLIC_ENABLE_WHATSAPP: "true"
        },
        cwd: "./stores/drivon",
        namespace: "drivon",
        instances: 1,
        exec_mode: "fork"
      },
      {
        name: "atlagia",
        script: "node",
        args: "-r dotenv/config ./dist/server/entry.mjs",
        env: {
          NODE_ENV: "production",
          PORT: 7003,
          ENV_FILE: ".env",
          TEMP: "./tmp",
          TMPDIR: "./tmp",
          SESSION_SECRET: "atlagia-secret-456",
          STORE_ID: "atlagia",
          THEME: "saas",
          PROJECT_TYPE: "default",
          PUBLIC_SITE_NAME: "Atlagia",
          PUBLIC_STORE_NAME: "Atlagia",
          PUBLIC_STORE_DOMAIN: "atlagia.com",
          DOMAINE: "https://atlagia.com",
          PUBLIC_BUSINESS_PHONE: "+1234567890",
          PUBLIC_ENABLE_WHATSAPP: "true"
        },
        cwd: "./stores/atlagia",
        namespace: "atlagia",
        instances: 1,
        exec_mode: "fork"
      }
    ]
};
