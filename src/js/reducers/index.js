'use strict';

import { combineReducers } from 'redux';
import routeState from './route_state';
import auth0State from './auth0_state';

const CombinedReducer = combineReducers({
  routeState, auth0State
})

export default CombinedReducer;
