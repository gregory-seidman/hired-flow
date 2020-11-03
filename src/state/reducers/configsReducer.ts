import { ActionType } from "../../enums";
import { ConfigsState } from "../ReduxState";
import { BaseAction, ConfigsLoadedAction } from "../actions";

const baseState: ConfigsState = {
    loaded: false,
    configs: [],
    jobs: []
};

export default function configsReducer(
    state: ConfigsState = baseState,
    action: BaseAction
): ConfigsState {
    let newState: ConfigsState = state;
    switch (action.type) {
        case ActionType.ConfigsLoaded:
            const configsAction = action as ConfigsLoadedAction;
            newState = {
                loaded: true,
                configs: configsAction.configs,
                jobs: []
            };
            if (newState.configs.length === 1) {
                newState.configIndex = 0;
            }
            return newState;
        default:
            return state;
    }
}
