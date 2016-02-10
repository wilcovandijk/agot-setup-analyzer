/*jshint quotmark: false */
/*jshint white: false */
/*jshint trailing: false */
/*jshint newcap: false */
/*global React */

/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../interfaces.d.ts"/>
/// <reference path="../libs/react-d3.d.ts" />

import { CardItem } from "../cardItem";
import { BarChart } from 'react-d3';


interface ISimulationStatsProps {
  stats : ISetupStats;
  displayDeck : Array<ICard>;
}

interface ISimulationStatsState {
  shownSetup : number;
}

class SimulationStats extends React.Component<ISimulationStatsProps, ISimulationStatsState> {

  public state : ISimulationStatsState;

  constructor(props : ISimulationStatsProps){
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

  public render() {
    var deck = this.props.displayDeck;

    var i = 0;

    var orderedDeck = deck.sort((c1, c2) => c2.setup_count - c1.setup_count);

    var cardItems = orderedDeck.map((card) => {
      var code = card.code + i;
      i++;
      return (
        <CardItem
          key={code}
          card={card}
          simulations={this.props.stats.simulations}
        />
      );
    });

    var cardUsageData = [{
      "name": "Used Cards",
      "values": []
    }];

    for (var i = 0; i < 8; i++){
      cardUsageData[0].values.push({
        "x": i,
        "y":  Math.round(10000*this.props.stats.cardCounts[i] / this.props.stats.simulations)/100
      });
    }

    var goldUsageData = [{"name": "Gold Spent",
    "values": [
    ]}];
    for (var i = 0; i < 9; i++){
      goldUsageData[0].values.push({
        "x": i,
        "y":  Math.round(10000*this.props.stats.goldCounts[i] / this.props.stats.simulations)/100
      });
    }

    var distinctCharData = [{"name": "Distinct Characters",
    "values": [
    ]}];
    for (var i = 0; i < 8; i++){
      distinctCharData[0].values.push({
        "x": i,
        "y":  Math.round(10000*this.props.stats.distinctCharCounts[i] / this.props.stats.simulations)/100
      });
    }

    var cardsUsed = [];
    for (var i = 0; i < 8; i++){
      if (this.props.stats.cardCounts[i] > 0){
        var plural = "";
        if (i != 1){
          plural = "s";
        }
        cardsUsed.push(
          <p key={i}>{i} Card{plural} : {Math.round(10000*this.props.stats.cardCounts[i]/this.props.stats.simulations)/100}%</p>
        );
      }
    }

    var goldUsed = [];
    for (var i = 0; i < 9; i++){
      if (this.props.stats.goldCounts[i] > 0){
        var plural = "";
        if (i != 1){
          plural = "s";
        }
        goldUsed.push(
          <p key={i}>{i} Gold{plural} : {Math.round(10000*this.props.stats.goldCounts[i]/this.props.stats.simulations)/100}%</p>
        );
      }
    }

    return (
      <div>
        <section className="stats">
          <section className="info">
            <p>Runs: {this.props.stats.simulations}</p>
            <p>Avg Gold: {Math.round(10000*this.props.stats.goldSetup/this.props.stats.simulations)/10000}</p>
            <p>Avg Cards: {Math.round(10000*this.props.stats.cardsSetup/this.props.stats.simulations)/10000}</p>

            <p><span className="tooltip hint--top" data-hint="Percentage of Setups with 2 or less cards set up or only 1 character">
                Poor Setups:
              </span> {Math.round(100*this.props.stats.poorSetups/this.props.stats.simulations)}%</p>
            <p><span className="tooltip hint--top" data-hint="Percentage of Setups with 5 or more cards set up and over 1 character">
              Great Setups:
              </span> {Math.round(100*this.props.stats.greatSetups/this.props.stats.simulations)}%</p>
            <p><strong>Cards Setup:</strong></p>
            {cardsUsed}
            <p><strong>Gold Used:</strong></p>
            {goldUsed}
          </section>
          <section className="charts">
            <BarChart
                data={cardUsageData}
                width={500}
                height={200}
                fill={'#3182bd'}
                title='Cards Used'
                yAxisLabel='Percent'
                xAxisLabel='Cards'
                />
              <BarChart
                  data={goldUsageData}
                  width={500}
                  height={200}
                  fill={'#3182bd'}
                  title='Gold Used'
                  yAxisLabel='Percent'
                  xAxisLabel='Gold Spent'
                  />
              <BarChart
                  data={distinctCharData}
                  width={500}
                  height={200}
                  fill={'#3182bd'}
                  title='Characters Out After Setup'
                  yAxisLabel='Percent'
                  xAxisLabel='Distinct Characters'
                  />
          </section>
        </section>
        <section className="deck">
          <ul className="card-list">
            {cardItems}
          </ul>
        </section>
      </div>
    );
  }
}

export { SimulationStats };
