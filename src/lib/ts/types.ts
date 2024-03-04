import type { StopInfo } from "./stops";

export interface StopWithPosition extends StopInfo {
  position: number;
}
