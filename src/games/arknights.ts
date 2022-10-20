import path from "path";

const refFolder = path.join(__dirname, "reference");

export const arknights = {
  initActivity: "com.YoStarEN.Arknights/com.u8.sdk.U8UnityContext",
  refs: {
    start: {
      imagePath: path.join(refFolder, "start-1980-960-320-100.png"),
      regionOfInterest: { x: 1980, y: 960, w: 320, h: 100 },
    },
    mission_start: {
      imagePath: path.join(refFolder, "mission_start-1765-550-205-420.png"),
      regionOfInterest: { x: 1765, y: 550, w: 205, h: 420 },
    },
    mission_in_progress: {
      imagePath: path.join(refFolder, "mission_in_progress-75-25-100-115.png"),
      regionOfInterest: { x: 75, y: 25, w: 100, h: 115 },
    },
    mission_results: {
      imagePath: path.join(refFolder, "mission_results-100-260-420-155.png"),
      regionOfInterest: { x: 100, y: 260, w: 420, h: 155 },
    },
  },
};
