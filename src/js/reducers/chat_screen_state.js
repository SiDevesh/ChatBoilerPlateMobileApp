'use strict';
import * as types from '../constants/actionTypes';
import { GiftedChat } from 'react-native-gifted-chat';

const initialState = {
  messages: [],
  last_id: null,
  till_last_loaded: false,
  status: 'initial'
};

export default function chatScreenState(state = initialState, action = {}) {
  switch (action.type) {
    case types.CHAT_SCREEN_NEW_MESSAGE:
      return {
        ...state,
        messages: GiftedChat.append(state.messages, [action.message]),
        last_id: action.message["_id"]
      };
    case types.CHAT_SCREEN_LOAD_EARLIER_SUCCESS:
      return {
        ...state,
        messages: GiftedChat.prepend(state.messages, action.messages),
        last_id: action.messages.length === 0 ? state.last_id : action.messages[action.messages.length-1]["_id"],
        till_last_loaded: action.messages.length === 0,
        status: 'success'
      };
    case types.CHAT_SCREEN_LOAD_EARLIER_LOADING:
      return {
        ...state,
        status: 'loading'
      };
    case types.CHAT_SCREEN_LOAD_EARLIER_ERROR:
      return {
        ...state,
        status: 'error'
      };
    case types.CHAT_SCREEN_PURGE:
      return initialState;
    default:
      return state;
  }
}