'use strict';
import * as types from '../constants/actionTypes';
import Auth0Lock from 'react-native-lock';
import realm from '../realm';
import { Actions } from 'react-native-router-flux';
import { API_BASE_URL } from '../constants/constants';

export const callAuth0LoggedInAction = (profile, token) => ({
  type: types.AUTH0_LOGGED_IN,
  profile: profile,
  token: token
})

export function callAuth0LoggedIn(profile, token) {
  return function(dispatch, getState) {
    let auth0_profile_config = realm.objectForPrimaryKey('ConfigData', 'auth0_profile');
    let auth0_token_config = realm.objectForPrimaryKey('ConfigData', 'auth0_token');
    realm.write(() => {
      auth0_profile_config.value = JSON.stringify(profile);
      auth0_token_config.value = JSON.stringify(token);
    });
    dispatch(callAuth0LoggedInAction(profile, token));
  }
}

export const callAuth0LoggedOutAction = () => ({
  type: types.AUTH0_LOGGED_OUT
})

export function callAuth0LoggedOut() {
  return function(dispatch, getState) {
    let auth0_profile_config = realm.objectForPrimaryKey('ConfigData', 'auth0_profile');
    let auth0_token_config = realm.objectForPrimaryKey('ConfigData', 'auth0_token');
    //realm.write(() => {
    //  auth0_profile_config.value = '';
    //  auth0_token_config.value = '';
    //});
    dispatch(callAuth0LoggedOutAction());
  }
}

export const callAuth0RefreshProfile = (profile) => ({
  type: types.AUTH0_REFRESH_PROFILE,
  profile: profile
})

export const saveAuth0RefreshToken = (token) => ({
  type: types.AUTH0_REFRESH_TOKEN,
  token: token
})

export function debugIdTokenCorrupt() {
  return function (dispatch, getState) {
    let auth0_token_config = realm.objectForPrimaryKey('ConfigData', 'auth0_token');
    let auth0_token_string = auth0_token_config.value;
    let auth0_token_object = JSON.parse(auth0_token_string);
    auth0_token_object.idToken = 'x'+auth0_token_object.idToken;
    dispatch(saveAuth0RefreshToken(auth0_token_object));
  }
}

export function callAuth0RefreshToken(caller_thunk) {
  return function (dispatch, getState) {
    let auth0_client_id = realm.objectForPrimaryKey('ConfigData', 'auth0_client_id').value;
    let auth0_domain = realm.objectForPrimaryKey('ConfigData', 'auth0_domain').value;
    let Auth0LockObj = new Auth0Lock({clientId: auth0_client_id, domain: auth0_domain});
    let auth0 = Auth0LockObj.authenticationAPI();
    auth0.refreshToken(getState().auth0state.token.refreshToken, {
      scope: "openid email offline_access"
    })
    .then((response) => {
      let auth0_token_config = realm.objectForPrimaryKey('ConfigData', 'auth0_token');
      let auth0_token_string = auth0_token_config.value;
      let auth0_token_object = JSON.parse(auth0_token_string);
      auth0_token_object.idToken = response.idToken;
      realm.write(() => {
        auth0_token_config.value = JSON.stringify(auth0_token_object);
      });
      dispatch(saveAuth0RefreshToken(auth0_token_object));
      if(caller_thunk!==undefined) {
        caller_thunk();
      }
    })
    .catch((error) => {
      console.log(error); //take back to login page here
      dispatch(callAuth0LoggedOut());
      Actions.authRun();
    });
  }
}