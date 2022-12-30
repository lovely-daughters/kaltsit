import Jimp from "jimp";
import path from "path";

import { adbCommands } from "./adbCommands";
import { Region } from "./types/Region";

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

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
export async function screenVSRefDiff(
  refPath: string,
  regionOfInterest?: Region,
  saveImages?: boolean
): Promise<number> {
  adbCommands.screencap();

  let ref = await Jimp.read(refPath);
  let screen = await Jimp.read(path.join(__dirname, "..", "screen.png"));

  if (saveImages) {
    ref.write("diffs/1-ref.png");
    screen.write("diffs/2-screen.png");
  }

  if (regionOfInterest) {
    const { x, y, w, h } = regionOfInterest;
    ref = await ref.crop(x, y, w, h);
    screen = await screen.crop(x, y, w, h);
  }

  const diff = Jimp.diff(ref, screen);

  if (saveImages) {
    ref.write("diffs/3-ref-crop.png");
    screen.write("diffs/4-screen-crop.png");
    diff.image.write("diffs/5-diff.png");
  }

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
export async function tapRegion(region: Region, variance = 0.15) {
  const { x, y, w, h } = region;

  let cX = (x + w / 2) | 0;
  let cY = (y + h / 2) | 0;

  if (variance) {
    const vX = (Math.random() * 2 - 1) * ((w * variance) | 0);
    const vY = (Math.random() * 2 - 1) * ((h * variance) | 0);
    cX += vX;
    cY += vY;
  }

  adbCommands.tap([cX, cY]);
}

export async function ensureStateChange(
  refPath: string,
  regionOfInterest: Region,
  diffThresh = 0.1,
  verbose = false
) {
  if (verbose) console.log("ensuring existence");

  // ensure the region exists
  while (true) {
    const pDiff = await screenVSRefDiff(refPath, regionOfInterest);

    if (pDiff < diffThresh) {
      break;
    }
  }

  if (verbose) console.log("existence ensured");

  if (verbose) console.log("ensuring dissapearance");
  tapRegion(regionOfInterest);
  if (verbose) console.log("dissapearance theoretically ensured");

  // should in theory only need to tap once to ensure dissapearance
  // might not need the while loop to continually check
  // ensure the state changes
  // old continual tap code
  // while (true) {
  //   await sleep(1000);
  //   const pDiff = await screenVSRefDiff(refPath, regionOfInterest);
  //   if (pDiff > diffThresh) {
  //     break;
  //   } else {
  //     tapRegion(regionOfInterest);
  //   }
  // }

  // console.log("dissapearance ensured");
}
