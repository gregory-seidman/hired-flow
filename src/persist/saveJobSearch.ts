import { JobSearch } from "../models";
import { appendJobSearchId } from "./jobSearchList";
import { keyForJobSearch, nextConfigId } from "./keys";
import { StoredJobSearch } from "./models";

const storage = window.localStorage;

export default async function saveJobSearch(
    jobSearch: JobSearch
): Promise<void> {
    const searchId = jobSearch.id || nextConfigId();
    if (!jobSearch.id) {
        appendJobSearchId(searchId);
        jobSearch.id = searchId;
    }
    const { jobs, ...jobRecord } = jobSearch;
    const storedJobSearch: StoredJobSearch = {
        ...jobRecord,
        jobIds: Object.keys(jobs)
    };
    const key = keyForJobSearch(searchId);
    storage[key] = JSON.stringify(storedJobSearch);
}

