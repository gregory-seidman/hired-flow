import { JobSearch, JobSearchClient } from "../models";
import createInteraction from "./createInteraction";
import createJob from "./createJob";
import loadJobSearch from "./loadJobSearch";
import { getJobSearchId, JobSearchId } from "./models";
import saveJob from "./saveJob";
import saveInteraction from "./saveInteraction";
import saveJobSearch from "./saveJobSearch";

export default function createClient(id: JobSearchId): JobSearchClient {
    const jobSearchId: string = getJobSearchId(id);
    if (!jobSearchId) {
        throw new Error("Cannot create a client from an unsaved job search");
    }
    const client: JobSearchClient = {
        loadJobSearch: () => loadJobSearch(jobSearchId),
        saveConfig: async (jobSearch: JobSearch) => {
            if (jobSearch.id !== jobSearchId) {
                throw new Error("Job search id mismatch");
            }
            return await saveJobSearch(jobSearch);
        },
        saveJob,
        saveInteraction,
        newJob: () => createJob(jobSearchId),
        newInteraction: createInteraction
    };

    return client;
}

