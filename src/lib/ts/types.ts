import type { StopInfo } from "./data";

export interface StopWithPosition extends StopInfo {
  position: number;
}
