'use strict';

import { combineReducers } from 'redux';
import routeState from './route_state';

const CombinedReducer = combineReducers({
  routeState
})

export default CombinedReducer;
