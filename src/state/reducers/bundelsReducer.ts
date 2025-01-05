import produce from 'immer';
import { ActionType } from '../action-types';
import { Action } from '../actions';

interface BundelsState {
    [key: string]: {
        loading: boolean;
        code: string;
        err: string;
    } | undefined;
}

const initialState: BundelsState = {};

const reducer = produce((state: BundelsState = initialState, action: Action): BundelsState => {

    switch (action.type) {
        case ActionType.BUNDLE_START:
            state[action.payload.cellId] = {
                loading: true,
                code: '',
                err: ''
            };
            return state;
        case ActionType.BUNDLE_COMPLETE:
            state[action.payload.cellId] = {
                loading: false,
                code: action.payload.bundle.code,
                err: action.payload.bundle.err
            };
            return state;
        default:
            return state;
    }
}, initialState);

export default reducer;