PlanetStats = (function() {

return Backbone.View.extend({
	initialize: function(options) {
		this.planet = options.planet;
		this.render();
	},
	render: function() {
		this.$el.append('<b>'+this.planet.name+'</b><br />');
		var self = this;
		var fields = _.pick(this.planet, 'startposition', 'startvelocity', 'mass');
		_.each(fields, function(val, key) {
			if (typeof(val) == 'object') {
				_.each(val, function(innerval, innerkey) {
					self.makeInput(innerval, innerkey, key);
				});
				return;
			}
			self.makeInput(val, key);
		});
	},
	makeInput: function(val, key, outerkey) {
		var input = $('<input></input>');
		var id = outerkey ? (outerkey+'_'+key) : key;
		input.attr('id', id);
		input.val(val);
		input.on('change', _.bind(this.change, this));
		var str = outerkey ? (outerkey+' '+key) : (key+' ');
		this.$el.append(str+' ');
		this.$el.append(input);
		this.$el.append('<br />');
	},
	change: function(event) {
		var el = $(event.target);
		var id = el.attr('id');
		var parent = id.split('_')[0];
		var field = id.split('_')[1];
		if (field) {
			this.planet[parent][field] = el.val()-0;
			this.trigger('change', this.planet);
		}
		else {
			this.planet[parent] = el.val()-0;
			this.trigger('change', this.planet);
		}
	}
});


})();