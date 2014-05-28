
### Main Canvas view ###

module.exports.WorldView = class WorldView

  constructor: (@controller, elId) ->
    @canvas = new fabric.Canvas elId

    @canvas.on 'mouse:down', (opt) =>
      pointer = @canvas.getPointer opt.e
      if opt.target
        if @controller.mouseMode is "connect"
          wire = @controller.createPowerLine pointer.x, pointer.y
          @canvas.add wire.view.create pointer.x, pointer.y
      else
        if @controller.mouseMode is "create"
          component = @controller.createCurrentComponent pointer.x, pointer.y
          @canvas.add component.view.create pointer.x, pointer.y

    @canvas.on 'mouse:move', (opt) =>
      return unless @controller.currentPowerline
      pointer = @canvas.getPointer opt.e
      @controller.currentPowerline.view.set { x2: pointer.x, y2: pointer.y }
      @canvas.renderAll()

    @canvas.on 'mouse:up', (opt) =>
        @controller.finalizePowerLine()

  setAllSelectable: (selectable = true) ->
    @canvas.getObjects().forEach (o) ->
      o.selectable = selectable

### Component views ###

class ImageView

  constructor: ({@imageElId, @scale, @xOffset, @yOffset}) ->

  element: null

  create: (x, y) ->
    imgElement = document.getElementById(@imageElId)
    @element = new fabric.Image imgElement, {left: x-@xOffset, top: y-@yOffset}
    @element.scale(@scale)
    return @element

  set: (args) ->
    @element.set args

module.exports.WindTurbineView = class WindTurbineView extends ImageView

  constructor: ->
    super {imageElId: 'pinwheel', scale: 0.5, xOffset: 30, yOffset: 100}


module.exports.HouseView = class HouseView extends ImageView

  constructor: ->
    super {imageElId: 'house', scale: 0.25, xOffset: 30, yOffset: 50}

module.exports.PowerLineView = class PowerLineView

  create: (x, y) ->
    points = [ x, y, x, y ];
    @element = new fabric.Line points,
      strokeWidth: 4
      stroke: 'green'
      originX: 'center'
      originY: 'center'
    return @element

  set: (args) ->
    @element.set args
