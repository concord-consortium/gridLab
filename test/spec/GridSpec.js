describe("Creating a basic grid", function() {

	Grid = require('grid');
	components = require('components');

	it("We can make a very simple grid and solve it", function() {
		var turbine = new components.WindTurbine({voltage: 10}),
				house = new components.House({resistance: 5}),
				wire1 = new components.Wire({}),
				wire2 = new components.Wire({}),
				grid = new Grid();

		wire1.setConnections([turbine.connections[0], house.connections[0]]);
		wire2.setConnections([turbine.connections[1], house.connections[1]]);

		grid.addComponent(turbine);
		grid.addComponent(house);
		grid.addComponent(wire1);
		grid.addComponent(wire2);

		expect(turbine.current).toBeAbout(2);
		expect(house.voltageDrop).toBeAbout(10);
		expect(house.voltageDrop).toBeLessThan(10);

		expect(wire1.voltageDrop).toBeBetween(0, 0.001);
		expect(wire2.voltageDrop).toBeBetween(-0.001, 0);
	});

});

