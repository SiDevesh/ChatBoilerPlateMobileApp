'use strict';

import Realm from 'realm';

class ConfigData {}
ConfigData.schema = {
  name: 'ConfigData',
  primaryKey: 'key',
  properties: {
    key:  'string',
    value: 'string',
  }
};

let realm = new Realm({
  schema: [ConfigData],
  schemaVersion: 1
});

//realm.write(() => {
//  realm.deleteAll();
//});

if(realm.objectForPrimaryKey('ConfigData', 'auth0_profile') === undefined) {
  realm.write(() => {
    realm.create('ConfigData', {
      key: 'auth0_profile', value: ''
    });  
  });
}

if(realm.objectForPrimaryKey('ConfigData', 'auth0_token') === undefined) {
  realm.write(() => {
    realm.create('ConfigData', {
      key: 'auth0_token', value: ''
    });  
  });
}

export default realm;