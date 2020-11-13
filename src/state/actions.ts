import { Action } from "redux";
import { ActionType } from "../enums";
import { Job, JobSearch, JobSearchIdentifier } from "../models";

export interface BaseAction extends Action<ActionType> {
    type: ActionType;
}

export interface ConfigsLoadedAction extends BaseAction {
    configs: JobSearchIdentifier[];
}

export interface ConfigSelectedAction extends BaseAction {
    jobSearchId: string;
}

export interface ConfigCreatedAction extends BaseAction {
    newJobSearch: JobSearch
}

export interface JobSearchLoadedAction extends BaseAction {
    searchId: string;
    jobSearch: JobSearch;
}

export interface JobSelectedAction extends BaseAction {
    jobId: string;
}

export interface JobSavedAction extends BaseAction {
    job: Job;
}

