import { combineReducers } from "redux";
import ReduxState from "../ReduxState";
import { BaseAction } from "../actions";
import configsReducer from "./configsReducer";

const reducers = combineReducers<ReduxState, BaseAction>({
    //TODO
    configs: configsReducer
});

export default reducers;
