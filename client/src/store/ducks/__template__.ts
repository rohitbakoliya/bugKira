import { IAction } from 'store';

// Actions

const DEFAULT_STATE = {};

// Reducer - default export
export default function reducer(state = DEFAULT_STATE, action: IAction) {
  switch (action.type) {
    default:
      return state;
  }
}

// Action Creators - export

// Side-effects - export
