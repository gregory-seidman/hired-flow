import { Job } from "../models";
import { JobSearchClient } from "../models";

export interface ConfigsState {
    loaded: boolean;
    configIndex?: number;
    configs: JobSearchClient[];
    jobs: Job[];
}

export default interface ReduxState {
    configs: ConfigsState;
    //TODO
}
