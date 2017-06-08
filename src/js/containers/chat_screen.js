'use strict';
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Platform
} from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import {Socket} from "../phoenix";
import { API_BASE_URL } from '../constants/constants';
import { connect } from 'react-redux';
import { callAuth0RefreshToken,
         callChatScreenPurge,
         callChatScreenNewMessage,
         callChatScreenLoadEarlier,
         callChatScreenChatterId } from '../actions';
import NavigationBar from 'react-native-navbar';
import * as Colors from '../constants/colors';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Actions } from 'react-native-router-flux';

class ChatScreenComponent extends React.Component {

  constructor(props) {
    super(props);
    this.onSend = this.onSend.bind(this);
  }

  generateSubTopic() {
    let first_id = this.props.user_id;
    let second_id = this.props.chat_user_id.chat_user_id;
    if(first_id < second_id) {
      return first_id+","+second_id;
    }
    else {
      return second_id+","+first_id;
    }
  }

  componentDidMount() {
    this.socket = new Socket(API_BASE_URL+"/socket", {params: {token: this.props.idToken}});
    this.socket.onError(() => alert("there was an error with the connection!") );
    this.socket.onClose(() => {
      alert("the connection dropped");
      this.props.auth0RefreshToken();
    });
    this.socket.connect();
    this.channel = this.socket.channel("private:"+this.generateSubTopic(), {});
    this.channel.onError(() => alert("there was an error!") );
    this.channel.onClose(() => {
      console.log("the channel has gone away gracefully");
    });
    this.channel.join()
      .receive("ok", resp => {this.props.loadEarlier(this.props.chat_user_id.chat_user_id);} )
      .receive("error", resp => alert(resp.reason) )
      .receive("timeout", () => alert("Networking issue. Still waiting...") );
    this.channel.on("new:msg", msg => this.appendNewMessage(msg) )
  }

  appendNewMessage(msg) {
    let new_message = {
      _id: msg.id,
      text: msg.body,
      createdAt: new Date(Date.now()),
      user: {
        _id: msg.sender_id
      },
    }
    this.props.newMessage(new_message);
  }

  componentWillUnmount() {
    this.channel.leave();
  }

  componentWillMount() {
    this.props.purge();
  }

  onSend(messages = []) {
    messages.forEach((message) => {
      this.channel.push("new:msg", {body: message.text}, 10000)
       .receive("ok", (msg) => console.log("created message", msg) )
       .receive("error", (reasons) => console.log("create failed", reasons) )
       .receive("timeout", () => console.log("Networking issue...") );
    });
  }

  render() {
    return (
      <View style={styles.container}>
        {Platform.OS === 'android' &&
          <Icon.ToolbarAndroid
            title={this.props.chat_user_id.chat_user_id}
            style={styles.toolbar}
            titleColor={Colors.TEXT_DARK_PRIMARY}
            navIconName='arrow-back'
            onIconClicked={() => {
              this.props.goToOverviewScreen();
            }}
          />
        }
        {Platform.OS === 'ios' &&
          <NavigationBar
            tintColor={Colors.TOOLBAR_SHADE}
            statusBar={{style: 'dark-content'}}
            title={{
              title: this.props.chat_user_id.chat_user_id,
              tintColor: Colors.TEXT_DARK_PRIMARY
            }}
            leftButton={{
              title: 'Back',
              tintColor: Colors.ACCENT,
              handler: () => {
                this.props.goToOverviewScreen();
              }
            }}
          />
        }
        <GiftedChat
          messages={this.props.messages}
          onSend={this.onSend}
          user={{
            _id: this.props.user_id
          }}
          loadEarlier={!this.props.till_last_loaded}
          onLoadEarlier={() => {this.props.loadEarlier(this.props.chat_user_id.chat_user_id);}}
          isLoadingEarlier={this.props.status==='loading'}
          shouldRenderAvatar={false}
        />
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
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
    idToken: state.auth0State.token.idToken,
    user_id: state.auth0State.profile.userId,
    messages: state.chatScreen0State.messages,
    last_id: state.chatScreen0State.last_id,
    till_last_loaded: state.chatScreen0State.till_last_loaded,
    status: state.chatScreen0State.status
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    auth0RefreshToken: () => {
      dispatch(callAuth0RefreshToken());
    },
    purge: () => {
      dispatch(callChatScreenPurge());
    },
    newMessage: (message) => {
      dispatch(callChatScreenNewMessage(message));
    },
    loadEarlier: (chat_user_id) => {
      dispatch(callChatScreenLoadEarlier(chat_user_id));
    },
    goToOverviewScreen: () => {
      Actions.mainScreen();
    }
  }
}

const ChatScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(ChatScreenComponent)

export default ChatScreen;