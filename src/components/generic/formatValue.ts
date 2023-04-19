import dayjs from "dayjs";

const dateFormat = "YYYY-MM-DD";
const dateTimeFormat = "YYYY-MM-DDTHH:mm:ssZ[Z]";

export default function formatValue(value: any): string {
    switch (typeof(value)) {
        case "string":
            return value;
        case "number":
            return value.toString();
        case "object":
            if (!value) return "";
            if (value instanceof Date) {
                const format = (
                    value.getHours() +
                    value.getMinutes() +
                    value.getSeconds() +
                    value.getMilliseconds()
                    ) ? dateTimeFormat : dateFormat;
                const formatted = dayjs(value).format(format);
                return formatted;
            }
            return value.toString();
        default:
            if (!value) return "";
            return value.toString();
    }
}