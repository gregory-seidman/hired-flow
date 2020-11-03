import { Action } from "redux";
import { ActionType } from "../enums";
import { JobSearchClient } from "../models";

export interface BaseAction extends Action<ActionType> {
    type: ActionType;
}

export interface ConfigsLoadedAction extends BaseAction {
    configs: JobSearchClient[];
}
