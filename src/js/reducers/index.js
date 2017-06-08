'use strict';

import { combineReducers } from 'redux';
import routeState from './route_state';
import auth0State from './auth0_state';
import chatScreenState from './chat_screen_state';
import mainScreenState from './main_screen_state';

const CombinedReducer = combineReducers({
  routeState, auth0State, chatScreenState, mainScreenState
})

export default CombinedReducer;
