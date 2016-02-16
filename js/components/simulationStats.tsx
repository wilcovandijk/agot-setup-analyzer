/*jshint quotmark: false */
/*jshint white: false */
/*jshint trailing: false */
/*jshint newcap: false */
/*global React */

/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../interfaces.d.ts"/>
/// <reference path="../libs/react-d3.d.ts" />

import { CardItem } from "../cardItem";
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


  private getBaseCardCountConfig(){
    var cardUsageData = {
        title: {
            text: 'Number of Cards Setup'
        },
        xAxis: [{
            categories: ['0 Card', '1 Card', '2 Card', '3 Card', '4 Card', '5 Card',
                '6 Card', '7 Card'],
        }],
        yAxis: [{ // Primary yAxis
            labels: {
                format: '{value}%',
            },
            title: {
                text: 'Percentage',
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
            y: 50,
            floating: true,
            backgroundColor: '#FFFFFF'
        },
        plotOptions: {
              pie: {
                  dataLabels: {
                      enabled: true,
                      distance: -50,
                      style: {
                          fontWeight: 'bold',
                          color: 'white',
                          textShadow: '0px 1px 2px black'
                      }
                  },
                  startAngle: -90,
                  endAngle: 90,
                  center: ['50%', '75%']
              }
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
        }, {
              type: 'pie',
              name: 'Browser share',
              innerSize: '50%',
              data: [
                ["Zero Card"],
                ["One Card"],
                ["Two Card"],
                ["Three Card"],
                ["Four Card"],
                ["Five Card"],
                ["Six Card"],
                ["Seven Card"]
              ],
              center: [100, 80],
              size: 100,
              showInLegend: false,
              dataLabels: {
                  enabled: false
              }
          }]
    };

    return cardUsageData;
  }

  private getBaseGoldConfig(){
    var goldUsageData = {
        title: {
            text: 'Gold Used'
        },
        xAxis: [{
            categories: ['0', '1', '2', '3', '4', '5', '6', '7', '8'],
        }],
        yAxis: [{ // Primary yAxis
            labels: {
                format: '{value}%',
            },
            title: {
                text: 'Percentage',
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
            y: 50,
            floating: true,
            backgroundColor: '#FFFFFF'
        },
        series: [{
            name: 'With Mulligan',
            type: 'column',
            data: [],
            tooltip: {
                valueSuffix: '%'
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

    return goldUsageData;
  }

  private getBaseDistinctCharacterConfig(){
    var characterData = {
        title: {
            text: 'Distinct Characters'
        },
        xAxis: [{
            categories: ['0', '1', '2', '3', '4', '5', '6', '7'],
        }],
        yAxis: [{ // Primary yAxis
            labels: {
                format: '{value}%',
            },
            title: {
                text: 'Percentage',
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
            y: 50,
            floating: true,
            backgroundColor: '#FFFFFF'
        },
        series: [{
            name: 'With Mulligan',
            type: 'column',
            data: [],
            tooltip: {
                valueSuffix: '%'
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

    return characterData;
  }

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


    var cardUsageData = this.getBaseCardCountConfig();
    for (var i = 0; i < 8; i++){
      var withMulligan = Math.round(10000*this.props.stats.cardCounts[i] / this.props.stats.simulations)/100;
      var withoutMuligan = Math.round(10000*this.props.noMulliganStats.cardCounts[i] / this.props.stats.simulations)/100;

      cardUsageData.series[0].data.push(withMulligan);
      cardUsageData.series[1].data.push(withoutMuligan);
      cardUsageData.series[2].data[i].push(withMulligan);
    }

    var goldUsageData = this.getBaseGoldConfig();
    for (var i = 0; i < 9; i++){
      var withMulligan = Math.round(10000*this.props.stats.goldCounts[i] / this.props.stats.simulations)/100;
      var withoutMuligan = Math.round(10000*this.props.noMulliganStats.goldCounts[i] / this.props.stats.simulations)/100;

      goldUsageData.series[0].data.push(withMulligan);
      goldUsageData.series[1].data.push(withoutMuligan);
    }

    var distinctCharData = this.getBaseDistinctCharacterConfig();
    for (var i = 0; i < 8; i++){
      var withMulligan = Math.round(10000*this.props.stats.distinctCharCounts[i] / this.props.stats.simulations)/100;
      var withoutMuligan = Math.round(10000*this.props.noMulliganStats.distinctCharCounts[i] / this.props.stats.simulations)/100;

      distinctCharData.series[0].data.push(withMulligan);
      distinctCharData.series[1].data.push(withoutMuligan);
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

    var charts = (
      <section className="charts">
        <p>Simulating...</p>
      </section>
    );
    if (this.props.stats.simulations == 5000){
      charts = (
        <section className="charts">
          <ReactHighcharts config={cardUsageData} />
          <ReactHighcharts config={distinctCharData} />
          <ReactHighcharts config={goldUsageData} />
        </section>
      );
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
          {charts}
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
