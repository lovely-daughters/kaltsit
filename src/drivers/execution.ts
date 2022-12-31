import Jimp from "jimp";
import path from "path";

import { adbCommands } from "../adbCommands";
import { Reference, RegionOfInterest } from "../reference";

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
  reference: Reference,
  saveImages?: boolean
): Promise<number> {
  adbCommands.screencap();

  let ref = await Jimp.read(reference.imagePath);
  let screen = await Jimp.read(
    path.join(__dirname, "../../temp", "screen.png")
  );

  if (saveImages) {
    ref.write("diffs/1-ref.png");
    screen.write("diffs/2-screen.png");
  }

  if (reference.roi) {
    const { x, y, width, height } = reference.roi;
    ref = await ref.crop(x, y, width, height);
    screen = await screen.crop(x, y, width, height);
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
export async function tapRegion(roi: RegionOfInterest, variance = 0.15) {
  const { x, y, width, height } = roi;

  let cX = x + width / 2;
  let cY = y + height / 2;

  if (variance) {
    const vX = (Math.random() * 2 - 1) * (width * variance);
    const vY = (Math.random() * 2 - 1) * (height * variance);
    cX += vX;
    cY += vY;
  }

  adbCommands.tap([cX, cY]);
}

export async function ensureStateChange(
  reference: Reference,
  diffThresh = 0.1,
  verbose = false
) {
  if (verbose) console.log("ensuring existence");

  // ensure the region exists
  while (true) {
    const pDiff = await screenVSRefDiff(reference);

    if (pDiff < diffThresh) {
      break;
    }
  }

  if (verbose) console.log("existence ensured");

  if (verbose) console.log("ensuring dissapearance");
  tapRegion(reference.roi!);
  if (verbose) console.log("dissapearance theoretically ensured");
}

export async function clickRefUntilRefFound(
  clickRef: Reference,
  searchRef: Reference
) {
  while ((await screenVSRefDiff(searchRef)) > 0.05) {
    tapRegion(clickRef.roi!);
  }
}
