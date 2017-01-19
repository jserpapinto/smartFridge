/**
 * SmartFridge.js requires artyom.js
 *
 * @license ISTEC
 * @version 0.0.1
 * @copyright 2017 ISTEC All Rights Reserved.
 * @authors Bruno Gomes, João Serpa, Tiago Wong
 * @param {Object} window (scope performance)
 */
"use strict"
// Vars
let ws
let currentCommand = {
    action: "",
    product: "",
    quantity: "",
}
let context = {
    name: null
}
// Factory functions
let cmds, fridge

/** SOCKET */
function webSocketConf() {
    //ws = new WebSocket("ws://LIPTON:8080/p5websocket")
    ws = new WebSocket("ws://tenzingyatso:9090/supersmart")
}
/** .SOCKET */

/** Called on body load */
window.init = function() {
    if ("WebSocket" in window) {
        // start websocket
        webSocketConf()
        console.log(ws)
        // Start artyom
        cmds = cmdFactory()
        fridge = fridgeFactory("Anibal", window, artyom)
        fridge.start()
    } else {
        // The browser doesn't support WebSocket
        alert("Please buy a new fridge!")
        return false
    }
}
/** .Called on body load */

/** COMMANDS */
function myAddCommands(commands, msg) {
    artyom.emptyCommands()
    artyom.addCommands(commands)
    if (context.name != null)
        artyom.addCommands(cmds.alwaysCommands)
    if (msg == undefined) artyom.say("You have new commands!")
    else artyom.say(msg)
    showCommands()
}
function showCommands () {
    var div = document.getElementById('commands')
    div.innerHTML = ""
    artyom.getAvailableCommands().forEach(function(cmds) {
        cmds.indexes.forEach(function(cmd) {
            div.innerHTML += "<div class='col-3 alert alert-info'>" + cmd + "</div>"
        })
    })
}
function askAuth() {
    console.log("passei 3")
    myAddCommands(cmds.authCommand, "Hello! Please login!")
}
function askHowMany(msg) {
    if (msg == "OK") {
        myAddCommands(cmds.howmanyCommands, "How many?")
    }
    else 
        fridge.say(msg)
}
function addMainCommands () {
    myAddCommands(cmds.mainCommands)
}
function cancel() {
    fridge.say("Canceled")
    myAddCommands(cmds.mainCommands)
}
function loggedin(username) {
    if (username != "?") {
        context.name = username
        fridge.say('Welcome, '+ context.name + '! Nice to see you!', {
            onEnd: function() {
                addMainCommands()
            }
        })
    } else {
        fridge.say('Incorrect login! Try again.')
    }
}
function logout () {
    fridge.shutdown();
    context.name = null;
    console.log("n passei")
    fridge.start(); 
    console.log("passei")
}
/**
 * .COMMANDS */

