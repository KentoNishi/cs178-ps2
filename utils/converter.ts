// import rawStops from '../data/stops.txt?raw';
// import rawRoutes from '../data/routes.txt?raw';
// import rawStopTimes from '../data/stop_times.txt?raw';
// import rawTrips from '../data/trips.txt?raw';
import { readFileSync, writeFileSync } from 'fs';
import { convertCsvToArray, convertCsvToObject, getDateObject } from '../src/lib/ts/utils';
import type { Trip, StopTime, StopInfo, PartialStopInfo, PartialRouteInfo, RouteInfo } from '../src/lib/ts/data';
const rawStops = readFileSync('./src/lib/data/stops.txt', 'utf8');
const rawRoutes = readFileSync('./src/lib/data/routes.txt', 'utf8');
const rawStopTimes = readFileSync('./src/lib/data/stop_times.txt', 'utf8');
const rawTrips = readFileSync('./src/lib/data/trips.txt', 'utf8');

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

export const constructStopInfos = (): Record<number, StopInfo> => {
  const stops = convertCsvToObject(rawStops, 'stop_id') as Record<string, PartialStopInfo>;
  const infos = Object.keys(stops).map(stopId => {
    const stop = stops[stopId];
    const stopTimesAtStop = stopTimes.filter(stopTime => stopTime.stop_id === stop.stop_id);
    return {
      ...stop,
      stopTimes: stopTimesAtStop.sort((a, b) => a.departure_time - b.departure_time)
    };
  });
  return infos.reduce((acc, stopInfo) => {
    acc[stopInfo.stop_id] = stopInfo;
    return acc;
  }, {} as Record<number, StopInfo>);
}

export const stopInfos = constructStopInfos();

const constructRouteInfos = (): RouteInfo[] => {
  const routes = convertCsvToObject(rawRoutes, 'route_id') as Record<string, PartialRouteInfo>;
  const routeInfos = Object.keys(routes).map(routeId => {
    const route = routes[routeId];
    const routeStopsList = stopTimes.filter(stopTime => {
      return stopTime.trip.route_id === route.route_id;
    });
    const routeStops = {} as Record<number, StopTime[]>;
    routeStopsList.forEach(stopTime => {
      if (routeStops[stopTime.stop_sequence]) {
        routeStops[stopTime.stop_sequence].push(stopTime);
      } else {
        routeStops[stopTime.stop_sequence] = [stopTime];
      }
    });
    for (const stopSequence in routeStops) {
      routeStops[stopSequence] = routeStops[stopSequence].sort((a, b) => a.departure_time - b.departure_time);
    }
    return {
      ...route,
      routeStops: routeStops
    };
  });
  return routeInfos;
};

export const routeInfos = constructRouteInfos();

writeFileSync('./src/lib/data/cached.json', JSON.stringify({ stopInfos, routeInfos }, null, 2), 'utf8');

// using routeInfos, print all stop names for each route
routeInfos.forEach(routeInfo => {
  console.log(routeInfo.route_long_name);
  const str = Object.keys(routeInfo.routeStops).map(stopSequence => {
    return stopInfos[routeInfo.routeStops[stopSequence][0].stop_id].stop_name;
  }).join(', ');
  console.log(str, '\n');
});
