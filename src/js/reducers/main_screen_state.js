'use strict';
import * as types from '../constants/actionTypes';

const initialState = {
  people: [],
  status: 'initial'
};

export default function mainScreenState(state = initialState, action = {}) {
  switch (action.type) {
    case types.MAIN_SCREEN_LOAD_SUCCESS:
      return {
        ...state,
        people: action.people,
        status: 'success'
      };
    case types.MAIN_SCREEN_LOAD_LOADING:
      return {
        ...state,
        status: 'loading'
      };
    case types.MAIN_SCREEN_LOAD_ERROR:
      return {
        ...state,
        status: 'error'
      };
    case types.MAIN_SCREEN_PURGE:
      return initialState;
    default:
      return state;
  }
}