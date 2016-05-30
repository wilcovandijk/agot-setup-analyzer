/*jshint quotmark: false */
/*jshint white: false */
/*jshint trailing: false */
/*jshint newcap: false */
/*global React */

/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../interfaces.d.ts"/>

interface ISetupExampleProps {
  setups : Array<any>;
  drawDeck : Array<ICard>;
}

interface ISetupExampleState {
  shownSetup : number;
}

class SetupExample extends React.Component<ISetupExampleProps, ISetupExampleState> {

  public state : ISetupExampleState;

  constructor(props : ISetupExampleProps){
    super(props);
    this.state = {
      shownSetup : 0
    }
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


public onPrevious(){
  var index = this.state.shownSetup - 1;
  index = Math.min(index, this.props.setups.length-1);

  this.setState({
    shownSetup: index
  });
}

public onNext(){
  var index = this.state.shownSetup + 1;
  if (index >= this.props.setups.length){
    index = 0;
  }

  this.setState({
    shownSetup: index
  });
}

  public render() {
    var i = 0;

    var exampleItems =  null;
    if (this.props.setups[this.state.shownSetup]){
        exampleItems = this.props.setups[this.state.shownSetup].draw.map((pos) => {
          i++;

          var card = this.props.drawDeck[pos];
          var code = card.code + i;
          var image = "http://thronesdb.com/" + card.imagesrc;
          var className = "card-container";

          if (this.props.setups[this.state.shownSetup].cards.filter((p) => p == pos).length > 0){
            className += " selected";
          }

          return (
            <div key={pos} className={className}><img alt={card.name} src={image}/></div>
          );
        });
        var mulligan = null;
        if (this.props.setups[this.state.shownSetup].mulliganed){
          var mulliganedItems = this.props.setups[this.state.shownSetup].mulliganed.draw.map((pos) => {
            i++;

            var card = this.props.drawDeck[pos];
            var code = card.code + i;
            var image = "http://thronesdb.com/" + card.imagesrc;
            var className = "card-container";

            if (this.props.setups[this.state.shownSetup].mulliganed.cards.filter((p) => p == pos).length > 0){
              className += " selected";
            }

            return (
              <div key={pos} className={className}><img alt={card.name} src={image}/></div>
            );
          });

          mulligan = (
            <div>
            <div>Mulliganed:</div>
            <div className="card-list example mulliganed">
              {mulliganedItems}
            </div>
            </div>
          );
        }
    }

    return (
        <section className="example">
          <div>{this.props.drawDeck.length} Cards</div>
          <div>Examples:<button onClick={this.onPrevious.bind(this)}>Previous</button> <button onClick={this.onNext.bind(this)}>Next</button></div>
          <div className="card-list example">
            {exampleItems}
          </div>
          {mulligan}
          <p>Does something look wrong? <a href="mailto:jason@red5dev.com">Let me know!</a></p>
        </section>
    );
  }
}

export { SetupExample };
