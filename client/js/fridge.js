"use strict"

const fridge = (name) => {

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
		_start() // Start fridge
	})()

	// Socket init configurations
	function _webSocketConf() {
	    //ws = new WebSocket("ws://LIPTON:8080/p5websocket")
	    _ws = new WebSocket("ws://tenzingyatso:9090/supersmart")
	    h.debug(_ws)
	}

	// Start fridge
	function _start() {
		h.debug("START")
		// Configure Artyom
	    artyom.initialize({
	        lang:"en-GB",
	        debug:true, // Show what recognizes in the Console
	        listen:true, // Start listening after this
	        speed:1.5, // Talk a little bit slow
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
		setTimeout( () => {
			sendToServer("logout")
		},1000)
	}


/* ------------------------------------
**		Authentication process 
*  --------------------------------- */
    function authenticateUser() {
    	h.debug("AUTHENTICATE USER")
    	// Check if user already logged in
    	if (_user != null && _user.name != null) return say("You are already logged in")
    	// Begin auth process
        bindCommands(_cmds.auth)
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
    			bindCommands(_cmds.mainCommands, true)
    			say("Tell me what you want to do!")
    		}
    	})
    }
// ------------------------------------

/* ------------------------------------
**	          Actions
*  --------------------------------- */
	function insertIn(product) {
		sendToServer("insert")
		setTimeout(() => {
			sendToServer(product)
		}, 1000)
		console.log(_cmds.howmanyCommands)
		bindCommands(_cmds.howmanyCommands, true)
		setTimeout(() => {
			say("How many?")
		}, 1000)
	}
	function remove(product) {
		sendToServer("remove")

		setTimeout(() => {
			sendToServer(product)
		}, 1000)

		_ws.onmessage = (res) => {
			h.debug(res.data)

			if (res.data == "OK") {
				bindCommands(_cmds.howmanyCommands, true)
				say("How many?")
			} else {
				bindCommands(_cmds.mainCommands, true)
				say("You don't have " + product + "!")
			}
		}
	}
	function search(product) {
		say("Searching...")
		_ws.onmessage = (res) => {
			h.debug(res.data)

			// Say response
			say("You have " + res.data + " " + product)
		}
	}
	function sendNumber(number) {
		if (parseInt(number)) {
			sendToServer(number)

			_ws.onmessage = (res) => {
				h.debug(res.data)

				if (res.data == "OK") {
					bindCommands(_cmds.mainCommands, true)
					say("Done! What else?")
				} else {
					say("Something went wrong!")
				}
			}
		} else {
			say("Tell me a number!")
		}
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
		console.log("------------------\nSENDING: " + msg + "\n------------------")
	    _ws.send(msg)
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
		sendNumber: sendNumber
	}
}