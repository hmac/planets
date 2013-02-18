Buffer = function(options) {
	this.size = (options && options.size) ? options.size : 100;
	this._buffer = [];

	// Add frame to buffer, removing end frame if max size is reached
	this.add = function(frame) {
		if (this._buffer.length > this.size) {
			this._buffer.shift();
		}
		this._buffer.push(frame);
		this.each(this.fade);
	};

	// Allow iteration over frames via underscore
	this.each = function(fn) {
		_.each(this._buffer, fn);
	}

	// Subtract small amount from alpha of each frame
	this.fade = function(frame) {
		if (frame.style.alpha > 0) {
		frame.style.alpha -= 0.0005;
		}
		else {
			frame.style.alpha = 0;
		}
	}

	return this;
};