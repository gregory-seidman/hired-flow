export type Datestamp = Date;

export const iso8601regex = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*))(?:Z|(\+|-)([\d|:]*))?$/;

export function fromIso8601(iso8601: string): Datestamp {
    if (!iso8601regex.test(iso8601)) {
        throw new Error("invalid ISO 8601 format");
    }
    return new Date(iso8601);
}

export function compareDatestamps(aDate: Datestamp, bDate: Datestamp): number {
    return (aDate === bDate) ? 0 :
        ((aDate < bDate) ? -1 : 1);
}

export const endOfTime: Datestamp = new Date(9999, 12);
export const startOfTime: Datestamp = new Date(0, 1);

function pastMidnightMillis(date: Date): number {
    return (
        date.getMilliseconds() + 1000 * (
            date.getSeconds() + 60 * (
                date.getMinutes() + 60 * (
                    date.getHours()
                )
            )
        )
    );
}

export function today(): Datestamp {
    const now: Date = new Date();
    const pastMidnight: number = pastMidnightMillis(now);
    return new Date(now.valueOf() - (pastMidnight - 1));
}

export function justYesterday(): Datestamp {
    const now: Date = new Date();
    const pastMidnight: number = pastMidnightMillis(now);
    return new Date(now.valueOf() - (pastMidnight + 1));
}

