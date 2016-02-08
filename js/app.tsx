/*jshint quotmark:false */
/*jshint white:false */
/*jshint trailing:false */
/*jshint newcap:false */
/*global React, Router*/

/// <reference path="libs/jquery.d.ts" />
/// <reference path="../typings/tsd.d.ts" />
/// <reference path="./interfaces.d.ts"/>

console.log("app");
import AppDispatcher = require('./dispatcher/AppDispatcher');
import DeckStore = require('./stores/deckStore')
import { SetupActions } from './actions/SetupActions';
import SetupStore = require('./stores/setupStore')
import { DeckImport } from "./components/DeckImport"
import { Simulation } from "./components/Simulation"


class DeckAnalyzerApp extends React.Component<IAppProps, IAppState> {
  public state : IAppState;

  constructor(props : IAppProps) {
    super(props);
    this.state = {
      editing: null
    };
  }

  public render() {

    var simulation = "";
    return (
      <div>
        <header className="header">
          <h1>agot setup analyzer</h1>
        </header>
        <section className="main">
          <DeckImport deck={this.props.setup.deck} />
          <Simulation setup={this.props.setup} />
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
