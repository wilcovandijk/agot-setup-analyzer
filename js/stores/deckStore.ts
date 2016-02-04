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
class DeckStore implements IDeckStore {
  private allCards : { [id: string] : ICard };
  public drawDeck : Array<ICard>;
  public displayDeck : Array<ICard>;
  public onChanges : Array<any>;

  constructor() {
    this.drawDeck = [];
    this.displayDeck = [];
    this.onChanges = [];
    this.allCards = {};
  }

  public subscribe(onChange) {
    this.onChanges.push(onChange);
  }

  public inform() {
    this.onChanges.forEach(function (cb) { cb(); });
  }

  public loadDeck(text : string) {
    var regexp = new RegExp('([0-9])x ([^(]+) \\(([^)]+)\\)', 'g');

    this.drawDeck = [];
    this.displayDeck = [];

    var req = $.get("js/data/cards.json", function (result) {
      result.forEach((cardData) => {
        this.allCards[cardData['pack_name'] + " - " + cardData['name']] = cardData;
      });

      var cardToAdd = regexp.exec(text);

      while (cardToAdd){
        var card = this.allCards[cardToAdd[3] + " - " + cardToAdd[2]];
        if (card.type_code != "plot"){
          card.count = cardToAdd[1];
          card.setup_count = 0;
          var limitedRegex = new RegExp('<abbr>Limited<\\/abbr>.*', 'g');
          card.is_limited = limitedRegex.test(card.text);
          if (card.is_limited){
            console.log("Limited ", card);
          }
          this.displayDeck.push(card);
          for (var i = 0; i < card.count; i++){
            this.drawDeck.push(card);
          }
        }
        cardToAdd = regexp.exec(text);
      }

      this.inform();
    }.bind(this));
  }
}

export { DeckStore };
