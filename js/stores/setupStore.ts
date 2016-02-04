/*jshint quotmark:false */
/*jshint white:false */
/*jshint trailing:false */
/*jshint newcap:false */

/// <reference path="../libs/jquery.d.ts" />
/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../interfaces.d.ts"/>

// Generic "model" object. You can use whatever
// framework you want. For this application it
// may not even be worth separating this logic
// out, but we do this to demonstrate one way to
// separate out parts of your application.
class SetupStore implements ISetupStore {
  public deck : IDeckStore;

  public exampleSetup;
  public onChanges : Array<any>;

  public cardsSetup : number;
  public goldSetup : number;
  public simulations : number;
  public poorSetups : number;
  public greatSetups : number;
  public cardCounts : Array<number>;

  public distinctCharCounts : Array<number>;
  public goldCounts: Array<number>;
  public traitStats : { [id: string] : string };

  private setups : Array<any>;

  constructor(deck : IDeckStore) {
    var self = this;
    this.deck = deck;

    this.deck.subscribe(function(){
      self.resetStats();
      if (self.deck.drawDeck.length >= 8){
        self.performSimulation(5000);
      }
      self.inform();
    });

    this.exampleSetup = {draw:[]};
    this.onChanges = [];
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
  }

  public performSimulation(runs : number){
      this.resetStats()

      var setup = null;
      for (var i = 0; i < runs; i++){
        setup = this.runSetup();
      }
      this.exampleSetup = setup;
      this.setups.push(setup);
      this.inform();
  }

  public setUp(setup, remainingCards){
    var drawDeck = this.deck.drawDeck;
    if (remainingCards.length == 0){
      if (setup.hasAttachment && setup.distinctCharacters == 0){
        //this is invalid
        return [];
      }

      var score = (setup.cards.length * 1000) + (setup.currentCost * 100) + (setup.distinctCharacters * 10) + setup.strength;
      if (setup.distinctCharacters > 1){
        score += 10000;
      }
      setup.score = score;
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

      if (card.type_code == 'character'){
        setup.strength += card.strength;
        setup.distinctCharacters++;
      }

      if (card.type_code == 'attachment'){
        setup.hasAttachment = true;
      }

      setup.currentCost += card.cost;
      setup.cards.push(pos);

      return this.setUp(setup, remainingCards).concat(this.setUp(cardNotUsedSetup, remainingCards));
    }

    return this.setUp(setup, remainingCards);
  }

  private runSetup(){
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
      return card.type_code == 'character'
             || card.type_code == 'location'
             || (card.type_code == 'attachment'
             && card.code != '02034'
             && card.code != '01035');
    })

    var possibleSetup = this.setUp({
      currentCost: 0,
      limitedUsed: false,
      distinctCharacters: 0,
      hasAttachment: false,
      strength: 0,
      cards: []
    }, filteredDraw);

    var bestSetup = possibleSetup[0];
    possibleSetup.forEach((setup) => {
      if (setup.score > bestSetup.score){
        //console.log("best", setup);
        bestSetup = setup;
      }
    });

    var credited = [];
    bestSetup.cards.forEach((pos) => {
      var card = this.deck.drawDeck[pos];
      if (card.is_unique && credited.filter((c) => c == card).length > 0){
        return;
      }
      credited.push(card);
      card.setup_count++;
    });

    bestSetup.draw = draw;

    this.goldSetup += bestSetup.currentCost;
    this.cardsSetup += bestSetup.cards.length;
    this.simulations++;

    this.cardCounts[bestSetup.cards.length] += 1;
    this.distinctCharCounts[bestSetup.distinctCharacters] += 1;
    this.goldCounts[bestSetup.currentCost] += 1;

    if (bestSetup.cards.length < 3 || bestSetup.distinctCharacters <= 1){
      this.poorSetups++;
    } else if (bestSetup.cards.length >= 5){
      this.greatSetups++;
    }

    return bestSetup;
  }
}
export { SetupStore };
