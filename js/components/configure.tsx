/*jshint quotmark: false */
/*jshint white: false */
/*jshint trailing: false */
/*jshint newcap: false */
/*global React */

/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../interfaces.d.ts"/>
/// <reference path="../libs/react-d3.d.ts" />

import { CardItem } from "../cardItem";


interface IConfigureProps {
  setup : ISetupStore;
}

interface IConfigureState {
}

class Configure extends React.Component<IConfigureProps, IConfigureState> {

  public state : ICardItemState;

  constructor(props : IConfigureProps){
    super(props);
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
    var deck = this.props.setup.deck;

    var i = 0;


    console.log("avoided : ", this.props.setup.avoidCards);
    var avoidedCards = this.props.setup.avoidCards.map((pos) => deck.drawDeck[pos]);
    avoidedCards = avoidedCards.filter(function(item, i, ar){ return ar.indexOf(item) === i; });

    console.log("avoided : ", avoidedCards);

    var avoidedItems = avoidedCards.map((card) => {
      i++;

      var code = card.code + i;
      var image = "http://thronesdb.com/" + card.imagesrc;
      var className = "card-container";

      return (
        <div className={className}><img src={image}/></div>
      );
    });

    return (
      <section className="content">
        <section className="example">
          <div>Avoided:</div>
          <div className="example-container">
            {avoidedItems}
          </div>
        </section>
      </section>
    );
  }
}

export { Configure };
