import { ActionType } from "../../enums";
import {
    ConfigsLoadedAction,
    ConfigSelectedAction,
    ConfigCreatedAction,
    JobSearchLoadedAction,
    JobSelectedAction
} from "../actions";
import { dispatch } from "../store";
import { JobSearch, JobSearchIdentifier } from "../../models";

export function dispatchLoadedConfigs(configs: JobSearchIdentifier[]): void {
    const action: ConfigsLoadedAction = {
        type: ActionType.ConfigsLoaded,
        configs
    };
    dispatch(action);
}

export function dispatchSelectedConfig(jobSearchId: string): void {
    const action: ConfigSelectedAction = {
        type: ActionType.ConfigSelected,
        jobSearchId
    };
    dispatch(action);
}

export function dispatchCreatedConfig(newJobSearch: JobSearch): void {
    const action: ConfigCreatedAction = {
        type: ActionType.ConfigCreated,
        newJobSearch
    };
    dispatch(action);
}

export function dispatchLoadedJobSearch(
    searchId: string,
    jobSearch: JobSearch
): void {
    const action: JobSearchLoadedAction = {
        type: ActionType.JobSearchLoaded,
        searchId,
        jobSearch
    };
    dispatch(action);
}

export function dispatchSelectedJob(jobId: string): void {
    const action: JobSelectedAction = {
        type: ActionType.JobSelected,
        jobId
    };
    dispatch(action);
}
