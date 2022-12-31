import Jimp from "jimp";
import path from "path";
import { adbCommands } from "../../adbCommands";
import { arknights } from "../../games/arknights/arknights";
import { epic7 } from "../../games/epic7/epic7";
import { Region } from "../../types";

import {
  sleep,
  screenVSRefDiff,
  tapRegion,
  ensureStateChange,
} from "../../execution-old";

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

import { pncRef } from "../../games/pnc/reference";

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
