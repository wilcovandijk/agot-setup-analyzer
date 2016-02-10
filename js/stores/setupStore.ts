/*jshint quotmark:false */
/*jshint white:false */
/*jshint trailing:false */
/*jshint newcap:false */

/// <reference path="../libs/jquery.d.ts" />
/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../interfaces.d.ts"/>

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

  public stats : ISetupStats;
  public settings : ISetupSettings;

  public keyCards : Array<string>;
  public neverSetupCards : Array<string>;

  public setups : Array<any>;

  constructor() {
    var self = this;
    this.deck = DeckStore;
    this.neverSetupCards = ['02006', '02034', '01035'];

    this.exampleSetup = {draw:[]};
    this.onChanges = [];

    this.settings = {
      simulations: 5000,
      minimumCards: 3,
      minimumCharacters: 2,

      greatCardCounts: 5,
      greatCharacterCounts : 2,

      mulliganOnPoor : false,
      mulliganOn3Card : false,
      mulliganWithoutKey : false,
      mulliganIfNotGreat : false,
      mulliganIfUnderXCards : 4
    };

    this.resetStats();
  }

  public subscribe(onChange) {
    this.onChanges.push(onChange);
  }

  public inform() {
    this.onChanges.forEach(function (cb) { cb(); });
  }

  public resetStats(){
    this.stats = {
      simulations : 0,
      goldSetup : 0,
      cardsSetup : 0,
      greatSetups : 0,
      poorSetups : 0,
      cardCounts : [0, 0, 0, 0, 0, 0, 0, 0],
      distinctCharCounts : [0, 0, 0, 0, 0, 0, 0, 0],
      goldCounts : [0, 0, 0, 0, 0, 0, 0, 0, 0],
      traitStats : {}
    }
    this.setups = [];

    this.deck.getDisplayDeck().forEach(c => c.setup_count = 0);
  }

  public getSettings() : ISetupSettings{
    return this.settings;
  }

  public getStats() : ISetupStats{
    return this.stats;
  }

  public performSimulation(runs : number){
      if (DeckStore.getDrawDeck().length < 7){
        return;
      }

      this.resetStats()

      var setup = null;
      var self = this;
      var i = 0;
      var process : () => void;
      var process = function(){
        var steps = Math.min(runs-i, 100);
        for (var j=0; j < steps;j++){
          setup = self.runSetup(true);
          self.setups.push(setup);
        }
        self.inform();

        if (i < runs){
          i += steps;
          setTimeout(process, 1);
        }
      }
      process();
      // for (var i = 0; i < runs; i++){
      //   setup = this.runSetup(true);
      //   this.setups.push(setup);
      //   this.inform();
      // }
      // this.exampleSetup = setup;
      // this.inform();
  }

  protected validateSetup(setup){
    if (setup.hasAttachment && setup.distinctCharacters == 0){
      //this is invalid
      return false;
    }

    var attachments = setup.cards.map(c => this.deck.getDrawDeck()[c]).filter(c => c.type_code == 'attachment');
    var characters = setup.cards.map(c => this.deck.getDrawDeck()[c]).filter(c => c.type_code == 'character');

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
    var drawDeck = this.deck.getDrawDeck();
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
    var drawDeck = this.deck.getDrawDeck();
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

    if (mulligan && bestSetup.keyCards == 0 && this.settings.mulliganWithoutKey){
       return this.runSetup(false);
    }

    if (bestSetup.cards.length < 3 || bestSetup.distinctCharacters <= 1){
      if (mulligan && (this.settings.mulliganOnPoor || this.settings.mulliganIfNotGreat)){
        //try to mulligan for a better hand...
        return this.runSetup(false);
      }
      this.stats.poorSetups++;
    } else if (bestSetup.cards.length >= 5){
      this.stats.greatSetups++;
    } else if (mulligan && this.settings.mulliganIfNotGreat){
      return this.runSetup(false);
    } else if (bestSetup.cards.length <= 3 && mulligan && this.settings.mulliganOn3Card){
      return this.runSetup(false);
    }

    var credited = [];
    bestSetup.cards.forEach((pos) => {
      var card = drawDeck[pos];
      if (card.is_unique && credited.filter((c) => c == card).length > 0){
        return;
      }
      credited.push(card);
      card.setup_count++;
    });

    this.stats.goldSetup += bestSetup.currentCost;
    this.stats.cardsSetup += bestSetup.cards.length;
    this.stats.simulations++;

    this.stats.cardCounts[bestSetup.cards.length] += 1;
    this.stats.distinctCharCounts[bestSetup.distinctCharacters] += 1;
    this.stats.goldCounts[bestSetup.currentCost] += 1;

    return bestSetup;
  }

  public toggleMulliganOnPoor(){
    this.settings.mulliganOnPoor = !this.settings.mulliganOnPoor;
    this.inform();
  }

  public toggleMulliganWithoutKey(){
    this.settings.mulliganWithoutKey = !this.settings.mulliganWithoutKey;
    this.inform();
  }

  public toggleMulliganIfNotGreat(){
    this.settings.mulliganIfNotGreat = !this.settings.mulliganIfNotGreat;
    this.inform();
  }

  public toggleThreeCardMulligan(){
    this.settings.mulliganOn3Card = !this.settings.mulliganOn3Card;
    this.inform();
  }

  public setNumberOfSimulations(simulations){
    this.settings.simulations = simulations;
    this.inform();
  }
}

var SetupStore:SetupStoreStatic = new SetupStoreStatic();

AppDispatcher.register(function(payload:IActionPayload){
  if (payload.actionType == SetupActionID.PERFORM_SIMULATIONS){
    SetupStore.performSimulation(SetupStore.settings.simulations);
  } else if (payload.actionType == SetupActionID.TOGGLE_MULIGAN_ON_POOR){
    SetupStore.toggleMulliganOnPoor();
  } else if (payload.actionType == SetupActionID.TOGGLE_MULIGAN_WITHOUT_KEY){
    SetupStore.toggleMulliganWithoutKey();
  } else if (payload.actionType == SetupActionID.TOGGLE_MULIGAN_IF_NOT_GREAT){
    SetupStore.toggleMulliganIfNotGreat();
  } else if (payload.actionType == SetupActionID.TOGGLE_MULLIGAN_ON_THREE_CARD){
    SetupStore.toggleThreeCardMulligan();
  }
});


export = SetupStore;
