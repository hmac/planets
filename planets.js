planets = (function(){
	return {
		Earth: {
			name: "Earth",
			style: "rgba(0, 0, 100, 0.2)",
			startposition: {
				x: 700,
				y: -100
			},
			mass: 12,
			radius: 10,
			startvelocity: {
				x: 1,
				y: 0
			}
		},
		Venus: {
			name: "Venus",
			style: "rgba(100, 0, 0, 0.2)",
			startposition: {
				x: 700,
				y: 420
			},
			mass: 0.00000000001,
			radius: 6,
			startvelocity: {
				x: 1,
				y: 0.1
			}
		},
		Jupiter: {
			name: "Jupiter",
			style: "rgba(0, 100, 0, 0.2)",
			startposition: {
				x: 550,
				y: -90
			},
			mass: 800,
			radius: 60,
			startvelocity: {
				x: -1,
				y: 0.3
			}
		},
		Nemesis: {
			name: "Nemesis",
			style: "rgba(200, 100, 0, 0.2)",
			startposition: {
				x: 700,
				y: 600
			},
			mass: 1000,
			radius: 20,
			startvelocity: {
				x: 0.6,
				y: 0
			}
		}
	}
})();