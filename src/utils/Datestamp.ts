import dayjs, { Dayjs, OpUnitType } from "dayjs";

export type Datestamp = Dayjs;

export const iso8601regex = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*))(?:Z|(\+|-)([\d|:]*))?$/;

export function fromIso8601(iso8601: string): Datestamp {
    if (!iso8601regex.test(iso8601)) {
        throw new Error("invalid ISO 8601 format");
    }
    return dayjs(iso8601);
}

export function compareDatestamps(aDate: Datestamp, bDate: Datestamp): number {
    return (aDate === bDate) ? 0 :
        ((aDate < bDate) ? -1 : 1);
}

export const endOfTime: Datestamp = dayjs(new Date(9999, 12));
export const startOfTime: Datestamp = dayjs(new Date(0, 1));

export function today(): Datestamp {
    return dayjs().startOf('day');
}

export function justYesterday(): Datestamp {
    return today().subtract(1, "ms");
}

