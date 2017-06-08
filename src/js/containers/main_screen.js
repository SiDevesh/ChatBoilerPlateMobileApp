'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Platform,
  FlatList
} from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import RecentUsersListItem from '../components/recent_users_listitem';
import NavigationBar from 'react-native-navbar';
import * as Colors from '../constants/colors';
import Icon from 'react-native-vector-icons/MaterialIcons';

class MainScreenComponent extends Component {
  render() {
    return (
      <View style={styles.container}>
        {Platform.OS === 'android' &&
          <Icon.ToolbarAndroid
            title="CHAT"
            style={styles.toolbar}
            titleColor={Colors.TEXT_DARK_PRIMARY}
          />
        }
        {Platform.OS === 'ios' &&
          <NavigationBar
            tintColor={Colors.TOOLBAR_SHADE}
            statusBar={{style: 'dark-content'}}
            title={{
              title: "CHAT",
              tintColor: Colors.TEXT_DARK_PRIMARY
            }}
          />
        }
        <FlatList
          data={[
            {id: 'auth0|59229095d4e199438b380740', name: 'sid.swap', last: 'hiiii!'},
            {id: 'auth0|5924d91fd9643f3235f49e3a', name: 'swap.sid', last: 'byee!'}
          ]}
          renderItem={({item}) => <RecentUsersListItem id={item.id} primaryText={item.name} secondaryText={item.last} onPress={()=>{this.props.showChatScreen({chat_user_id: item.id})}}/>}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: Colors.BACKDROP,
  },
  toolbar: {
    backgroundColor: Colors.TOOLBAR_SHADE,
    height: 56
  }
});

const mapStateToProps = (state) => {
  return {
    //
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    showChatScreen: (user_id) => {
      Actions.chatScreen({chat_user_id: user_id});
    }
  }
}

const MainScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(MainScreenComponent)

export default MainScreen;
