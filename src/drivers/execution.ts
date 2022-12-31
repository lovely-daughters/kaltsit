import Jimp from "jimp";
import path from "path";

import { adbCommands } from "../adbCommands";
import { Reference, RegionOfInterest } from "../reference";

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * screenVSRefDiff()
 *
 * calculates percentage difference between the current screen (obtained through screenshot) and the reference image provided
 * can constrain comparison to a region to speed things up
 *
 * @param reference
 * @param saveImages debug utility
 * @param takeScreenshot can provide an alternative
 * @returns percentage difference (lower => better)
 */
export async function screenVSRefDiff(
  reference: Reference,
  saveImages?: boolean,
  takeScreenshot = () => adbCommands.screencap()
): Promise<number> {
  takeScreenshot();

  let referenceImage = await Jimp.read(reference.imagePath);
  let screenshot = await Jimp.read(
    path.join(__dirname, "../../temp", "screenshot.png")
  );

  if (saveImages) {
    referenceImage.write("diffs/1-ref.png");
    screenshot.write("diffs/2-screen.png");
  }

  if (reference.roi) {
    const { x, y, width, height } = reference.roi;
    referenceImage = await referenceImage.crop(x, y, width, height);
    screenshot = await screenshot.crop(x, y, width, height);
  }

  const diff = Jimp.diff(referenceImage, screenshot);

  if (saveImages) {
    referenceImage.write("diffs/3-ref-crop.png");
    screenshot.write("diffs/4-screen-crop.png");
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

/**
 * causeEffect()
 *
 * basic driver for state change
 *
 * condition and action can use the same reference
 * false action can be an empty function () => null
 *
 * @param condition
 * @param falseAction
 * @param trueAction
 */
export async function causeEffect(
  condition: () => Promise<Boolean>,
  trueAction: () => Promise<void>,
  falseAction?: () => Promise<void>
): Promise<void> {
  while (!(await condition())) {
    if (falseAction) {
      await falseAction();
    }
  }
  await trueAction();
}

export function conditionGenerator(
  referenceMap: Map<string, Reference>,
  referenceName: string,
  thresh = 0.05
): () => Promise<Boolean> {
  const reference = referenceMap.get(referenceName)!;
  return async () => {
    console.log(reference.name);
    return (await screenVSRefDiff(reference)) < thresh;
  };
}

export function actionGenerator(
  referenceMap: Map<string, Reference>,
  referenceName: string
): () => Promise<void> {
  const reference = referenceMap.get(referenceName)!;
  return async () => {
    console.log(reference.name);
    await tapRegion(reference.roi);
  };
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
