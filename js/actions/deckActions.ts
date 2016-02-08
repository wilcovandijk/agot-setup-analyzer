/*jshint quotmark: false */
/*jshint white: false */
/*jshint trailing: false */
/*jshint newcap: false */
/*global React */

/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../interfaces.d.ts"/>

 console.log("deckActions");

import AppDispatcher = require('../dispatcher/AppDispatcher');
import DeckActionID = require('./deckActionID');

class DeckActionsStatic {

  // so jshint won't bark
  public DeckActionID = DeckActionID;
  public AppDispatcher = AppDispatcher;


  public deckLoad(text:string){
    console.log("loading", DeckActionID.LOAD_DECK, text);
    AppDispatcher.dispatch({
      actionType: DeckActionID.LOAD_DECK,
      data: text
    });
    console.log("done loading");
  }

  public markKeyCard(code:string){
    AppDispatcher.dispatch({
      actionType: DeckActionID.MARK_KEY_CARD,
      data: code
    });
  }
}

var DeckActions: DeckActionsStatic = new DeckActionsStatic();

export = DeckActions;
