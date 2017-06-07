'use strict';
import * as types from '../constants/actionTypes';
import Auth0Lock from 'react-native-lock';
import realm from '../realm';
import { Actions } from 'react-native-router-flux';
import { API_BASE_URL } from '../constants/constants';
import { Auth0ClientID, Auth0Domain } from '../secrets';

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
    realm.write(() => {
      auth0_profile_config.value = '';
      auth0_token_config.value = '';
    });
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
    let Auth0LockObj = new Auth0Lock({clientId: Auth0ClientID, domain: Auth0Domain});
    let auth0 = Auth0LockObj.authenticationAPI();
    auth0.refreshToken(getState().auth0State.token.refreshToken, {
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

export const callChatScreenChatterId = (chatter_id) => ({
  type: types.CHAT_SCREEN_CHATTER_ID,
  chatter_id: chatter_id
})

export const callChatScreenPurge = () => ({
  type: types.CHAT_SCREEN_PURGE
})

export const callChatScreenNewMessage = (message) => ({
  type: types.CHAT_SCREEN_NEW_MESSAGE,
  message: message
})

export const callChatScreenLoadEarlierSuccess = (messages) => ({
  type: types.CHAT_SCREEN_LOAD_EARLIER_SUCCESS,
  messages: messages
})

export const callChatScreenLoadEarlierLoading = () => ({
  type: types.CHAT_SCREEN_LOAD_EARLIER_LOADING
})

export const callChatScreenLoadEarlierError = () => ({
  type: types.CHAT_SCREEN_LOAD_EARLIER_ERROR
})

export function callChatScreenLoadEarlier() {
  return function (dispatch, getState) {
    if(((getState().auth0State.profile!==null)&&(getState().auth0State.token!==null))&&(!getState().chatScreen0State.till_last_loaded)) {
      dispatch(callChatScreenLoadEarlierLoading());
      return fetch(
        API_BASE_URL+`/api/v1/previous_messages/private/`+getState().chatScreen0State.chatter_id+(getState().chatScreen0State.last_id!==null ? `?last=`+(getState().chatScreen0State.last_id) : ""),
        {
          method: "GET",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': "Bearer "+getState().auth0State.token.idToken
          }
        }
      )
      .then(response => {
        if((response.status === 200)||(response.status === 400)||(response.status === 401)) {
          return response.json();
        }
      })
      .then((json) => {
        if(!json.hasOwnProperty('errors')) {
          dispatch(callChatScreenLoadEarlierSuccess(json.messages.map(adaptMessageObject)));
        }
        else {
          if(json.errors[0]==="Invalid token.") {
            dispatch(callAuth0RefreshToken(()=>{dispatch(callChatScreenLoadEarlier());}));
          }
          else {
            console.log(json);
            dispatch(callChatScreenLoadEarlierError());
          }
        }
      })
      .catch((err) => {
        console.log(err);
        dispatch(callChatScreenLoadEarlierError());
      });
    }
  }
}

function adaptMessageObject(json_message) {
  return {
    _id: json_message.id,
    text: json_message.content,
    createdAt: new Date(json_message.inserted_at),
    user: {
      _id: json_message.sender_id
    },
  }
}