import { RowData, CellValue } from "./generic/tableModel";
import { JobStatus, InteractionStatus } from "../enums";
import { Job, Interaction } from "../models";
import { columnDefs } from "./columnBuilder";
import {
    Datestamp,
    endOfTime,
    startOfTime,
    justYesterday
} from "../utils/Datestamp";

type JobFieldExtractor = (job: Job) => CellValue;

function makeSimpleExtractor(field: keyof Job): JobFieldExtractor {
    return (job: Job) => job[field];
}

function makeDetailsExtractor(field: string): JobFieldExtractor {
    const subfield: string = field.replace("details.", "");
    return (job: Job) => job.details[subfield];
}

function getLastInteraction(interactions: Interaction[]): Datestamp|null {
    const guard: Datestamp = startOfTime;
    const now: Datestamp = justYesterday();
    const mostRecent: Datestamp = interactions.reduce(
        (latest,interaction) => {
            const { date, status } = interaction;
            return ((status !== InteractionStatus.Occurred) ||
                    (date > now)) ?
                latest :
                ((date > latest) ? date : latest);
        },
        guard
    );
    return (mostRecent === guard) ? null : mostRecent;
}

function getNextInteraction(interactions: Interaction[]): Datestamp|null {
    const guard: Datestamp = endOfTime;
    const now: Datestamp = justYesterday();
    const immediateNext: Datestamp = interactions.reduce(
        (nearest,interaction) => {
            const { date, status } = interaction;
            return ((status !== InteractionStatus.Upcoming) ||
                    (date < now)) ?
                nearest :
                ((date < nearest) ? date : nearest);
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
        getLastInteraction(Object.values(job.interactions)),
    "_nextInteractionDate": (job: Job) =>
        getNextInteraction(Object.values(job.interactions)),
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
