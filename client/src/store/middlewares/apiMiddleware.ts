import http from 'utils/httpInstance';
import { Method } from 'axios';
import { Dispatch } from 'redux';
import { API } from 'store/types';

export interface ApiAction {
  type: 'API';
  payload: {
    url: string;
    method: Method;
    formData?: any;
  };
  onRequest?: string | ((dispatch: Dispatch) => void);
  onSuccess?: string | ((dispatch: Dispatch, data: any) => void);
  onFailure?: string | ((dispatch: Dispatch, err: string) => void);
  // to handling apiMiddleware promises
  [x: string]: any;
}
interface apiProps {
  getState: any;
  dispatch: Dispatch;
}

export const ApiMiddleware = ({ getState, dispatch }: apiProps) => (next: any) => async (
  action: ApiAction
) => {
  const noop = () => {};
  if (action.type !== API) return next(action);
  const {
    payload: { method, url, formData },
    onRequest = noop,
    onSuccess = noop,
    onFailure = noop,
  } = action;

  if (typeof onRequest === 'function') {
    onRequest(dispatch);
  } else {
    dispatch({ type: onRequest });
  }
  try {
    const { data } = await http({
      method,
      url,
      data: formData,
    });
    console.log(`data from ApiMiddleware: `, data);
    if (typeof onSuccess === 'function') {
      onSuccess(dispatch, data);
    } else {
      dispatch({ type: onSuccess, payload: data });
    }
  } catch (err) {
    if (typeof onFailure === 'function') {
      onFailure(dispatch, err);
    } else {
      dispatch({ type: onFailure, payload: err || 'Something went wrong' });
    }
    console.error(`error from ApiMiddleware: `, err);
    return Promise.reject(err);
  }
};
export default ApiMiddleware;