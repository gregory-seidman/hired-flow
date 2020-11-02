import { Action } from "redux";
import { ActionType } from "../enums";

export interface BaseAction extends Action<ActionType> {
    type: ActionType;
}

