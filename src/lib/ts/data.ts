import rawStops from '../data/stops.txt?raw';
import rawRoutes from '../data/routes.txt?raw';
import rawStopTimes from '../data/stop_times.txt?raw';
import rawTrips from '../data/trips.txt?raw';
import { convertCsvToArray, convertCsvToObject, getDateObject } from './utils';

interface PartialStopInfo {
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

interface PartialRouteInfo {
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
  arrival_time: Date;
  departure_time: Date;
  stop_id: number;
  stop_sequence: number;
  stop_headsign: string;
  pickup_type: number;
  drop_off_type: number;
  timepoint: number;
};

const trips = convertCsvToArray(rawTrips) as Trip[];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const stopTimes = convertCsvToArray(rawStopTimes).map((item: any) => {
  return {
    ...item,
    arrival_time: getDateObject(item.arrival_time),
    departure_time: getDateObject(item.departure_time),
    trip: trips.find(trip => trip.trip_id === item.trip_id || trip.trip_headsign === item.trip_headsign)
  };
}) as StopTime[];

export interface StopInfo extends PartialStopInfo {
  stopTimes: StopTime[];
}

export const constructStopInfos = (): Record<number, StopInfo> => {
  const stops = convertCsvToObject(rawStops, 'stop_id') as Record<string, PartialStopInfo>;
  const infos = Object.keys(stops).map(stopId => {
    const stop = stops[stopId];
    const stopTimesAtStop = stopTimes.filter(stopTime => stopTime.stop_id === stop.stop_id);
    return {
      ...stop,
      stopTimes: stopTimesAtStop.sort((a, b) => a.arrival_time.getTime() - b.arrival_time.getTime())
    };
  });
  return infos.reduce((acc, stopInfo) => {
    acc[stopInfo.stop_id] = stopInfo;
    return acc;
  }, {} as Record<number, StopInfo>);
}

export const stopInfos = constructStopInfos();

export interface RouteInfo extends PartialRouteInfo {
  routeStops: StopInfo[];
}

const constructRouteInfos = () => {
  const routes = convertCsvToObject(rawRoutes, 'route_id') as Record<string, PartialRouteInfo>;
  const routeInfos = Object.keys(routes).map(routeId => {
    const route = routes[routeId];
    const routeStops = Object.values(stopInfos).filter(stopInfo => {
      return stopTimes.some(stopTime => {
        return stopTime.stop_id === stopInfo.stop_id;
      });
    });
    return {
      ...route,
      routeStops
    };
  });
  return routeInfos;
};

export const routeInfos = constructRouteInfos();
