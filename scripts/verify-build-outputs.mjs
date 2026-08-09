import { existsSync } from "node:fs";
import { createRequire } from "node:module";

const outputFiles = [
  new URL("../dist/index.js", import.meta.url),
  new URL("../dist/index.cjs", import.meta.url),
  new URL("../dist/index.d.ts", import.meta.url),
  new URL("../dist/index.d.cts", import.meta.url),
];

for (const outputFile of outputFiles) {
  if (!existsSync(outputFile)) {
    throw new Error(`Expected build output is missing: ${outputFile.pathname}`);
  }
}

const esmModule = await import("../dist/index.js");
const require = createRequire(import.meta.url);
const cjsModule = require("../dist/index.cjs");

const bundles = [
  { format: "ESM", module: esmModule },
  { format: "CJS", module: cjsModule },
];

for (const { format, module } of bundles) {
  if (module.ByteUnit?.GB?.toBytes(2) !== 2_000_000_000) {
    throw new Error(`${format} bundle failed the ByteUnit.GB conversion check.`);
  }

  if (module.BitUnit?.MBIT?.toBits(3) !== 3_000_000) {
    throw new Error(`${format} bundle failed the BitUnit.MBIT conversion check.`);
  }
}

console.log("Build output smoke check passed for ESM and CJS bundles.");
