import { ActionType } from "../../enums";
import { DataState, JobSearchIdentifiersById } from "../ReduxState";
import {
    BaseAction,
    ConfigsLoadedAction,
    ConfigSelectedAction,
    ConfigCreatedAction,
    JobSearchLoadedAction,
    JobSelectedAction
} from "../actions";
import {
    dispatchSelectedConfig,
    dispatchLoadedJobSearch
} from '../dispatchers/dataDispatchers';
import { JobSearch, JobSearchIdentifier } from "../../models";
import { createClient } from "../../persist";

const baseState: DataState = {
    configsLoaded: false,
    jobSearchLoaded: false,
    selectedJobSearchId: "",
    selectedJobId: "",
    configs: {}
};

function curId(state: DataState): string {
    const { jobSearch, selectedJobSearchId } = state;
    return jobSearch?.id || selectedJobSearchId;
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
                jobSearchLoaded: false,
                selectedJobSearchId: "",
                selectedJobId: "",
                configs: configsAction.configs.reduce(
                    (byId: JobSearchIdentifiersById, jobSearch: JobSearchIdentifier) => {
                        byId[jobSearch.id] = jobSearch;
                        return byId;
                    }, {}
                )
            };
            if (configsAction.configs.length > 0) {
                dispatchSelectedConfig(configsAction.configs[0].id);
            }
            break;
        case ActionType.ConfigSelected:
            const cfgSelectAction = action as ConfigSelectedAction;
            const { jobSearchId } = cfgSelectAction;
            if (jobSearchId !== state.selectedJobSearchId) {
                newState = {
                    ...state,
                    jobSearchLoaded: false,
                    client: createClient(jobSearchId),
                    selectedJobSearchId: jobSearchId,
                    selectedJobId: ""
                };
                const configId = curId(newState);
                newState.client!.loadJobSearch()
                    .then((j: JobSearch) => dispatchLoadedJobSearch(configId, j));
            }
            break;
        case ActionType.ConfigCreated:
            const cfgCreatedAction = action as ConfigCreatedAction;
            const { newJobSearch } = cfgCreatedAction;
            newState = {
                configs: {
                    ...state.configs,
                    [newJobSearch.id]: newJobSearch
                },
                selectedJobSearchId: "",
                selectedJobId: "",
                configsLoaded: true,
                jobSearchLoaded: false,
                jobSearch: newJobSearch
            };
            dispatchSelectedConfig(newJobSearch.id);
            break;
        case ActionType.JobSearchLoaded:
            const jobsAction = action as JobSearchLoadedAction;
            const { jobSearch, searchId } = jobsAction;
            if (searchId === curId(state)) {
                newState = {
                    ...state,
                    jobSearchLoaded: true,
                    jobSearch
                };
            }
            break;
        case ActionType.JobSelected:
            const jobSelectAction = action as JobSelectedAction;
            const { jobId } = jobSelectAction;
            if (jobId !== state.selectedJobId) {
                newState = {
                    ...state,
                    selectedJobId: jobId
                };
            }
            break;
        default:
            break;
    }
    return newState;
}
