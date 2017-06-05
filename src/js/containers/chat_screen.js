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

class ChatScreenComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {messages: []};
    this.onSend = this.onSend.bind(this);
  }

  generateSubTopic(first_id, second_id) {
    if(first_id < second_id) {
      return first_id+","+second_id;
    }
    else {
      return second_id+","+first_id;
    }
  }

  componentDidMount() {
    this.socket = new Socket(API_BASE_URL+"/socket", {params: {token: this.props.idToken}});
    this.socket.connect();
    this.channel = this.socket.channel("private:"+this.generateSubTopic(this.props.user_id, this.props.chat_user_id), {});
    this.channel.join()
      .receive("ok", resp => { alert("Joined successfully") })
      .receive("error", resp => { alert(resp.reason) })
  }

  componentWillMount() {
    this.setState({
      messages: [
        {
          _id: 1,
          text: 'Hello developer',
          createdAt: new Date(Date.UTC(2016, 7, 30, 17, 20, 0)),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://facebook.github.io/react/img/logo_og.png',
          },
        },
      ],
    });
  }

  onSend(messages = []) {
    this.setState((previousState) => {
      return {
        messages: GiftedChat.append(previousState.messages, messages),
      };
    });
  }

  render() {
    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={this.onSend}
        user={{
          _id: 1,
        }}
      />
    );
  }

}


const mapStateToProps = (state) => {
  return {
    idToken: state.auth0State.token.idToken,
    user_id: state.auth0State.profile.userId
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    showChatScreen: (user_id) => {
      //
    }
  }
}

const ChatScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(ChatScreenComponent)

export default ChatScreen;