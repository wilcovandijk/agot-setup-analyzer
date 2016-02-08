/*jshint quotmark:false */
/*jshint white:false */
/*jshint trailing:false */
/*jshint newcap:false */

/// <reference path="../libs/jquery.d.ts" />
/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../interfaces.d.ts"/>

console.log("dummyStore");

import AppDispatcher = require('../dispatcher/AppDispatcher');

/*
This does nothing, but I'm leaving it for testing purposes for the time being
*/
class DummyStoreStatic {
  public dummy(){
    console.log("dummy store");
  }
}

var DummyStore:DummyStoreStatic = new DummyStoreStatic();

AppDispatcher.register(function(payload:IActionPayload){
  console.log("dummyStore : payload", payload);
});

export { DummyStore };
