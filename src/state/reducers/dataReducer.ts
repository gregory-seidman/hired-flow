import { ActionType } from "../../enums";
import { DataState } from "../ReduxState";
import {
    BaseAction,
    ConfigsLoadedAction,
    ConfigSelectedAction,
    ConfigCreatedAction,
    JobsLoadedAction,
    JobSelectedAction
} from "../actions";
import {
    dispatchSelectedConfig,
    dispatchLoadedJobs
} from '../dispatchers/dataDispatchers';
import { JobSearchClient } from "../../models";

const baseState: DataState = {
    configsLoaded: false,
    jobsLoaded: false,
    configs: [],
    jobs: []
};

function curId(state: DataState): string {
    const { configs, configIndex } = state;
    return configs[configIndex!].config.id!;
}

export default function dataReducer(
    state: DataState = baseState,
    action: BaseAction
): DataState {
    let newState: DataState = state;
    switch (action.type) {
        case ActionType.ConfigsLoaded:
            const configsAction = action as ConfigsLoadedAction;
            newState = {
                configsLoaded: true,
                jobsLoaded: false,
                configs: configsAction.configs,
                jobs: []
            };
            if (newState.configs.length === 1) {
                dispatchSelectedConfig(0);
            }
            break;
        case ActionType.ConfigSelected:
            const cfgSelectAction = action as ConfigSelectedAction;
            const { configIndex } = cfgSelectAction;
            if (configIndex !== state.configIndex) {
                newState = {
                    ...state,
                    jobsLoaded: false,
                    jobs: [],
                    configIndex
                };
                delete newState.jobIndex;
                const configId = curId(newState);
                newState.configs[configIndex].loadJobs()
                    .then(j => dispatchLoadedJobs(configId, j));
            }
            break;
        case ActionType.ConfigCreated:
            const cfgCreatedAction = action as ConfigCreatedAction;
            const { config } = cfgCreatedAction;
            newState = {
                configsLoaded: true,
                jobsLoaded: false,
                jobs: [],
                configs: [ ...state.configs, config ]
            };
            dispatchSelectedConfig(state.configs.length);
            break;
        case ActionType.JobsLoaded:
            const jobsAction = action as JobsLoadedAction;
            const { jobs, searchId } = jobsAction;
            if (searchId === curId(state)) {
                newState = {
                    ...state,
                    jobsLoaded: true,
                    jobs
                };
                delete newState.jobIndex;
            }
            break;
        case ActionType.JobSelected:
            const jobSelectAction = action as JobSelectedAction;
            const { jobIndex } = jobSelectAction;
            if (jobIndex !== state.jobIndex) {
                newState = {
                    ...state,
                    jobIndex
                };
                if (jobIndex < 0) delete newState.jobIndex;
            }
            break;
        default:
            break;
    }
    return newState;
}
