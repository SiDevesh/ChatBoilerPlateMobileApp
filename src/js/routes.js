'use strict';

import React from 'react';
import { Scene, Actions } from 'react-native-router-flux'
import LogInScreen from './containers/login_screen';
import MainApp from './containers/main_app';

function is_never_loggedin() {
  return false;
}


/* To many type=resets */
const scenes = Actions.create(
  <Scene key="root">
  <Scene key="againroot">

    <Scene key="authRun" initial={is_never_loggedin()}>
      <Scene key="logInRun" initial={true} >
        <Scene key="logInScreen" component={LogInScreen} initial={true} hideNavBar={true} />
      </Scene>
    </Scene>

    <Scene key="mainScreen" component={MainApp} hideNavBar={true} type="reset" initial={!is_never_loggedin()}/>

  </Scene>
  </Scene>
);

export default scenes;
