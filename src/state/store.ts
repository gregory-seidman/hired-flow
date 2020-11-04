import { applyMiddleware, createStore } from 'redux';
import { createLogger } from 'redux-logger';
import { composeWithDevTools } from 'redux-devtools-extension';
import reducers from './reducers/reducers';
import { BaseAction } from './actions';

const middleware = composeWithDevTools(applyMiddleware(createLogger()));
const store = createStore(reducers, middleware);

type Dispatch = (action: BaseAction) => void;

export const dispatch: Dispatch = (action: BaseAction) =>
    setTimeout(() => store.dispatch(action), 0);

export default store;

