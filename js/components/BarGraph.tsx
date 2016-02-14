/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../libs/react-d3.d.ts" />
/// <reference path="../libs/chart.d.ts" />

interface IBarGraphProps {
  data:any;
  options:any;
  width:string;
  height:string;
  showLegend:boolean;
}

interface IBarGraphState {
  chart:ChartInstance;
}

class BarGraph extends React.Component<IBarGraphProps, IBarGraphState> {
  public state : IBarGraphState;

  private extras = ['clear', 'stop', 'resize', 'toBase64Image', 'generateLegend', 'update', 'addData', 'removeData','getBarsAtEvent'];


  constructor(props : IBarGraphProps){
    super(props);

    this.state = { chart: null };
    var i;
    for (i=0; i<this.extras.length; i++) {
      this.extra(this.extras[i]);
    }
  }

  public render() {
    var _props = {
      ref: 'canvass'
    };
    for (var name in this.props) {
      if (this.props.hasOwnProperty(name)) {
        if (name !== 'data' && name !== 'options') {
          _props[name] = this.props[name];
        }
      }
    }

    var legend = null;
    if (this.props.showLegend && this.state && this.state.chart){
      legend = (
        <div dangerouslySetInnerHTML={{__html: this.state.chart.generateLegend()}}></div>
      );
    }
    return (
      <div>
      {legend}
      <canvas ref="chart" {..._props} />
      </div>
    )
  }

    public extra(type) {
      this[type] = function() {
        return this.state.chart[type].apply(this.state.chart, arguments);
      };
    }

    public componentDidMount = function() {
      this.initializeChart(this.props);
    };

    public componentWillUnmount = function() {
      var chart = this.state.chart;
      chart.destroy();
    };

    public componentWillReceiveProps = function(nextProps) {
      var chart = this.state.chart;
      if (nextProps.redraw) {
        chart.destroy();
        this.initializeChart(nextProps);
      } else {
        var dataKey = dataKey || dataKeys[chart.name];
        updatePoints(nextProps, chart, dataKey);
        if (chart.scale) {
          chart.scale.xLabels = nextProps.data.labels;
          chart.scale.calculateXLabelRotation();
        }
        chart.update();
      }
    };

    public initializeChart = function(nextProps) {
      var el :any = this.refs['canvass'];// ReactDOM.findDOMNode(this);
      var ctx = el.getContext("2d");
      var chart = new Chart(ctx).Bar(nextProps.data, nextProps.options || {});
      this.state.chart = chart;
    };

    // return the chartjs instance
    public getChart = function() {
      return this.state.chart;
    };

    // return the canvass element that contains the chart
    public getCanvass = function() {
      return this.refs.canvass;
    };

    public getCanvas = function(){
      return this.getCanvass();
    }

  //   for (i=0; i<methodNames.length; i++) {
  //     extra(methodNames[i]);
  //   }
  //
  //   return React.createClass(classData);
  // }
};

var dataKeys = {
  'Line': 'points',
  'Radar': 'points',
  'Bar': 'bars'
};

var updatePoints = function(nextProps, chart, dataKey) {
  var name = chart.name;

  if (name === 'PolarArea' || name === 'Pie' || name === 'Doughnut') {
    nextProps.data.forEach(function(segment, segmentIndex) {
      if (!chart.segments[segmentIndex]) {
        chart.addData(segment);
      } else {
        Object.keys(segment).forEach(function (key) {
          chart.segments[segmentIndex][key] = segment[key];
        });
      }
    });
  } else {
    while (chart.scale.xLabels.length > nextProps.data.labels.length) {
      chart.removeData();
    }
    nextProps.data.datasets.forEach(function(set, setIndex) {
      set.data.forEach(function(val, pointIndex) {
        if (typeof(chart.datasets[setIndex][dataKey][pointIndex]) == "undefined") {
          addData(nextProps, chart, setIndex, pointIndex);
        } else {
          chart.datasets[setIndex][dataKey][pointIndex].value = val;
        }
      });
    });
  }
};

var addData = function(nextProps, chart, setIndex, pointIndex) {
  var values = [];
  nextProps.data.datasets.forEach(function(set) {
    values.push(set.data[pointIndex]);
  });
  chart.addData(values, nextProps.data.labels[setIndex]);
};

export { BarGraph };
