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
import { callMainScreenPurge,
         callMainScreenLoad } from '../actions';

class MainScreenComponent extends Component {

  componentDidMount() {
    this.props.loadPeople();
  }

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
        {this.props.status==='success' &&
          <FlatList
            data={this.props.people}
            renderItem={({item}) => <RecentUsersListItem id={item.user_id} primaryText={item.user_id} secondaryText={item.chat_content} onPress={()=>{this.props.showChatScreen({chat_user_id: item.user_id})}}/>}
          />
        }
      </View>
    );
  }

  componentWillUnmount() {
    this.props.purge();
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
    people: state.mainScreenState.people,
    status: state.mainScreenState.status
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    showChatScreen: (user_id) => {
      Actions.chatScreen({chat_user_id: user_id});
    },
    loadPeople: () => {
      dispatch(callMainScreenLoad());
    },
    purge: () => {
      dispatch(callMainScreenPurge());
    }
  }
}

const MainScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(MainScreenComponent)

export default MainScreen;
