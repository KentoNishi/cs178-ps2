// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import getDistance from 'gps-distance';
import type { RouteInfo, StopInfo } from "./data";
import { routeInfos } from "./data";
import type { GPS } from './types';

const WALKING_SPEED = 3.2;

interface Path {
  start: StopInfo;
  end: StopInfo;
  route: RouteInfo;
  busOriginDepartureTime: number;
  busDestinationArrivalTime: number;
  tripStartTime: number;
  tripEndTime: number;
  tripDuration: number;
  walkingTimeToStartStop: number;
  walkingTimeFromEndStop: number;
  totalWalkingTime: number;
};

const adjustTime = (time: number, currentTime: Date): number => {
  // set the time of day to the same as the current time
  // but only if the current time of day is earlier than the time of day of the time
  // otherwise, set the time of day to the same as the current time, but the next day
  const timeDate = new Date(time);
  timeDate.setFullYear(currentTime.getFullYear());
  timeDate.setMonth(currentTime.getMonth());
  timeDate.setDate(currentTime.getDate());
  if (timeDate < currentTime) {
    timeDate.setDate(timeDate.getDate() + 1);
  }
  return timeDate.getTime();
};

export const findPaths = (
  origin: GPS,
  destination: GPS,
  currentTime: number,
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
  const fiveBestPaths: Path[] = [];
  const currentDate = new Date(currentTime);
  // routeInfos.forEach(route => {
  //   route.routeStops.forEach(startStop => {
  //     route.routeStops.forEach(endStop => {
  for (const route of routeInfos) {
    for (const startStop of route.routeStops) {
      for (const endStop of route.routeStops) {
        if (startStop.stop_id === endStop.stop_id) continue;
        const distanceToStartStop = getDistance(origin.lat, origin.lon, startStop.stop_lat, startStop.stop_lon);
        const distanceToEndStop = getDistance(origin.lat, origin.lon, endStop.stop_lat, endStop.stop_lon);
        const distanceToDestination = getDistance(origin.lat, origin.lon, destination.lat, destination.lon);
        if (distanceToEndStop > distanceToDestination || distanceToStartStop > distanceToDestination) continue;
        // const startStopTime = startStop.stopTimes.filter(stopTime => {
        //   return adjustTime(stopTime.arrival_time, currentDate) > currentTime;
        // }).sort((a, b) => adjustTime(a.arrival_time, currentDate) - adjustTime(b.arrival_time, currentDate))[0];
        let startStopTime = startStop.stopTimes[startStop.stopTimes.length - 1];
        for (const stopTime of startStop.stopTimes) {
          if (
            adjustTime(stopTime.arrival_time, currentDate) > currentTime &&
            adjustTime(stopTime.arrival_time, currentDate) < adjustTime(startStopTime.arrival_time, currentDate)
          ) {
            startStopTime = stopTime;
          }
        }
        // const endStopTime = endStop.stopTimes.filter(stopTime => {
        //   return adjustTime(stopTime.arrival_time, currentDate) > adjustTime(startStopTime.departure_time, currentDate);
        // }).sort((a, b) => adjustTime(a.arrival_time, currentDate) - adjustTime(b.arrival_time, currentDate))[0];
        let endStopTime = endStop.stopTimes[endStop.stopTimes.length - 1];
        for (const stopTime of endStop.stopTimes) {
          if (
            adjustTime(stopTime.arrival_time, currentDate) > adjustTime(startStopTime.departure_time, currentDate) &&
            adjustTime(stopTime.arrival_time, currentDate) < adjustTime(endStopTime.departure_time, currentDate)
          ) {
            endStopTime = stopTime;
          }
        }
        const distanceFromEndStop = getDistance(destination.lat, destination.lon, endStop.stop_lat, endStop.stop_lon);
        const walkingTimeToStartStop = distanceToStartStop / WALKING_SPEED * 60;
        const walkingTimeFromEndStop = distanceFromEndStop / WALKING_SPEED * 60;
        const tripStartTime = new Date(Math.min(currentTime, adjustTime(startStopTime.departure_time, currentDate) - walkingTimeToStartStop * 60 * 1000)).getTime();
        const tripEndTime = new Date(adjustTime(endStopTime.arrival_time, currentDate) + walkingTimeFromEndStop * 60 * 1000).getTime();
        const path: Path = {
          start: startStop,
          end: endStop,
          route,
          busOriginDepartureTime: adjustTime(startStopTime.departure_time, currentDate),
          busDestinationArrivalTime: adjustTime(endStopTime.arrival_time, currentDate),
          tripStartTime,
          tripEndTime,
          walkingTimeToStartStop,
          walkingTimeFromEndStop,
          tripDuration: (tripEndTime - tripStartTime) / 1000 / 60,
          totalWalkingTime: walkingTimeToStartStop + walkingTimeFromEndStop,
        };
        // only add the path if the trip duration is less than any of the trip durations of the five best paths
        if (fiveBestPaths.length < 5 || path.tripEndTime < fiveBestPaths[fiveBestPaths.length - 1].tripEndTime) {
          fiveBestPaths.push(path);
          fiveBestPaths.sort((a, b) => a.tripEndTime - b.tripEndTime);
          if (fiveBestPaths.length > 5) fiveBestPaths.pop();
        }
      }
    }
  }
  return fiveBestPaths.sort((a, b) => {
    if (a.tripEndTime === b.tripEndTime) {
      return a.tripDuration - b.tripDuration;
    }
    return a.tripEndTime - b.tripEndTime;
  });
};
