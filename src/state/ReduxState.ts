import { Job } from "../models";
import { JobSearchClient } from "../models";

export interface DataState {
    configs: JobSearchClient[];
    configsLoaded: boolean;
    configIndex?: number;
    jobs: Job[];
    jobsLoaded: boolean;
    jobIndex?: number;
}

export default interface ReduxState {
    data: DataState;
    //TODO
}
