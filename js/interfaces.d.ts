interface ICard {
  code : string;
  count : number;
  pack_name : string;
  faction : string;
  image: string;
  url : string;
  traits : Array<string>;
  text : string;
  name : string;
  type_name : string;
  type_code : string;
  cost : number;
  strength : number;
  imagesrc : string;
  is_unique : boolean;
  is_loyal : boolean;
  is_military : boolean;
  is_intrigue : boolean;
  is_power : boolean;
  is_limited : boolean;
  setup_count : number;
}

interface IDeckStore {
  drawDeck : Array<ICard>;
  displayDeck : Array<ICard>;
  onChanges : Array<any>;

  subscribe(onChange);
  inform();
  loadDeck(text : string);
}

interface ISetupStore {
  deck : IDeckStore;

  exampleSetup : any;

  cardsSetup : number;
  goldSetup : number;
  simulations : number;
  poorSetups : number;
  greatSetups : number;
  cardCounts : Array<number>;
  goldCounts : Array<number>;
  distinctCharCounts : Array<number>;
  traitStats : { [id: string] : string };

  performSimulation(runs : number);

  subscribe(onChange);
  inform();
}

interface IDeckModel {
  key : any;
  drawDeck : Array<ICard>;
  displayDeck : Array<ICard>;
  exampleSetup : any;
  onChanges : Array<any>;
  subscribe(onChange);
  inform();
  loadDeck(text : string);
  cardsSetup : number;
  goldSetup : number;
  simulations : number;
  poorSetups : number;
  greatSetups : number;
  cardCounts : Array<number>;
}

interface ICardItemProps {
  key : string,
  card : ICard,
  simulations : number;
}

interface ICardItemState {
  editText : string
}

interface IAppProps {
  setup : ISetupStore;
}

interface IAppState {
  editing? : string;
  nowShowing? : string
}
