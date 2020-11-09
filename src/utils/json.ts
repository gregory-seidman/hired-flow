
export type JsonPropParser = (key: string, value: unknown) => any;

export interface SpecializedParser {
    canParse: (key: string, value: unknown) => boolean;
    parse: JsonPropParser
}

function combineParsers(parsers: SpecializedParser[]): JsonPropParser {
    return (key: string, value: unknown) => {
        const parser = parsers.find(p => p.canParse(key, value));
        return parser ? parser.parse(key, value) : value;
    };
}

export function parseJson(json: string, parsers: SpecializedParser[]): any {
    return JSON.parse(json, combineParsers(parsers));
}
