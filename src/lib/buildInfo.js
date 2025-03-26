import fs from "fs";
import path from "path";
import { DateTime } from "luxon";

const packageJsonPath = path.resolve("package.json");
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
const astroVersion = packageJson.dependencies.astro || "Unknown";

const lastBuildTime = DateTime.now()
  .setZone("Asia/Kolkata")
  .toFormat("EEEE, d MMMM yyyy, hh:mm:ss a");

export { astroVersion, lastBuildTime };
