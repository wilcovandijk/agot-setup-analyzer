/*jshint quotmark:false */
/*jshint white:false */
/*jshint trailing:false */
/*jshint newcap:false */

/// <reference path="../libs/jquery.d.ts" />
/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../interfaces.d.ts"/>

console.log("deckStore");

import AppDispatcher = require('../dispatcher/AppDispatcher');
import DeckActionID = require('../actions/DeckActionID');

/*
 * Stores direct information about the currently loaded Deck
 */
class DeckStoreStatic implements IDeckStore {
  private allCards : { [id: string] : ICard };
  public drawDeck : Array<ICard>;
  public displayDeck : Array<ICard>;
  public onChanges : Array<any>;

  constructor() {
    this.drawDeck = [];
    this.displayDeck = [];
    this.onChanges = [];
    this.allCards = {};
    var self = this;

    //TODO: Move cards to their own store, and move API call to it's own API
    var req = $.get("js/data/cards.json", function (result) {
      result.forEach((cardData) => {
        self.allCards[cardData['pack_name'] + " - " + cardData['name']] = cardData;
      });
    });
  }

  public subscribe(onChange) {
    this.onChanges.push(onChange);
  }

  public inform() {
    this.onChanges.forEach(function (cb) { cb(); });
  }

  public getDisplayDeck() : Array<ICard>{
    return this.displayDeck;
  }

  public getDrawDeck() : Array<ICard>{
    return this.drawDeck;
  }

  public getCard(code) : ICard{
    var cards = this.getDisplayDeck().filter(c => c.code == code)

    if (cards.length >= 0){
      return cards[0];
    }
    return null;
  }

  public markKeyCard(code){
    var card = this.getCard(code);
    card.is_key_card = !card.is_key_card;
    card.is_avoided = false;
    card.is_restricted = false;

    this.inform();
  }

  public markAvoidedCard(code){
    var card = this.getCard(code);
    card.is_key_card = false;
    card.is_avoided = !card.is_avoided;
    card.is_restricted = false;

    this.inform();
  }

  public markRestrictedCard(code){
    var card = this.getCard(code);
    card.is_key_card = false;
    card.is_avoided = false;
    card.is_restricted = !card.is_restricted;

    this.inform();
  }

  public loadDeck(text : string) {
    var regexp = new RegExp('([0-9])x ([^(]+) \\(([^)]+)\\)', 'g');

    this.drawDeck = [];
    this.displayDeck = [];

    var neverSetup = ['02006', '02034', '01035'];

      var cardToAdd = regexp.exec(text);

      while (cardToAdd){
        var card = this.allCards[cardToAdd[3] + " - " + cardToAdd[2]];
        if (card.type_code != "plot"){
          card.count = +cardToAdd[1];
          card.setup_count = 0;

          card.is_key_card = false;
          card.is_avoided = false;
          card.is_restricted = false;

          if (neverSetup.filter(c => c == card.code).length > 0){
            card.is_restricted = true;
          }

          this.addLimitedStatus(card);
          this.addIncomeBonus(card);
          this.addMarshalEffects(card);
          this.addAttachmentRestrictions(card);

          if (card.enter_play_effect){
            card.is_avoided = true;
          }

          this.displayDeck.push(card);
          for (var i = 0; i < card.count; i++){
            this.drawDeck.push(card);
          }
        }
        cardToAdd = regexp.exec(text);
      }

      this.inform();
    }


  private addLimitedStatus(card:ICard){
    var limitedRegex = new RegExp('<abbr>Limited<\\/abbr>.*', 'g');
    card.is_limited = limitedRegex.test(card.text);
  }

  private addIncomeBonus(card:ICard){
    var incomeRegex = new RegExp('\\+([0-9]) Income', 'g');
    var incomeMatches = incomeRegex.exec(card.text);

    card.income = 0;
    if (incomeMatches){
      card.income = +incomeMatches[1];
    }
  }

  private addAttachmentRestrictions(card:ICard){
    card.attachmentRestriction = [];
    if (card.type_code == 'attachment') {
      var restrictionRegex = new RegExp('(.*) character only');
      var restrictionMatches = restrictionRegex.exec(card.text);

      if (restrictionMatches){
        if (restrictionMatches[1] == '<i>Lord</i> or <i>Lady</i>'
            || restrictionMatches[1] == 'Lord or Lady'){
          card.attachmentRestriction = ['Lord', 'Lady'];
        } else{
          var restriction = restrictionMatches[1];
          restriction = restriction.replace(/\[|\]/g, "");
          card.attachmentRestriction = [restriction];
        }
      }
    } else if (card.type_code == 'character'){
      var restrictionRegex = new RegExp('No attachments( except <i>Weapon<\\/i>)');
      var restrictionMatches = restrictionRegex.exec(card.text);

      if (restrictionMatches){

        if (restrictionMatches[1]){
          card.attachmentRestriction = ['Weapon'];
        } else {
          card.attachmentRestriction = ['NO ATTACHMENTS'];
        }
      }
    }
  }

  private addMarshalEffects(card:ICard){
    var marshalEffectRegex = new RegExp('(After you marshal ' + card.name + ')|(After ' + card.name + ' enters play)');
    var marshalMatches = marshalEffectRegex.exec(card.text);

    card.enter_play_effect = marshalEffectRegex.test(card.text);
    if (card.enter_play_effect){
    }
  }
}

var DeckStore:DeckStoreStatic = new DeckStoreStatic();

AppDispatcher.register(function(payload:IActionPayload){
  console.log("deckStore: payload", payload);
  if (payload.actionType == DeckActionID.LOAD_DECK){
    DeckStore.loadDeck(payload.data);
  } else if (payload.actionType == DeckActionID.MARK_KEY_CARD){
    DeckStore.markKeyCard(payload.data);
  } else if (payload.actionType == DeckActionID.MARK_AVOID_CARD){
    DeckStore.markAvoidedCard(payload.data);
  } else if (payload.actionType == DeckActionID.MARK_NEVER_CARD){
    DeckStore.markRestrictedCard(payload.data);
  }
});


export = DeckStore;
