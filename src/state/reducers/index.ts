import { combineReducers } from 'redux';
import cellsReducer from './cellsReducers';
import bundelsReducer from './bundelsReducer';

const reducers = combineReducers({
    cells: cellsReducer,
    bundles: bundelsReducer
});

export default reducers;

export type RootState = ReturnType<typeof reducers>;