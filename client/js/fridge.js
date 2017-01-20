"use strict"

const fridge = (name, socket) => {

	// Attributes
	let _ws
	let _name
	let _cmds
	let _user


/* ------------------------------------
**		Boot process 
*  --------------------------------- */
	// Construct
	const init = (() => {
		h.debug("INIT")

		// Atributions
		_user = null
		_name = name // Fridge name
        _cmds = cmdFactory() // Commands
		h.bindHacks() // Bind hacks for easyness

		// Boot functions
		_webSocketConf() // Start Socket
	})()

	// Socket init configurations
	function _webSocketConf() {
	    //ws = new WebSocket("ws://LIPTON:8080/p5websocket")
	    _ws = new WebSocket("ws://" + socket)
	    h.debug(_ws)
	    _ws.onmessage = (res) => {
	    	if (res.data == "START") {
	    		document.body.className += " started"
				_start() // Start fridge
	    	}
	    }
	}

	// Start fridge
	function _start() {
		h.debug("START")
		// Configure Artyom
	    artyom.initialize({
	        lang:"en-GB",
	        debug:true, // Show what recognizes in the Console
	        listen:true, // Start listening after this
	        speed:1, // Talk a little bit slow
	        soundex: true,// Use the soundex algorithm to increase accuracy
	        mode:"normal", // This parameter is not required as it will be normal by default
	        continuous: true
	    }).then(() => {
			h.debug("START - THEN")
	        h.debug("\t\tArtyom has been succesfully initialized")

	        // Animation configs
	        _robotConfig()
	        // Require Login
	        authenticateUser()
	    }).catch((err) => {
			h.debug("START - ERROR")
	        console.error("\t\tArtyom couldn't be initialized: ", err)
	    })
	}
	// Config css for robot face
	function _robotConfig() {
		h.debug("ROBOT CONFIG")
	    artyom.when("SPEECH_SYNTHESIS_START", function() {
	        document.body.className = document.body.className.replace("shutup", "talk")
	    })
	    artyom.when("SPEECH_SYNTHESIS_END", function() {
	        document.body.className = document.body.className.replace("talk", "shutup")
	    })
	}

// ------------------------------------
// 
	// Shutdown fridge
	function shutdown() {
		h.debug("shutting down")
		say("Logging out. see you next time " + context.name)
		artyom.fatality()
		sendToServer("logout")
	}


/* ------------------------------------
**		Authentication process 
*  --------------------------------- */
    function authenticateUser() {
    	h.debug("AUTHENTICATE USER")
    	// Check if user already logged in
    	if (_user != null) return say("You are already logged in")
    	// Begin auth process
        bindCommands(_cmds.auth, true)
    	say("Hello! Please login!")
    }
    function tryAuthentication(name) {
    	h.debug("TRY AUTHENTICATION")
    	// Send authentication
    	sendToServer("login " + name)

    	_ws.onmessage = (res) => {
    		h.debug(res.data)

    		// Incorrect login
    		if (res.data != name) {
    			return say("Incorrect login.")
    		}

    		// Correct login
    		configUser(name)
    	}
    }
    function configUser(name) {
    	_user = userFactory(name)
    	say("Welcome " + _user.name + "! Nice to see you!", {
    		onEnd: () => {
				console.log(_cmds.mainCommands)
    			bindCommands(_cmds.alwaysCommands, true)
    			bindCommands(_cmds.mainCommands)
    			say("Tell me what you want to do!")
    			cleanInput();
    		}
    	})
    }
    function cleanUser() {
    	_user = null;
    }
// ------------------------------------

/* ------------------------------------
**	          Actions
*  --------------------------------- */
	function insertIn(product) {
		sendToServer("insert")
		setTimeout(() => {
			sendToServer(product)
		}, 2000)
		console.log(_cmds.howmanyCommands)
		bindCommands(_cmds.howmanyCommands, true)
		setTimeout(() => {
			say("How many?")
		}, 5000)
	}
	function remove(product) {
		sendToServer("remove")
		setTimeout(() => {
			sendToServer(product)
		}, 2000)
		_ws.onmessage = (res) => {
			h.debug(res.data)

			if (res.data == "OK") {
				bindCommands(_cmds.alwaysCommands, true)
				bindCommands(_cmds.howmanyCommandsRemove)
				say("How many?")
			} else {
				bindCommands(_cmds.alwaysCommands, true)
				bindCommands(_cmds.mainCommands)
				say("You don't have " + product + "!")
			}
		}
	}
	function search(product) {
		setTimeout(() => {
			sendToServer("search")
		}, 1000)
		setTimeout(() => {
			say("Searching...")
		}, 500)
		setTimeout(() => {
			sendToServer(product)
		}, 2000)
		_ws.onmessage = (res) => {
			h.debug(res.data)

			if (res.data != "?") {
				say("You have " + res.data + " " + product)
				bindCommands(_cmds.alwaysCommands, true)
				bindCommands(_cmds.mainCommands)
			}
			else {
				say("You don't have " + product)
			}
		}
	}
	function sendNumber(number) {
		if (parseInt(number)) {
			sendToServer(number)

			_ws.onmessage = (res) => {
				h.debug(res.data)
				if (res.data == "OK") {
					bindCommands(_cmds.alwaysCommands)
					bindCommands(_cmds.mainCommands, true)
					say("Done! What else?")
				} else {
					say("Something went wrong!")
				}
			}
		} else {
			say("Can't parse it!")
		}
	}
	function sendNumberRemove(number) {
		if (parseInt(number)) {
			sendToServer(number)

			_ws.onmessage = (res) => {
				h.debug(res.data)
				bindCommands(_cmds.alwaysCommands)
				bindCommands(_cmds.mainCommands, true)
				say(res.data)
			}
		} else {
			say("Can't parse it!")
		}
	}
	function hacks() {
		if (document.body.className.indexOf("hacking")) document.body.className = document.body.className.replace("hacking", "")
		if (document.body.className.indexOf("hacking") < 0) document.body.className = document.body.className.replace("", " hacking")
	}
// ------------------------------------


/* ------------------------------------
**	          Commands 
*  --------------------------------- */
	function bindCommands(cmds, clearAll = false) {
		h.debug("BINDING COMMANDS")
		// Clear all commands, if needed
		if (clearAll == true) artyom.emptyCommands()

		// Add commands
		artyom.addCommands(cmds)
        _cmds.showCommands(artyom.getAvailableCommands())
	}
	function cleanInput() {
		_ws.onmessage = null;
	}
	function cancel() {
		setTimeout(() => {
			sendToServer("cancel")
		}, 2000)
		bindCommands(_cmds.alwaysCommands, true)
		bindCommands(_cmds.mainCommands)
		setTimeout(() => {
			say("Canceling...")
		}, 2000)
	}
	function logout() {
		say("Logging out securely.. Clearing your account information.")
		setTimeout(() => {
			sendToServer("logout")
		}, 2000)
		cleanUser();
	    document.body.className = document.body.className.replace("started", "")
	    _ws.onmessage = (res) => {
	    	if (res.data == "START") {
	    		document.body.className += " started"
				authenticateUser() // Start fridge
	    	}
	    }
	}
// ------------------------------------

/* ------------------------------------
**				I/O 
*  --------------------------------- */
	let say = (msg, obj) => {
	    artyom.say(msg, obj)
	    sendToServer("*" + msg)
	}

	/** Send message to server with callbacks */
	let sendToServer = (msg) => {
		msg = msg.toString().toLowerCase()
		setTimeout(() => {
	    	_ws.send(msg)
			console.log("------------------\nSENDING: " + msg + "\n------------------")
		}, 200)
	}

	function okay () {
		say("Yes, but the way you architected me is awful!")
	}

	function howareyou () {
		say("A little bit okay. Your city is freezing! Please cover me with a blanket.")
	}
// ------------------------------------

	return {
		say: say,
		sendToServer: sendToServer,
		shutdown: shutdown,
		tryAuthentication: tryAuthentication,
		insertIn: insertIn,
		remove: remove,
		search: search,
		sendNumber: sendNumber,
		sendNumberRemove: sendNumberRemove,
		logout: logout,
		cancel: cancel,
		hacks: hacks,
		okay: okay,
		howareyou: howareyou,
		cleanInput: cleanInput
	}
}