import {
    JobIdentifier,
    InteractionIdentifier
} from "../models";
import { JobSearchId, getJobSearchId } from "./models";

const storage = window.localStorage;
const separator = ":";

function nextId(key: string): string {
    const next: string = storage[key] || "1";
    storage[key] = (+next) + 1;
    return next;
}

const configIdCounterKey = "JobSearch:NextConfigId";

export function nextConfigId(): string {
    return "C" + nextId(configIdCounterKey);
}

const jobIdCounterKey = "JobSearch:NextJobId";

export function nextJobId(): string {
    return "J" + nextId(jobIdCounterKey);
}

const interactionIdCounterKey = "JobSearch:NextInteractionId";

export function nextInteractionId(): string {
    return "I" + nextId(interactionIdCounterKey);
}

export function keyForJobSearch(jobSearch: JobSearchId): string {
    const searchId: string = getJobSearchId(jobSearch);
    if (!searchId) {
        throw new Error("No job search id");
    }
    return searchId;
}

export function keyForJob(job: JobIdentifier): string {
    if (!job.id) {
        throw new Error("No job id");
    }
    return [ job.jobSearchId, job.id ].join(separator);
}

export function keyForInteraction(
    job: JobIdentifier,
    interaction: InteractionIdentifier
): string {
    if (!job.id) {
        throw new Error("No job id");
    }
    if (!interaction.id) {
        throw new Error("No interaction id");
    }
    if (job.id !== interaction.jobId) {
        throw new Error("Given job does not own this interaction");
    }
    return [ job.jobSearchId, job.id, interaction.id ].join(separator);
}

