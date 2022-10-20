import Jimp from "jimp";
import path from "path";
import { adbCommands } from "./adbCommands";
import { arknights } from "./games/arknights";

interface Region {
  x: number;
  y: number;
  w: number;
  h: number;
}

/**
 * screenVSRefDiff()
 *
 * calculates percentage difference between the current screen (obtained through screenshot) and the reference image provided
 *
 * @param refPath
 * @param regionOfInterest
 * @param saveDiff
 * @returns percentage difference (lower => better)
 */
async function screenVSRefDiff(
  refPath: string,
  regionOfInterest?: Region,
  saveDiff?: boolean
): Promise<number> {
  adbCommands.screencap();

  let ref = await Jimp.read(refPath);
  let screen = await Jimp.read(path.join(__dirname, "..", "screen.png"));

  if (regionOfInterest) {
    const { x, y, w, h } = regionOfInterest;
    ref = await ref.crop(x, y, w, h);
    screen = await screen.crop(x, y, w, h);
  }

  const diff = Jimp.diff(ref, screen);

  if (saveDiff) diff.image.write("diff.png");

  return diff.percent;
}

/**
 * tapRegion()
 *
 * generates an adb tap command in the region provided
 * adds on some variance for anti-ban purposes
 *
 * @param region
 * @param variance
 */
async function tapRegion(region: Region, variance = true) {
  const { x, y, w, h } = region;

  let cX = (x + w / 2) | 0;
  let cY = (y + h / 2) | 0;

  if (variance) {
    const vX = (Math.random() * 2 - 1) * ((w * 0.3) | 0);
    const vY = (Math.random() * 2 - 1) * ((h * 0.3) | 0);
    cX += vX;
    cY += vY;
  }

  adbCommands.tap([cX, cY]);
}

async function ensureStateChange(
  refPath: string,
  regionOfInterest: Region,
  diffThresh = 0.1
) {
  console.log("ensuring existence");

  // ensure the region exists
  while (true) {
    const pDiff = await screenVSRefDiff(refPath, regionOfInterest);
    if (pDiff < diffThresh) {
      break;
    }
  }

  console.log("existence ensured");

  console.log("ensuring dissapearance");

  // ensure the state changes
  while (true) {
    const pDiff = await screenVSRefDiff(refPath, regionOfInterest);
    if (pDiff > diffThresh) {
      break;
    } else {
      tapRegion(regionOfInterest);
    }
  }

  console.log("dissapearance ensured");
}
// try to only tap when absolutely sure
// need to think about how to deal with wrong taps during state transition periods
async function main() {
  while (true) {
    console.log("LOOKING FOR START");

    await ensureStateChange(
      arknights.refs.start.imagePath,
      arknights.refs.start.regionOfInterest
    );

    console.log("LOOKING FOR MISSION_START");

    await ensureStateChange(
      arknights.refs.mission_start.imagePath,
      arknights.refs.mission_start.regionOfInterest
    );

    console.log("LOOKING FOR MISSION_RESULTS");

    await ensureStateChange(
      arknights.refs.mission_results.imagePath,
      arknights.refs.mission_results.regionOfInterest
    );

    console.log("COMPLETE");
  }
}

main();
