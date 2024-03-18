// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import getDistance from 'gps-distance';
import type { RouteInfo, StopInfo, StopTime } from "./data";
import { routeInfos, stopInfos } from "./data";
import type { GPS, TripUpdates, VehiclePositions } from './types';

const WALKING_SPEED = 3.2;

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

interface PathWithRealtimeData extends Path {
  realtime: {
    currentPosition: GPS;
    currentStopSequence: number;
    currentStopId: number;
    lastUpdated: number;
    vehicleId: string;
    expectedArrivalAtStartStop: number;
    expectedArrivalAtEndStop: number;
  }
};

export interface PathWithRealtimeUncertainty extends PathWithRealtimeData {
  uncertainty: {
    departureLowEnd: number;
    departureHighEnd: number;
    arrivalLowEnd: number;
    arrivalHighEnd: number;
  }
}

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
  if (a.tripEndTime === b.tripEndTime) {
    return a.totalWalkingTime - b.totalWalkingTime;
  }
  // if (a.route.route_id === b.route.route_id) {
  //   const startSequenceA = a.start.stopTime.stop_sequence;
  //   const startSequenceB = b.start.stopTime.stop_sequence;
  //   let endSequenceA = a.end.stopTime.stop_sequence;
  //   if (endSequenceA < startSequenceA) endSequenceA += a.route.maxRouteSequence;
  //   let endSequenceB = b.end.stopTime.stop_sequence;
  //   if (endSequenceB < startSequenceB) endSequenceB += b.route.maxRouteSequence;
  //   return (endSequenceA - startSequenceA) - (endSequenceB - startSequenceB);
  // }
  return a.tripEndTime - b.tripEndTime;
}

export const findPaths = (
  origin: GPS,
  destination: GPS,
  currentTime: number,
  N=3
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
  // const walkingTime = timeToWalk(origin, destination);
  for (const route of routeInfos.filter(item => {
    return ![777, 783, 785].includes(item.route_id)
  })) {
    // for (const startStopKey of Object.keys(route.routeStops)) {
    let startStopKey = -1;
    // pick the closest stop to the origin
    let minDistanceToStartStop = Infinity;
    for (const key in route.routeStops) {
      const stopInfo = stopInfos[route.routeStops[key as unknown as number][0].stop_id];
      const distanceToStartStop = getDistance(origin.lat, origin.lon, stopInfo.stop_lat, stopInfo.stop_lon);
      if (distanceToStartStop < minDistanceToStartStop) {
        minDistanceToStartStop = distanceToStartStop;
        startStopKey = key as unknown as number;
      }
    }
    if (startStopKey === -1) continue;
    const startStopInfo = stopInfos[route.routeStops[startStopKey as unknown as number][0].stop_id];
    const distanceToStartStop = getDistance(origin.lat, origin.lon, startStopInfo.stop_lat, startStopInfo.stop_lon);
    // for (const endStopKey of Object.keys(route.routeStops)) 
    let endStopKey = -1;
    // pick the closest stop to the destination
    let minDistanceToEndStop = Infinity;
    for (const key in route.routeStops) {
      const stopInfo = stopInfos[route.routeStops[key as unknown as number][0].stop_id];
      const distanceToEndStop = getDistance(destination.lat, destination.lon, stopInfo.stop_lat, stopInfo.stop_lon);
      if (distanceToEndStop < minDistanceToEndStop) {
        minDistanceToEndStop = distanceToEndStop;
        endStopKey = key as unknown as number;
      }
    }
    // console.log('considering riding from ', startStopInfo.stop_name, ' to ', stopInfos[route.routeStops[endStopKey as unknown as number][0].stop_id].stop_name, ' on route ', route.route_long_name);
    const endStopInfo = stopInfos[route.routeStops[endStopKey as unknown as number][0].stop_id];
    if (startStopInfo.stop_id === endStopInfo.stop_id) continue;
    const walkingTimeToStartStop = distanceToStartStop / WALKING_SPEED * 60;
    const currentDateWithWalk = new Date(
      currentDate.getTime() + walkingTimeToStartStop * 60 * 1000
    );
    const startStopTime = startStopInfo.stopTimes.filter(item => {
      return item.trip.route_id === route.route_id;
    }).sort((a, b) => adjustTime(a.arrival_time, currentDateWithWalk) - adjustTime(b.arrival_time, currentDateWithWalk))[0];
    if (!startStopTime) continue;
    const departureDate = new Date(adjustTime(startStopTime.departure_time, currentDateWithWalk));
    const endStopTime = endStopInfo.stopTimes.filter(item => {
      return item.trip.route_id === route.route_id && stopInfos[item.stop_id].stop_id === endStopInfo.stop_id;
    }).sort((a, b) => adjustTime(a.arrival_time, departureDate) - adjustTime(b.arrival_time, departureDate))[0];
    if (!endStopTime) continue;
    const distanceFromEndStop = getDistance(destination.lat, destination.lon, endStopInfo.stop_lat, endStopInfo.stop_lon);
    const walkingTimeFromEndStop = distanceFromEndStop / WALKING_SPEED * 60;
    const tripStartTime = new Date(adjustTime(startStopTime.departure_time, currentDateWithWalk) - walkingTimeToStartStop * 60 * 1000).getTime();
    const tripEndTime = new Date(adjustTime(endStopTime.arrival_time, departureDate) + walkingTimeFromEndStop * 60 * 1000).getTime();
    const busOriginDepartureTime = adjustTime(startStopTime.departure_time, currentDate);
    const busDestinationArrivalTime = adjustTime(endStopTime.arrival_time, departureDate);
    if (distanceToStartStop + distanceFromEndStop > distanceToDestination) continue;
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
    // console.log(path.route.route_long_name, path.start.stopInfo.stop_name, path.end.stopInfo.stop_name, path.tripDuration, path.totalWalkingTime, path.totalRidingTime, new Date(path.tripStartTime).toLocaleTimeString(), new Date(path.tripEndTime).toLocaleTimeString());
    // const index = bestPaths.findIndex(p => {
    //   return p.route.route_id === path.route.route_id;
    // });
    // if (index !== -1) {
    //   if (sortFunc(path, bestPaths[index]) < 0) {
    //     bestPaths[index] = path;
    //     bestPaths.sort(sortFunc);
    //   }
    //   continue;
    // }
    if (
      bestPaths.length < N ||
      sortFunc(path, bestPaths[bestPaths.length - 1]) <= 0
    ) {
      bestPaths.push(path);
      bestPaths.sort(sortFunc);
      if (bestPaths.length > N) bestPaths.pop();
    }
    // }
  }
  return bestPaths.filter(item => {
    return item.tripEndTime > currentTime && item.tripEndTime < currentTime + 1.5 * 60 * 60 * 1000;
  });
};

const augmentRealtimeData = async (path: Path): Promise<PathWithRealtimeData> => {
  const [tripUpdates, vehiclePositions]: [TripUpdates, VehiclePositions] = await Promise.all([fetch(
    'https://corsproxy.io/?https://passio3.com/harvard/passioTransit/gtfs/realtime/tripUpdates.json'
  ).then(res => res.json()), fetch(
    'https://corsproxy.io/?https://passio3.com/harvard/passioTransit/gtfs/realtime/vehiclePositions.json'
  ).then(res => res.json())]);
  // const tripUpdate = tripUpdates.entity.find(entity => parseInt(entity.trip_update.trip.trip_id) == path.trip.trip_id);
  // instead of ==, find the item with the closest trip id in absolute value
  let tripUpdate = tripUpdates.entity[0];
  for (const entity of tripUpdates.entity) {
    if (
      Math.abs(parseInt(entity.trip_update.trip.trip_id) - path.trip.trip_id) <
      Math.abs(parseInt(tripUpdate.trip_update.trip.trip_id) - path.trip.trip_id)
    ) {
      tripUpdate = entity;
    }
  }
  const unsolvedArrivalAtStart = tripUpdate.trip_update.stop_time_update.find(update => parseInt(update.stop_id) == path.start.stopInfo.stop_id)?.arrival.time;
  const unsolvedArrivalAtEnd = tripUpdate.trip_update.stop_time_update.find(update => parseInt(update.stop_id) == path.end.stopInfo.stop_id)?.arrival.time;
  const expectedArrivalAtStartStop = unsolvedArrivalAtStart ? (unsolvedArrivalAtStart * 1000 - tripUpdates.header.timestamp * 1000 + Date.now()) : path.busOriginDepartureTime;
  const expectedArrivalAtEndStop = unsolvedArrivalAtEnd ? (unsolvedArrivalAtEnd * 1000 - tripUpdates.header.timestamp * 1000 + Date.now()) : path.busDestinationArrivalTime;
  // const vehicle = vehiclePositions.entity.find(entity => parseInt(entity.vehicle.trip.trip_id) == parseInt(tripUpdate.trip_update.trip.trip_id)) as VehiclePositions['entity'][0];
  let vehicle = vehiclePositions.entity[0];
  for (const entity of vehiclePositions.entity) {
    if (Math.abs(parseInt(entity.vehicle.trip.trip_id) - path.trip.trip_id) < Math.abs(parseInt(vehicle.vehicle.trip.trip_id) - path.trip.trip_id)) {
      vehicle = entity;
    }
  }
  const currentPosition = {
    lat: vehicle.vehicle.position.latitude,
    lon: vehicle.vehicle.position.longitude
  };
  const currentStopSequence = vehicle.vehicle.current_stop_sequence;
  const currentStopId = parseInt(vehicle.vehicle.stop_id);
  const lastUpdated = vehicle.vehicle.timestamp;
  const vehicleId = vehicle.id;
  return {
    ...path,
    realtime: {
      currentPosition,
      currentStopSequence,
      currentStopId,
      lastUpdated,
      vehicleId,
      expectedArrivalAtStartStop,
      expectedArrivalAtEndStop
    }
  };
};

export const augmentRealtimeUncertainty = async (item: Path): Promise<PathWithRealtimeUncertainty> => {
  const path = await augmentRealtimeData(item);
  const departureLowEnd = Math.min(path.busOriginDepartureTime, path.realtime.expectedArrivalAtStartStop);
  const departureHighEnd = Math.max(path.busOriginDepartureTime, path.realtime.expectedArrivalAtStartStop);
  const arrivalLowEnd = Math.min(path.busDestinationArrivalTime, path.realtime.expectedArrivalAtEndStop);
  const arrivalHighEnd = Math.max(path.busDestinationArrivalTime, path.realtime.expectedArrivalAtEndStop);
  return {
    ...path,
    uncertainty: {
      departureLowEnd,
      departureHighEnd,
      arrivalLowEnd,
      arrivalHighEnd
    }
  };
}

export const getPaths = async (
  origin: GPS,
  destination: GPS,
  currentTime: number
): Promise<PathWithRealtimeUncertainty[]> => {
  const paths = findPaths(origin, destination, currentTime);
  const augmentedPaths = await Promise.all(paths.map(augmentRealtimeUncertainty));
  return augmentedPaths;
}
