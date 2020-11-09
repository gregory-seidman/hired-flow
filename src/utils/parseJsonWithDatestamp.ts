import { SpecializedParser } from "./json";
import { iso8601regex } from "./Datestamp";

function parseIso8601(key: string, value: unknown): any {
    if (typeof value === "string") {
        const dateString: string = value as string;
        if (iso8601regex.test(dateString)) {
            return new Date(dateString);
        }
    }
    return value;
}

export const specializedDatestampParser: SpecializedParser = {
    canParse: (key, value) => ((typeof value === "string") &&
                               iso8601regex.test(value as string)),
    parse: (key, value) => new Date(value as string)
};

export default function parseJsonWithDatestamp(json: string): any {
    return JSON.parse(json, parseIso8601);
}
