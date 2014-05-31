var HID = require('node-hid');

function NESController(path) {
    HID.HID.call(this, path);
    this.controlState = new Buffer(8);
    this.buttonAddresses = {
        "A":        [3, 0x01],
        "B":        [3, 0x02],
        "SELECT":   [4, 0x01],
        "START":    [4, 0x02],
    };

    this.on("data", function(data) {

        var analogEW = data[0];
        var analogNS = data[1];
        if (this.controlState[0] != analogEW) {
            this.emit("analogEW", analogEW);
            this.emit("analog", [analogEW, analogNS]);
        }
        if (this.controlState[1] != analogNS) {
            this.emit("analogNS", analogNS);
            this.emit("analog", [analogEW, analogNS]);
        }

        for (key in this.buttonAddresses) {
            var address = this.buttonAddresses[key];
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

        // save state to compare against next frame
        data.copy(this.controlState);
    });
}

NESController.prototype = Object.create(HID.HID.prototype);
NESController.prototype.constructor = NESController;

module.exports = function() {
    var controllers = [];
    HID.devices().forEach(function(device) {
        if (device.product === '2Axes 11Keys Game  Pad') {
            controllers.push(new NESController(device.path));
        }
    });
    return controllers;
}
