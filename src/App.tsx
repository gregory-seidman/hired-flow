import React from "react";
import { connect } from "react-redux";
import ReduxState from "./state/ReduxState";
import NewJobSearchDialog from "./components/NewJobSearchDialog";
import JobSearch from "./components/JobSearch";

interface InputPropsType {
}

enum AppState {
    AwaitingConfigsLoading,
    NoConfigsYet,
    AwaitingConfigSelection,
    Displaying
}

interface MappedPropsType {
    appState: AppState;
    name: string|undefined;
}

type Mapper = (state: ReduxState, props: InputPropsType) => MappedPropsType;

const mapStateAndProps: Mapper = (state, props) => {
    const { configsLoaded, configs, jobSearch, client } = state.data;
    let appState: AppState = AppState.Displaying;
    let name: string|undefined;

    if (!configsLoaded) {
        appState = AppState.AwaitingConfigsLoading;
    } else if (Object.keys(configs).length === 0) {
        appState = AppState.NoConfigsYet;
    } else if (!(jobSearch && client)) {
        appState = AppState.AwaitingConfigSelection;
    } else {
        name = jobSearch.name;
    }
    return {
        appState,
        name
    };
};

const ComponentFunc: React.FC<MappedPropsType> = ({ appState, name }) => {
    switch (appState) {
        case AppState.AwaitingConfigsLoading:
            return <h1>Loading Job Searches...</h1>;
        case AppState.NoConfigsYet:
            return <NewJobSearchDialog open={true} />;
        case AppState.AwaitingConfigSelection:
            return <h1>Select Job Search</h1>;
        case AppState.Displaying:
            return (
                <React.Fragment>
                    <h1 style={{ textAlign: "center" }}>Job Search: {name}</h1>
                    <JobSearch />
                </React.Fragment>
            );
    }
}

export type AppPropsType = InputPropsType;
export default connect(mapStateAndProps)(ComponentFunc);
