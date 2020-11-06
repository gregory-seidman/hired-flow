import { RowData, CellValue } from "@material-ui/data-grid";
import { JobStatus } from "../enums";
import { Job, Interaction } from "../models";
import { columnDefs } from "./columnBuilder";

type JobFieldExtractor = (job: Job) => CellValue;

function makeSimpleExtractor(field: keyof Job): JobFieldExtractor {
    return (job: Job) => job[field];
}

function makeDetailsExtractor(field: string): JobFieldExtractor {
    const subfield: string = field.replace("details.", "");
    return (job: Job) => job.details[subfield];
}

const endOfTime: Date = new Date(9999, 12);
const startOfTime: Date = new Date(0, 1);

function justYesterday(): Date {
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

function getLastInteraction(interactions: Interaction[]): Date|null {
    const guard: Date = startOfTime;
    const now: Date = justYesterday();
    const mostRecent: Date = interactions.reduce(
        (latest,interaction) => {
            const { date } = interaction;
            return (date > now) ? latest : (
                (date > latest) ? date : latest
            );
        },
        guard
    );
    return (mostRecent === guard) ? null : mostRecent;
}

function getNextInteraction(interactions: Interaction[]): Date|null {
    const guard: Date = endOfTime;
    const now: Date = justYesterday();
    const immediateNext: Date = interactions.reduce(
        (nearest,interaction) => {
            const { date } = interaction;
            return (date < now) ? nearest : (
                (date < nearest) ? date : nearest
            );
        },
        guard
    );
    return (immediateNext === guard) ? null : immediateNext;
}

interface JobFieldMapper {
    field: string;
    extractor: JobFieldExtractor;
}

const syntheticFieldExtractors: { [fieldName: string]: JobFieldExtractor } = {
    "_lastInteractionDate": (job: Job) =>
        getLastInteraction(job.interactions),
    "_nextInteractionDate": (job: Job) =>
        getNextInteraction(job.interactions),
    "status": (job: Job) => {
        const { status, eliminatedReason } = job;
        return (status === JobStatus.Eliminated) ?
            `${status}: ${eliminatedReason}` :
            status;
    }
};

function getFieldExtractor(field: string): JobFieldExtractor {
    if (syntheticFieldExtractors.hasOwnProperty(field)) {
        return syntheticFieldExtractors[field];
    }
    if (field.startsWith("details.")) {
        return makeDetailsExtractor(field);
    }
    if (columnDefs.hasOwnProperty(field)) {
        return makeSimpleExtractor(field as keyof Job);
    }
    throw new Error(`Unknown field: ${field}`);
}

function rowBuilder(fieldOrder: string[]): (job: Job) => RowData {
    const mappers: JobFieldMapper[] = fieldOrder.map(field => ({
        field,
        extractor: getFieldExtractor(field)
    }));
    return (job: Job) => mappers.reduce(
        (row: RowData, mapper: JobFieldMapper) => {
            row[mapper.field] = mapper.extractor(job);
            return row;
        },
        { id: job.id }
    );
}

export default rowBuilder;
