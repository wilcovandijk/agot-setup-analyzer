/*jshint quotmark:false */
/*jshint white:false */
/*jshint trailing:false */
/*jshint newcap:false */

/// <reference path="../libs/jquery.d.ts" />
/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../interfaces.d.ts"/>

console.log("setupStore");

import AppDispatcher = require('../dispatcher/AppDispatcher');
import SetupActionID = require('../actions/setupActionID');
import DeckStore = require('./deckStore')


// Generic "model" object. You can use whatever
// framework you want. For this application it
// may not even be worth separating this logic
// out, but we do this to demonstrate one way to
// separate out parts of your application.
class SetupStoreStatic implements ISetupStore {
  public deck : IDeckStore;

  public exampleSetup;
  public onChanges : Array<any>;

  public mulliganOnPoor : boolean;
  public mulliganWithoutKey : boolean;

  public cardsSetup : number;
  public goldSetup : number;
  public simulations : number;
  public poorSetups : number;
  public greatSetups : number;
  public cardCounts : Array<number>;

  public keyCards : Array<string>;

  public neverSetupCards : Array<string>;

  public distinctCharCounts : Array<number>;
  public goldCounts: Array<number>;
  public traitStats : { [id: string] : string };

  public setups : Array<any>;

  constructor() {
    var self = this;
    this.deck = DeckStore;
    this.neverSetupCards = ['02006', '02034', '01035'];

    this.exampleSetup = {draw:[]};
    this.onChanges = [];
    this.mulliganOnPoor = false;
    this.mulliganWithoutKey = false;
    this.resetStats();
  }

  public subscribe(onChange) {
    this.onChanges.push(onChange);
  }

  public inform() {
    this.onChanges.forEach(function (cb) { cb(); });
  }

  public resetStats(){
    this.simulations = 0;
    this.goldSetup = 0;
    this.cardsSetup = 0;
    this.greatSetups = 0;
    this.poorSetups = 0;
    this.setups = [];
    this.cardCounts = [0, 0, 0, 0, 0, 0, 0, 0];
    this.distinctCharCounts = [0, 0, 0, 0, 0, 0, 0, 0];
    this.goldCounts = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.traitStats = {};

    this.deck.displayDeck.forEach(c => c.setup_count = 0);
  }

  public performSimulation(runs : number){
    console.log("start sim");
      if (DeckStore.getDrawDeck().length < 7){
        console.log("not enough cards");
        return;
      }

      this.resetStats()

      var setup = null;
      for (var i = 0; i < runs; i++){
        setup = this.runSetup(true);
        this.setups.push(setup);

      }
      this.exampleSetup = setup;
      console.log("end sim");
      this.inform();
  }

  protected validateSetup(setup){
    if (setup.hasAttachment && setup.distinctCharacters == 0){
      //this is invalid
      return false;
    }

    var attachments = setup.cards.map(c => this.deck.drawDeck[c]).filter(c => c.type_code == 'attachment');
    var characters = setup.cards.map(c => this.deck.drawDeck[c]).filter(c => c.type_code == 'character');

    var unattachables = attachments.filter((att) => {
      var regex = att.attachmentRestriction.reduce((prev, curr) => (prev ? prev + "|" : "") + curr, "");

      var traitRegex = new RegExp(regex);
      var targetCharacters = characters.filter((c) => {
        if (c.attachmentRestriction){
          var attachmentRestriction = new RegExp(c.attachmentRestriction.reduce((prev, curr) => (prev ? prev + "|" : "") + curr, ""));

          if (!attachmentRestriction.test(att.traits)){
            return false;
          }

        }

         return !att.attachmentRestriction || traitRegex.test(c.traits) || traitRegex.test(c.faction_code);
       });

      if (targetCharacters == 0){
        return true;
      }

      return false;
    });

    //TODO: determine attachment validity based on traits/faction

    return unattachables.length == 0;
  }

  protected scoreSetup(setup){

    var factors = [
      setup.distinctCharacters > 1, // must have at least > 1 char
      setup.keyCards,
      (setup.cards.length - setup.avoidedCards), // cards used that we like to setup
      setup.cards.length, // cards used overall
      setup.currentCost + setup.income, // effective gold used at setup
      setup.limitedUsed, // was a limited card able to be played?
      setup.distinctCharacters, // how many characters were played
      setup.strength // how strong were the characters played
    ];

    var score = 0;

    for (var i = 0; i < factors.length; i++){
      score += factors[i] * Math.pow(100, (factors.length - i));
    }

    setup.factors = factors;

    setup.score = score;
  }

  public setUp(setup, remainingCards){
    var drawDeck = this.deck.drawDeck;
    if (remainingCards.length == 0){
      if (!this.validateSetup(setup)){
        //this is invalid
        return [];
      }

      this.scoreSetup(setup);

      return [setup];
    }

    var pos = remainingCards[0];
    var card = drawDeck[pos];
    var remainingCards = remainingCards.slice(1);

    if (card.is_unique && setup.cards.filter(function(c) { return drawDeck[c].code == card.code }).length > 0){
      setup.cards.push(pos);
      return this.setUp(setup, remainingCards);
    }

    if (setup.limitedUsed && card.is_limited){
      return this.setUp(setup, remainingCards);
    }

    if (card.cost + setup.currentCost <= 8){
      var cardNotUsedSetup = $.extend(true, {}, setup)

      if (card.is_limited){
        setup.limitedUsed = true;
      }

      if (card.is_key_card){
        setup.keyCards++;
      } else if (card.is_avoided){
        setup.avoidedCards++;
      }

      if (card.type_code == 'character'){
        setup.strength += card.strength;
        setup.distinctCharacters++;
      }

      if (card.type_code == 'attachment'){
        setup.hasAttachment = true;
      }

      if (card.enter_play_effect){
        setup.enterPlayEffects += 1;
      }

      setup.currentCost += card.cost;
      setup.income += card.income;
      setup.cards.push(pos);

      return this.setUp(setup, remainingCards).concat(this.setUp(cardNotUsedSetup, remainingCards));
    }

    return this.setUp(setup, remainingCards);
  }

  private runSetup(mulligan){
    var drawDeck = this.deck.drawDeck;
    var deckSize = drawDeck.length;
    var draw = [];
    while (draw.length < 7){
      var pos = Math.floor((Math.random() * deckSize));
      if (draw.filter(function(c) { return c == pos }).length > 0) {
        continue;
      }
      draw.push(pos);
    }

    var filteredDraw = draw.filter(function(d) {
      var card = drawDeck[d];
      return (card.type_code == 'character'
             || (card.type_code == 'location'
                 && card.code != '02006')
             || (card.type_code == 'attachment'
                 && card.code != '02034'
                 && card.code != '01035')) && ! card.is_restricted;
    })

    var possibleSetup = this.setUp({
      currentCost: 0,
      limitedUsed: false,
      distinctCharacters: 0,
      hasAttachment: false,
      strength: 0,
      income: 0,
      enterPlayEffects: 0,
      keyCards: 0,
      avoidedCards: 0,
      cards: []
    }, filteredDraw);

    var bestSetup = possibleSetup[0];
    possibleSetup.forEach((setup) => {
      if (setup.score > bestSetup.score){
        bestSetup = setup;
      }
    });

    bestSetup.draw = draw;

    if (mulligan && bestSetup.keyCards == 0 && this.mulliganWithoutKey){
       return this.runSetup(false);
    }

    if (bestSetup.cards.length < 3 || bestSetup.distinctCharacters <= 1){
      if (mulligan && this.mulliganOnPoor){
        //try to mulligan for a better hand...
        return this.runSetup(false);
      }
      this.poorSetups++;
    } else if (bestSetup.cards.length >= 5){
      this.greatSetups++;
    }

    var credited = [];
    bestSetup.cards.forEach((pos) => {
      var card = this.deck.drawDeck[pos];
      if (card.is_unique && credited.filter((c) => c == card).length > 0){
        return;
      }
      credited.push(card);
      card.setup_count++;
    });

    this.goldSetup += bestSetup.currentCost;
    this.cardsSetup += bestSetup.cards.length;
    this.simulations++;

    this.cardCounts[bestSetup.cards.length] += 1;
    this.distinctCharCounts[bestSetup.distinctCharacters] += 1;
    this.goldCounts[bestSetup.currentCost] += 1;

    return bestSetup;
  }

  public toggleMulliganOnPoor(){
    this.mulliganOnPoor = !this.mulliganOnPoor;
    this.inform();
  }

  public toggleMulliganWithoutKey(){
    this.mulliganWithoutKey = !this.mulliganWithoutKey;
    this.inform();
  }
}

var SetupStore:SetupStoreStatic = new SetupStoreStatic();

AppDispatcher.register(function(payload:IActionPayload){
  console.log("setupStore : payload", payload);
  if (payload.actionType == SetupActionID.PERFORM_SIMULATIONS){
    SetupStore.performSimulation(payload.data);
  } if (payload.actionType == SetupActionID.TOGGLE_MULIGAN_ON_POOR){
    SetupStore.toggleMulliganOnPoor();
  } if (payload.actionType == SetupActionID.TOGGLE_MULIGAN_WITHOUT_KEY){
    SetupStore.toggleMulliganWithoutKey();
  }
});


export = SetupStore;
