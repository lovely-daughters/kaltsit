import path from "path";

const refFolder = path.join(__dirname, "reference");

interface Reference {
  imagePath: string;
  regionOfInterest: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
  diffThresh: number;
}

export const epic7 = {
  initActivity: "com.stove.epic7.google/kr.supercreative.epic7.AppActivity",
  refs: {
    select_team: {
      imagePath: path.join(refFolder, "1-select_team-1960-980-175-35.png"),
      regionOfInterest: { x: 1785, y: 920, w: 545, h: 145 },
      diffThresh: 0.35,
    },
    start: {
      imagePath: path.join(refFolder, "2-start-2030-955-230-80.png"),
      regionOfInterest: { x: 1785, y: 920, w: 545, h: 145 },
      diffThresh: 0.5,
    },
    stage_clear: {
      imagePath: path.join(refFolder, "3-stage_clear-1040-135-370-250.png"),
      regionOfInterest: { x: 1040, y: 135, w: 370, h: 250 },
      diffThresh: 0.35,
    },
    add_friend: {
      imagePath: path.join(refFolder, "4-add_friend-900-720-300-100.png"),
      regionOfInterest: { x: 900, y: 720, w: 300, h: 100 },
      diffThresh: 0.25,
    },
    confirm_result: {
      imagePath: path.join(refFolder, "5-confirm_results-2050-950-255-95.png"),
      regionOfInterest: { x: 2050, y: 950, w: 255, h: 95 },
      diffThresh: 0.25,
    },
    try_again: {
      imagePath: path.join(refFolder, "6-try_again-1895-950-405-100.png"),
      regionOfInterest: { x: 1895, y: 950, w: 405, h: 100 },
      diffThresh: 0.25,
    },
  } satisfies Record<string, Reference>,
  banshee_refs: {
    start: {
      imagePath: path.join(
        refFolder,
        "banshee_start-1933-941.28125-280-89.png"
      ),
      regionOfInterest: { x: 1933, y: 941, w: 280, h: 89 },
      diffThresh: 0.5,
    },
    confirm: {
      imagePath: path.join(
        refFolder,
        "banshee_confirm-1971-951.28125-240-84.png"
      ),
      regionOfInterest: { x: 1971, y: 951, w: 240, h: 84 },
      diffThresh: 0.5,
    },
    tryagain: {
      imagePath: path.join(
        refFolder,
        "banshee_tryagain-2006-954.28125-202-73.png"
      ),
      regionOfInterest: { x: 2006, y: 954, w: 202, h: 73 },
      diffThresh: 0.5,
    },
  } satisfies Record<string, Reference>,
};
