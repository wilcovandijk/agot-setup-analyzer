/*jshint quotmark: false */
/*jshint white: false */
/*jshint trailing: false */
/*jshint newcap: false */
/*global React */

/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../interfaces.d.ts"/>
/// <reference path="../libs/react-d3.d.ts" />

import { CardSettings } from "./cardSettings";
import DeckStore = require('../stores/deckStore')
import AppDispatcher = require('../dispatcher/AppDispatcher');
import SetupActionID = require('../actions/SetupActionID');

interface IConfigureProps {
  setup : ISetupStore;
}

interface IConfigureState {
  displayDeck : Array<ICard>
}

class Configure extends React.Component<IConfigureProps, IConfigureState> {

  public state : IConfigureState;

  constructor(props : IConfigureProps){
    super(props);

    this.state = this.getStateFromStores();

    DeckStore.subscribe(this._onChange.bind(this));
  }

  private getStateFromStores(){
    return {
      displayDeck: DeckStore.getDisplayDeck()
    }
  }

  private _onChange(){
    this.setState(this.getStateFromStores());
  }

  /**
   * This is a completely optional performance enhancement that you can
   * implement on any React component. If you were to delete this method
   * the app would still work correctly (and still be very performant!), we
   * just use it as an example of how little code it takes to get an order
   * of magnitude performance improvement.
   */
  // public shouldComponentUpdate(nextProps : ICardItemProps, nextState : ICardItemState) {
  //   return false;
  // }


  public render() {
    var displayDeck = this.state.displayDeck;

    var i = 0;

    var avoidedCards = displayDeck.filter((card) => card.is_avoided);
    avoidedCards = avoidedCards.filter(function(item, i, ar){ return ar.indexOf(item) === i; });

    var avoidedItems = avoidedCards.map((card) => {
      i++;
      return (
        <CardSettings key={card.code} code={card.code} />
      );
    });

    var allCards = displayDeck.sort(function(c1, c2) {
      if (c1.cost == c2.cost){
        return c2.cost - c1.cost;
      } else if (c1.name < c2.name) {
         return 1;
      }
      return -1;
    }).map((card) => {
      return (
        <CardSettings key={card.code} code={card.code}/>
      );
    });

    return (
      <section className="content">
        <section className="configure">
          <div>Cards avoided during setup if possible:</div>
          <div className="card-list">
            {avoidedItems}
          </div>
          <p>This section is a work in progress, and will soon be the home of configuration settings...</p>
          <div className="card-list">
            {allCards}
          </div>
        </section>
      </section>
    );
  }
}

export { Configure };
