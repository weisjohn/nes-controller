var HID = require('node-hid');

var definitions = {
    "2Axes 11Keys Game  Pad" : {
        "buttons": {
            "A":        [3, 0x01],
            "B":        [3, 0x02],
            "SELECT":   [4, 0x01],
            "START":    [4, 0x02],
        },
        "dpad" : {
            "EW" : 0,
            "NS" : 1
        }
    },
    "USB Gamepad " : {
        "buttons": {
            "A":        [5, 0x20],
            "B":        [5, 0x40],
            "SELECT":   [6, 0x10],
            "START":    [6, 0x20],
        },
        "dpad" : {
            "EW" : 3,
            "NS" : 4
        }
    },
    "NES PC Game Pad" : {
        "buttons": {
            "A":        [5, 0x20],
            "B":        [5, 0x10],
            "SELECT":   [5, 0x40],
            "START":    [5, 0x80],
        },
        "dpad" : {
            "EW" : 0,
            "NS" : 4
        }        
    }
}

function NESController(path, controller) {
    HID.HID.call(this, path);
    this.controlState = new Buffer(8);
    this.controlString = "";

    this.buttons = controller.buttons;
    this.dpad = controller.dpad;

    this.on("data", function(data) {

        // early bolt for optimization improvements
        if (data.toString('hex') == this.controlString) return;

        // check d-pad state
        var analogEW = data[this.dpad.EW];
        var analogNS = data[this.dpad.NS];

        if (this.controlState[this.dpad.EW] != analogEW) {
            this.emit("analogEW", analogEW);
            this.emit("analog", [analogEW, analogNS]);
        }
        if (this.controlState[this.dpad.NS] != analogNS) {
            this.emit("analogNS", analogNS);
            this.emit("analog", [analogEW, analogNS]);
        }

        // check buttons
        for (key in this.buttons) {
            var address = this.buttons[key];
            var chunk = address[0];
            var mask = address[1];
            if (
                // check if different from controlState
                (this.controlState[chunk] & mask) !=
                (data[chunk] & mask)
            ) {

                if ((data[chunk] & mask) === mask) {
                    this.emit("press"+key);
                } else {
                    this.emit("release"+key);
                }
            }
        };

        // save state to compare against next frame, update cache
        data.copy(this.controlState);
        this.controlString = this.controlState.toString('hex');
    });
}

NESController.prototype = Object.create(HID.HID.prototype);
NESController.prototype.constructor = NESController;

var controllers = [];
module.exports = function() {

    HID.devices().forEach(function(device) {
        if (!~Object.keys(definitions).indexOf(device.product)) return;
        var definition = definitions[device.product];
        var controller = new NESController(device.path, definition);
        controllers.push(controller);
    });
    return controllers;
}

process.on('exit', function() {
    controllers.forEach(function(controller) {
        controller.close();
    });
});