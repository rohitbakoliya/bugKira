import { IAction } from 'store';
import { ApiAction } from 'store/middlewares';
import { API, ApiActionCreator } from 'store/types';
import { batch } from 'react-redux';
import { CLEAR_ALL_ERRORS } from './errors';
import { normalize } from 'normalizr';
import { bugSchema } from 'store/schemas';

// action
export const CLEAR_BUG_DATA = 'singlebug/CLEAR_BUG_DATA';
export const FETCH_BUG = ApiActionCreator('singlebug/FETCH_BUG');

export interface SinglebugReducerState {
  entities: {
    comments: {
      [x: string]: any;
    };
  };
  result: {
    activities: any[];
    body: string;
    title: string;
    bugId: number;
    labels: any[];
    comments: string[];
    reactions: any[];
    references: any[];
    dateOpened: string;
    author: any;
    [x: string]: any;
  };
}

const DEFAULT_STATE: SinglebugReducerState = {
  entities: {
    comments: {},
  },
  result: {
    activities: [],
    body: '',
    title: '',
    bugId: 0,
    labels: [],
    comments: [],
    reactions: [],
    references: [],
    dateOpened: '',
    author: { username: '' },
  },
};

const reducer = (state = DEFAULT_STATE, action: IAction) => {
  switch (action.type) {
    case FETCH_BUG.SUCCESS:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};
export default reducer;

export const fetchBugWithId = (bugId: number | string): ApiAction => ({
  type: API,
  payload: {
    method: 'GET',
    url: `/api/bugs/${bugId}`,
  },
  onRequest: (dispatch: any) => {
    batch(() => {
      dispatch({ type: CLEAR_ALL_ERRORS });
      dispatch({ type: CLEAR_BUG_DATA });
      dispatch({ type: FETCH_BUG.REQUEST });
    });
  },
  onSuccess: (dispatch: any, data) => {
    dispatch({
      type: FETCH_BUG.SUCCESS,
      payload: normalize(data, bugSchema),
    });
  },
  onFailure: FETCH_BUG.FAILURE,
});
