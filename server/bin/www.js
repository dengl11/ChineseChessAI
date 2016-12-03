#!/usr/bin/env node
"use strict";
var State_1 = require("../Strategy/State/State");
var TDLearner_1 = require("../Strategy/TDLearner/TDLearner");
// import { Agent } from '../Strategy/Agent/Agent'
// import { GreedyAgent } from '../Strategy/Greedy/GreedyAgent'
// import { EvalFnAgent } from '../Strategy/EvalFn/EvaluationFn'
// import { Piece } from '../Objects/Piece'
var app = require('../server').app;
var debug = require('debug')('server:server');
var http = require('http');
var assert = require('assert');
var port = '3000';
app.set('port', port);
var server = http.createServer(app);
server.listen('3000');
server.on('listening', onListening);
function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
}
// ******************* PARAM ******************* //
var N_MAX_MOVES = 100;
app.put('/compute/', function (request, response) {
    // console.log("-=-=-=-= Server: Compute get Request Received  -=-=-=-=-=-=-");
    var state = request.body;
    var to_return = {};
    // console.log(state.redAgent.pastMoves.length)
    // console.log(state.blackAgent.pastMoves.length)
    if (state.redAgent.pastMoves.length >= N_MAX_MOVES) {
        console.log("-=-=-=-=-= Draw -=-=-=-=-=-");
        response.end(JSON.stringify({ "move": [] }));
        return;
    }
    state = State_1.State.copyFromDict(state);
    // console.log(playing.strategy)
    // console.log(playing instanceof TDLeaner)
    // console.log(playing.oppoAgent instanceof TDLeaner)
    var start = new Date().getTime();
    var next = state.nextMove();
    var now = new Date().getTime();
    // console.log("next move:", next);
    var t = (now - start);
    var feature_vec = null;
    var playing = state.get_playing_agent();
    if (playing.check_king_exist() && playing instanceof TDLearner_1.TDLeaner && !state.is_repeating) {
        // console.log(playing.weights)
        feature_vec = playing.extract_state_feature(playing, state, playing.oppoAgent);
    }
    response.end(JSON.stringify({ "move": next, "time": t, "state_feature": feature_vec }));
    console.log("Agent { ", playing.strategy + "-" + state.get_playing_agent().DEPTH, "} Compute Move Using: ", t, " ms");
});
//# sourceMappingURL=www.js.map