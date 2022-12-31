import path from "path";
import { readdirSync } from "fs";
import { Reference } from "../types/Reference";
import { RegionOfInterest } from "../types/RegionOfInterest";

// get image directories
const dirents = readdirSync(__dirname, { withFileTypes: true });
const filteredDirents = dirents.filter((dirent) => dirent.isDirectory());
const directories = filteredDirents.map((dirent) =>
  path.join(__dirname, dirent.name)
);

// get images from image directories
const imagePaths: string[] = [];
directories.forEach((directory) => {
  const files = readdirSync(directory);
  files.forEach((file) => {
    const filePath = path.join(directory, file);
    file.endsWith(".png") ? imagePaths.push(filePath) : null;
  });
});

export const pncRefs = new Map<string, Reference>();
imagePaths.forEach((imagePath) => {
  const pathSplit = imagePath.split("/");
  const fileNameSplit = pathSplit[pathSplit.length - 1]
    ?.split(".")[0] // remove extension
    .split("-")!; // separate out roi
  const referenceName = `${pathSplit[pathSplit.length - 2]}/${
    fileNameSplit[fileNameSplit.length - 5]
  }`;

  const roi: RegionOfInterest = {
    x: Number(fileNameSplit[fileNameSplit.length - 4]) + 3,
    y: Number(fileNameSplit[fileNameSplit.length - 3]) + 3,
    width: Number(fileNameSplit[fileNameSplit.length - 2]) - 6,
    height: Number(fileNameSplit[fileNameSplit.length - 1]) - 6,
    // need -6 since xy +3 leads to 2x gap on rect opp side
  };

  pncRefs.set(referenceName, { name: referenceName, imagePath, roi });
});
