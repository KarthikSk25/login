import {combineReducers} from 'redux';
import {productsReducer} from './reducers/reducers';

 const rootReducer = combineReducers({
    getProduct: productsReducer,
 });

export default rootReducer;