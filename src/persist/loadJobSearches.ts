import { JobSearchIdentifier } from "../models";
import parseJsonWithDatestamp from "../utils/parseJsonWithDatestamp";
import { StoredJobSearch } from "./models";
import { keyForJobSearch } from "./keys";
import { loadJobSearchIds } from "./jobSearchList";

const storage = window.localStorage;

function loadJobSearchIdentifier(searchId: string): JobSearchIdentifier {
    const key: string = keyForJobSearch(searchId);
    if (storage.hasOwnProperty(key)) {
        const jobSearch: StoredJobSearch =
            parseJsonWithDatestamp(storage[key]);
        if (jobSearch.id !== searchId) {
            const error = new Error("Incorrectly stored job search");
            (error as any).jobSearch = jobSearch;
            throw error;
        }
        const identifier: JobSearchIdentifier = {
            id: jobSearch.id,
            name: jobSearch.name,
            createdAt: jobSearch.createdAt
        };
        return identifier;
    } else {
        throw new Error(`Job search not found: '${searchId}'`);
    }
}

export default async function loadJobSearches(): Promise<JobSearchIdentifier[]> {
    const jobSearchIds: string[] = loadJobSearchIds();
    return jobSearchIds.map(loadJobSearchIdentifier);
}
