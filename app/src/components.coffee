views = require 'views'

UID = 0

nextUID = ->
  UID++


### Power Sources ###

class DCPowerSource

  constructor: ({@x, @y, @voltage}) ->
    @UID = "DCV"+nextUID()
    @connections = [@UID + "0", @UID + "1"]
    @current = 0

  setVoltage: (@voltage) ->

  getVoltage: ->
    @voltage

  addToCircuit: (ciso) ->
    voltage = @voltage or 0

    ciso.addVoltageSource(@UID, voltage, @connections[0], @connections[1]);


module.exports.WindTurbine = class WindTurbine extends DCPowerSource

  constructor: (args) ->
    super(args)
    @voltage = @voltage ? 5
    @view = new @viewClass()

  viewClass: views.WindTurbineView


module.exports.SolarPanel = class WindTurbine extends DCPowerSource



### Power Sinks ###

class Resistor

  constructor: ({@x, @y, @resistance}) ->
    @UID = "R"+nextUID()
    @voltageDrop = 0
    @connections = []

  addToCircuit: (ciso) ->
    ciso.addComponent(@UID, "Resistor", @resistance, @connections);


module.exports.Wire = class Wire extends Resistor

  constructor: (args) ->
    super(args)
    @resistance = @resistance ? 1e-6
    @view = new @viewClass()

  setConnections: ([a, b]) ->
    @connections[0] = a if a?
    @connections[1] = b if b?

  viewClass: views.PowerLineView


module.exports.House = class House extends Resistor

  constructor: (args) ->
    super(args)
    @resistance = @resistance ? 10
    @connections = [@UID + "0", @UID + "1"]
    @view = new @viewClass()

  viewClass: views.HouseView
