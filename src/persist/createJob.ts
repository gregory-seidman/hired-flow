import { JobStatus } from "../enums";
import { Job } from "../models";
import { getJobSearchId, JobSearchId } from "./models";

export default function createJob(jobSearch: JobSearchId): Job {
    const jobSearchId = getJobSearchId(jobSearch);
    if (!jobSearchId) {
        throw new Error("Can't create a job in an unsaved job search");
    }
    const job: Job = {
        id: "",
        jobSearchId,
        company: "",
        jobTitle: "",
        status: JobStatus.Applied,
        contact: {
            name: ""
        },
        interactions: {},
        details: {}
    };
    return job;
}
