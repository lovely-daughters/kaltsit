import path from "path";

const refFolder = path.join(__dirname, "reference");

export const epic7 = {
  initActivity: "com.stove.epic7.google/kr.supercreative.epic7.AppActivity",
  refs: {
    select_team: {
      imagePath: path.join(refFolder, "1-select_team-1960-980-175-35.png"),
      regionOfInterest: { x: 1785, y: 920, w: 545, h: 145 },
    },
    start: {
      imagePath: path.join(refFolder, "2-start-2030-955-230-80.png"),
      regionOfInterest: { x: 1785, y: 920, w: 545, h: 145 },
    },
    stage_clear: {
      imagePath: path.join(refFolder, "3-stage_clear-1040-135-370-250.png"),
      regionOfInterest: { x: 1040, y: 135, w: 370, h: 250 },
    },
    add_friend: {
      imagePath: path.join(refFolder, "4-add_friend-900-720-300-100.png"),
      regionOfInterest: { x: 900, y: 720, w: 300, h: 100 },
    },
    confirm_result: {
      imagePath: path.join(refFolder, "5-confirm_results-2050-950-255-95.png"),
      regionOfInterest: { x: 2050, y: 950, w: 255, h: 95 },
    },
    try_again: {
      imagePath: path.join(refFolder, "6-try_again-1895-950-405-100.png"),
      regionOfInterest: { x: 1895, y: 950, w: 405, h: 100 },
    },
  },
};
