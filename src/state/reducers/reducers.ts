import { combineReducers } from "redux";
import ReduxState from "../ReduxState";
import { BaseAction } from "../actions";
import dataReducer from "./dataReducer";

const reducers = combineReducers<ReduxState, BaseAction>({
    //TODO
    data: dataReducer
});

export default reducers;
