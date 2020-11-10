import { JobSearchRecord, JobRecord, JobSearchIdentifier } from "../models";
import { endOfTime } from "../utils/Datestamp";

export type JobSearchId = JobSearchIdentifier | string;

const emptyId: JobSearchId = {
    id: "",
    name: "",
    createdAt: endOfTime
};

export function getJobSearchId(jobSearch: JobSearchId): string {
    return (typeof jobSearch === "string") ?
        (jobSearch as string) :
        ((jobSearch||emptyId) as JobSearchIdentifier).id;
}

export interface StoredJobSearch extends JobSearchRecord {
    jobIds: string[];
};

export interface StoredJob extends JobRecord {
    interactionIds: string[];
};

