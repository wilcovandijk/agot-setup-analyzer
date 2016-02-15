/*jshint quotmark: false */
/*jshint white: false */
/*jshint trailing: false */
/*jshint newcap: false */
/*global React */

/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../interfaces.d.ts"/>
/// <reference path="../libs/react-d3.d.ts" />

import { CardItem } from "../cardItem";
import { BarGraph } from "./barGraph"
import ReactHighcharts = require('react-highcharts');




interface ISimulationStatsProps {
  stats : ISetupStats;
  noMulliganStats : ISetupStats;
  displayDeck : Array<ICard>;
  setups : Array<any>;
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

    var options = {

};

  var cardUsageData = {
      title: {
          text: 'Number of Cards Setup'
      },
      subtitle: {
          text: 'Source: WorldClimate.com'
      },
      xAxis: [{
          categories: ['0 Card', '1 Card', '2 Card', '3 Card', '4 Card', '5 Card',
              '6 Card', '7 Card', '8 Card', 'Oct'],
      }],
      yAxis: [{ // Primary yAxis
          labels: {
              format: '{value}%',
              style: {
                  color: Highcharts.getOptions().colors[1]
              }
          },
          title: {
              text: 'Percentage',
              style: {
                  color: Highcharts.getOptions().colors[1]
              }
          }
      }],
      tooltip: {
          shared: true
      },
      legend: {
          layout: 'vertical',
          align: 'left',
          x: 120,
          verticalAlign: 'top',
          y: 100,
          floating: true,
          backgroundColor: '#FFFFFF'
      },
      series: [{
          name: 'With Mulligan',
          type: 'column',
          data: [],
          tooltip: {
              valueSuffix: ' %'
          }

      }, {
          name: 'Without Mulligan',
          type: 'spline',
          data: [],
          tooltip: {
              valueSuffix: '%'
          }
      }]
  };


    for (var i = 0; i < 8; i++){
      var withMulligan = Math.round(10000*this.props.stats.cardCounts[i] / this.props.stats.simulations)/100;
      var withoutMuligan = Math.round(10000*this.props.noMulliganStats.cardCounts[i] / this.props.stats.simulations)/100;

      cardUsageData.series[0].data.push(withMulligan);
      cardUsageData.series[1].data.push(withoutMuligan);
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

    var scatterData = [{
    name: "Setups",
    values: [ ]
  }];
    this.props.setups.forEach(setup => {
        scatterData[0].values.push({
          x: setup.cards.length,
          y: setup.currentCost
        });
    });

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
            <ReactHighcharts config={cardUsageData} />

            <div>

            </div>

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
