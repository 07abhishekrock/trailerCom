import {applyMiddleware, combineReducers, createStore} from 'redux';
import movies_reducer from './movies_reducer';
import thunkMiddleware from 'redux-thunk';

const store = createStore(movies_reducer , applyMiddleware(thunkMiddleware));

export default store;