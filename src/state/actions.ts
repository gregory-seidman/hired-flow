import { Action } from "redux";
import { ActionType } from "../enums";
import { JobSearchClient } from "../models";

export interface BaseAction extends Action<ActionType> {
    type: ActionType;
}

export interface ConfigsLoadedAction extends BaseAction {
    configs: JobSearchClient[];
}

export interface ConfigSelectedAction extends BaseAction {
    configIndex: number;
}

export interface JobsLoadedAction extends BaseAction {
    searchId: string;
    jobs: Job[];
}

export interface JobSelectedAction extends BaseAction {
    jobIndex: number;
}
