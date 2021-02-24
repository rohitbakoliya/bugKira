import { push } from 'connected-react-router';
import { IAction } from 'store';
import { ApiAction } from 'store/middlewares';
import { API, ApiActionCreator } from 'store/types';
import { CLEAR_ALL_ERRORS } from './errors';

// Actions
export const AUTH_LOGOUT = 'auth/LOGOUT';
export const AUTH_SET_USER = 'auth/SET_USER';

export const SIGNUP = ApiActionCreator('user/SIGN_UP');
export const LOGIN = ApiActionCreator('user/LOGIN');

export interface UserProps {
  username?: string;
  name?: string;
  bio?: string;
  avatarUrl?: string;
  id?: string;
}

export interface AuthReducerState {
  isAuthenticated: boolean;
  user: UserProps;
}

const DEFAULT_STATE: AuthReducerState = {
  isAuthenticated: false,
  user: {},
};

// Reducer - default export
const reducer = (state = DEFAULT_STATE, action: IAction) => {
  switch (action.type) {
    default:
      return state;
  }
};
export default reducer;

// Action Creators - export
export const logout = () => ({ type: AUTH_LOGOUT });

// Side-effects - export
export const signupUser = (formData: FormData): ApiAction => ({
  type: API,
  payload: {
    method: 'POST',
    url: '/api/user/signup',
    formData,
  },
  onRequest: SIGNUP.REQUEST,
  onSuccess: (dispatch, data) => {
    dispatch({ type: CLEAR_ALL_ERRORS });
    dispatch({ type: SIGNUP.SUCCESS });
    dispatch(push(`/?signedup=true&email=${data.email}`));
  },
  onFailure: (dispatch, err) => {
    dispatch({ type: SIGNUP.FAILURE, payload: err });
    dispatch({ type: AUTH_LOGOUT });
    dispatch({ type: CLEAR_ALL_ERRORS });
  },
});

export const loginUser = (formData: { email: string; password: string }): ApiAction => ({
  type: API,
  payload: {
    method: 'POST',
    url: '/api/user/login',
    formData,
  },
  onRequest: LOGIN.REQUEST,
  onSuccess: (dispatch, data) => {
    dispatch({ type: LOGIN.SUCCESS, payload: data });
    dispatch({ type: CLEAR_ALL_ERRORS });
    dispatch(push('/dashboard/bugs'));
  },
  onFailure: (dispatch, err) => {
    dispatch({ type: LOGIN.FAILURE, payload: err });
    dispatch({ type: AUTH_LOGOUT });
    dispatch({ type: CLEAR_ALL_ERRORS });
  },
});
