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
            console.log("name", name)
            // Send action to server
            if (Array.isArray(name)) name = name.split[0]
            fridge.sendToServer("login " + name, loggedin)
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
        indexes: ["Insert *"], //, "Remove *", "Search *"],
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
                console.log("number parsed", number)
                fridge.sendToServer(number.toString(), addMainCommands);
            } else {
                fridge.say("Please say a number or cancel to quit.")
            }
        }
    }];



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
        console.log("----------------- LOGOUT ----------------")
        fridge.shutdown()
        context.name = null
        fridge = fridgeFactory("Anibal 2")
    }

    return {
        authCommand: authCommand,
        listCommand: listCommand,
        mainCommands: mainCommands,
        howmanyCommands: howmanyCommands,
        alwaysCommands: alwaysCommands,
        askAuth: askAuth,
        askHowMany: askHowMany,
        addMainCommands: addMainCommands,
        cancel: cancel,
        loggedin: loggedin,
        logout: logout
    }
}