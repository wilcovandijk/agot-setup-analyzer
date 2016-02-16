/*jshint quotmark:false */
/*jshint white:false */
/*jshint trailing:false */
/*jshint newcap:false */
/*global React, Router*/

/// <reference path="libs/jquery.d.ts" />
/// <reference path="libs/highcharts.d.ts" />

/// <reference path="../typings/tsd.d.ts" />
/// <reference path="./interfaces.d.ts"/>

import AppDispatcher = require('./dispatcher/AppDispatcher');
import DeckStore = require('./stores/deckStore')
import { SetupActions } from './actions/SetupActions';
import SetupStore = require('./stores/setupStore')
import { DeckImport } from "./components/DeckImport"
import { Simulation } from "./components/Simulation"

import { Bar as BarChart } from 'react-chartjs';
import ReactHighcharts = require('react-highcharts');



class DeckAnalyzerApp extends React.Component<IAppProps, IAppState> {
  public state : IAppState;

  constructor(props : IAppProps) {
    super(props);
    this.state = {
      editing: null
    };
  }

  public render() {

    var options = {
    //Boolean - Whether the scale should start at zero, or an order of magnitude down from the lowest value
    scaleBeginAtZero : true,

    //Boolean - Whether grid lines are shown across the chart
    scaleShowGridLines : true,

    //String - Colour of the grid lines
    scaleGridLineColor : "rgba(0,0,0,.05)",

    //Number - Width of the grid lines
    scaleGridLineWidth : 1,

    //Boolean - Whether to show horizontal lines (except X axis)
    scaleShowHorizontalLines: true,

    //Boolean - Whether to show vertical lines (except Y axis)
    scaleShowVerticalLines: true,

    //Boolean - If there is a stroke on each bar
    barShowStroke : true,

    //Number - Pixel width of the bar stroke
    barStrokeWidth : 2,

    //Number - Spacing between each of the X value sets
    barValueSpacing : 5,

    //Number - Spacing between data sets within X values
    barDatasetSpacing : 1,

    //String - A legend template
    legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].fillColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"

    };

    var cardUsageData = {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
        {
            label: "My First dataset",
            fillColor: "rgba(220,220,220,0.2)",
            strokeColor: "rgba(220,220,220,1)",
            pointColor: "rgba(220,220,220,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(220,220,220,1)",
            data: [23, 59, 80, 81, 56, 55, 40]
        },
        {
            label: "My Second dataset",
            fillColor: "rgba(151,187,205,0.2)",
            strokeColor: "rgba(151,187,205,1)",
            pointColor: "rgba(151,187,205,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(151,187,205,1)",
            data: [28, 48, 40, 19, 86, 27, 90]
        }
    ]
    }


    var simulation = "";
    return (
      <div>
        <header className="header">
          <h1>agot setup analyzer</h1>
        </header>
        <section className="main">
          <DeckImport deck={this.props.setup.deck} />
          <Simulation setup={this.props.setup} deck={this.props.setup.deck} />
        </section>
      </div>
    );
  }
}

function render() {
  ReactDOM.render(
    <DeckAnalyzerApp setup={SetupStore}/>,
    document.getElementsByClassName('setup-app')[0]
  );
}

SetupStore.subscribe(render);
render();
