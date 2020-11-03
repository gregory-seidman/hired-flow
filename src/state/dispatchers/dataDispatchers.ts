import { ActionType } from "../../enums";
import { ConfigsLoadedAction, ConfigSelectedAction } from "../actions";
import { dispatch } from "../store";
import { Job, JobSearchClient } from "../../models";

export function dispatchLoadedConfigs(configs: JobSearchClient[]): void {
    const action: ConfigsLoadedAction = {
        type: ActionType.ConfigsLoaded,
        configs
    };
    dispatch(action);
}

export function dispatchSelectedConfig(configIndex: number): void {
    const action: ConfigSelectedAction = {
        type: ActionType.ConfigSelected,
        configIndex
    };
    dispatch(action);
}

export function dispatchCreatedConfig(config: JobSearchClient): void {
    const action: ConfigCreatedAction = {
        type: ActionType.ConfigCreated,
        config
    };
    dispatch(action);
}

export function dispatchLoadedJobs(searchId: string, jobs: Job[]): void {
    const action: JobsLoadedAction = {
        type: ActionType.JobsLoaded,
        searchId,
        jobs
    };
    dispatch(action);
}

export function dispatchSelectedJob(jobIndex: number): void {
    const action: JobSelectedAction = {
        type: ActionType.JobSelected,
        jobIndex
    };
    dispatch(action);
}
