#!/usr/bin/env node
/**
 * Aplica schema no Postgres da Vercel.
 * Preferimos migrate deploy; se o banco já existia sem _prisma_migrations (P3005),
 * caímos em db push para não quebrar o build.
 */
import { spawnSync } from "node:child_process";

function run(cmd, args) {
  return spawnSync(cmd, args, { stdio: "inherit", shell: false });
}

const migrate = run("npx", ["prisma", "migrate", "deploy"]);
if (migrate.status === 0) process.exit(0);

console.warn("[db-deploy] migrate deploy falhou; tentando prisma db push…");
const push = run("npx", ["prisma", "db", "push", "--skip-generate"]);
process.exit(push.status ?? 1);
