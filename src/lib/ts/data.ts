/* eslint-disable @typescript-eslint/no-explicit-any */
import cachedJson from '$lib/data/cached.json';

export interface PartialStopInfo {
  stop_id: number;
  stop_code: number;
  stop_name: string;
  stop_desc: string;
  stop_lat: number;
  stop_lon: number;
  stop_url: string;
  location_type: number;
  stop_timezone: string;
  wheelchair_boarding: number;
  platform_code: string;
};

export interface PartialRouteInfo {
  route_id: number;
  agency_id: number;
  route_short_name: string;
  route_long_name: string;
  route_type: number;
  route_color: string;
  route_text_color: string;
};

export interface Trip {
  route_id: number;
  service_id: number;
  trip_id: number;
  trip_headsign: string;
  trip_short_name: string;
  direction_id: number;
  block_id: number;
  shape_id: number;
  wheelchair_accessible: number;
  bikes_allowed: number;
}

export interface StopTime {
  trip: Trip;
  arrival_time: number;
  departure_time: number;
  stop_id: number;
  stop_sequence: number;
  stop_headsign: string;
  pickup_type: number;
  drop_off_type: number;
  timepoint: number;
};

export interface StopInfo extends PartialStopInfo {
  stopTimes: StopTime[];
}
export interface RouteInfo extends PartialRouteInfo {
  routeStops: Record<number, StopTime[]>;
}

export const routeInfos = (cachedJson as any).routeInfos as RouteInfo[];
export const stopInfos = (cachedJson as any).stopInfos as Record<number, StopInfo>;

export interface Path {
  route: RouteInfo;
  start: StopInfo;
  end: StopInfo;
  startTime: number;
  endTime: number;
}
