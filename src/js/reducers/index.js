'use strict';

import { combineReducers } from 'redux';
import routeState from './route_state';
import auth0State from './auth0_state';
import chatScreen0State from './chat_screen_state';

const CombinedReducer = combineReducers({
  routeState, auth0State, chatScreen0State
})

export default CombinedReducer;
