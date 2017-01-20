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

    let auth = [{   
        indexes: ["login *"],
        smart: true,
        action: function(i, name){
            console.log("name -> ", name)
            // Send action to server
            window.fridge.tryAuthentication(name)
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
        indexes: ["Insert *", "Put *"],
        smart:true,
        action: function(i, product){
            let action = this.indexes[i].split(" *")[0]
            // Send action to server
            window.fridge.insertIn(product)
        }
    }, {   
        indexes: ["Remove *", "Take out *"],
        smart:true,
        action: function(i, product){
            let action = this.indexes[i].split(" *")[0];
            // Send action to server
            window.fridge(action)
            setTimeout(function() {
                if (i == 0 || i == 1) 
                    fridge.sendToServer(product, askHowMany)
                else if (i == 2)
                    fridge.sendToServer(product)
            }, 1000)
        }
    }, {   
        indexes: ["Search *", "Do you have *"],
        smart:true,
        action: function(i, product){
            let action = this.indexes[i].split(" *")[0];
            // Send action to server
            window.fridge(action)
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
            window.fridge.sendNumber(number)
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
    function showCommands (allCmds) {
        var div = document.getElementById('commands')
        div.innerHTML = ""
        allCmds.forEach(function(cmds) {
            cmds.indexes.forEach(function(cmd) {
                div.innerHTML += "<div class='col-3 alert alert-info'>" + cmd + "</div>"
            })
        })
    }
    function authF() {
        h.debug("AUTH")
        myAddCommands(authCommand, "Hello! Please login!")
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
        /*if (username != "?") {
            context.name = username
            fridge.say('Welcome, '+ context.name + '! Nice to see you!', {
                onEnd: function() {
                    addMainCommands()
                }
            })
        } else {
            fridge.say('Incorrect login! Try again.')
        }*/
    }
    function logout () {
        console.log("----------------- LOGOUT ----------------")
        fridge.shutdown()
        context.name = null
        fridge = fridgeFactory("Anibal 2")
    }

    return {
        auth: auth,
        askHowMany: askHowMany,
        addMainCommands: addMainCommands,
        cancel: cancel,
        loggedin: loggedin,
        showCommands: showCommands,
        logout: logout,
        mainCommands: mainCommands,
        howmanyCommands: howmanyCommands
    }
}