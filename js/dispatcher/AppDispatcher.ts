import flux = require('flux');

console.log("new dispatcher");
var Dispatcher: flux.Dispatcher<IActionPayload> = new flux.Dispatcher();

export = Dispatcher;
