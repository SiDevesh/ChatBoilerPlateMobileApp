'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as Colors from '../constants/colors';
import Touchable from './touchable.js';

const RecentUsersListItem = ({onPress, primaryText, secondaryText}) => {
  return (
    <Touchable onPress={onPress}>
      <View style={styles.listitem_view}>
        <Icon name="person" size={40} color={Colors.TEXT_DARK_PRIMARY} />
        <View style={styles.listitem_textbox} >
          <Text style={styles.listitem_text_primary} >{primaryText}</Text>
          <Text style={styles.listitem_text_secondary} >{secondaryText}</Text>
        </View>
      </View>
    </Touchable>
  );
}

export default RecentUsersListItem;

const styles = StyleSheet.create({
  listitem_view: {
    height: 60,
    paddingLeft: 16,
    paddingRight: 16,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  listitem_text_primary: {
    color: Colors.TEXT_DARK_PRIMARY,
    fontSize: 16
  },
  listitem_text_secondary: {
    color: Colors.TEXT_DARK_SECONDARY,
    fontSize: 14
  },
  listitem_textbox: {
    paddingLeft: 16,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start'
  },
});
