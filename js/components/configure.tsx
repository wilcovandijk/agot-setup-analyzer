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
import SetupStore = require('../stores/setupStore')
import AppDispatcher = require('../dispatcher/AppDispatcher');
import SetupActionID = require('../actions/SetupActionID');

interface IConfigureProps {
  settings : ISetupSettings;
  displayDeck : Array<ICard>;
}

interface IConfigureState {
}

class Configure extends React.Component<IConfigureProps, IConfigureState> {

  public state : IConfigureState;

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

  private cardSort(c1, c2) {
    // if (c1.is_restricted && !c2.is_restricted){
    //   return 1;
    // } else if (c2.is_restricted && !c1.is_restricted){
    //   return -1;
    // }
    //
    // if (c1.is_key_card && !c2.is_key_card){
    //   return -1;
    // } else if (c2.is_key_card && !c2.is_key_card){
    //   return 1;
    // }
    //
    // if (c1.is_avoided && !c2.is_avoided){
    //   return -1;
    // } else if (c2.is_avoided && !c2.is_avoided){
    //   return 1;
    // }

    if (c1.cost != c2.cost){
      return c2.cost - c1.cost;
    } else if (c1.name < c2.name) {
       return 1;
    }
    return -1;
  }

  private toggleMulliganOnPoor(){
    AppDispatcher.dispatch({
      actionType: SetupActionID.TOGGLE_MULIGAN_ON_POOR,
      data: null
    })
  }

  private toggleMulliganWithoutKey(){
    AppDispatcher.dispatch({
      actionType: SetupActionID.TOGGLE_MULIGAN_WITHOUT_KEY,
      data: null
    })
  }

  private toggleRequireEcon(){
    AppDispatcher.dispatch({
      actionType: SetupActionID.TOGGLE_REQUIRE_ECON,
      data: null
    })
  }

  private toggleMulliganWithoutEcon(){
    AppDispatcher.dispatch({
      actionType: SetupActionID.TOGGLE_MULLIGAN_WITHOUT_ECON,
      data: null
    })
  }

  private toggleRequireMoreThanOneCharacter(){
    AppDispatcher.dispatch({
      actionType: SetupActionID.TOGGLE_REQUIRE_ONE_CHARACTER,
      data: null
    })
  }

  private toggleFavorEcon(){
    AppDispatcher.dispatch({
      actionType: SetupActionID.TOGGLE_FAVOR_ECON,
      data: null
    })
  }

  private poorCardsChanged(event:any){
    AppDispatcher.dispatch({
      actionType: SetupActionID.SET_POOR_CARDS,
      data: event.target.value
    })
  }

  private minimumCardsChanged(event:any){
    AppDispatcher.dispatch({
      actionType: SetupActionID.SET_MINIMUM_CARDS,
      data: event.target.value
    })
  }

  private toggleRequireFourCostCharacter(){
    AppDispatcher.dispatch({
      actionType: SetupActionID.TOGGLE_REQUIRE_FOUR_COST_CHARACTER,
      data: null
    })
  }

  public render() {
    var displayDeck = this.props.displayDeck;

    var i = 0;

    var avoidedCards = displayDeck.filter((card) => card.is_avoided).sort(this.cardSort);
    var avoidedItems = avoidedCards.sort(this.cardSort).map((card) => {
      i++;
      return (
        <CardSettings key={card.code} card={card} />
      );
    });

    var avoided = null;
    if (avoidedCards.length > 0){
      avoided = (
        <div>
          <div>Try to Avoid Cards:</div>
          <div className="card-list">
            {avoidedItems}
          </div>
        </div>
      )
    }

    var keyCards = displayDeck.filter((card) => card.is_key_card).sort(this.cardSort);
    var keyItems = keyCards.sort(this.cardSort).map((card) => {
      i++;
      return (
        <CardSettings key={card.code} card={card} />
      );
    });

    var key = null;
    if (keyCards.length > 0){
      key = (
        <div>
          <div>Key cards:</div>
          <div className="card-list">
            {keyItems}
          </div>
        </div>
      );
    }

    var restrictedCards = displayDeck.filter((card) => card.is_restricted).sort(this.cardSort);
    var restrictedItems = restrictedCards.map((card) => {
      i++;
      return (
        <CardSettings key={card.code} card={card} />
      );
    });

    var restricted = null;
    if (restrictedCards.length > 0){
      restricted = (
        <div>
          <div>Restricted Cards:</div>
          <div className="card-list">
            {restrictedItems}
          </div>
        </div>
      );
    }

    var econCards = displayDeck.filter((card) => card.is_econ && !card.is_avoided && !card.is_key_card).sort(this.cardSort);
    var econItems = econCards.map((card) => {
      i++;
      return (
        <CardSettings key={card.code} card={card} />
      );
    });

    var econ = null;
    if (econCards.length > 0){
      econ = (
        <div>
          <div>Econ Cards:</div>
          <div className="card-list">
            {econItems}
          </div>
        </div>
      );
    }

    var cards = displayDeck.sort(this.cardSort);
    var allCards = cards.map((card) => {
      return (
        <CardSettings key={card.code} card={card}/>
      );
    });

    return (
      <section className="content">
        <section className="configure">
          <h2>Preferred Setup Settings</h2>
          <div>
            <p><strong>Require Two Characters:</strong></p>
            <input id="require-one-character" type="checkbox" checked={this.props.settings.requireMoreThanOneCharacter} onChange={this.toggleRequireMoreThanOneCharacter} />
            <label htmlFor="require-one-character">Require 2+ Characters. If this is selected, one character setups will be considered poor</label>

            <p><strong>Require Four Cost Character:</strong></p>
            <input id="require-four-cost-character" type="checkbox" checked={this.props.settings.requireFourCostCharacter} onChange={this.toggleRequireFourCostCharacter} />
            <label htmlFor="require-four-cost-character">Require 4 cost character. If this is selected, setups with only characters that cost 3 or less will be considered poor</label>

            <p><strong>Number of Cards to consider a Poor Setup:</strong></p>
            <p>
              <input type="radio" name="poorCards" value="0" onChange={this.poorCardsChanged} checked={this.props.settings.poorCards == 0} id="zero-poor" /><label htmlFor="zero-poor">0 Cards </label>
              <input type="radio" name="poorCards" value="1" onChange={this.poorCardsChanged} checked={this.props.settings.poorCards == 1} id="one-poor" /><label htmlFor="one-poor">1 Card </label>
              <input type="radio" name="poorCards" value="2" onChange={this.poorCardsChanged} checked={this.props.settings.poorCards == 2} id="two-poor" /><label htmlFor="two-poor">2 Cards </label>
              <input type="radio" name="poorCards" value="3" onChange={this.poorCardsChanged} checked={this.props.settings.poorCards == 3} id="three-poor" /><label htmlFor="three-poor">3 Cards </label>
              <input type="radio" name="poorCards" value="4" onChange={this.poorCardsChanged} checked={this.props.settings.poorCards == 4} id="four-poor" /><label htmlFor="four-poor">4 Cards </label>
              <input type="radio" name="poorCards" value="5" onChange={this.poorCardsChanged} checked={this.props.settings.poorCards == 5} id="five-poor" /><label htmlFor="five-poor">5 Cards </label>
              <input type="radio" name="poorCards" value="6" onChange={this.poorCardsChanged} checked={this.props.settings.poorCards == 6} id="six-poor" /><label htmlFor="six-poor">6 Cards </label>
            </p>
            <p>{this.props.settings.poorCards} cards or under will be considered "poor"</p>


            <p><strong>Econ:</strong></p>
            <div>
              <input id="require-econ" type="checkbox" checked={this.props.settings.requireEcon} onChange={this.toggleRequireEcon} />
              <label htmlFor="require-econ">Poor if No Econ</label>
            </div>
            <div>
              <input id="favor-econ" type="checkbox" checked={this.props.settings.favorEcon} onChange={this.toggleFavorEcon} />
              <label htmlFor="favor-econ">This will prefer setups that contain econ cards over cards that don't, but will not mark econless hands as poor</label>
            </div>
          </div>

          <h2>Mulligan Settings</h2>
          <div>
            <input id="mulligan-if-poor" type="checkbox" checked={this.props.settings.mulliganOnPoor} onChange={this.toggleMulliganOnPoor} />
            <label htmlFor="mulligan-if-poor">Mulligan All Poor Setups</label>
          </div>

          <div>
            <input id="mulligan-without-key" type="checkbox" checked={this.props.settings.mulliganWithoutKey} onChange={this.toggleMulliganWithoutKey} />
            <label htmlFor="mulligan-without-key">Mulligan if No Key Card</label>
          </div>

          <div>
            <input id="mulligan-without-econ" type="checkbox" checked={this.props.settings.mulliganWithoutEcon} onChange={this.toggleMulliganWithoutEcon} />
            <label htmlFor="mulligan-without-econ">Mulligan if No Econ</label>
          </div>

          <div>
            <p><strong>Number of Cards to Mulligan:</strong></p>
            <p>
              <input type="radio" name="mullianCards" value="0" onChange={this.minimumCardsChanged} checked={this.props.settings.minimumCards == 0} id="zero-minimum" /><label htmlFor="zero-minimum">0 Cards </label>
              <input type="radio" name="mullianCards" value="1" onChange={this.minimumCardsChanged} checked={this.props.settings.minimumCards == 1} id="one-minimum" /><label htmlFor="one-minimum">1 Card </label>
              <input type="radio" name="mullianCards" value="2" onChange={this.minimumCardsChanged} checked={this.props.settings.minimumCards == 2} id="two-minimum" /><label htmlFor="two-minimum">2 Cards </label>
              <input type="radio" name="mullianCards" value="3" onChange={this.minimumCardsChanged} checked={this.props.settings.minimumCards == 3} id="three-minimum" /><label htmlFor="three-minimum">3 Cards </label>
              <input type="radio" name="mullianCards" value="4" onChange={this.minimumCardsChanged} checked={this.props.settings.minimumCards == 4} id="four-minimum" /><label htmlFor="four-minimum">4 Cards </label>
              <input type="radio" name="mullianCards" value="5" onChange={this.minimumCardsChanged} checked={this.props.settings.minimumCards == 5} id="five-minimum" /><label htmlFor="five-minimum">5 Cards </label>
              <input type="radio" name="mullianCards" value="6" onChange={this.minimumCardsChanged} checked={this.props.settings.minimumCards == 6} id="six-minimum" /><label htmlFor="six-minimum">6 Cards </label>
            </p>
            <p>{this.props.settings.minimumCards} cards or under will be mulliganed</p>
          </div>

          <p>The Setup Analyzer will now attempt to mulligan your first draw if it doesn't meet certain criteria. This page provides all the current settings for configuring what setups to prefer and what hands to mulligan. You can configure cards as being <i className="fa fa-key fa-fw"></i> Key cards, <i className="fa fa-exclamation-triangle fa-fw"></i> Try to Avoid Cards, and <i className="fa fa-ban fa-fw"></i>Restricted Cards</p>
          <p>Key Cards will be set up as often as possible. As long as you can set up at least 2 total characters, a set up with a key card will be used if available</p>
          <p>Try to Avoid Cards will be avoided unless there is nothing else that can be used. For example, if you have only 3 gold worth of cards to set up, and a 5 cost try to avoid card, it will set up the card. By default this includes characters with positive enter play abilities</p>
          <p>Restricted cards will never be set up under any circumstances. By default this includes negative attachments</p>


          {key}

          {econ}

          {avoided}

          {restricted}

          <div>All Cards:</div>
          <div className="card-list">
            {allCards}
          </div>
        </section>
      </section>
    );
  }
}

export { Configure };
