[jQuery Drink](http://github.com/elijahr/jquery-drink)
================================

Attach event handlers to DOM elements before they exist.

Examples
--------

	<script src="jquery.drink.js"></script>
	<script>

	$('.foo')
		.drink(function(){
			// this function is called on any current or future .foo elements
			$(this).text('bar');
		})
		.drink('click', function(event){
			// this attaches a click event handler to any current or future .foo elements
			alert('baz');
		});

	$(function(){
		// on dom ready, we insert a new element that will match our .foo selector
		$(document.body).append('<div class="foo"></div>');
	});

	</script>


Questions?
----------

Please feel free to [contact the author](mailto:elijahr+jquerydrink@gmail.com) with questions.


Issues?
-------

Please submit bugs or feature requests using the issue tracker on [github](http://github.com/elijahr/jquery-drink/issues).


Credits
-------

Thanks to Brandon Aaron for creating the [Live Query](http://plugins.jquery.com/project/livequery) plugin which is the inspiration for Drink.
