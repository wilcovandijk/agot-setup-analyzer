/*jshint quotmark: false */
/*jshint white: false */
/*jshint trailing: false */
/*jshint newcap: false */
/*global React */

/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../interfaces.d.ts"/>

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
    this.props.deck.loadDeck(ReactDOM.findDOMNode<HTMLTextAreaElement>(this.refs["deckText"]).value);
  }

  public render() {
    return (
      <section className="import">
        <a href="#" onClick={ e => this.handleImportDeck(e)}>Import</a>

        <textarea
          ref="deckText"
          className="deck-import"
          placeholder="Copy your decklist here"
          autoFocus={true} />
      </section>
    );
  }
}

export { DeckImport };
