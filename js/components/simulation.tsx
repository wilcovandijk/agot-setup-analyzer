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

import { BarChart } from 'react-d3';
import AppDispatcher = require('../dispatcher/AppDispatcher');
import SetupActionID = require('../actions/SetupActionID');


interface ISimulationProps {
  setup : ISetupStore;
}

interface ISimulationState {
}

class Simulation extends React.Component<ISimulationProps, ISimulationState> {

  public state : ICardItemState;

  constructor(props : ISimulationProps){
    super(props);
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
    if (this.props.setup.deck.drawDeck.length == 0){
      return (
        <section className="simulation">
          <section className="example">
            <About />
          </section>
        </section>
      );
    }

    return (
      <section className="simulation">
      <button className="action" onClick={this.rerunSimulation}>Rerun Simulation</button>

      <div className="worko-tabs">
        <input className="state" type="radio" title="tab-one" name="tabs-state" id="tab-one" defaultChecked />
        <input className="state" type="radio" title="tab-two" name="tabs-state" id="tab-two" />
        <input className="state" type="radio" title="tab-three" name="tabs-state" id="tab-three" />

        <div className="tabs flex-tabs">
          <label htmlFor="tab-one" id="tab-one-label" className="tab">Setup Stats</label>
          <label htmlFor="tab-two" id="tab-two-label" className="tab">Restrictions</label>
          <label htmlFor="tab-three" id="tab-three-label" className="tab">About</label>


           <div id="tab-one-panel" className="panel active">
            <SimulationStats setup={this.props.setup} />
           </div>

           <div id="tab-two-panel" className="panel">
                <Configure setup={this.props.setup} />
            </div>

            <div id="tab-three-panel" className="panel">
                 <About />
             </div>

         </div>
     </div>

      </section>
    );
  }
}

export { Simulation };
