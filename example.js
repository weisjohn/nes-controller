var controllers = require('./index')();

// the NES-Controller constructor takes the same arguments as HID.HID
// it also exposes the same EventEmitter interface, just with added
// events for each control. All events are demonstrated below:

if (!controllers[0]) throw new Error("No controller found");
var controller = controllers[0];

function log(val) {
    return function(arg) { console.log(val, typeof arg !== "undefined" ? arg : "") }
}

var buttons = ["A", "B", "START", "SELECT"]
buttons.forEach(function(button) {
    controller.on("press" + button, log("pressed " + button));
    controller.on("release" + button, log("release " + button));
});
controller.on("analog", log("analog"));
controller.on("analogNS", log("analogNS"));
controller.on("analogEW", log("analogEW"));
