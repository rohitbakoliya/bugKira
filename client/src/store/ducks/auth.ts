import { push } from 'connected-react-router';
import { IAction } from 'store';
import { ApiAction } from 'store/middlewares';
import { API, ApiActionCreator } from 'store/types';
import { CLEAR_ALL_ERRORS } from './errors';

// Actions
export const AUTH_SET_USER = 'auth/SET_USER';

export const SIGNUP = ApiActionCreator('user/SIGN_UP');
export const LOGIN = ApiActionCreator('user/LOGIN');
export const LOGOUT = ApiActionCreator('user/LOGOUT');
export const CHECK_AUTH = ApiActionCreator('auth/CHECK_AUTH');
export const RESET_PASSWORD = ApiActionCreator('user/RESET_PASSWORD');
export const REQ_RESET_PASSWORD = ApiActionCreator('user/REQ_RESET_PASSWORD');
export const REQ_VERIFICATION_EMAIL = ApiActionCreator('user/REQ_VERIFICATION_EMAIL');
export interface UserProps {
  username?: string;
  name?: string;
  bio?: string;
  avatarUrl?: string;
  id?: string;
}

export interface AuthReducerState {
  isAuthenticated: boolean;
  user: UserProps | null;
}

const DEFAULT_STATE: AuthReducerState = {
  isAuthenticated: false,
  user: {},
};

// Reducer - default export
const reducer = (state = DEFAULT_STATE, action: IAction): AuthReducerState => {
  switch (action.type) {
    case CHECK_AUTH.SUCCESS:
      return { ...state, user: action.payload, isAuthenticated: true };
    case LOGOUT.SUCCESS:
      return { ...state, user: null, isAuthenticated: false };
    case LOGIN.SUCCESS:
      return { ...state, user: action.payload, isAuthenticated: true };
    default:
      return state;
  }
};
export default reducer;

// Action Creators - export

// Side-effects - export
export const checkAuth = (): ApiAction => ({
  type: API,
  payload: {
    method: 'GET',
    url: '/api/user/auth/check-auth',
    formData: null,
  },
  onRequest: CHECK_AUTH.REQUEST,
  onSuccess: CHECK_AUTH.SUCCESS,
  onFailure: CHECK_AUTH.FAILURE,
});

export const signupUser = (formData: any): ApiAction => ({
  type: API,
  payload: {
    method: 'POST',
    url: '/api/user/auth/signup',
    formData,
  },
  onRequest: SIGNUP.REQUEST,
  onSuccess: (dispatch, data) => {
    dispatch({ type: CLEAR_ALL_ERRORS });
    dispatch({ type: SIGNUP.SUCCESS });
    dispatch(push(`/?signedup=true`));
  },
  onFailure: (dispatch, err) => {
    dispatch({ type: SIGNUP.FAILURE, payload: err });
    dispatch({ type: LOGOUT.SUCCESS });
    dispatch({ type: CLEAR_ALL_ERRORS });
  },
});

export const loginUser = (formData: { uoe: string; password: string }): ApiAction => ({
  type: API,
  payload: {
    method: 'POST',
    url: '/api/user/auth/login',
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
    dispatch({ type: LOGOUT.SUCCESS });
    dispatch({ type: CLEAR_ALL_ERRORS });
  },
});

export const logoutUser = (): ApiAction => ({
  type: API,
  payload: {
    method: 'GET',
    url: 'api/user/auth/logout',
    formData: null,
  },
  onRequest: LOGOUT.REQUEST,
  onSuccess: (dispatch, data) => {
    dispatch({ type: LOGOUT.SUCCESS, payload: data });
    dispatch(push('/', null));
  },
  onFailure: (dispatch, err) => {
    dispatch({ type: LOGOUT.FAILURE, payload: err });
  },
});

export const resetPassword = (
  formData: { password: string; confirmPassword: string },
  token: string
): ApiAction => ({
  type: API,
  payload: {
    method: 'PATCH',
    url: `/api/user/auth/reset-password/${token}`,
    formData,
  },
  onRequest: RESET_PASSWORD.REQUEST,
  onSuccess: RESET_PASSWORD.SUCCESS,
  onFailure: RESET_PASSWORD.FAILURE,
});

export const resetPasswordRequest = (formData: { email: string }): ApiAction => ({
  type: API,
  payload: {
    method: 'POST',
    url: `/api/user/auth/request/reset-password`,
    formData,
  },
  onRequest: REQ_RESET_PASSWORD.REQUEST,
  onSuccess: REQ_RESET_PASSWORD.SUCCESS,
  onFailure: REQ_RESET_PASSWORD.FAILURE,
});

export const requestEmailVerification = (formData: { email: string }): ApiAction => ({
  type: API,
  payload: {
    method: 'POST',
    url: `/api/user/auth/request/verification-email`,
    formData,
  },
  onRequest: REQ_VERIFICATION_EMAIL.REQUEST,
  onSuccess: REQ_VERIFICATION_EMAIL.SUCCESS,
  onFailure: REQ_VERIFICATION_EMAIL.FAILURE,
});
