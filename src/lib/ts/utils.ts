// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import csvToJson from 'convert-csv-to-json';

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

