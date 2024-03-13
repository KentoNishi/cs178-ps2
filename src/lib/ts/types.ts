import type { StopInfo } from "./data";

export interface StopWithPosition extends StopInfo {
  position: number;
}

export interface GPS {
  lat: number;
  lon: number;
};
