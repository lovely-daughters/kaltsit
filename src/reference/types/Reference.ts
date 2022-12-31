import { RegionOfInterest } from "./RegionOfInterest";

export interface Reference {
  name: string;
  imagePath: string;
  roi: RegionOfInterest;
}
