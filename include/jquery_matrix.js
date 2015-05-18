/**
 * jMatrix
 * http://code.google.com/p/jquery-matrix/
 *
 * Copyright (c) 2009 Manuel Strehl
 * Licensed under the MIT license
 *
 */
/*jslint white: true, plusplus: true */
/*global jQuery: false, window: false, document: false */
(function ($) {
"use strict";

/**
 * Return a random integer
 */
var rand = function (max) {
	return max? Math.round(Math.random() * max) : 0;
};

/**
 * Extends jQuery objects with the matrix method
 */
$.fn.matrix = function (options) {
	var settings, addData, addString;

	/**
	 * Settings get defaulted with values from $.fn.matrix.settings
	 */
	settings = $.extend ({}, $.fn.matrix.settings, options);
	
	/**
	 * Add string data to a single matrix string
	 */
	addData = function (initelement, step, data, randset) {
		if (step % settings.charstep === 1) { // every charstep'th iteration adds a new character
			var added = document.createElement("span");
			added.appendChild(document.createTextNode(initelement.firstChild.nodeValue));
			$(added).animate({'opacity':'0'}, randset);
			initelement.parentNode.insertBefore(added, initelement);
			initelement.firstChild.nodeValue = data.substr(step%data.length, 1);
		}
	};
	
	/**
	 * Add a new matrix string (one vertically floating text stripe)
	 */
	addString = function ($matrix) {
		if ($matrix.children().length < settings.maxStrings) {

			var matrix_width = $matrix.width(),
				matrix_height = $matrix.height(),
				size = rand(3), // the size of the string (0: large, foreground; 3: small, background)
				seed = 20-3*size,
				pos = seed*rand(matrix_width/seed), // the position from the left border (foreground is wider apart)
				speed = settings.speedSeed + rand(settings.speedSeed)
						+ (3-size) * rand(settings.speedSeed), // the downwards speed (foreground is faster)
			
			// state for addData()
			addDataSettings = {
				step: 0,
				data: settings.data[rand(settings.data.length-1)],
				randset: (settings.fadingSeed + rand(settings.fadingSeed))
			},

			// The string to append:
			span = document.createElement("span"),
			$mstring = $(span),
			init = document.createElement("span");
			span.setAttribute("class", 'ui-matrix-string ui-matrix-string-size'+size);
			span.style.left = pos+'px';
			span.style.top = "-"+(50+rand(matrix_height))+'px';
			init.setAttribute("class", "ui-matrix-string-first");
			init.appendChild(document.createTextNode("0"));
			span.appendChild(init);

			$matrix.append($mstring);
			// move it:
			$mstring.animate(
				{"top": matrix_height + 10}, 
				{
					duration: speed,
					step: function () {
						addDataSettings.step++;
						addData(init, addDataSettings.step, addDataSettings.data, addDataSettings.randset);
					},
					complete: function () {
						this.parentNode.removeChild(this);
					}
				}
			);
		
		}
		
		// load up more strings
		window.setTimeout(function () {
			addString($matrix);
		}, settings.distanceRoot + rand(settings.distanceSeed));
	};
	
	// don't break the chain
	return this.each(function () {
		var that = $(this);
		that.addClass("ui-matrix");
		addString(that);
	});

};

/**
 * Publicly available settings for jMatrix
 *
 * data: array of strings that are used for the matrix effect
 * maxStrings: number of strings generated per matrix (more will lead to a 
 *	 significant performance impact)
 * charstep: how many ticks of down movement until add a new char in front
 */
$.fn.matrix.settings = {
	'data': ["abcdefghijklmnopqrstuvwxyz0123456789"],
	maxStrings: 100,
	charstep: 22,
	speedSeed: 10000,
	fadingSeed: 8000,
	distanceRoot: 100,
	distanceSeed: 500
};

}(jQuery));