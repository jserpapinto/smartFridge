/**
 * SmartFridge.js requires artyom.js
 *
 * @license ISTEC
 * @version 0.0.1
 * @copyright 2017 ISTEC All Rights Reserved.
 * @authors Bruno Gomes, João Serpa, Tiago Wong
 * @param {Object} window (scope performance)
 */
(function(window) {
    // Vars
    let ws;
    let currentCommand = {
        action: "",
        product: "",
        quanitty: "",
    };
    let messageRecieved = false;
    let context = {
        name: ""
    };

    /** SOCKET */
    function webSocketConf() {
        ws = new WebSocket("ws://LIPTON:8080/p5websocket");
    }

    /** Send message to server with callbacks */
    function sendToServer(msg, callbackOK) {
        ws.send(msg.toString().toLowerCase());
        ws.onmessage = function(evt, callback) {
            console.log(evt.data);
            messageRecieved = evt.data;
            console.log(callbackOK, callbackBAD);
            if(callbackOK != undefined) {
                callbackOK(messageRecieved);
            } else {
                console.error('No callback defined');
            }
        };
    }
    /** .SOCKET */

    /** Called on body load */
    window.init = function() {
        if ("WebSocket" in window) {
            // start websocket
            webSocketConf();
            console.log(ws);
            // Start artyom
            startArtyom();
            robotConfig();
        } else {
            // The browser doesn't support WebSocket
            alert("Please buy a new fridge!");
            return false;
        }
    }
    /** .Called on body load */


    /** ARTYOM */
    function robotConfig() {
        artyom.when("SPEECH_SYNTHESIS_START", function() {
            document.body.className = "talk";
        })
        artyom.when("SPEECH_SYNTHESIS_END", function() {
            document.body.className = "shutup";
        })
    }

    function startArtyom() {
        artyom.initialize({
            lang:"en-US",
            debug:true, // Show what recognizes in the Console
            listen:true, // Start listening after this
            speed:0.7, // Talk a little bit slow
            soundex: true,// Use the soundex algorithm to increase accuracy
            executionKeyword: "Alexis",
            mode:"normal", // This parameter is not required as it will be normal by default
            continuous: true
        }).then(() => {
            console.log("Artyom has been succesfully initialized");
            // Start with main commands
            askAuth();

        }).catch((err) => {
            console.error("Artyom couldn't be initialized: ", err);
        });
    }
    /** .ARTYOM */


    /** COMMANDS */
    function addCommands(cmds) {
        artyom.emptyCommands();
        cmds.forEach( function(cmd, index) {
            // add Command
            artyom.addCommands(cmds);
        });
        artyom.say("You have new commands!");
    }

    function askAuth() {
        addCommands(authCommand);
    }
    function askHowMany() {
        addCommands(howmanyCommands);
    }
    function addMainCommands () {
        addCommands(mainCommands);
    }
    function cancel() {
        artyom.say("Canceled");
        addCommands(mainCommands);
    }
    function loggedin(username) {
        if (username != "?") {
            context.name = username;
            artyom.say('Thank you, '+ context.name + '!');
            addMainCommands();
        } else {
            artyom.say('Incorrect login!');
        }
    }

    let authCommand = [{   
        indexes: ["login *"],
        smart: true,
        action: function(i, name){
            // Send action to server
            if (Array.isArray(name)) name = name.split[0];
            sendToServer("login " + name, loggedin, cancel);
            
        }
    }];

    let listCommand = [{   
        indexes: ["List"],
        action: function(i){
            let action = this.indexes[i].split(" *")[0];
            // Send action to server
            sendToServer(action, askHowMany());

        }
    }];

    let mainCommands = [{   
        indexes: ["Insert *", "Remove *", "Search *"],
        smart:true,
        action: function(i, product){
            let action = this.indexes[i].split(" *")[0];
            // Send action to server
            sendToServer(action);
            // Send product to server
            sendToServer(product);
            sendToServer("*"+ action + " " + product);

        }
    }];


    let howmanyCommands = [{
        indexes: ['*'],
        smart: true,
        action: function(i, number) {
            if (parseInt(number)) {
                sendToServer(number.toString());
                sendToServer("*" + number.toString());
            } else if (number == "cancel") {
                artyom.addCommands(mainCommands);
                artyom.say("Back to basics!")
            } else {
                artyom.say("Please say a number or cancel to quit.")
            }
        }
    }];
    /**
     * .COMMANDS */


})(window);