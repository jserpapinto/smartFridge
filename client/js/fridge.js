"use strict"

const fridgeFactory = (name) => {

	// Attributes
	let _name
	let hacks

	// Construct
	let init = (() => {
		_name = name
		_start()
		hacks = _bindHacks()
	})()

	function _start() {
    console.log("passei 2")
	    artyom.initialize({
	        lang:"en-GB",
	        debug:true, // Show what recognizes in the Console
	        listen:true, // Start listening after this
	        speed:1, // Talk a little bit slow
	        soundex: true,// Use the soundex algorithm to increase accuracy
	        mode:"normal", // This parameter is not required as it will be normal by default
	        continuous: true
	    }).then(() => {
	        console.log("Artyom has been succesfully initialized")
	        // Start with main commands
	        askAuth()
	        _robotConfig()
	    }).catch((err) => {
	        console.error("Artyom couldn't be initialized: ", err)
	    })
	}

	function _bindHacks () {
		let template = '<a onclick="fridge.ACTION" id="hack-ID" class="list-group-item list-group-item-action">TITLE</a>'
		let hacks = [{
			title: "Login",
			action: hackLogin
		}, {
			title: "Insert donkey",
			action: hackInsert
		}, {
			title: "three hundred",
			action: hackLogin
		}, {
			title: "logout",
			action: hackLogout
		}]

		let init = (() => {
			let c = 1;
			hacks.forEach((hack) => {
				console.log(hack)
				$("#hacks").append(template.replace('TITLE', hack.title).replace('ID', c))
				$("#hack-" + c).on('click', hack.action)
				c++;
			})
		})()

		let toggleHacks = () => {
			if (document.body.className.indexOf("hacking")) document.body.className = document.body.className.replace("hacking", "")
			if (!document.body.className.indexOf("hacking")) document.body.className = document.body.className.replace("", "hacking")
		}

		function hackLogin() {
			artyom.simulateInstruction("login john")
		}
		function hackInsert() {
			artyom.simulateInstruction("insert banana")
		}
		function hackHowMany() {
			artyom.simulateInstruction(300)
		}
		function hackLogout() {
			artyom.simulateInstruction("logout")
		}

		return {
			hackLogin: hackLogin,
			toggleHacks: toggleHacks
		}
	}

	/** ARTYOM */
	let _robotConfig = () => {
	    artyom.when("SPEECH_SYNTHESIS_START", function() {
	        document.body.className = document.body.className.replace("shutup", "talk")
	    })
	    artyom.when("SPEECH_SYNTHESIS_END", function() {
	        document.body.className = document.body.className.replace("talk", "shutup")
	    })
	}
	/** .ARTYOM */

	let shutdown = () => {
		artyom.fatality()
		say("Logging out. see you next time " + context.name)
	}

	let say = (msg, obj) => {
	    artyom.say(msg, obj)
	    sendToServer("*" + msg)
	}

	/** Send message to server with callbacks */
	let sendToServer = (msg, callback) => {
		msg = msg.toString().toLowerCase()
		console.log("------------------\nSENDING: " + msg + "\n------------------")
	    ws.send(msg)
	    ws.onmessage = function(evt) {

	        console.log(evt.data, typeof(evt.data));

	        console.log(callback)
	        if (callback != undefined) {
	            callback(evt.data)
	        }
	    }
	}

	return {
		say: say,
		sendToServer: sendToServer,
		start: _start,
		shutdown: shutdown,
		hacks: hacks
	}
}