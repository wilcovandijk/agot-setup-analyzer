/*jshint quotmark: false */
/*jshint white: false */
/*jshint trailing: false */
/*jshint newcap: false */
/*global React */

/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../interfaces.d.ts"/>

import { CardItem } from "../cardItem";
import DeckStore = require('../stores/deckStore')
import DeckActions = require('../actions/deckActions');
import AppDispatcher = require('../dispatcher/AppDispatcher');
import DeckActionID = require('../actions/deckActionID');


interface ICardSettingsProps {
  key : string;
  card: ICard;
}

interface ICardSettingsState {
}

class CardSettings extends React.Component<ICardSettingsProps, ICardSettingsState> {

  public state : ICardSettingsState;

  private card:ICard;

  constructor(props : ICardSettingsProps){
    super(props);

    // this.state = this.getStateFromStores();
    // DeckStore.subscribe(this._onChange.bind(this));
  }

  // public getStateFromStores(){
  //   return {
  //     card: DeckStore.getCard(this.props.code)
  //   };
  // }

  // private _onChange(){
  //   console.log("on change");
  //   this.setState(this.getStateFromStores());
  // }

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

  public onMarkKey(){
    AppDispatcher.dispatch({
      actionType: DeckActionID.MARK_KEY_CARD,
      data: this.props.card.code
    });
  }

  public onMarkAvoided(){
    AppDispatcher.dispatch({
      actionType: DeckActionID.MARK_AVOID_CARD,
      data: this.props.card.code
    });
  }

  public onMarkRestricted(){
    AppDispatcher.dispatch({
      actionType: DeckActionID.MARK_NEVER_CARD,
      data: this.props.card.code
    });
  }

  public onMarkEcon(){
    AppDispatcher.dispatch({
      actionType: DeckActionID.MARK_ECON,
      data: this.props.card.code
    });
  }


  public render() {
    var card = this.props.card;

    var image = "http://thronesdb.com/" + card.imagesrc;
    var className = "card-container";

    var controls = null;

    if (card.is_key_card){
      className += " key-card";
    } else if (card.is_avoided){
      className += " avoided-card";
    } else if (card.is_restricted){
      className += " restricted-card";
    } else if (card.is_econ){
      className += " econ-card";
    }

    if (card.type_code == 'character'
        || card.type_code == 'attachment'
        || card.type_code == 'location'){

          controls = (
            <div className="controls">
              <button className="key-button" onClick={this.onMarkKey.bind(this)}><i className="fa fa-key fa-fw"></i></button>
              <button className="income-button" onClick={this.onMarkEcon.bind(this)}><i className="fa fa-dollar fa-fw"></i></button>
              <button className="avoid-button" onClick={this.onMarkAvoided.bind(this)}><i className="fa fa-exclamation-triangle fa-fw"></i></button>
              <button className="restricted-button" onClick={this.onMarkRestricted.bind(this)}><i className="fa fa-ban fa-fw"></i></button>
            </div>
          );
        } else{
          controls = (
            <div className="controls">
              <button className="active"><i className="fa fa-ban fa-fw"></i></button>
            </div>
          );
        }

    return (
      <div className={className}>
        <img src={image}/>
        {controls}
      </div>
    );
  }
}

export { CardSettings };
