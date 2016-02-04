/*jshint quotmark: false */
/*jshint white: false */
/*jshint trailing: false */
/*jshint newcap: false */
/*global React */

/// <reference path="../typings/tsd.d.ts" />
/// <reference path="./interfaces.d.ts"/>

class CardItem extends React.Component<ICardItemProps, ICardItemState> {

  public state : ICardItemState;

  constructor(props : ICardItemProps){
    super(props);
    this.state = { editText: this.props.card.name };
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


  public render() {
    var image = "http://thronesdb.com/" + this.props.card.imagesrc;
    return (
      <li>
          <img src={image}/>
          <span className="count">x{this.props.card.count}</span>
          <span className="setup-percent">{Math.round(100 * this.props.card.setup_count / this.props.simulations)}%</span>
      </li>
    );
  }
}

export { CardItem };
