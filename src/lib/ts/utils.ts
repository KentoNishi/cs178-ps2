// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import csvToJson from 'convert-csv-to-json';
import type { TickWithPosition } from './types';

export const convertCsvToObject = (csv: string, key: string) => {
  const arr = convertCsvToArray(csv);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return arr.reduce((acc, item) => {
    acc[item[key]] = item;
    return acc;
  }, {} as Record<string, unknown>);
}

export const convertCsvToArray = (csv: string) => {
  return csvToJson.formatValueByType().fieldDelimiter(',').csvStringToJson(csv);
}

const isDaylightSaving = (d: Date): boolean => {
  const start = new Date(d.getFullYear(), 2, 14 - new Date(d.getFullYear(), 2, 1).getDay());
  const end = new Date(d.getFullYear(), 10, 7 - new Date(d.getFullYear(), 10, 1).getDay());
  return d >= start && d < end;
};

export const getDateObject = (timeString: string): Date => {
  const date = new Date();
  const [hours, minutes, seconds] = timeString.split(':').map(Number);
  const offset = date.getTimezoneOffset() + 300;
  date.setUTCHours(hours + (isDaylightSaving(date) ? offset - 60 : offset), minutes, seconds);
  return date;
};

export const formatDate = (date: number) => {
  const d = new Date(date);
  // hour:minute, 12 hour, no zeros, no am/pm, no seconds
  return d
    .toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
      hourCycle: 'h23'
    })
    .slice(0, -3);
};

export const getEstimate = (tick: TickWithPosition, index: number) => {
  if (index == 1) {
    const f1 = formatDate(tick.uncertainty.departureLowEnd);
    const f2 = formatDate(tick.uncertainty.departureHighEnd);
    if (f1 == f2) return f1;
    return `${f1}–${f2}`;
  }
  const f1 = formatDate(tick.uncertainty.arrivalLowEnd);
  const f2 = formatDate(tick.uncertainty.arrivalHighEnd);
  if (f1 == f2) return f1;
  return `${f1}–${f2}`;
};

export const getETA = (uncertainty: TickWithPosition['uncertainty']) => {
  // "in X-XX minutes"
  const depLow = new Date(uncertainty.departureLowEnd);
  const depHigh = new Date(uncertainty.departureHighEnd);
  const now = new Date();
  const depLowDiff = Math.max(0, depLow.getTime() - now.getTime());
  const depHighDiff = Math.max(0, depHigh.getTime() - now.getTime());
  const depLowMinutes = Math.floor(depLowDiff / 60000);
  const depHighMinutes = Math.floor(depHighDiff / 60000);
  if (depLowMinutes != depHighMinutes) return `Departs in ${depLowMinutes}–${depHighMinutes} minutes`;
  return `Departs in ${depHighMinutes} minutes`;
};

export const getETABounds = (ticks: TickWithPosition[], walkingTimeFromEndStop: number) => {
  const timeLowerBound = formatDate(
		ticks[2].uncertainty.arrivalLowEnd +walkingTimeFromEndStop * 60 * 1000
	);
	const timeHigherBound = formatDate(
		ticks[3].uncertainty.arrivalHighEnd + walkingTimeFromEndStop * 60 * 1000
	);
  return { timeLowerBound, timeHigherBound };
}