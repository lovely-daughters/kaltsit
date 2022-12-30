import Jimp from "jimp";
import path from "path";
import { adbCommands } from "./adbCommands";
import { arknights } from "./games/arknights/arknights";
import { epic7 } from "./games/epic7/epic7";

interface Region {
  x: number;
  y: number;
  w: number;
  h: number;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

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
async function tapRegion(region: Region, variance = 0.15) {
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

async function ensureStateChange(
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
// try to only tap when absolutely sure
// need to think about how to deal with wrong taps during state transition periods
async function mainArknights() {
  while (true) {
    console.log("LOOKING FOR START");

    // await ensureStateChange(
    //   arknights.refs.start.imagePath,
    //   arknights.refs.start.regionOfInterest,
    //   0.5
    // );

    await ensureStateChange(
      arknights.refs.start_sulfitera.imagePath,
      arknights.refs.start_sulfitera.regionOfInterest,
      0.5
    );

    // return;

    console.log("LOOKING FOR MISSION_START");

    await ensureStateChange(
      arknights.refs.mission_start.imagePath,
      arknights.refs.mission_start.regionOfInterest
    );

    // sleep from 0-5 seconds
    // NORMAL ~ 2 mins
    await sleep(2 * 60 * 1000 + Math.random() * 5 * 1000);
    // ANNIHILATION ~ 20 mins
    // await sleep(Math.random() * 20 * 60 * 1000);

    console.log("LOOKING FOR MISSION_RESULTS");

    await ensureStateChange(
      arknights.refs.mission_results.imagePath,
      arknights.refs.mission_results.regionOfInterest
    );

    console.log("COMPLETE");
  }
}

async function mainEpic7() {
  const interest = [
    epic7.refs.select_team,
    epic7.refs.start,
    epic7.refs.stage_clear,
    epic7.refs.add_friend,
    epic7.refs.confirm_result,
    epic7.refs.try_again,
  ];

  while (true) {
    console.log("searching for select team");
    await ensureStateChange(
      interest[0].imagePath,
      interest[0].regionOfInterest,
      0.35
    );
    console.log("found select team");
    await sleep(1000);

    console.log("searching for start");
    await ensureStateChange(
      interest[1].imagePath,
      interest[1].regionOfInterest,
      0.5
    );
    console.log("found start");
    await sleep(10000);

    console.log("searching for stage clear");
    await ensureStateChange(
      interest[2].imagePath,
      interest[2].regionOfInterest,
      0.35
    );
    console.log("found stage clear");
    await sleep(1000);

    console.log("searching for add friend");
    await ensureStateChange(
      interest[3].imagePath,
      interest[3].regionOfInterest,
      0.25
    );
    console.log("found add friend");
    await sleep(1000);

    console.log("searching for confirm result");
    await ensureStateChange(
      interest[4].imagePath,
      interest[4].regionOfInterest,
      0.25
    );
    console.log("found confirm result");
    await sleep(1000);

    console.log("searching for try again");
    await ensureStateChange(
      interest[5].imagePath,
      interest[5].regionOfInterest,
      0.25
    );
    console.log("found try again");
    await sleep(1000);
  }
}

async function test() {
  const interest = [
    epic7.refs.select_team,
    epic7.refs.start,
    epic7.refs.stage_clear,
    epic7.refs.add_friend,
    epic7.refs.confirm_result,
    epic7.refs.try_again,
  ];
  const out = await screenVSRefDiff(
    interest[2].imagePath,
    interest[2].regionOfInterest,
    true
  );

  console.log(out);
}

import { pncRef } from "./games/pnc/reference";

async function test2() {
  const split = pncRef.login.away_too_long.split(".")[0].split("-");

  const roi: Region = {
    x: Number(split[split.length - 4]) + 3,
    y: Number(split[split.length - 3]) + 3,
    w: Number(split[split.length - 2]) - 6, // Need to double since shifting x&y also 'shift' width and height
    h: Number(split[split.length - 1]) - 6,
  };

  const out = await screenVSRefDiff(pncRef.login.away_too_long, roi, true);

  console.log(out);

  // await ensureStateChange(pncRef.login.away_too_long, roi, 0.9);
}

// interest.forEach(
//   async (ref: {
//     imagePath: string;
//     regionOfInterest: { x: number; y: number; w: number; h: number };
//   }) => {
//     console.log(ref.imagePath);

//     await ensureStateChange(ref.imagePath, ref.regionOfInterest);
//   }
// );

// async function test() {
//   await ensureStateChange(
//     epic7.refs.select_team.imagePath,
//     epic7.refs.select_team.regionOfInterest
//   );
// }

// mainArknights();
// mainEpic7();
// test();
// test2();
