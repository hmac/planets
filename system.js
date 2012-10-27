(function($, _, Backbone, planets, Sun, PlanetStats) {

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var max_width = $(canvas).attr('width') - 0;
var max_height = $(canvas).attr('height') - 0;
/*
	Constants
*/
var G = 6.67;

TIME_PERIOD = 0.01; // 0.01s

var force = function(obj1, obj2) {
	// if (!_.has(planets, obj1.name) || !_.has(planets, obj2.name) || obj2.name == "Sun") {
	// 	return;
	// }
	var disp_x = obj1.position.x - obj2.position.x;
	var disp_y = obj1.position.y - obj2.position.y;

	var opp = disp_y;
	var adj = disp_x;
	var hyp = Math.sqrt( Math.pow(disp_x, 2) + Math.pow(disp_y, 2) );

	var r = hyp;
	// console.log(r);

	if (r < 5) {
		console.log('collision');
		if (obj1.mass > obj2.mass) {
			obj1.mass += obj2.mass;
			planets.splice(planets.indexOf(obj2), 1);
		}
		obj1.velocity.x += obj2.velocity.x;
		obj1.velocity.y += obj2.velocity.y;
		return;
	}

	var force = G * obj1.mass * obj2.mass * (1 / (r*r));

	var acc = force / obj2.mass;

	var acc_x = acc * (adj / hyp);
	var acc_y = acc * (opp / hyp);

	obj2.velocity.x += acc_x * TIME_PERIOD;
	obj2.velocity.y += acc_y * TIME_PERIOD;

	obj2.position.x += obj2.velocity.x;
	obj2.position.y += obj2.velocity.y;

	if (obj1.position == obj2.position) {
		obj1.velocity = 0 - obj1.velocity;
		obj2.velocity = 0 - obj2.velocity;
	}
}

var bounce = function(planet) {
	planet.velocity.x = - planet.velocity.x;
	planet.velocity.y = - planet.velocity.y;
}

var tick = function(stats) {
	_.each(planets, function(planet1, name1) {
		if (planet1.position.x >= max_width || planet1.position.x <= 0) {
			bounce(planet1);
		}
		if (planet1.position.y >= max_height || planet1.position.y <= 0) {
			bounce(planet1);
		}
		force(Sun, planet1);
		_.each(planets, function(planet2, name2) {
			if (name1 == name2) {
				return;
			}
			force(planet1, planet2);
		});
	});
	draw();
	// stats.render();
}

var drawPlanet = function(planet) {
	ctx.strokeStyle = planet.style;
	ctx.beginPath();
	ctx.arc(planet.position.x, planet.position.y, planet.radius, 0, Math.PI*2, false);
	ctx.closePath();
	ctx.stroke();
}
	
	
var draw = function() {
	_.each(planets, function(planet, name) {
		if (name == "Sun") {
			return;
		}
		drawPlanet(planet);
	})
}

var start = function() {
	window.tickID && window.clearInterval(window.tickID, 10);
	canvas.width = canvas.width;
	drawPlanet(Sun);
	_.each(planets, function(planet, name) {
		if (name == 'Sun') {return};
		planet.position = {
			x: planet.startposition.x,
			y: planet.startposition.y
		};
		planet.velocity = {
			x: planet.startvelocity.x,
			y: planet.startvelocity.y
		};
	});
	window.tickID = window.setInterval(tick, 10);
}

var updatePlanet = function(planet) {
	planets[planet.name] = planet;
	saveState();
}

var saveState = function() {
	console.log("save state");
	var ls = window.localStorage;
	ls['planetnumber'] = _.keys(planets).length;
	_.each(planets, function(planet) {
		var name = planet.name;
		var fields = "";
		_.each(planet, function(val, key) {
			if (typeof(val) == 'object') {
				_.each(val, function(_val, _key) {
					ls[name+'_'+key+'_'+_key] = _val;
					fields += name+'_'+key+'_'+_key+'/';
				});
			}
			else
			{
			ls[name+'_'+key] = val;
			fields += name+'_'+key+'/';				
			}
		});
		ls[name] = fields;
	});
	ls['planets'] = _.reduce(_.pluck(planets, 'name'), function(memo, planet) { return planet+'_'+memo}, '');
}

/*
	Pretty complex function, so a bit of explanation needed.
	This function walks through all the strings stored in localStorage and applies those
	properties to the objects they correspond to.
	The localStorage keys are the object property chains put into words, i.e.
	Nemesis.position.x is stored as "Nemesis_position_x";
	All the properties that exist are stored, separated by "/" characters.
	The lastpath thing is there because in order to alter the global planet object,
	we need a reference
*/
var restoreState = function() {
	var ls = window.localStorage;
	if (!ls['planets']) {
		return;
	}
	var _planets = ls['planets'].split('_');
	_.each(_planets, function(name) {
		if (name == "") {return};
		var fields = ls[name].split('/');
		_.each(fields, function(f) {
			if (f == "") {return};
			var paths = f.split('_');
			var obj = undefined;
			var lastpath = undefined;
			_.each(paths, function(p) {
				if (p == "") {return};
				if (obj == undefined) {
					obj = planets[p];
					return;
				}
				if (typeof(obj[p]) != 'object') {
					lastpath = p;
					return;
				}
				else
				{
					obj = obj[p];
				}
			});
			obj[lastpath] = (typeof(obj[lastpath]) == 'number') ? ls[f] - 0 : ls[f];
		});
	});
}

$(document).ready(function() {
	// Restore state from localStorage
	restoreState();
	// Create fields
	_.each(planets, function(planet, name) {
		var elem = $('<div id="'+name+'"></div>');
		var stats = new PlanetStats({
			el: elem,
			planet: planet
		});
		stats.on('change', updatePlanet);
		$("#controls").append(elem);
	});

	// Enable restart button
	$('#restart').on('click', start);
	// $('#restart').on('click', restoreState); // Temp hack to test restoreState

	start();
});

})($, _, Backbone, planets, Sun, PlanetStats);