import { readFile } from "node:fs/promises";
import path from "node:path";

const tagRef = process.env.GITHUB_REF_NAME ?? process.argv[2];
if (!tagRef) {
  throw new Error("A tag name is required.");
}

if (!tagRef.startsWith("v") || tagRef.length === 1) {
  throw new Error(`Release tags must start with v: ${tagRef}`);
}

const expectedVersion = tagRef.slice(1);
const readJson = async (relativePath) => JSON.parse(await readFile(path.resolve(relativePath), "utf8"));
const packageJson = await readJson("package.json");
const lockfile = await readJson("package-lock.json");
const changelog = await readFile(path.resolve("CHANGELOG.md"), "utf8");

function assertVersion(label, actualVersion) {
  if (actualVersion !== expectedVersion) {
    throw new Error(`${label} has version ${actualVersion}, expected ${expectedVersion}`);
  }
}

assertVersion("package.json", packageJson.version);
assertVersion("package-lock.json", lockfile.version);
assertVersion('package-lock.json packages[""]', lockfile.packages?.[""]?.version);

const escapedVersion = expectedVersion.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&");
const changelogSectionPattern = new RegExp(`^## \\[${escapedVersion}\\](?: - \\d{4}-\\d{2}-\\d{2})?$`, "m");
if (!changelogSectionPattern.test(changelog)) {
  throw new Error(`CHANGELOG.md does not contain a section for ${expectedVersion}.`);
}
