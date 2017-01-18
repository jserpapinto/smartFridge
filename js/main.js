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
    let registredCommands = [];
    /**
     * Called on body load
     */
    window.init = function() {
        if ("WebSocket" in window) {
            // start websocket
            ws = new WebSocket("ws://tenzingyatso:9090/yourholiness");
            ws.onmessage = function(evt) {
                console.log(evt.data);
            };
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
            addCommands(mainCommands);

        }).catch((err) => {
            console.error("Artyom couldn't be initialized: ", err);
        });;

    }

    /**
     * COMMANDS
     */

    function addCommands(cmds) {
        removeAllCommands();
        cmds.forEach( function(cmd, index) {
            // add Command
            artyom.addCommands(cmds);
            // registered Command
            registredCommands.push(mainCommands);
        });
    }

    function removeAllCommands() {
        registredCommands.forEach( function(cmd, index) {
            artyom.removeCommands(cmd);
        });
    }

    function sendToServer(msg) {
        ws.send(msg);
    }


    let mainCommands = [{   
        indexes: ["Insert *", "Remove *", "List *"],
        smart:true,
        action: function(i, product){
            let action = this.indexes[i].split(" *")[0];
            console.log(action + "ing, " + product);
            // Send action to server
            sendToServer(action);
            // Send product to server
            sendToServer(product);
            // How many?
            artyom.say('How many?');
            // Add commands
            addCommands(howmanyCommands);
        }
    }];

    let howmanyCommands = [{
        indexes: ['*'],
        smart: true,
        action: function(i, number) {
            if (parseInt(number)) {
                artyom.say(number);
                sendToServer(number.toString());
            } else if (number == "cancel") {
                artyom.addCommands(mainCommands);
                artyom.say("Back to basics!")
            } else {
                artyom.say("Please say a number or cancel to quit.")
            }
        }
    }];
    /**
     * .COMMANDS
     */

    artyom.on(['Good morning','Good afternoon']).then(function(i){
        switch (i) {
            case 0:
                artyom.say("Good morning, how are you?");

                artyom.on(['Fine thanks','Little bit okay']).then(function(i){
                    switch (i) {
                        case 0:
                            artyom.say("Fuck off!");
                        break;
                        case 1:
                            artyom.say("Fuck in!");
                        break;            
                    }
                });

            break;
            case 1:
                artyom.say("Good afternoon, how are you?");
            break;            
        }
    });

    /*
    artyom.newPrompt({
        question:"We have no cheese, you want it without cheese anyway ?",
        options:["Yes","No","Buy some cheese"],
        beforePrompt: () => {
            console.log("Before ask");
        },
        onStartPrompt: () => {
            console.log("The prompt is being executed");
        },
        onEndPrompt: () => {
            console.log("The prompt has been executed succesfully");
        },
        onMatch: (i) => { // i returns the index of the given options
            var action;

            if(i == 0){ 
                action =  () => {
                    artyom.say("Your sandwich will be ready in a minute");
                }
            }

            if(i == 1){ 
                action =  () => {
                    artyom.say("You may consider to order some cheese later");
                }
            }

            if(i == 2){
                action = () => {
                    artyom.say("I'll order some cheese via eBay");
                }
            }

            // A function needs to be returned in onMatch event
            // in order to accomplish what you want to execute
            return action; 
        }
    });*/


})(window);