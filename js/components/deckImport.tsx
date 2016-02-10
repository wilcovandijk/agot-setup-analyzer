/*jshint quotmark: false */
/*jshint white: false */
/*jshint trailing: false */
/*jshint newcap: false */
/*global React */

/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../interfaces.d.ts"/>

import AppDispatcher = require('../dispatcher/AppDispatcher');
import DeckActionID = require('../actions/deckActionID');
import SetupActionID = require('../actions/SetupActionID');
import { SetupActions } from '../actions/SetupActions';


interface IDeckImportProps {
  deck : IDeckStore;
}

interface IDeckImportState {
}

class DeckImport extends React.Component<IDeckImportProps, IDeckImportState> {

  public state : ICardItemState;

  constructor(props : IDeckImportProps){
    super(props);
  }

  /**
   * This is a completely optional performance enhancement that you can
   * implement on any React component. If you were to delete this method
   * the app would still work correctly (and still be very performant!), we
   * just use it as an example of how little code it takes to get an order
   * of magnitude performance improvement.
   */
  public shouldComponentUpdate(nextProps : ICardItemProps, nextState : ICardItemState) {
    return false;
  }

  public handleImportDeck(event : __React.MouseEvent){
    var text = ReactDOM.findDOMNode<HTMLTextAreaElement>(this.refs["deckText"]).value;

    SetupActions.test("actions");

    AppDispatcher.dispatch({
      actionType: SetupActionID.TEST,
      data: "direct"
    });

    AppDispatcher.dispatch({
      actionType: DeckActionID.LOAD_DECK,
      data: text
    });
    //
    AppDispatcher.dispatch({
      actionType: SetupActionID.PERFORM_SIMULATIONS,
      data: 5000
    })
  }

  public render() {
    return (
      <section className="import">
        <button onClick={ e => this.handleImportDeck(e)}>Load</button>

        <textarea
          ref="deckText"
          className="deck-import"
          placeholder="Copy your decklist here"
          autoFocus={true} />
      </section>
    );
  }
}

AppDispatcher.dispatch({
  actionType: "SETUP",
  data: null
});

export { DeckImport };
