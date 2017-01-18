"use strict"

const fridgeFactory = () => {


	let start = () => {
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

	/** ARTYOM */
	let _robotConfig = () => {
	    artyom.when("SPEECH_SYNTHESIS_START", function() {
	        document.body.className = "talk"
	    })
	    artyom.when("SPEECH_SYNTHESIS_END", function() {
	        document.body.className = "shutup"
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
		start: start,
		shutdown: shutdown
	}
}