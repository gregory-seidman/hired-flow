// These must be the first lines in src/index.js
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
// after polyfills
import React from 'react';
import App from './App';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import store from './state/store';
import { loadJobSearches } from './persist/client';
import { dispatchLoadedConfigs } from './state/dispatchers/dataDispatchers';

render(
    <React.StrictMode>
        <Provider store={store}>
            <App />
        </Provider>
    </React.StrictMode>,
    document.getElementById('root')
);

loadJobSearches()
    .then(dispatchLoadedConfigs);
