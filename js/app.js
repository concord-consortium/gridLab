(function(/*! Brunch !*/) {
  'use strict';

  var globals = typeof window !== 'undefined' ? window : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};

  var has = function(object, name) {
    return ({}).hasOwnProperty.call(object, name);
  };

  var expand = function(root, name) {
    var results = [], parts, part;
    if (/^\.\.?(\/|$)/.test(name)) {
      parts = [root, name].join('/').split('/');
    } else {
      parts = name.split('/');
    }
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var dir = dirname(path);
      var absolute = expand(dir, name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var require = function(name, loaderPath) {
    var path = expand(name, '.');
    if (loaderPath == null) loaderPath = '/';

    if (has(cache, path)) return cache[path].exports;
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex].exports;
    if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '" from '+ '"' + loaderPath + '"');
  };

  var define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    } else {
      modules[bundle] = fn;
    }
  };

  var list = function() {
    var result = [];
    for (var item in modules) {
      if (has(modules, item)) {
        result.push(item);
      }
    }
    return result;
  };

  globals.require = require;
  globals.require.define = define;
  globals.require.register = define;
  globals.require.list = list;
  globals.require.brunch = true;
})();
require.register("components", function(exports, require, module) {
var DCPowerSource, House, Resistor, UID, WindTurbine, Wire, nextUID, views, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

views = require('views');

UID = 0;

nextUID = function() {
  return UID++;
};

/* Power Sources*/


DCPowerSource = (function() {
  function DCPowerSource(_arg) {
    this.x = _arg.x, this.y = _arg.y, this.voltage = _arg.voltage;
    this.UID = "DCV" + nextUID();
    this.connections = [this.UID + "0", this.UID + "1"];
    this.current = 0;
  }

  DCPowerSource.prototype.setVoltage = function(voltage) {
    this.voltage = voltage;
  };

  DCPowerSource.prototype.getVoltage = function() {
    return this.voltage;
  };

  DCPowerSource.prototype.addToCircuit = function(ciso) {
    var voltage;
    voltage = this.voltage || 0;
    return ciso.addVoltageSource(this.UID, voltage, this.connections[0], this.connections[1]);
  };

  return DCPowerSource;

})();

module.exports.WindTurbine = WindTurbine = (function(_super) {
  __extends(WindTurbine, _super);

  function WindTurbine(args) {
    var _ref;
    WindTurbine.__super__.constructor.call(this, args);
    this.voltage = (_ref = this.voltage) != null ? _ref : 5;
    this.view = new this.viewClass();
  }

  WindTurbine.prototype.viewClass = views.WindTurbineView;

  return WindTurbine;

})(DCPowerSource);

module.exports.SolarPanel = WindTurbine = (function(_super) {
  __extends(WindTurbine, _super);

  function WindTurbine() {
    _ref = WindTurbine.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  return WindTurbine;

})(DCPowerSource);

/* Power Sinks*/


Resistor = (function() {
  function Resistor(_arg) {
    this.x = _arg.x, this.y = _arg.y, this.resistance = _arg.resistance;
    this.UID = "R" + nextUID();
    this.voltageDrop = 0;
    this.connections = [];
  }

  Resistor.prototype.addToCircuit = function(ciso) {
    return ciso.addComponent(this.UID, "Resistor", this.resistance, this.connections);
  };

  return Resistor;

})();

module.exports.Wire = Wire = (function(_super) {
  __extends(Wire, _super);

  function Wire(args) {
    var _ref1;
    Wire.__super__.constructor.call(this, args);
    this.resistance = (_ref1 = this.resistance) != null ? _ref1 : 1e-6;
    this.view = new this.viewClass();
  }

  Wire.prototype.setConnections = function(_arg) {
    var a, b;
    a = _arg[0], b = _arg[1];
    if (a != null) {
      this.connections[0] = a;
    }
    if (b != null) {
      return this.connections[1] = b;
    }
  };

  Wire.prototype.viewClass = views.PowerLineView;

  return Wire;

})(Resistor);

module.exports.House = House = (function(_super) {
  __extends(House, _super);

  function House(args) {
    var _ref1;
    House.__super__.constructor.call(this, args);
    this.resistance = (_ref1 = this.resistance) != null ? _ref1 : 10;
    this.connections = [this.UID + "0", this.UID + "1"];
    this.view = new this.viewClass();
  }

  House.prototype.viewClass = views.HouseView;

  return House;

})(Resistor);

});

require.register("controller", function(exports, require, module) {
var Grid, WorldController, components, views;

views = require('views');

components = require('components');

Grid = require('grid');

module.exports = WorldController = (function() {
  function WorldController(elId) {
    this.view = new views.WorldView(this, elId);
    this.grid = new Grid();
  }

  WorldController.prototype.createPowerLine = function(x, y) {
    this.currentPowerline = new components.Wire({
      x: x,
      y: y
    });
    this.components.push(this.currentPowerline);
    return this.currentPowerline;
  };

  WorldController.prototype.finalizePowerLine = function() {
    return this.currentPowerline = null;
  };

  WorldController.prototype.createCurrentComponent = function(x, y) {
    var component;
    component = new this.currentComponent({
      x: x,
      y: y
    });
    this.components.push(component);
    return component;
  };

  WorldController.prototype.setMouseMode = function(mode) {
    this.mouseMode = mode;
    if (mode === "connect") {
      return this.view.setAllSelectable(false);
    } else {
      return this.view.setAllSelectable();
    }
  };

  WorldController.prototype.mouseMode = 'create';

  WorldController.prototype.currentPowerline = null;

  WorldController.prototype.currentComponent = components.WindTurbine;

  WorldController.prototype.components = [];

  return WorldController;

})();

});

require.register("grid", function(exports, require, module) {
var Grid;

module.exports = Grid = (function() {
  function Grid() {}

  Grid.prototype.components = [];

  Grid.prototype.addComponent = function(component) {
    this.components.push(component);
    return this.calculateCircuit();
  };

  Grid.prototype.calculateCircuit = function() {
    var c, ciso, component, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2, _results;
    ciso = new CiSo();
    _ref = this.components;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      component = _ref[_i];
      component.addToCircuit(ciso);
    }
    _ref1 = this.components;
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      c = _ref1[_j];
      if (c.current != null) {
        c.current = ciso.getCurrent(c.UID).magnitude;
      }
    }
    _ref2 = this.components;
    _results = [];
    for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
      c = _ref2[_k];
      if (c.voltageDrop != null) {
        _results.push(c.voltageDrop = ciso.getVoltageAt(c.connections[0]).real - ciso.getVoltageAt(c.connections[1]).real);
      }
    }
    return _results;
  };

  return Grid;

})();

});

require.register("views", function(exports, require, module) {
/* Main Canvas view*/

var HouseView, ImageView, PowerLineView, WindTurbineView, WorldView,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

module.exports.WorldView = WorldView = (function() {
  function WorldView(controller, elId) {
    var _this = this;
    this.controller = controller;
    this.canvas = new fabric.Canvas(elId);
    this.canvas.on('mouse:down', function(opt) {
      var component, pointer, wire;
      pointer = _this.canvas.getPointer(opt.e);
      if (opt.target) {
        if (_this.controller.mouseMode === "connect") {
          wire = _this.controller.createPowerLine(pointer.x, pointer.y);
          return _this.canvas.add(wire.view.create(pointer.x, pointer.y));
        }
      } else {
        if (_this.controller.mouseMode === "create") {
          component = _this.controller.createCurrentComponent(pointer.x, pointer.y);
          return _this.canvas.add(component.view.create(pointer.x, pointer.y));
        }
      }
    });
    this.canvas.on('mouse:move', function(opt) {
      var pointer;
      if (!_this.controller.currentPowerline) {
        return;
      }
      pointer = _this.canvas.getPointer(opt.e);
      _this.controller.currentPowerline.view.set({
        x2: pointer.x,
        y2: pointer.y
      });
      return _this.canvas.renderAll();
    });
    this.canvas.on('mouse:up', function(opt) {
      return _this.controller.finalizePowerLine();
    });
  }

  WorldView.prototype.setAllSelectable = function(selectable) {
    if (selectable == null) {
      selectable = true;
    }
    return this.canvas.getObjects().forEach(function(o) {
      return o.selectable = selectable;
    });
  };

  return WorldView;

})();

/* Component views*/


ImageView = (function() {
  function ImageView(_arg) {
    this.imageElId = _arg.imageElId, this.scale = _arg.scale, this.xOffset = _arg.xOffset, this.yOffset = _arg.yOffset;
  }

  ImageView.prototype.element = null;

  ImageView.prototype.create = function(x, y) {
    var imgElement;
    imgElement = document.getElementById(this.imageElId);
    this.element = new fabric.Image(imgElement, {
      left: x - this.xOffset,
      top: y - this.yOffset
    });
    this.element.scale(this.scale);
    return this.element;
  };

  ImageView.prototype.set = function(args) {
    return this.element.set(args);
  };

  return ImageView;

})();

module.exports.WindTurbineView = WindTurbineView = (function(_super) {
  __extends(WindTurbineView, _super);

  function WindTurbineView() {
    WindTurbineView.__super__.constructor.call(this, {
      imageElId: 'pinwheel',
      scale: 0.5,
      xOffset: 30,
      yOffset: 100
    });
  }

  return WindTurbineView;

})(ImageView);

module.exports.HouseView = HouseView = (function(_super) {
  __extends(HouseView, _super);

  function HouseView() {
    HouseView.__super__.constructor.call(this, {
      imageElId: 'house',
      scale: 0.25,
      xOffset: 30,
      yOffset: 50
    });
  }

  return HouseView;

})(ImageView);

module.exports.PowerLineView = PowerLineView = (function() {
  function PowerLineView() {}

  PowerLineView.prototype.create = function(x, y) {
    var points;
    points = [x, y, x, y];
    this.element = new fabric.Line(points, {
      strokeWidth: 4,
      stroke: 'green',
      originX: 'center',
      originY: 'center'
    });
    return this.element;
  };

  PowerLineView.prototype.set = function(args) {
    return this.element.set(args);
  };

  return PowerLineView;

})();

});

