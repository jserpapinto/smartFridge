/**
 * SmartFridge.js requires artyom.js
 *
 * @license ISTEC
 * @version 0.0.1
 * @copyright 2017 ISTEC All Rights Reserved.
 * @authors Bruno Gomes, João Serpa, Tiago Wong
 * @param {Object} window (scope performance)
 */
"use strict"
// Vars
let currentCommand = {
    action: "",
    product: "",
    quantity: "",
}
// Factory functions
window.debug = true
let h = helperFactory()

// First Init, on body load
window.init = function() {
    if ("WebSocket" in window) {
        // Create Fridge
        window.fridge = fridge("Aníbal")
    } else {
        // The browser doesn't support WebSocket
        alert("Please buy a new fridge!")
        return false
    }
}

