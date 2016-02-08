/*jshint quotmark: false */
/*jshint white: false */
/*jshint trailing: false */
/*jshint newcap: false */

/// <reference path="../libs/jquery.d.ts" />
/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../interfaces.d.ts"/>

console.log("dummyAction");

import AppDispatcher = require('../dispatcher/appDispatcher');

/*
This does nothing, but I'm leaving it for testing purposes for the time being
*/
class DummyActionStatic {
  public dummy(){
    console.log("dummy action");
  }
}

var DummyAction: DummyActionStatic = new DummyActionStatic();

AppDispatcher.register(function(payload:IActionPayload){
  console.log("dummyActions : payload", payload);
});

export { DummyAction };
