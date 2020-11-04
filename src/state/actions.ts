import { Action } from "redux";
import { ActionType } from "../enums";
import { JobSearchClient, Job } from "../models";

export interface BaseAction extends Action<ActionType> {
    type: ActionType;
}

export interface ConfigsLoadedAction extends BaseAction {
    configs: JobSearchClient[];
}

export interface ConfigSelectedAction extends BaseAction {
    configIndex: number;
}

export interface ConfigCreatedAction extends BaseAction {
    config: JobSearchClient
}

export interface JobsLoadedAction extends BaseAction {
    searchId: string;
    jobs: Job[];
}

export interface JobSelectedAction extends BaseAction {
    jobIndex: number;
}
