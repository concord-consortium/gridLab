views = require 'views'
components = require 'components'
Grid = require 'grid'

module.exports = class WorldController

  constructor: (elId) ->
    @view = new views.WorldView this, elId
    @grid = new Grid()

  createPowerLine: (x, y) ->
    @currentPowerline = new components.Wire {x, y}
    @components.push @currentPowerline
    return @currentPowerline

  finalizePowerLine: ->
    @currentPowerline = null

  createCurrentComponent: (x, y) ->
    component = new @currentComponent {x, y}
    @components.push component
    return component

  setMouseMode: (mode) ->
    @mouseMode = mode
    if mode is "connect"
      @view.setAllSelectable(false)
    else
      @view.setAllSelectable()

  mouseMode: 'create'

  currentPowerline: null

  currentComponent: components.WindTurbine

  components: []
