/**
 * Load environment variables for Node scripts.
 * Order: root `.env`, then optional `.env.<storeTarget>` (override).
 */
import dotenv from 'dotenv';
import { existsSync } from 'fs';
import { resolve } from 'path';

/**
 * @param {string | null | undefined} storeTarget - e.g. FastIPTV (matches `.env.FastIPTV`)
 */
export function loadRootAndStoreEnv(storeTarget = null) {
  const root = resolve(process.cwd(), '.env');
  if (existsSync(root)) {
    dotenv.config({ path: root });
  }
  if (storeTarget) {
    const storePath = resolve(process.cwd(), `.env.${storeTarget}`);
    if (existsSync(storePath)) {
      dotenv.config({ path: storePath, override: true });
    }
  }
}
