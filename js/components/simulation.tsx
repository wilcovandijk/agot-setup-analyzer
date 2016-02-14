/*jshint quotmark: false */
/*jshint white: false */
/*jshint trailing: false */
/*jshint newcap: false */
/*global React */

/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../interfaces.d.ts"/>
/// <reference path="../libs/react-d3.d.ts" />

import { CardItem } from "../cardItem";
import { About } from "./about"
import { Configure } from "./configure"

import { SimulationStats } from "./simulationStats"
import { SetupExample } from "./setupExample"


import AppDispatcher = require('../dispatcher/AppDispatcher');
import SetupActionID = require('../actions/SetupActionID');


interface ISimulationProps {
  setup : ISetupStore;
  deck : IDeckStore;
}

interface ISimulationState {
  running : boolean;
  percentage : number;
}

class Simulation extends React.Component<ISimulationProps, ISimulationState> {

  public state : ISimulationState;

  constructor(props : ISimulationProps){
    super(props);

    this.props.setup.subscribe(this._onChange.bind(this));
    this.props.deck.subscribe(this._onChange.bind(this));

    this.state = this.getStateFromStores();
  }

  private _onChange(){
    this.setState(this.getStateFromStores());
    // console.log("changing ", this.state);
    // this.setState(this.getStateFromStores());
  }

  public getStateFromStores(){
    return {
      running : this.props.setup.getStats().simulations > 0 && this.props.setup.getStats().simulations < 5000,
      percentage : Math.round((this.props.setup.getStats().simulations / 5000) * 100)
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

  public rerunSimulation(){
    AppDispatcher.dispatch({
      actionType: SetupActionID.PERFORM_SIMULATIONS,
      data: 5000
    })
  }


  public render() {
    if (this.state.percentage == 0){
      return (
        <section className="simulation">
          <section className="example">
            <About />
          </section>
        </section>
      );
    }

    var top = null;
    if (this.state.percentage < 100){
      top = (
        <div className="progress">
          <div className="progress-bar" role="progressbar" aria-valuenow="{this.state.percentage}"
          aria-valuemin="0" aria-valuemax="100" style={{width: this.state.percentage +'%'}}>
            Simulating... {this.state.percentage}%
          </div>
        </div>
      );
    } else{
      top = (
        <button className="action" onClick={this.rerunSimulation}>Rerun Simulation</button>
      );
    }

    return (
      <section className="simulation">
      {top}

      <div className="worko-tabs">
        <input className="state" type="radio" title="tab-one" name="tabs-state" id="tab-one" defaultChecked />
        <input className="state" type="radio" title="tab-two" name="tabs-state" id="tab-two" />
        <input className="state" type="radio" title="tab-three" name="tabs-state" id="tab-three" />
        <input className="state" type="radio" title="tab-four" name="tabs-state" id="tab-four" />

        <div className="tabs flex-tabs">
          <label htmlFor="tab-one" id="tab-one-label" className="tab">Stats</label>
          <label htmlFor="tab-two" id="tab-two-label" className="tab">Examples</label>
          <label htmlFor="tab-three" id="tab-three-label" className="tab">Configure</label>
          <label htmlFor="tab-four" id="tab-four-label" className="tab">About</label>


           <div id="tab-one-panel" className="panel active">
             <section className="content">
               <SimulationStats setups={this.props.setup.setups} stats={this.props.setup.getStats()} noMulliganStats={this.props.setup.getNoMulliganStats()} displayDeck={this.props.deck.getDisplayDeck()} />
             </section>
           </div>

           <div id="tab-two-panel" className="panel">
              <SetupExample setups={this.props.setup.setups} drawDeck={this.props.deck.getDrawDeck()} />
           </div>

           <div id="tab-three-panel" className="panel">
                <Configure settings={this.props.setup.getSettings()} displayDeck={this.props.deck.getDisplayDeck()} />
            </div>

            <div id="tab-four-panel" className="panel">
                 <About />
             </div>

         </div>
     </div>

      </section>
    );
  }
}

export { Simulation };
