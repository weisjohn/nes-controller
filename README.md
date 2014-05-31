nes-controller
==============

Interface to a
[Gtron USB Nintendo Entertainment System controller](http://www.amazon.com/gp/product/B002YVD3KM).
Forked from [@dustMason](https://github.com/dustMason)'s [n64controller](https://github.com/dustMason/n64controller) module.

`npm install nes-controller`

### usage

```
var controllers = require('nes-controller')();
var player1 = controllers[0];

player1.on('pressA', function() {
    console.log('A was pressed');
});

player1.on('releaseA', function() {
    console.log('A was released');
});
```

See the [example.js](example.js) file for more detailed usage.

### API

 - `pressA`
 - `releaseA`
 - `pressB`
 - `releaseB`
 - `pressSTART`
 - `releaseSTART`
 - `pressSELECT`
 - `releaseSELECT`
 - `analog`
 - `analogNS`
 - `analogEW`

`analogNS` and `analogEW` receive one value, while `analog` receives an array of two values.

The directional values are either `0`, `127`, `255`.


### others

If you have an NES USB Controller that isn't supported, pull requests are welcome.