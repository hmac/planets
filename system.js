(function($, _, Backbone, planets, Sun, PlanetStats, Buffer) {

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var max_width = $(canvas).attr('width') - 0;
var max_height = $(canvas).attr('height') - 0;

var centre_width = max_width/2;
var centre_height = max_height/2;

/*
	Constants
*/
var G = 6.67;
var BUFFER_SIZE = 1000;
TIME_PERIOD = 0.01; // 0.01s

var buffer = new Buffer({
	size: BUFFER_SIZE
});


var force = function(obj1, obj2) {
	// If planets have been 'destroyed', skip them
	if (obj1.dead || obj2.dead) {
		return
	}

	var disp_x = obj1.position.x - obj2.position.x;
	var disp_y = obj1.position.y - obj2.position.y;

	var opp = disp_y;
	var adj = disp_x;
	var hyp = Math.sqrt( Math.pow(disp_x, 2) + Math.pow(disp_y, 2) );

	var r = hyp;

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
	canvas.width = canvas.width;
	_.each(planets, function(planet1, name1) {
		if ((planet1.position.x + planet1.radius) >= max_width || (planet1.position.x - planet1.radius) <= 0 || (planet1.position.y + planet1.radius) >= max_height || (planet1.position.y - planet1.radius) <= 0) {
			// bounce(planet1);
		}

		force(Sun, planet1);

		// Check collision with Sun
		var x = planet1.position.x - Sun.position.x;
		var y = planet1.position.y - Sun.position.y;
		var r = Sun.radius + planet1.radius;
		if ((x*x + y*y) < (r*r)) {
			// Planet has collided with Sun
			planet1.dead = true;
			return;
		}

		_.each(planets, function(planet2, name2) {
			if (name1 == name2) {
				return;
			}
			// Check if any planets have collided
			var x = planet2.position.x - planet1.position.x;
			var y = planet2.position.y - planet1.position.y;
			var r = (planet1.radius >= planet2.radius) ? planet1.radius : planet2.radius;
			if ((x*x + y*y) < (r*r)) {
				// Planets have collided
				var smaller_planet = (planet1.mass >= planet2.mass) ? planet2 : planet1;
				smaller_planet.dead = true;
			}
			force(planet1, planet2);
		});
	});
	draw();
	buffer.each(renderFrame);
	renderFrame({
		style: _.clone(Sun.style),
		x: Sun.position.x,
		y: Sun.position.y,
		radius: Sun.radius
	});
}

var drawPlanet = function(planet) {
	buffer.add({
		style: _.clone(planet.style),
		x: planet.position.x,
		y: planet.position.y,
		radius: planet.radius
	});
}

var renderFrame = function(frame) {
	if (frame.alpha <= 0) {
		return;
	}
	ctx.strokeStyle = (function(style) {
		return "rgba("+style.red+","+style.green+","+style.blue+","+style.alpha+")";
	})(frame.style);
	ctx.beginPath();
	ctx.arc(frame.x, frame.y, frame.radius, 0, Math.PI*2, false);
	ctx.closePath();
	ctx.stroke();
}
	
var draw = function() {
	_.each(planets, function(planet, name) {
		if (planet.dead) {
			return;
		}
		drawPlanet(planet);
	});
}

var start = function() {
	window.tickID && window.clearInterval(window.tickID, 10);
	canvas.width = canvas.width;
	Sun.position.x = centre_width;
	Sun.position.y = centre_height;
	drawPlanet(Sun);
	_.each(planets, function(planet, name) {
		planet.dead = false;
		if (name == 'Sun') {return};
		planet.position = {
			x: centre_width + planet.startposition.x,
			y: centre_height + planet.startposition.y
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
	Nemesis.position.x is stored under the key "Nemesis_position_x";
	All the properties that exist for a planet are stored in "<Planetname>", separated by "/" characters.
	The lastpath thing is there because in order to alter the global planet object,
	we need a reference to it, and javascript only passes objects by reference, so we 
	have to stop traversing when we hit the last thing in the tree that is an object
	-- i.e. before we hit a 'value'.
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

})($, _, Backbone, planets, Sun, PlanetStats, Buffer);