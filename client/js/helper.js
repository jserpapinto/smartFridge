"use strict"

const helperFactory = () => {

	const debug = (msg) => {
		if (window.debug == true) { 
			console.log("-------------------------------------------")
			console.log(msg)
			console.log("-------------------------------------------")
		}
	}

	// Bind hacks to html
	const bindHacks = () => {
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
			$("#hacks").html("")
			hacks.forEach((hack) => {
				$("#hacks").append(template.replace('TITLE', hack.title).replace('ID', c))
				$("#hack-" + c).on('click', hack.action)
				c++;
			})
			console.log("\n------------- BIND HACKS ----------------")
			console.table(hacks);
			console.log("------------- END BIND HACKS ----------------")
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
			artyom.simulateInstruction("300")
		}
		function hackLogout() {
			artyom.simulateInstruction("logout")
		}
	}

	const wait = () => {

	}

	return {
		debug: debug,
		wait: wait,
		bindHacks: bindHacks
	}
}