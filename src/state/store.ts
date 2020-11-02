import { applyMiddleware, createStore } from 'redux';
import { createLogger } from 'redux-logger';
import { composeWithDevTools } from 'redux-devtools-extension';
import reducers from './reducers/reducers';

const middleware = composeWithDevTools(applyMiddleware(createLogger()));
const store = createStore(reducers, middleware);

export const dispatch = store.dispatch.bind(store);

export default store;

