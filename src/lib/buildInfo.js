import { DateTime } from "luxon";

const lastBuildTime = DateTime.now()
  .setZone("Asia/Kolkata")
  .toFormat("EEEE, d MMMM yyyy, hh:mm:ss a");

export { lastBuildTime };
