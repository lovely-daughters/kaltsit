import path from "path";
import { readdirSync } from "fs";
import { Reference } from "../types/Reference";
import { RegionOfInterest } from "../types/RegionOfInterest";

const dirents = readdirSync(__dirname, { withFileTypes: true });
const filteredDirents = dirents.filter((dirent) => dirent.isDirectory());
const directories = filteredDirents.map((dirent) =>
  path.join(__dirname, dirent.name)
);

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
  const nameSplit = pathSplit[pathSplit.length - 1]?.split(".")[0].split("-")!;
  const referenceName = `${pathSplit[pathSplit.length - 2]}/${
    nameSplit[nameSplit.length - 5]
  }`;

  const roi: RegionOfInterest = {
    x: Number(nameSplit[nameSplit.length - 4]) + 3,
    y: Number(nameSplit[nameSplit.length - 3]) + 3,
    width: Number(nameSplit[nameSplit.length - 2]) - 6,
    height: Number(nameSplit[nameSplit.length - 1]) - 6,
  };

  pncRefs.set(referenceName, { imagePath, roi });
});

console.log(pncRefs);
