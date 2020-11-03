import { ActionType } from "../../enums";
import { ConfigsState } from "../ReduxState";
import { BaseAction, ConfigsLoadedAction, ConfigSelectedAction } from "../actions";
import { dispatchSelectedConfig } from '../dispatchers/configsDispatchers';

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
                dispatchSelectedConfig(0);
            }
            break;
        case ActionType.ConfigSelected:
            const { configIndex } = action as ConfigSelectedAction;
            newState = {
                ...state,
                configIndex
            };
            newState.configs[configIndex].loadJobs()
                .then(console.log); //TODO
            break;
    }
    return newState;
}
