import React from "react";
import { connect } from "react-redux";
import ReduxState from "./state/ReduxState";

export interface AppPropsType {
}

interface MappedPropsType {
}

type Mapper = (state: ReduxState, props: AppPropsType) => MappedPropsType;

const mapStateAndProps: Mapper = (state, props) => props;

const App: React.FC<MappedPropsType> = () => {
    return <h1>Job Search</h1>;
}

export default connect(mapStateAndProps)(App);
