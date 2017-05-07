'use strict';

import { createStore, applyMiddleware } from 'redux';
import reducer from '../reducers';
import { composeWithDevTools } from 'remote-redux-devtools';
import thunk from 'redux-thunk';

export default function configureStore() {
  return createStore(reducer, composeWithDevTools(applyMiddleware(thunk)));
}
