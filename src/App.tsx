import React from "react";
import { connect } from "react-redux";
import ReduxState from "./state/ReduxState";

export interface AppPropsType {
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

type Mapper = (state: ReduxState, props: AppPropsType) => MappedPropsType;

const mapStateAndProps: Mapper = (state, props) => {
    const { configsLoaded, configs, configIndex } = state.data;
    let appState: AppState = AppState.Displaying;
    let name: string|undefined;

    if (!configsLoaded) {
        appState = AppState.AwaitingConfigsLoading;
    } else if (configs.length === 0) {
        appState = AppState.NoConfigsYet;
    } else if (typeof(configIndex) !== "number") {
        appState = AppState.AwaitingConfigSelection;
    } else {
        name = configs[configIndex].config.name;
    }
    return {
        appState,
        name
    };
};

const App: React.FC<MappedPropsType> = ({ appState, name }) => {
    switch (appState) {
        case AppState.AwaitingConfigsLoading:
            return <h1>Loading Job Searches...</h1>;
        case AppState.NoConfigsYet:
            return <h1>Create First Job Search</h1>;
        case AppState.AwaitingConfigSelection:
            return <h1>Select Job Search</h1>;
        case AppState.Displaying:
            return <h1>Job Search: {name}</h1>;
    }
}

export default connect(mapStateAndProps)(App);
