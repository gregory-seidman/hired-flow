import { Interaction, InteractionIdentifier, InteractionsById, Job, JobIdentifier, JobsById, JobSearch } from "../models";
import { getJobSearchId, JobSearchId } from "./models";
import { keyForJobSearch, keyForJob, keyForInteraction } from "./keys";
import parseJsonWithDatestamp from "../utils/parseJsonWithDatestamp";

const storage = window.localStorage;

async function loadInteraction(
    jobId: JobIdentifier,
    interactionId: InteractionIdentifier
): Promise<Interaction> {
    const key: string = keyForInteraction(jobId, interactionId);
    const interaction: Interaction =
        parseJsonWithDatestamp(storage[key]);
    return interaction;
}

async function loadJob(jobId: JobIdentifier): Promise<Job> {
    const key: string = keyForJob(jobId);
    const { interactionIds, ...jobRecord } =
        JSON.parse(storage[key]);
    const interactions: InteractionsById = {};
    const job: Job = {
        ...jobRecord,
        interactions
    };
    for (let id of interactionIds) {
        interactions[id] = await loadInteraction(jobId, {
            id,
            jobId: jobId.id
        });
    }
    return job;
}

export default async function loadJobSearch(jobSearchId: JobSearchId): Promise<JobSearch> {
    const searchId: string = getJobSearchId(jobSearchId);
    const key: string = keyForJobSearch(jobSearchId);
    const { jobIds, ...jobSearchRecord } =
        parseJsonWithDatestamp(storage[key]);
    const jobs: JobsById = {};
    const jobSearch: JobSearch = {
        ...jobSearchRecord,
        jobs
    };
    for (let id of jobIds) {
        jobs[id] = await loadJob({
            id,
            jobSearchId: searchId
        });
    }
    return jobSearch;
}
