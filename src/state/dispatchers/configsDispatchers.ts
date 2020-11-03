import { ActionType } from "../../enums";
import { ConfigsLoadedAction } from "../actions";
import { dispatch } from "../store";
import { JobSearchClient } from "../../models";

export function dispatchLoadedConfigs(configs: JobSearchClient[]) {
    const action: ConfigsLoadedAction = {
        type: ActionType.ConfigsLoaded,
        configs
    };
    dispatch(action);
}
