'use strict';
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View
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

class ChatScreenComponent extends React.Component {

  constructor(props) {
    super(props);
    this.onSend = this.onSend.bind(this);
  }

  generateSubTopic() {
    let first_id = this.props.user_id;
    let second_id = this.props.chatter_id;
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
      alert("the channel has gone away gracefully");
    });
    this.channel.join()
      .receive("ok", resp => {alert("Joined successfully, catching up");console.log(resp.messages);} )
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
    this.props.setChatterId(this.props.chat_user_id.chat_user_id);
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
      <GiftedChat
        messages={this.props.messages}
        onSend={this.onSend}
        user={{
          _id: this.props.user_id
        }}
        loadEarlier={!this.props.till_last_loaded}
        onLoadEarlier={() => {this.props.loadEarlier();}}
        isLoadingEarlier={this.props.status==='loading'}
      />
    );
  }

}


const mapStateToProps = (state) => {
  return {
    idToken: state.auth0State.token.idToken,
    user_id: state.auth0State.profile.userId,
    messages: state.chatScreen0State.messages,
    last_id: state.chatScreen0State.last_id,
    till_last_loaded: state.chatScreen0State.till_last_loaded,
    chatter_id: state.chatScreen0State.chatter_id,
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
    loadEarlier: () => {
      dispatch(callChatScreenLoadEarlier());
    },
    setChatterId: (id) => {
      dispatch(callChatScreenChatterId(id));
    }
  }
}

const ChatScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(ChatScreenComponent)

export default ChatScreen;