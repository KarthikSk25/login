import {applyMiddleware, createStore} from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import rootReducer from './RootReducers';

const store = createStore(rootReducer,
     applyMiddleware(thunk, logger),
window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;
