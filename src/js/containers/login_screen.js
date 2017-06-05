'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button
} from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { callAuth0LoggedIn } from '../actions'
import realm from '../realm';
import Auth0Lock from 'react-native-lock';
import { Auth0Domain, Auth0ClientID } from '../secrets.js';

class logInScreenComponent extends Component {

  onShowLock() {
    let self = this;
    self.lock.show({
      closable: true,
      authParams: {
        scope: "openid email offline_access",
      }
    },
    (err, profile, token) => {
      if (err) {
        console.log(err);
        return;
      }
      self.props.auth0LoggedIn(profile, token);
      Actions.mainScreen();
    });
  }

  componentDidMount() {
    this.lock = new Auth0Lock({clientId: Auth0ClientID, domain: Auth0Domain});
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to Login!
        </Text>
        <Text style={styles.instructions}>
          To get started, edit index.android.js
        </Text>
        <Text style={styles.instructions}>
          Double tap R on your keyboard to reload,{'\n'}
          Shake or press menu button for dev menu
        </Text>
        <Button onPress={()=>{this.onShowLock();}} title="GO" />
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    color: '#000000',
  },
  instructions: {
    textAlign: 'center',
    color: '#000000',
    marginBottom: 5,
  },
});


const mapStateToProps = (state) => {
  return {
    //token: state.auth0state.token,
    //profile: state.auth0state.profile
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    auth0LoggedIn: (profile, token) => {
      dispatch(callAuth0LoggedIn(profile, token));
    }
  }
}

const logInScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(logInScreenComponent)

export default logInScreen;