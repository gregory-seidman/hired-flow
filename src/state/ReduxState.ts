import { JobSearch, JobSearchClient, JobSearchIdentifier } from "../models";

export type JobSearchIdentifiersById = {
    [id: string]: JobSearchIdentifier
}
export interface DataState {
    configs: JobSearchIdentifiersById;
    selectedJobSearchId: string;
    selectedJobId: string;
    jobSearch?: JobSearch;
    client?: JobSearchClient;
    configsLoaded: boolean;
    jobSearchLoaded: boolean;
}

export default interface ReduxState {
    data: DataState;
    //TODO
}
