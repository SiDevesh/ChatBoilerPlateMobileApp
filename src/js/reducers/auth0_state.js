'use strict';

import * as types from '../constants/actionTypes';
import realm from '../realm';

//const initialState = {
//  token: null,
//  profile: null
//};

let auth0_profile_configforinitialstate = realm.objectForPrimaryKey('ConfigData', 'auth0_profile').value === '' ? null : JSON.parse(realm.objectForPrimaryKey('ConfigData', 'auth0_profile').value);
let auth0_token_configforinitialstate = realm.objectForPrimaryKey('ConfigData', 'auth0_token').value === '' ? null : JSON.parse(realm.objectForPrimaryKey('ConfigData', 'auth0_token').value);

const initialState = {
  token: auth0_token_configforinitialstate,
  profile: auth0_profile_configforinitialstate
};

export default function auth0State(state = initialState, action = {}) {
  switch (action.type) {
    case types.AUTH0_LOGGED_IN:
      return {
        ...state,
        token: action.token,
        profile: action.profile
      };
    case types.AUTH0_LOGGED_OUT:
      return {
        ...state,
        token: null,
        profile: null
      };
    case types.AUTH0_REFRESH_PROFILE:
      return {
        ...state,
        profile: action.profile
      };
    case types.AUTH0_REFRESH_TOKEN:
      return {
        ...state,
        token: action.token
      };
    default:
      return state;
  }
}