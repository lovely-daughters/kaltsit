import Jimp from "jimp";
import path from "path";
import { adbCommands } from "./adbCommands";
import { arknights } from "./games/arknights/arknights";
import { epic7 } from "./games/epic7/epic7";
import { Region } from "./types/Region";
import {
  sleep,
  screenVSRefDiff,
  tapRegion,
  ensureStateChange,
} from "./execution-old";

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

// mainArknights();
// mainEpic7();
