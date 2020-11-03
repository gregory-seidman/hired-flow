import { ActionType } from "../../enums";
import { ConfigsLoadedAction, ConfigSelectedAction } from "../actions";
import { dispatch } from "../store";
import { JobSearchClient } from "../../models";

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
