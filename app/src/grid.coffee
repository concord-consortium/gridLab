module.exports = class Grid

  components: []

  addComponent: (component) ->
    @components.push component
    @calculateCircuit()

  calculateCircuit: ->
    ciso = new CiSo()
    for component in @components
      component.addToCircuit ciso

    for c in @components when c.current?
      c.current = ciso.getCurrent(c.UID).magnitude

    for c in @components when c.voltageDrop?
      c.voltageDrop = ciso.getVoltageAt(c.connections[0]).real - ciso.getVoltageAt(c.connections[1]).real

