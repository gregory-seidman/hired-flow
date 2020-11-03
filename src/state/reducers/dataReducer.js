import { ActionType } from "../../enums";
import { DataState } from "../ReduxState";
import { BaseAction, ConfigsLoadedAction, ConfigSelectedAction } from "../actions";
import { dispatchSelectedConfig } from '../dispatchers/configsDispatchers';

const baseState: DataState = {
    loaded: false,
    configs: [],
    jobs: []
};

export default function dataReducer(
    state: DataState = baseState,
    action: BaseAction
): DataState {
    let newState: DataState = state;
    switch (action.type) {
        case ActionType.ConfigsLoaded:
            const configsAction: ConfigsLoadedAction = action;
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
            const selectedAction: ConfigSelectedAction = action;
            const { configIndex } = selectedAction;
            newState = {
                ...state,
                configIndex
            };
            newState.configs[configIndex].loadJobs()
                .then(console.log); //TODO
            break;
        default:
            break;
    }
    return newState;
}
