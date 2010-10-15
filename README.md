jQuery Drink
=====================================================

Attach event handlers to DOM elements before they exist.

Homepage: <http://github.com/elijahr/jquery-drink>

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


		// here's how we can remove this drink
		$('.foo').eat('click');

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

Thanks to Brandon Aaron for creating the awesome [Live Query](http://plugins.jquery.com/project/livequery) plugin which is the inspiration for Drink.
