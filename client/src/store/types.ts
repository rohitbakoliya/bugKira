import { RouterState } from 'connected-react-router';
import { Reducer } from 'redux';
import { AuthReducerState } from './ducks/auth';

export interface StoreState {
  bugs: any[];
  auth: AuthReducerState;
  router: Reducer<RouterState<unknown>>;
  loading: {
    [x: string]: boolean;
  };
  error: {
    [x: string]: string;
  };
}

export interface IAction {
  type: string;
  payload?: any;
}

export const API = 'API';

export const ApiActionCreator = (
  actionName: string
): {
  REQUEST: string;
  SUCCESS: string;
  FAILURE: string;
} => ({
  REQUEST: `${actionName}_REQUEST`,
  SUCCESS: `${actionName}_SUCCESS`,
  FAILURE: `${actionName}_FAILURE`,
});
