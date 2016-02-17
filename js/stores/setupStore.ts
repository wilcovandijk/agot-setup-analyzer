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
  public noMulliganStats : ISetupStats;
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

      poorCards: 2,

      minimumCards: 0,
      minimumCharacters: 2,

      greatCardCounts: 5,
      greatCharacterCounts : 2,

      requireMoreThanOneCharacter: true,

      mulliganOnPoor : true,
      mulliganWithoutKey : false
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
    this.noMulliganStats = {
      simulations : 0,
      goldSetup : 0,
      cardsSetup : 0,
      greatSetups : 0,
      poorSetups : 0,
      cardCounts : [0, 0, 0, 0, 0, 0, 0, 0],
      distinctCharCounts : [0, 0, 0, 0, 0, 0, 0, 0],
      goldCounts : [0, 0, 0, 0, 0, 0, 0, 0, 0],
      traitStats : {}
    };
    this.setups = [];

    this.deck.getDisplayDeck().forEach(c => c.setup_count = 0);
  }

  public getSettings() : ISetupSettings{
    return $.extend({}, this.settings) as ISetupSettings;
  }

  public getStats() : ISetupStats{
    return $.extend({}, this.stats) as ISetupStats;
  }

  public getNoMulliganStats() : ISetupStats{
    return this.noMulliganStats;
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
      this.settings.requireMoreThanOneCharacter ? setup.distinctCharacters > 1 : 0, // must have at least > 1 char
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

  private runSetup(mulligan, previousSetup = null){
    if (previousSetup && !mulligan){
      this.updateStats(this.noMulliganStats, previousSetup);
    }
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
       return this.runSetup(false, bestSetup);
    }

    if (mulligan && bestSetup.cards.length <= this.settings.minimumCards){
        return this.runSetup(false, bestSetup);
    } else if (bestSetup.cards.length <= this.settings.poorCards || (bestSetup.distinctCharacters <= 1 && this.settings.requireMoreThanOneCharacter)){
      if (mulligan && this.settings.mulliganOnPoor){
        //try to mulligan for a better hand...
        return this.runSetup(false, bestSetup);
      }
      this.stats.poorSetups++;
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

    this.updateStats(this.stats, bestSetup);

    if (mulligan && !previousSetup){
      this.updateStats(this.noMulliganStats, bestSetup);
    }

    if (previousSetup){
      bestSetup.mulliganed = previousSetup;
    } else{
      bestSetup.mulliganed = null;
    }
    return bestSetup;
  }

  private updateStats(stats:ISetupStats, setup){
    stats.goldSetup += setup.currentCost;
    stats.cardsSetup += setup.cards.length;
    stats.simulations++;

    stats.cardCounts[setup.cards.length] += 1;
    stats.distinctCharCounts[setup.distinctCharacters] += 1;
    stats.goldCounts[setup.currentCost] += 1;
  }

  public toggleMulliganOnPoor(){
    this.settings.mulliganOnPoor = !this.settings.mulliganOnPoor;
    this.inform();
  }

  public toggleMulliganWithoutKey(){
    this.settings.mulliganWithoutKey = !this.settings.mulliganWithoutKey;
    this.inform();
  }

  public toggleRequireMoreThanOneCharacter(){
    this.settings.requireMoreThanOneCharacter = !this.settings.requireMoreThanOneCharacter;
    this.inform();
  }

  public setNumberOfSimulations(simulations){
    this.settings.simulations = simulations;
    this.inform();
  }

  public setPoorCards(cards){
    this.settings.poorCards = Math.min(7, Math.max(0, cards));
    this.inform();
  }

  public setMinimumCards(cards){
    this.settings.minimumCards = Math.min(7, Math.max(0, cards));
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
  } else if (payload.actionType == SetupActionID.TOGGLE_REQUIRE_ONE_CHARACTER){
    SetupStore.toggleRequireMoreThanOneCharacter();
  } else if (payload.actionType == SetupActionID.SET_POOR_CARDS){
    SetupStore.setPoorCards(payload.data);
  } else if (payload.actionType == SetupActionID.SET_MINIMUM_CARDS){
    SetupStore.setMinimumCards(payload.data);
  }
});


export = SetupStore;
