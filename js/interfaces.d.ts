interface ICard {
  code : string;
  count : number;
  pack_name : string;
  pack_code : string;
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
  enter_play_effect : boolean;
  income : number;
  attachmentRestriction : Array<string>;
  is_key_card : boolean;
  is_avoided : boolean;
  is_restricted : boolean;
  is_econ : boolean;
}

interface IDeckStore {
  loadDeck(text : string);
  getDrawDeck() : Array<ICard>;
  getDisplayDeck() : Array<ICard>;

  subscribe(onChange);
  inform();
}

interface ISetupStats{
  simulations : number;
  mulligans : number;
  cardsSetup : number;
  goldSetup : number;
  poorSetups : number;
  greatSetups : number;
  cardCounts : Array<number>;
  goldCounts : Array<number>;
  econCounts : Array<number>;
  distinctCharCounts : Array<number>;
  traitStats : { [id: string] : string };
  iconStats : { [id: string] : any };
  iconStrengthStats : { [id: string] : any };
}

interface ISetupSettings{
  simulations : number;

  requireMoreThanOneCharacter: boolean;
  requireFourCostCharacter : boolean;
  requireEcon : boolean;

  favorEcon : boolean;
  poorCards : number;

  minimumCards : number;
  minimumCharacters : number;

  greatCardCounts : number;
  greatCharacterCounts : number;

  mulliganOnPoor : boolean;
  mulliganWithoutKey : boolean;
  mulliganWithoutEcon : boolean;
}

interface ISetupStore {
  deck : IDeckStore;

  exampleSetup : any;

  getStats() : ISetupStats;
  getNoMulliganStats() : ISetupStats;
  getSettings() : ISetupSettings;
  setups : Array<any>;

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

interface IActionPayload {
  actionType: string;
  data: any;
}
