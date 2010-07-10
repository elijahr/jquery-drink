
/*!
 * jQuery Drink
 *
 * version 1.0
 *
 * Attach event handlers to DOM elements before they exist. 
 * Requires jQuery 1.4 or later
 *
 * http://github.com/elijahr/jquery-drink
 *
 * Copyright 2010, Elijah Rutschman
 * Dual licensed under the MIT
 * (http://www.opensource.org/licenses/mit-license.php)$(function(){

 * or GPL Version 2
 * (http://www.opensource.org/licenses/gpl-license.php)
 * licenses.
 *
 */

(function($){

	var $drink, CONTEXT=0, SELECTOR=1, ACTION=2, ARGS=3, ID=4;

	$.drink = {
		add_query: function(/*context, selector, action, args*/){
			var query;
			query = Array.prototype.slice.call(arguments, 0);
			query[ID] = $.drink.id++;
			$.drink.queries.push(query);
		},
		remove_query: function(context, selector, action, args){
			var i, len;
			i = 0;

			len = this.queries.length;

			while (i<len) {
				query = this.queries[i];
				if (query[CONTEXT] === context && query[SELECTOR] === selector && (action !== undefined ? query[ACTION] === action : true)) {
					this.queries.splice(i, 1);
					len--;
				} else {
					i++;
				}
			}
		},
		queries: [],
		go: function(){
			var i, len, query, varname, filter, $elems;	
			i = 0;
			len = this.queries.length;
			filter = function(varname){
				return function(){
					return ! $(this).data(varname);
				};
			};
			while (i<len) {
				query = this.queries[i];
				varname = 'drink-'+query[ID];
				$elems = $(query[CONTEXT]).find(query[SELECTOR]).filter(filter(varname));
				$elems.data(varname, true);
				$elems[query[ACTION]].apply($elems, query[ARGS]);
				i++;
			}
			$drink.trigger('done');
		},
		start: function(){
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
		dom_manip: function(){
			var callback, drink_callback, dom_manip_args;
			callback = arguments[2];
			drink_callback = $.drink.drunk_callback(callback);
			dom_manip_args = Array.prototype.slice.call(arguments, 0);
			dom_manip_args.splice(2, 1, drink_callback);
			return $.fn._domManip.apply(this, dom_manip_args);
		},
		drunk_callback: function(callback){
			return callback ? function(){
				var return_val;
				return_val = callback.apply(this, arguments);
				$drink.trigger('go');
				return return_val;
			} : callback;
		},
		drink: function($elem, event_type, handler){
			$.drink.change('add_query', $elem, event_type, handler);
			$drink.trigger('go')
		},
		eat: function($elem, event_type, handler){
			$.drink.change('remove_query', $elem, event_type, handler);
		},
		stop: function(){
			if (! $.drink.on) {
				return;
			}
			$.fn.domManip = $.fn._domManip;
			$.fn.html = $.fn._html;
			$drink.unbind('go.main');
			$.drink.on = false;
		},
		on: false,
		id: 0,
		change: function(method, $elem){
			var callback, event_type, handler;
			if (arguments[2] instanceof Function) {
				callback = arguments[2];
				$.drink[method]($elem.context, $elem.selector, 'each', [callback]);
			} else {
				event_type = arguments[2];
				handler = arguments[3];
				$.drink[method]($elem.context, $elem.selector, 'bind', [event_type, handler]);
			}
		}
	};

	$.extend($.fn, {
		drink: function(event_type, handler){
			$.drink.drink(this, event_type, handler);
			return this;
		},
		eat: function(event_type, handler){
			$.drink.eat(this, event_type, handler);
			return this;
		}
	});

	$.drink.start();

})(jQuery);
