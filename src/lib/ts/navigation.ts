// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import getDistance from 'gps-distance';
import type { RouteInfo, StopInfo, StopTime } from "./data";
import { routeInfos, stopInfos } from "./data";
import type { GPS } from './types';

const WALKING_SPEED = 4;

interface StopTimeWithMeta {
  stopTime: StopTime;
  stopInfo: StopInfo;
}

interface Path {
  start: StopTimeWithMeta;
  end: StopTimeWithMeta;
  route: RouteInfo;
  busOriginDepartureTime: number;
  busDestinationArrivalTime: number;
  tripStartTime: number;
  tripEndTime: number;
  tripDuration: number;
  walkingTimeToStartStop: number;
  walkingTimeFromEndStop: number;
  totalWalkingTime: number;
  totalRidingTime: number;
  trip: StopTime['trip'];
};

const adjustTime = (time: number, currentTime: Date): number => {
  // set the time of day to the same as the current time
  // but only if the current time of day is earlier than the time of day of the time
  // otherwise, set the time of day to the same as the current time, but the next day
  const timeDate = new Date(time);
  timeDate.setFullYear(currentTime.getFullYear());
  timeDate.setMonth(currentTime.getMonth());
  timeDate.setDate(currentTime.getDate());
  if (timeDate.getTime() < currentTime.getTime()) {
    timeDate.setDate(timeDate.getDate() + 1);
  }
  return timeDate.getTime();
};

export const timeToWalk = (origin: GPS, destination: GPS): number => {
  return getDistance(origin.lat, origin.lon, destination.lat, destination.lon) / WALKING_SPEED * 60;
}

const sortFunc = (a: Path, b: Path): number => {
  if (a.tripDuration === b.tripDuration) {
    return a.totalWalkingTime - b.totalWalkingTime;
  }
  return a.tripDuration - b.tripDuration;
}

export const findPaths = (
  origin: GPS,
  destination: GPS,
  currentTime: number,
  N=5
): Path[] => {
  // have a list of Path objects
  // go through all the routes
  //   for each startStop in the route
  //     for each endStop in the route
  //       find the soonest departure_time from startStop after currentTime
  //       find the soonest arrival_time at endStop after the startStop departure_time
  //       find distance in km between the origin and startStop, as well as the destination and endStop
  //         using a value of 5 km/h for walking speed, calculate the time it would take to walk to the startStop and from the endStop to the destination
  //       append a new Path object to the list of Path objects
  // sort the list of Path objects by tripEndTime
  // return the list of Path objects
  const bestPaths: Path[] = [];
  const currentDate = new Date(currentTime);
  // routeInfos.forEach(route => {
  //   route.routeStops.forEach(startStop => {
  //     route.routeStops.forEach(endStop => {
  const distanceToDestination = getDistance(origin.lat, origin.lon, destination.lat, destination.lon);
  for (const route of routeInfos) {
    for (const startStopKey of Object.keys(route.routeStops)) {
      const startStopInfo = stopInfos[route.routeStops[startStopKey as unknown as number][0].stop_id];
      const distanceToStartStop = getDistance(origin.lat, origin.lon, startStopInfo.stop_lat, startStopInfo.stop_lon);
      if (distanceToStartStop > distanceToDestination) continue;
      for (const endStopKey of Object.keys(route.routeStops)) {
        // console.log('considering riding from ', startStopInfo.stop_name, ' to ', stopInfos[route.routeStops[endStopKey as unknown as number][0].stop_id].stop_name, ' on route ', route.route_long_name);
        const endStopInfo = stopInfos[route.routeStops[endStopKey as unknown as number][0].stop_id];
        if (startStopInfo.stop_id === endStopInfo.stop_id) break;
        const distanceToEndStop = getDistance(origin.lat, origin.lon, endStopInfo.stop_lat, endStopInfo.stop_lon);
        if (distanceToEndStop > distanceToDestination) continue;
        const walkingTimeToStartStop = distanceToStartStop / WALKING_SPEED * 60;
        const currentDateWithWalk = new Date(
          currentDate.getTime() + walkingTimeToStartStop * 60 * 1000
        );
        const startStopTime = startStopInfo.stopTimes.sort((a, b) => adjustTime(a.arrival_time, currentDateWithWalk) - adjustTime(b.arrival_time, currentDateWithWalk))[0];
        if (!startStopTime) continue;
        const departureDate = new Date(adjustTime(startStopTime.departure_time, currentDateWithWalk));
        const endStopTime = endStopInfo.stopTimes.filter(item => {
          const diff = ((item.trip.trip_headsign as unknown as number) - (startStopTime.trip.trip_headsign as unknown as number));
          return item.trip.trip_id === startStopTime.trip.trip_id ||
            (item.trip.trip_headsign && item.trip.trip_headsign == startStopTime.trip.trip_headsign) ||
            (Math.abs(diff) <= 1 && diff >= 0);
        }).sort((a, b) => adjustTime(a.arrival_time, departureDate) - adjustTime(b.arrival_time, departureDate))[0];
        if (!endStopTime) continue;
        const distanceFromEndStop = getDistance(destination.lat, destination.lon, endStopInfo.stop_lat, endStopInfo.stop_lon);
        const walkingTimeFromEndStop = distanceFromEndStop / WALKING_SPEED * 60;
        const tripStartTime = new Date(adjustTime(startStopTime.departure_time, currentDateWithWalk) - walkingTimeToStartStop * 60 * 1000).getTime();
        const tripEndTime = new Date(adjustTime(endStopTime.arrival_time, departureDate) + walkingTimeFromEndStop * 60 * 1000).getTime();
        const busOriginDepartureTime = adjustTime(startStopTime.departure_time, currentDate);
        const busDestinationArrivalTime = adjustTime(endStopTime.arrival_time, departureDate);
        const path: Path = {
          start: { stopTime: startStopTime, stopInfo: startStopInfo },
          end: { stopTime: endStopTime, stopInfo: endStopInfo },
          route,
          busOriginDepartureTime,
          busDestinationArrivalTime,
          tripStartTime,
          tripEndTime,
          walkingTimeToStartStop,
          walkingTimeFromEndStop,
          tripDuration: (tripEndTime - tripStartTime) / 1000 / 60,
          totalWalkingTime: walkingTimeToStartStop + walkingTimeFromEndStop,
          totalRidingTime: busDestinationArrivalTime - busOriginDepartureTime,
          trip: endStopTime.trip
        };
        const index = bestPaths.findIndex(p => {
          return p.route.route_id === path.route.route_id;
        });
        if (index !== -1) {
          if (bestPaths[index].tripDuration > path.tripDuration || (
            bestPaths[index].tripDuration === path.tripDuration &&
            bestPaths[index].totalWalkingTime > path.totalWalkingTime
          )) {
            bestPaths[index] = path;
            bestPaths.sort(sortFunc);
          }
          continue;
        }
        if (
          bestPaths.length < N ||
          path.tripDuration < bestPaths[bestPaths.length - 1].tripDuration
        ) {
          bestPaths.push(path);
          bestPaths.sort(sortFunc);
          if (bestPaths.length > N) bestPaths.pop();
        }
      }
    }
  }
  return bestPaths;
};
