/*!
 * jQuery Drink
 *
 * Attach event handlers to DOM elements before they exist. 
 * Requires jQuery 1.4 or later
 *
 * http://github.com/elijahr/jquery-drink
 *
 * Copyright 2010, Elijah Rutschman
 * Dual licensed under the MIT
 * (http://www.opensource.org/licenses/mit-license.php)
 * or GPL Version 2
 * (http://www.opensource.org/licenses/gpl-license.php)
 * licenses.
 *
 */

(function ($) {

	var $drink, CONTEXT = 0, SELECTOR = 1, ACTION = 2, ARGS = 3, ID = 4;

	$.drink = {
		add_query: function (/*context, selector, action, args*/) {
			var query;
			query = Array.prototype.slice.call(arguments, 0);
			query[ID] = $.drink.id;
			$.drink.id += 1;
			$.drink.queries.push(query);
		},
		remove_query: function (context, selector, action, args) {
			var i, len, q;
			i = 0;
			len = this.queries.length;

			while (i < len) {
				q = this.queries[i];
				// remove this query if any of the following are true:
				//		the context + selector match
				//		the context matches and there is no selector
				//		the selector matches and there is no context
				//		AND
				//		either the action is undefined or the action is a match
				//		AND
				//		either the args are undefined or the args are a match
 
				if (context ? context === q[CONTEXT] : true &&
					selector ? selector === q[SELECTOR] : true &&
					( !action || action === q[ACTION]) &&
					( !args || equivalent(args, q[ARGS]))) {
					this.queries.splice(i, 1);
					len -= 1;
				} else {
					i += 1;
				}
			}
		},
		queries: [],
		go: function () {
			var i, len, query, varname, $elems;	
			i = 0;
			len = this.queries.length;
			while (i < len) {
				// cycle through the queries and trigger the action on domready
				// if dom is already ready, the action is triggered immediately
				query = this.queries[i];
				varname = 'drink_' + query[ID] + '_applied';

				$(document).bind('ready', function(){
					$elems = $(query[CONTEXT])
					if (query[SELECTOR]) {
						$elems = $elems.find(query[SELECTOR])
					}
					$elems = $elems.filter(filter(varname));
					$elems.data(varname, true);
					$elems[query[ACTION]].apply($elems, query[ARGS]);
				})
				i += 1;
			}
		},
		start: function () {
			if ($.drink.on) {
				return;
			}
			$.fn._domManip = $.fn.domManip;
			$.fn.domManip = $.drink.dom_manip;

			$.fn._html = $.fn.html;
			$.fn.html = $.drink.drunk_callback($.fn._html);

			$drink = $($.drink).bind('go.main', $.drink.go);

			$.drink.on = true;
		},
		dom_manip: function () {
			var callback, drink_callback, dom_manip_args;
			callback = arguments[2];
			drink_callback = $.drink.drunk_callback(callback);
			dom_manip_args = Array.prototype.slice.call(arguments, 0);
			dom_manip_args.splice(2, 1, drink_callback);
			return $.fn._domManip.apply(this, dom_manip_args);
		},
		drunk_callback: function (callback) {
			return callback ? function () {
				var return_val;
				return_val = callback.apply(this, arguments);
				$drink.trigger('go');
				return return_val;
			} : callback;
		},
		drink: function () {
			parse_query_args_and_call.apply($.drink.add_query, arguments);
			$drink.trigger('go');
		},
		eat: function () {
			parse_query_args_and_call.apply($.drink.remove_query, arguments);
		},
		stop: function () {
			if (! $.drink.on) {
				return;
			}
			$.fn.domManip = $.fn._domManip;
			$.fn.html = $.fn._html;
			$drink.unbind('.main');
			$.drink.on = false;
		},
		on: false,
		id: 0
	};

	// miscellaneous private helper functions
	function filter(varname) {
		// build a filter function to remove elements that have
		// already been used by the query that varname represents
		return function () {
			return ! $(this).data(varname);
		};
	};

	function parse_query_args_and_call($elem, callback_or_event_name, handler) {
		var callback, event_name, handler, action, args;
		if ($.isFunction(callback_or_event_name)) {
			// a callback for the jQuery.each method was passed in
			callback = callback_or_event_name;
			action = 'each';
			args = [callback];
		} else {
			// an event name and event handler were passed in
			event_name = callback_or_event_name;
			if (this === $.drink.remove_query) {
				// action can be undefined if we're removing a query, thats ok
			} else {
				action = 'bind';
			}
			args = [event_name, handler];
		}
		this($elem.context, $elem.selector, action, args);
	}

	function equivalent(array1, array2){
		var i=0, len1=array1.length, len2=array2.length;
		if (len1 != len2) {
			return false;
		}

		while (i < len1) {
			if (array1[i] !== array2[i]) {
				return false;
			}
			i += 1;
		}
		return true;
	}

	$.extend($.fn, {
		drink: function (callback_or_event_name, handler) {
			$.drink.drink(this, callback_or_event_name, handler);
			return this;
		},
		eat: function (callback_or_event_name, handler) {
			$.drink.eat(this, callback_or_event_name, handler);
			return this;
		}
	});

	$.drink.start();

})(jQuery);
