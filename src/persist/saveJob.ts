import { Job } from "../models";
import { StoredJob } from "./models";
import { keyForJob, nextJobId } from "./keys";

const storage = window.localStorage;

export default async function saveJob(job: Job): Promise<void> {
    const jobId = job.id || nextJobId();
    if (!job.id) {
        job.id = jobId;
    }
    const key = keyForJob(job);
    const { interactions, ...jobRecord } = job;
    const storedJob: StoredJob = {
        ...jobRecord,
        interactionIds: Object.keys(interactions)
    };
    storage[key] = JSON.stringify(storedJob);
}

