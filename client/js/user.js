"use strict"

const userFactory = (name) => {

	let user = {
		name: null,
		commands: []
	}

	let init = (() => {
		user.name = name
	})()

	return user
}