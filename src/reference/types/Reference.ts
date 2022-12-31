import { RegionOfInterest } from "./RegionOfInterest";

export interface Reference {
  imagePath: string;
  roi?: RegionOfInterest;
}
