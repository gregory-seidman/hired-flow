
type Datestamp = Date;
export default Datestamp;

export const endOfTime: Datestamp = new Date(9999, 12);
export const startOfTime: Datestamp = new Date(0, 1);

export function justYesterday(): Datestamp {
    const now: Date = new Date();
    const pastMidnight: number = (
        now.getMilliseconds() + 1000 * (
            now.getSeconds() + 60 * (
                now.getMinutes() + 60 * (
                    now.getHours()
                )
            )
        )
    );
    return new Date(now.valueOf() - (pastMidnight + 1));
}

