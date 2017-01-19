"use strict"

const cmdFactory = () => {

    let alwaysCommands = [{
        indexes: ["cancel", "logout", "hack"],
        action: function(i){
            // Send action to server
            if (i == 0) cancel();
            else if (i == 1) logout();
            else if (i == 2) fridge.hacks();
        }
    }]

    let authCommand = [{   
        indexes: ["login *"],
        smart: true,
        action: function(i, name){
            // Send action to server
            if (Array.isArray(name)) name = name.split[0];
            fridge.sendToServer("login " + name, loggedin);
        }
    }];

    let listCommand = [{   
        indexes: ["List"],
        action: function(i){
            let action = this.indexes[i].split(" *")[0];
            // Send action to server
            fridge.sendToServer(action, askHowMany());

        }
    }];

    let mainCommands = [{   
        indexes: ["Insert *", "Remove *", "Search *"],
        smart:true,
        action: function(i, product){
            let action = this.indexes[i].split(" *")[0];
            // Send action to server
            fridge.sendToServer(action)
            setTimeout(function() {
                if (i == 0 || i == 1) 
                    fridge.sendToServer(product, askHowMany)
                else if (i == 2)
                    fridge.sendToServer(product)
            }, 1000)
        }
    }];

    let howmanyCommands = [{
        indexes: ['*'],
        smart: true,
        action: function(i, number) {
            if (parseInt(number)) {
                fridge.sendToServer(number.toString(), addMainCommands);
            } else {
                fridge.say("Please say a number or cancel to quit.")
            }
        }
    }];



    return {
        authCommand: authCommand,
        listCommand: listCommand,
        mainCommands: mainCommands,
        howmanyCommands: howmanyCommands,
        alwaysCommands: alwaysCommands
    }
}