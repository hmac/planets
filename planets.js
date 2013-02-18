planets = (function(){
	return {
		Earth: {
			name: "Earth",
			style: {
				red: 0,
				green: 0,
				blue: 100,
				alpha: 0.4
			},
			startposition: {
				x: 300,
				y: 0
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
			style: {
				red: 100,
				green: 0,
				blue: 0,
				alpha: 0.4
			},
			startposition: {
				x: 0,
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
			style: {
				red: 0,
				green: 100,
				blue: 0,
				alpha: 0.4
			},
			startposition: {
				x: -450,
				y: 120
			},
			mass: 800,
			radius: 60,
			startvelocity: {
				x: 0.3,
				y: -0.5
			}
		},
		Nemesis: {
			name: "Nemesis",
			style: {
				red: 200,
				green: 100,
				blue: 0,
				alpha: 0.4
			},
			startposition: {
				x: 300,
				y: 600
			},
			mass: 1000,
			radius: 20,
			startvelocity: {
				x: -0.6,
				y: 0
			}
		},
		Uranus: {
			name: "Uranus",
			style: {
				red: 255,
				green: 0,
				blue: 0,
				alpha: 0.4
			},
			startposition: {
				x: 30,
				y: 300
			},
			mass: 2000,
			radius: 20,
			startvelocity: {
				x: -0.6,
				y: 0
			}
		}
	}
})();